package config

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

var DB *sql.DB

func ConnectDB() {
	host := GetEnv("DB_HOST", "127.0.0.1")
	port := GetEnv("DB_PORT", "3306")
	user := GetEnv("DB_USER", "root")
	password := GetEnv("DB_PASSWORD", "")
	database := GetEnv("DB_NAME", "bb_laundrylink")

	dsn := fmt.Sprintf(
		"%s:%s@tcp(%s:%s)/%s?parseTime=true",
		user,
		password,
		host,
		port,
		database,
	)

	db, err := sql.Open("mysql", dsn)

	if err != nil {
		log.Fatal("Database connection failed:", err)
	}
	err = db.Ping()

	if err != nil {
		log.Fatal("MySQL is not connected:", err)
	}

	DB = db

	log.Println("MySQL Database Connected Successfully!")
}
