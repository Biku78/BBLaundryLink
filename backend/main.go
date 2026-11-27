package main

import (
	"bb-laundrylink-backend/config"
	"bb-laundrylink-backend/database/seeders"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// configureCORS runs before the API routes, including for OPTIONS preflights.
// Set CORS_ALLOWED_ORIGINS to a comma-separated list of exact frontend origins
// in production. Origins contain a scheme and host/port, but no trailing slash.
func configureCORS(router *gin.Engine) {
	origins := config.GetEnv("CORS_ALLOWED_ORIGINS", "http://192.168.6.126:5173,http://192.168.6.126:5174,http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174")
	router.Use(corsMiddleware(strings.Split(origins, ",")))
}

func corsMiddleware(origins []string) gin.HandlerFunc {
	allowed := make([]string, 0, len(origins))
	for _, origin := range origins {
		origin = strings.TrimSpace(origin)
		if origin != "" && origin != "*" && origin != "null" {
			allowed = append(allowed, origin)
		}
	}
	corsConfig := cors.Config{
		AllowOrigins: allowed,
		AllowMethods: []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders: []string{"Origin", "Content-Type", "Accept", "Authorization"},
		MaxAge:       10 * time.Minute,
	}
	if len(allowed) == 0 {
		corsConfig.AllowOriginFunc = func(string) bool { return false }
	}
	return cors.New(corsConfig)
}

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
