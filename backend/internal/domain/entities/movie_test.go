package entities

import (
	"testing"

	"github.com/google/uuid"
)

func TestCreation(t *testing.T) {
	title := "title"
	year := 1999
	imageUrl := "https://url.example.com"
	movie := CreateMovie(title, &year, imageUrl)

	if movie.Title != title {
		t.Errorf("Expected movie title to be %s, but got %s", title, movie.Title)
	}

	if movie.Year != &year {
		t.Errorf("Expected movie year to be %d, but got %d", &year, movie.Year)
	}

	if movie.ImageUrl != imageUrl {
		t.Errorf("Expected movie imageUrl to be %s, but got %s", imageUrl, movie.ImageUrl)
	}

	if movie.CreatedAt != movie.UpdatedAt {
		t.Errorf("Expected movie CreatedAt and UpdatedAt to be equal, but got %s %s", movie.CreatedAt, movie.UpdatedAt)
	}
}

func TestValidation(t *testing.T) {
	title := "title"
	year := 1999
	imageUrl := "https://url.example.com"
	movie := CreateMovie(title, &year, imageUrl)

	movie.Id = uuid.Nil

	if movie.Validate() == nil {
		t.Errorf("Expected movie.Validate() to throw an error when Id is %d", movie.Id)
	}

	movie.Id = uuid.Must(uuid.NewV7())
	movie.Title = "sh"

	if movie.Validate() == nil {
		t.Errorf("Expected movie.Validate() to throw an error when Title is %d characters long", len(movie.Title))
	}
}

func TestUpdateImageUrl(t *testing.T) {
	title := "title"
	year := 1999
	imageUrl := "https://url.example.com"
	movie := CreateMovie(title, &year, imageUrl)

	newUrl := "new_url"

	movie.UpdateImageUrl(newUrl)

	if movie.ImageUrl != newUrl {
		t.Errorf("Expected ImageUrl to be updated to %s, but it was %s", newUrl, movie.ImageUrl)
	}
}

func TestUpdateTitle(t *testing.T) {
	title := "title"
	year := 1999
	imageUrl := "https://url.example.com"
	movie := CreateMovie(title, &year, imageUrl)

	newTitle := "new_url"

	movie.UpdateTitle(newTitle)

	if movie.Title != newTitle {
		t.Errorf("Expected Title to be updated to %s, but it was %s", newTitle, movie.Title)
	}
}

func TestUpdateYear(t *testing.T) {
	title := "title"
	year := 1999
	imageUrl := "https://url.example.com"
	movie := CreateMovie(title, &year, imageUrl)

	newYear := 2000

	movie.UpdateYear(&newYear)

	if movie.Year != &newYear {
		t.Errorf("Expected Year to be updated to %d, but it was %d", newYear, movie.Year)
	}
}
