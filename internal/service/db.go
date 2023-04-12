package service

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

func SetupDB(dbURI string) *sql.DB {
	db, err := sql.Open("postgres", dbURI)
	if err != nil {
		log.Fatalf("Failed to open DB: %v", err)
	}

	err = db.Ping()
	if err != nil {
		log.Fatalf("Failed to ping DB: %v", err)
	}

	// print a success message if the connection was successful
	fmt.Println("Connected to database!")
	return db
}
