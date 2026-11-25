package routes

import (
	"net/http"

	"bb-laundrylink-backend/internal/services"

	"github.com/gin-gonic/gin"
)

func AuthRoutes(router *gin.Engine) {

	router.POST("/api/login", func(c *gin.Context) {

		var req services.LoginRequest

		// Parse JSON request
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"status":  "error",
				"message": "Invalid request data",
			})
			return
		}

		// Call login service
		result, err := services.LoginUser(req)

		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"status":  "error",
				"message": err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"status":  "success",
			"message": "Login successful",
			"data":    result,
		})
	})
}
