package main

import (
	"log"
	"net/http"

	"github.com/daitasu/pan-shoot/internal/handler"
	"github.com/daitasu/pan-shoot/internal/service"
)

func main() {
	service.SetupDB()

	mux := http.NewServeMux()

	mux.Handle("/", http.FileServer(http.Dir("./dist/")))

	mux.HandleFunc("/api/fake", handler.FakeHandler)
	mux.HandleFunc("/api/login", handler.LoginHandler)
	mux.HandleFunc("/api/me", handler.GetUserInfoHandler)
	mux.HandleFunc("/auth/google/callback", handler.GoogleCallbackHandler)

	log.Println("Listening: 8080 ...")
	log.Fatal(http.ListenAndServe(":8080", mux))

}
