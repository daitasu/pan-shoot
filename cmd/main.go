package main

import (
	"log"
	"net/http"

	"github.com/daitasu/pan-shoot/internal/handler"
	"github.com/daitasu/pan-shoot/internal/repository"
	"github.com/daitasu/pan-shoot/internal/service"
)

func main() {
	var db = service.SetupDB()
	defer db.Close()

	mux := http.NewServeMux()

	mux.Handle("/", http.FileServer(http.Dir("./dist/")))

	mux.HandleFunc("/api/fake", handler.FakeHandler)
	mux.HandleFunc("/api/login", handler.LoginHandler)
	mux.HandleFunc("/api/me", handler.GetUserInfoHandler)
	mux.HandleFunc("/auth/google/callback", handler.GoogleCallbackHandler)

	// Create a new instance of the score service, repository and controller
	scoreRepo := repository.NewMySQLRepo(db)
	scoreService := service.NewRankService(scoreRepo)
	scoreController := handler.NewController(scoreService)

	mux.HandleFunc("/api/ranks", scoreController.GetRankingsHandler)
	
	log.Printf("Listening: 8080 ...")
	log.Fatal(http.ListenAndServe(":8080", mux))

}
