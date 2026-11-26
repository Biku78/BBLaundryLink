package routes

import (
	"net/http"
	"errors"
	"strings"

	"bb-laundrylink-backend/internal/services"

	"github.com/gin-gonic/gin"
)

func AuthRoutes(router *gin.Engine) {
 router.POST("/api/register", func(c *gin.Context) {
  // Bound request size before binding or hashing a password.
  c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, 16 * 1024)
  var req services.RegisterRequest
  if err := c.ShouldBindJSON(&req); err != nil {
   c.JSON(http.StatusBadRequest, gin.H{"status":"error", "message":"Please provide a valid name, email, mobile, password, confirmation, and terms acceptance."})
   return
  }
  if err := services.ValidateRegistration(req); err != nil {
   c.JSON(http.StatusBadRequest, gin.H{"status":"error", "message":err.Error()})
   return
  }
  if err := services.RegisterUser(req); err != nil {
   if errors.Is(err, services.ErrEmailExists) {
    c.JSON(http.StatusConflict, gin.H{"status":"error", "message":err.Error()})
   } else {
    c.JSON(http.StatusInternalServerError, gin.H{"status":"error", "message":"Unable to create account. Please try again later."})
   }
   return
  }
  c.JSON(http.StatusCreated, gin.H{"status":"success", "message":"Account created. Please sign in."})
 })

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

		req.Email = strings.ToLower(strings.TrimSpace(req.Email))
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
