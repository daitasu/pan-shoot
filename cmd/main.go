package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"

	"github.com/daitasu/pan-shoot/internal/handler"
	"github.com/daitasu/pan-shoot/internal/repository"
	"github.com/daitasu/pan-shoot/internal/service"
)

var BaseUrl string

func init() {
	err := godotenv.Load()
	if err != nil {
		 log.Fatal("Error loading .env file")
	}

	BaseUrl = os.Getenv("BASE_URL")
}

func main() {
	var db = service.SetupDB()
	defer db.Close()

	router := mux.NewRouter()

	router.Handle("/", http.FileServer(http.Dir("./dist/")))

	router.HandleFunc("/api/fake", handler.FakeHandler)
	router.HandleFunc("/api/login", handler.LoginHandler)
	router.HandleFunc("/api/me", handler.GetUserInfoHandler)
	router.HandleFunc("/auth/google/callback", handler.GoogleCallbackHandler)

	// Create a new instance of the score service, repository and controller
	scoreRepo := repository.NewMySQLRepo(db)
	scoreService := service.NewRankService(scoreRepo)
	scoreController := handler.NewController(scoreService)

	router.HandleFunc("/api/ranks", scoreController.GetRankingsHandler).Methods("GET")
	router.HandleFunc("/api/ranks", scoreController.PostRankingHandler).Methods("POST")

	log.Printf("Listening: 8080 ...")
	
	log.Fatal(http.ListenAndServe(BaseUrl + ":8080", router))

}
