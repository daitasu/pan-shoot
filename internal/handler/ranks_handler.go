package handler

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"github.com/daitasu/pan-shoot/internal/repository"
	"github.com/daitasu/pan-shoot/internal/service"
)

// Controller struct holds the service instance
type Controller struct {
	Service service.Service
}

type Rank struct {
	ID        int       `json:"id"`
	Score     int       `json:"score"`
}

type responseError struct {
	Message string `json:"message"`
}

// NewController returns a new instance of Controller
func NewController(s service.Service) *Controller {
	return &Controller{
		Service: s,
	}
}

// GetRankingsHandler handles GET requests to /rankings
func (c *Controller) GetRankingsHandler(w http.ResponseWriter, r *http.Request) {
	// Get rankings from service
	rankings, err := c.Service.GetRankList(10)
	if err != nil {
		log.Printf("Error getting top scores: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		writeJSONError(w, "Internal server error")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(rankings)
}

// PostRankingHandler handles POST requests to /rankings
func (c *Controller) PostRankingHandler(w http.ResponseWriter, r *http.Request) {
	var ranking repository.Rank

	// Decode request body
	if err := json.NewDecoder(r.Body).Decode(&ranking); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		writeJSONError(w, "Invalid request body")
		return
	}

	// Add ranking through service
	err := c.Service.PostRank(ranking.GoogleUserId, ranking.Score)
	if err != nil {
		log.Printf("Error adding score: %v", err)
		if strings.HasPrefix(err.Error(), "Error 1062") {
			w.WriteHeader(http.StatusBadRequest)
			writeJSONError(w, "Deplicate error")
			return
		}

		w.WriteHeader(http.StatusInternalServerError)
		writeJSONError(w, "Internal server error")
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func writeJSONError(w http.ResponseWriter, message string) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(responseError{Message: message})
}