package repository

import (
	"database/sql"
	"log"
	"time"

	"github.com/google/uuid"
	"github.com/jaswdr/faker"
)

// Repository is the interface for interacting with the ranks table.
type Repository interface {
	PostRank(googleUserId string, score int) error
	GetRankList(limit int) ([]Rank, error)
}

// Rank is the model for the ranks table.
type Rank struct {
	ID        uuid.UUID `json:"id"`
	GoogleUserId string `json:"googleUserId"`
	Username  string    `json:"username"`
	Score     int       `json:"score"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// MySQLRepo is a MySQL implementation of Repository.
type MySQLRepo struct {
	db *sql.DB
}

// NewMySQLRepo creates a new MySQLRepo instance.
func NewMySQLRepo(db *sql.DB) *MySQLRepo {
	return &MySQLRepo{
		db: db,
	}
}

// PostRank adds a new rank record to the database.
func (r *MySQLRepo) PostRank(googleUserId string, score int) error {
	fake := faker.New()
	var fakeUserName string = fake.Person().Name()

	_, err := r.db.Exec("INSERT INTO ranks (id, google_user_id, username, score) VALUES (?, ?, ?, ?)", uuid.New(), googleUserId, fakeUserName, score)
	if err != nil {
		return err
	}
	return nil
}

// GetRankList returns a list of rank records from the database.
func (r *MySQLRepo) GetRankList(limit int) ([]Rank, error) {
	rows, err := r.db.Query("SELECT id, google_user_id, username, score, created_at, updated_at FROM ranks ORDER BY score DESC, created_at ASC LIMIT ?", limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var ranks []Rank
	for rows.Next() {
		var rank Rank
		log.Println(rows)
		err := rows.Scan(&rank.ID, &rank.GoogleUserId, &rank.Username, &rank.Score, &rank.CreatedAt, &rank.UpdatedAt)
		if err != nil {
			return nil, err
		}
		log.Println(rank)
		ranks = append(ranks, rank)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return ranks, nil
}