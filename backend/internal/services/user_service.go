package services

import (
	"bb-laundrylink-backend/config"
	"bb-laundrylink-backend/model"
)

func CreateUser(user model.User) error {

	_, err := config.DB.Exec(
		`INSERT INTO users (name, email, password, role)
         VALUES (?, ?, ?, ?)`,
		user.Name,
		user.Email,
		user.Password,
		user.Role,
	)

	return err
}
