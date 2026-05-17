package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"

	"swishdish-api/internal/auth"
	"swishdish-api/internal/db"
	"swishdish-api/internal/household"
	"swishdish-api/internal/middleware"
)

func main() {
	dsn := mustEnv("DATABASE_URL")
	jwtSecret := mustEnv("JWT_SECRET")
	if len(jwtSecret) < 32 {
		log.Fatal("JWT_SECRET must be at least 32 characters")
	}
	port := envOr("PORT", "8080")

	database, err := db.Open(dsn)
	if err != nil {
		log.Fatalf("connect to database: %v", err)
	}
	defer database.Close()

	if err := db.RunMigrations(database); err != nil {
		log.Fatalf("run migrations: %v", err)
	}
	log.Println("migrations applied")

	authSvc := auth.NewService(database, jwtSecret)
	hhSvc := household.NewService(database)
	requireAuth := middleware.RequireAuth(jwtSecret)

	mux := http.NewServeMux()

	mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
	})

	mux.Handle("POST /auth/sign-up", auth.HandleSignUp(authSvc))
	mux.Handle("POST /auth/sign-in", auth.HandleSignIn(authSvc))

	mux.Handle("POST /households", requireAuth(household.HandleCreate(hhSvc)))
	mux.Handle("GET /household", requireAuth(household.HandleGet(hhSvc)))
	mux.Handle("POST /household/invites", requireAuth(household.HandleInvite(hhSvc)))
	mux.Handle("PUT /household/cadence", requireAuth(household.HandleSetCadence(hhSvc)))

	log.Printf("server listening on :%s", port)
	if err := http.ListenAndServe(":"+port, mux); err != nil {
		log.Fatalf("listen: %v", err)
	}
}

func mustEnv(key string) string {
	v := os.Getenv(key)
	if v == "" {
		log.Fatalf("required env var %s is not set", key)
	}
	return v
}

func envOr(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
