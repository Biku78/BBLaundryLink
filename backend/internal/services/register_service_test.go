package services

import "testing"

func TestValidateRegistration(t *testing.T) {
 valid := RegisterRequest{Name: "Customer", Mobile: "9876543210", Email: "test@example.com", Password: "Laundry123!", ConfirmPassword: "Laundry123!", AcceptTerms: true}
 if err := ValidateRegistration(valid); err != nil { t.Fatal(err) }
 tests := []struct {name string; change func(*RegisterRequest)}{
  {"blank name", func(r *RegisterRequest) { r.Name = "  " }},
  {"invalid mobile", func(r *RegisterRequest) { r.Mobile = "123" }},
  {"short password", func(r *RegisterRequest) { r.Password = "short" }},
  {"long password", func(r *RegisterRequest) { r.Password = "123456789012345678901234567890123456789012345678901234567890123456789012345" }},
  {"mismatch", func(r *RegisterRequest) { r.ConfirmPassword = "different" }},
  {"terms declined", func(r *RegisterRequest) { r.AcceptTerms = false }},
 }
 for _, tc := range tests {
  t.Run(tc.name, func(t *testing.T) {
   req := valid
   tc.change(&req)
   if ValidateRegistration(req) == nil { t.Fatal("expected validation error") }
  })
 }
}
