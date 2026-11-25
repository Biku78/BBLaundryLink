package services

func HealthCheck() map[string]string {
	return map[string]string{
		"status":  "success",
		"message": "Welcome to BB LaundryLink API",
	}
}
