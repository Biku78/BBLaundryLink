package services

import (
 "errors"
 "strings"
 "unicode/utf8"
 "regexp"

 "bb-laundrylink-backend/config"
 "github.com/go-sql-driver/mysql"
 "golang.org/x/crypto/bcrypt"
)

var ErrEmailExists = errors.New("an account with this email already exists")
var mobilePattern = regexp.MustCompile(`^[0-9]{10}$`)

type RegisterRequest struct {
 Name string `json:"name" binding:"required,max=100"`
 Mobile string `json:"mobile" binding:"required"`
 Email string `json:"email" binding:"required,email,max=150"`
 Password string `json:"password" binding:"required"`
 ConfirmPassword string `json:"confirm_password" binding:"required"`
 AcceptTerms bool `json:"accept_terms" binding:"required"`
}

func ValidateRegistration(req RegisterRequest) error {
 if strings.TrimSpace(req.Name) == "" || utf8.RuneCountInString(req.Name) > 100 {
  return errors.New("please enter a name of up to 100 characters")
 }
 if !mobilePattern.MatchString(req.Mobile) {
  return errors.New("please enter a 10-digit mobile number")
 }
 // bcrypt rejects passwords over 72 bytes. Check before hashing.
 if utf8.RuneCountInString(req.Password) < 8 || len([]byte(req.Password)) > 72 {
  return errors.New("password must be at least 8 characters and no more than 72 bytes")
 }
 if req.Password != req.ConfirmPassword {
  return errors.New("passwords do not match")
 }
 if !req.AcceptTerms {
  return errors.New("please accept the terms and privacy notice")
 }
 return nil
}

func RegisterUser(req RegisterRequest) error {
 if err := ValidateRegistration(req); err != nil { return err }
 hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
 if err != nil { return err }
 // Public registration always creates a customer, never accepts a client-supplied role.
 _, err = config.DB.Exec(
  `INSERT INTO users (name, mobile, email, password, role) VALUES (?, ?, ?, ?, ?)`,
  strings.TrimSpace(req.Name), req.Mobile, strings.ToLower(strings.TrimSpace(req.Email)), string(hash), "customer",
 )
 var dbErr *mysql.MySQLError
 if errors.As(err, &dbErr) && dbErr.Number == 1062 { return ErrEmailExists }
 return err
}
