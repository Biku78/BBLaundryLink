package services

import (
	"errors"
	"time"

	"bb-laundrylink-backend/config"
	"bb-laundrylink-backend/model"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	Token string     `json:"token"`
	User  model.User `json:"user"`
}

func LoginUser(req LoginRequest) (*LoginResponse, error) {

	var user model.User

	// Find user by email
	err := config.DB.QueryRow(
		`SELECT id, name, email, password, role
		 FROM users
		 WHERE email = ?`,
		req.Email,
	).Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&user.Password,
		&user.Role,
	)

	if err != nil {
		return nil, errors.New("invalid email or password")
	}

	// Verify password
	err = bcrypt.CompareHashAndPassword(
		[]byte(user.Password),
		[]byte(req.Password),
	)

	if err != nil {
		return nil, errors.New("invalid email or password")
	}

	// Generate JWT
	secret := config.GetEnv("JWT_SECRET", "")

	if secret == "" {
		return nil, errors.New("JWT secret is not configured")
	}

	claims := jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"role":    user.Role,
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
		"iat":     time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString([]byte(secret))

	if err != nil {
		return nil, err
	}

	// Never return the hashed password
	user.Password = ""

	return &LoginResponse{
		Token: tokenString,
		User:  user,
	}, nil
}
