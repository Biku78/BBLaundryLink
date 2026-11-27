package main

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
)

func TestCORS(t *testing.T) {
	gin.SetMode(gin.TestMode)
	for _, tc := range []struct {
		name   string
		origin string
		method string
		status int
		allow  string
	}{
		{"frontend 5174", "http://localhost:5174", "POST", 200, "http://localhost:5174"},
		{"frontend 5173", "http://localhost:5173", "POST", 200, "http://localhost:5173"},
		{"preflight", "http://localhost:5174", "OPTIONS", 204, "http://localhost:5174"},
		{"untrusted", "https://untrusted.example", "POST", 403, ""},
		{"untrusted preflight", "https://untrusted.example", "OPTIONS", 403, ""},
		{"no origin", "", "POST", 200, ""},
	} {
		t.Run(tc.name, func(t *testing.T) {
			router := gin.New()
			router.Use(corsMiddleware([]string{"http://localhost:5174", "http://localhost:5173"}))
			router.POST("/api/login", func(c *gin.Context) { c.Status(http.StatusOK) })
			req := httptest.NewRequest(tc.method, "/api/login", nil)
			if tc.origin != "" {
				req.Header.Set("Origin", tc.origin)
			}
			req.Header.Set("Access-Control-Request-Method", "POST")
			req.Header.Set("Access-Control-Request-Headers", "content-type,authorization")
			response := httptest.NewRecorder()
			router.ServeHTTP(response, req)
			if response.Code != tc.status {
				t.Fatalf("status = %d, want %d", response.Code, tc.status)
			}
			if got := response.Header().Get("Access-Control-Allow-Origin"); got != tc.allow {
				t.Errorf("allow origin = %q, want %q", got, tc.allow)
			}
			if tc.status == http.StatusNoContent && !strings.Contains(response.Header().Get("Access-Control-Allow-Headers"), "Authorization") {
				t.Error("preflight must allow the Authorization header")
			}
		})
	}
}
