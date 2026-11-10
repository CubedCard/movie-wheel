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
	if len(m.Title) < 3 {
		return fmt.Errorf("%w: Title must be at least 3 characters long", ErrValidation)
	}

	return nil
}

func CreateMovie(title string, year *int, imageUrl string) error {
	m := &Movie{
		Id:        uuid.Must(uuid.NewV7()),
		Title:     title,
		Year:      year,
		ImageUrl:  imageUrl,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	return m.Validate()
}

func (m *Movie) UpdateImageUrl(imageUrl string) error {
	m.ImageUrl = imageUrl
	m.UpdatedAt = time.Now()

	return m.Validate()
}

func (m *Movie) UpdateTitle(title string) error {
	m.Title = title

	return m.Validate()
}

func (m *Movie) UpdateYear(year *int) error {
	m.Year = year

	return m.Validate()
}
