package entities

import "errors"

var (
	ErrMovieNotFound = errors.New("movie not found")
	ErrTitleTooShort = errors.New("title is too short")
	ErrValidation    = errors.New("validation failed")
)
