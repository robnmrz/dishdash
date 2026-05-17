package auth

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"hash/fnv"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

var avatarColors = []string{"#6B8E5A", "#D67A5F", "#E8C16A", "#1C1A17"}

type User struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Email       string `json:"email"`
	AvatarColor string `json:"avatarColor"`
}

type AuthResult struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}

type claims struct {
	Name        string `json:"name"`
	AvatarColor string `json:"avatar_color"`
	jwt.RegisteredClaims
}

type Service struct {
	db        *sql.DB
	jwtSecret []byte
}

func NewService(db *sql.DB, jwtSecret string) *Service {
	return &Service{db: db, jwtSecret: []byte(jwtSecret)}
}

func (s *Service) SignUp(ctx context.Context, email, password, name string) (AuthResult, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return AuthResult{}, fmt.Errorf("hash password: %w", err)
	}

	color := pickAvatarColor(email)
	var userID string
	err = s.db.QueryRowContext(ctx,
		`INSERT INTO users (email, password_hash, name, avatar_color)
		 VALUES ($1, $2, $3, $4) RETURNING id`,
		strings.ToLower(strings.TrimSpace(email)), string(hash), name, color,
	).Scan(&userID)
	if err != nil {
		if strings.Contains(err.Error(), "unique") {
			return AuthResult{}, ErrEmailTaken
		}
		return AuthResult{}, fmt.Errorf("insert user: %w", err)
	}

	token, err := s.makeToken(userID, name, color)
	if err != nil {
		return AuthResult{}, err
	}

	return AuthResult{
		Token: token,
		User:  User{ID: userID, Name: name, Email: strings.ToLower(strings.TrimSpace(email)), AvatarColor: color},
	}, nil
}

func (s *Service) SignIn(ctx context.Context, email, password string) (AuthResult, error) {
	var u struct {
		id           string
		name         string
		email        string
		passwordHash string
		avatarColor  string
	}
	err := s.db.QueryRowContext(ctx,
		`SELECT id, name, email, password_hash, avatar_color FROM users WHERE email = $1`,
		strings.ToLower(strings.TrimSpace(email)),
	).Scan(&u.id, &u.name, &u.email, &u.passwordHash, &u.avatarColor)
	if errors.Is(err, sql.ErrNoRows) {
		return AuthResult{}, ErrInvalidCredentials
	}
	if err != nil {
		return AuthResult{}, fmt.Errorf("query user: %w", err)
	}

	if err := bcrypt.CompareHashAndPassword([]byte(u.passwordHash), []byte(password)); err != nil {
		return AuthResult{}, ErrInvalidCredentials
	}

	token, err := s.makeToken(u.id, u.name, u.avatarColor)
	if err != nil {
		return AuthResult{}, err
	}

	return AuthResult{
		Token: token,
		User:  User{ID: u.id, Name: u.name, Email: u.email, AvatarColor: u.avatarColor},
	}, nil
}

func (s *Service) makeToken(userID, name, avatarColor string) (string, error) {
	now := time.Now()
	c := claims{
		Name:        name,
		AvatarColor: avatarColor,
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   userID,
			Issuer:    "swishdish-api",
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(now.Add(30 * 24 * time.Hour)),
		},
	}
	tok := jwt.NewWithClaims(jwt.SigningMethodHS256, c)
	signed, err := tok.SignedString(s.jwtSecret)
	if err != nil {
		return "", fmt.Errorf("sign token: %w", err)
	}
	return signed, nil
}

func pickAvatarColor(email string) string {
	h := fnv.New32a()
	h.Write([]byte(strings.ToLower(strings.TrimSpace(email))))
	return avatarColors[h.Sum32()%uint32(len(avatarColors))]
}

var (
	ErrEmailTaken         = errors.New("email already registered")
	ErrInvalidCredentials = errors.New("invalid credentials")
)
