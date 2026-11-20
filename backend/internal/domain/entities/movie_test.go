package entities

import "testing"

func TestNewMovie(t *testing.T) {
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
