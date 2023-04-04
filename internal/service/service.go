package service

import (
	"github.com/daitasu/pan-shoot/internal/repository"
	"github.com/pkg/errors"
)

// Service is the interface for the score ranking service.
type Service interface {
	PostRank(username string, score int) error
	GetRankList(limit int) ([]repository.Rank, error)
}

// RankService is the service for the score ranking app.
type RankService struct {
	repo repository.Repository
}

// NewRankService creates a new RankService instance.
func NewRankService(repo repository.Repository) *RankService {
	return &RankService{
		repo: repo,
	}
}

// PostRank posts a new rank record to the repository.
func (s *RankService) PostRank(username string, score int) error {
	if username == "" {
		return errors.New("username is required")
	}
	if score < 0 {
		return errors.New("score must be a positive integer")
	}

	return s.repo.PostRank(username, score)
}

// GetRankList returns a list of rank records from the repository.
func (s *RankService) GetRankList(limit int) ([]repository.Rank, error) {
	if limit <= 0 {
		return nil, errors.New("limit must be a positive integer")
	}

	return s.repo.GetRankList(limit)
}