package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/people/v1"

	"github.com/daitasu/pan-shoot/internal/handler"
	"github.com/daitasu/pan-shoot/internal/middleware"
	"github.com/daitasu/pan-shoot/internal/repository"
	"github.com/daitasu/pan-shoot/internal/service"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		 log.Fatal("Error loading .env file")
	}
	BaseUrl := os.Getenv("BASE_URL")
	ClientID := os.Getenv("GOOGLE_OAUTH_CLIENT_ID")
	ClientSecret := os.Getenv("GOOGLE_OAUTH_CLIENT_SECRET")
	RedirectURL := os.Getenv("GOOGLE_OAUTH_REDIRECT_URL")
	
	googleOauthConfig := &oauth2.Config{
		ClientID:     ClientID,
		ClientSecret: ClientSecret,
		RedirectURL:  RedirectURL,
		Scopes: []string{
			people.UserinfoEmailScope,
			people.UserinfoProfileScope,
		},
		Endpoint: google.Endpoint,
	}

	var db = service.SetupDB()
	defer db.Close()

	router := mux.NewRouter()

	router.Handle("/", http.FileServer(http.Dir("./dist/")))

	router.HandleFunc("/api/fake", handler.FakeHandler)
	router.HandleFunc("/api/login", handler.LoginHandler(googleOauthConfig))
	router.HandleFunc("/auth/google/callback", handler.GoogleCallbackHandler(googleOauthConfig))

	router.Handle("/api/me", middleware.AuthMiddleware(http.HandlerFunc(handler.GetUserInfoHandler), googleOauthConfig))

	// Create a new instance of the score service, repository and controller
	scoreRepo := repository.NewMySQLRepo(db)
	scoreService := service.NewRankService(scoreRepo)
	scoreController := handler.NewController(scoreService)

	router.Handle("/api/ranks", middleware.AuthMiddleware(http.HandlerFunc(scoreController.GetRankingsHandler), googleOauthConfig)).Methods("GET")
	router.Handle("/api/ranks", middleware.AuthMiddleware(http.HandlerFunc(scoreController.PostRankingHandler), googleOauthConfig)).Methods("POST")

	log.Printf("Listening: 8080 ...")
	log.Fatal(http.ListenAndServe(BaseUrl + ":8080", router))

}
