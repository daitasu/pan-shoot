package main

import (
	"log"
	"net/http"
)

func main() {
	setupDB()

	mux := http.NewServeMux()

	mux.Handle("/", http.FileServer(http.Dir("./dist/")))

	mux.HandleFunc("/api/fake", fakeHandler)
	mux.HandleFunc("/api/login", loginHandler)
	mux.HandleFunc("/api/me", getUserInfoHandler)
	mux.HandleFunc("/auth/google/callback", googleCallbackHandler)

	log.Println("Listening: 8080 ...")
	log.Fatal(http.ListenAndServe(":8080", mux))

}
