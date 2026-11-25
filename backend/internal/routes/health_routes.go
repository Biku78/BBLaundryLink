package routes

import (
	"bb-laundrylink-backend/internal/services"
	"github.com/gin-gonic/gin"
	"net/http"
)

func HealthRoutes(router *gin.Engine) {
	router.GET("/api/health", func(c *gin.Context) {
		response := services.HealthCheck()
		c.JSON(http.StatusOK, response)
	})
}
