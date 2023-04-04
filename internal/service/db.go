package service

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

func SetupDB() *sql.DB {
	dbURI := "user1:password@tcp(127.0.0.1:3306)/devdb?parseTime=true"

	db, err := sql.Open("mysql", dbURI)
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
