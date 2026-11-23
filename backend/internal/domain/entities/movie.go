package entities

import (
	"fmt"
	"time"

	"github.com/google/uuid"
)

type Movie struct {
	Id        uuid.UUID
	Title     string
	Year      *int
	ImageUrl  string
	CreatedAt time.Time
	UpdatedAt time.Time
}

func (m *Movie) Validate() error {
	if m.Id == uuid.Nil {
		return fmt.Errorf("%w: Id must not be empty", ErrValidation)
	}
	if len(m.Title) < 2 {
		return fmt.Errorf("%w: Title must be at least 2 characters long", ErrValidation)
	}

	return nil
}

func CreateMovie(title string, year *int, imageUrl string) (*Movie, error) {
	now := time.Now()

	m := &Movie{
		Id:        uuid.Must(uuid.NewV7()),
		Title:     title,
		Year:      year,
		ImageUrl:  imageUrl,
		CreatedAt: now,
		UpdatedAt: now,
	}

	if m.Validate() != nil {
		return &Movie{}, fmt.Errorf("%w: Validation failed", ErrValidation)
	}

	return m, nil
}

func (m *Movie) UpdateImageUrl(imageUrl string) error {
	m.ImageUrl = imageUrl
	m.UpdatedAt = time.Now()

	return nil
}

func (m *Movie) UpdateTitle(title string) error {
	oldTitle := m.Title
	m.Title = title
	err := m.Validate()

	if err != nil {
		m.Title = oldTitle
		return err
	}

	m.UpdatedAt = time.Now()
	return nil
}

func (m *Movie) UpdateYear(year *int) error {
	m.Year = year
	m.UpdatedAt = time.Now()

	return nil
}
