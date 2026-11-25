package seeders

import (
	"fmt"

	"bb-laundrylink-backend/config"
	"bb-laundrylink-backend/internal/services"
	"bb-laundrylink-backend/model"

	"golang.org/x/crypto/bcrypt"
)

func UserSeeder() error {

	email := "customer@yopmail.com"

	var count int

	err := config.DB.QueryRow(
		"SELECT COUNT(*) FROM users WHERE email = ?",
		email,
	).Scan(&count)

	if err != nil {
		return err
	}

	// Check existing user
	if count > 0 {
		fmt.Println("User already exists:", email)
		return nil
	}

	password, err := bcrypt.GenerateFromPassword(
		[]byte("Customer@123"),
		bcrypt.DefaultCost,
	)

	if err != nil {
		return err
	}

	user := model.User{
		Name:     "Customer",
		Email:    email,
		Password: string(password),
		Role:     "customer",
	}

	err = services.CreateUser(user)

	if err != nil {
		return err
	}

	fmt.Println("User seeded successfully:", email)

	return nil
}
