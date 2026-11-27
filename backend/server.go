package main

import (
	"log"
	// "net/http"
	"bb-laundrylink-backend/internal/routes"

	"github.com/gin-gonic/gin"
)

func StartServer() {
	router := gin.Default()
	configureCORS(router)
	// router.GET("/api/health", func(c *gin.Context) {

	// 	c.JSON(http.StatusOK, gin.H{
	// 		"status":  "success",
	// 		"message": "Welcome to BB LaundryLink API",
	// 	})

	// })
	routes.HealthRoutes(router)
	routes.AuthRoutes(router)

	err := router.Run(":6060")

	if err != nil {
		log.Fatal("Server failed to start:", err)
	}
}
