package main

import (
	"bb-laundrylink-backend/config"
	"bb-laundrylink-backend/database/seeders"
	"fmt"
	"log"
)

func main() {
	config.LoadEnv()
	fmt.Println("Starting BB LaundryLink Backend...")
	// appName := config.GetEnv("APP_NAME", "BB LaundryLink")
	// appPort := config.GetEnv("APP_PORT", "8000")
	// fmt.Println("Application:", appName)
	// fmt.Println("Port:", appPort)
	config.ConnectDB()
	fmt.Println("welcome baby to laudry link nothing else")

	if err := seeders.DatabaseSeeder(); err != nil {
		log.Fatal(err)
	}
	StartServer()
}
