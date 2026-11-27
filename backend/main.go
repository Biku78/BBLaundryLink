package main

import (
	"bb-laundrylink-backend/config"
	"bb-laundrylink-backend/database/seeders"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// configureCORS runs before the API routes, including for OPTIONS preflights.
// Set CORS_ALLOWED_ORIGINS to a comma-separated list of exact frontend origins
// in production. Origins contain a scheme and host/port, but no trailing slash.
func configureCORS(router *gin.Engine) {
	origins := config.GetEnv("CORS_ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174")
	router.Use(corsMiddleware(strings.Split(origins, ",")))
}

func corsMiddleware(origins []string) gin.HandlerFunc {
	allowed := make(map[string]bool, len(origins))
	for _, origin := range origins {
		origin = strings.TrimSpace(origin)
		// Do not allow wildcard or opaque origins for authentication endpoints.
		if origin != "" && origin != "*" && origin != "null" {
			allowed[origin] = true
		}
	}

	return func(c *gin.Context) {
		c.Writer.Header().Add("Vary", "Origin")
		origin := c.GetHeader("Origin")
		if origin == "" {
			c.Next()
			return
		}
		if !allowed[origin] {
			c.AbortWithStatus(http.StatusForbidden)
			return
		}

		c.Header("Access-Control-Allow-Origin", origin)
		// Authentication uses a Bearer token, not cross-origin cookies.
		c.Header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept")
		if c.Request.Method == http.MethodOptions {
			c.Writer.Header().Add("Vary", "Access-Control-Request-Method")
			c.Writer.Header().Add("Vary", "Access-Control-Request-Headers")
			c.Header("Access-Control-Max-Age", "600")
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	}
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
