package household

import (
	"encoding/json"
	"errors"
	"net/http"

	"swishdish-api/internal/middleware"
)

func HandleCreate(svc *Service) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		user, ok := middleware.UserFromContext(r.Context())
		if !ok {
			writeError(w, http.StatusUnauthorized, "unauthorized")
			return
		}

		var body struct {
			Name string `json:"name"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.Name == "" {
			writeError(w, http.StatusBadRequest, "name is required")
			return
		}

		hh, err := svc.Create(r.Context(), user.ID, body.Name)
		if err != nil {
			if errors.Is(err, ErrAlreadyInHousehold) {
				writeError(w, http.StatusConflict, "user already belongs to a household")
				return
			}
			writeError(w, http.StatusInternalServerError, "internal error")
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(hh)
	}
}

func HandleGet(svc *Service) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		user, ok := middleware.UserFromContext(r.Context())
		if !ok {
			writeError(w, http.StatusUnauthorized, "unauthorized")
			return
		}

		hh, err := svc.GetForUser(r.Context(), user.ID)
		if err != nil {
			if errors.Is(err, ErrNotMember) {
				writeError(w, http.StatusNotFound, "no household found")
				return
			}
			writeError(w, http.StatusInternalServerError, "internal error")
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(hh)
	}
}

func HandleInvite(svc *Service) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		user, ok := middleware.UserFromContext(r.Context())
		if !ok {
			writeError(w, http.StatusUnauthorized, "unauthorized")
			return
		}

		var body struct {
			EmailOrPhone string `json:"emailOrPhone"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.EmailOrPhone == "" {
			writeError(w, http.StatusBadRequest, "emailOrPhone is required")
			return
		}

		if err := svc.InviteMember(r.Context(), user.ID, body.EmailOrPhone); err != nil {
			if errors.Is(err, ErrNotMember) {
				writeError(w, http.StatusForbidden, "not a household member")
				return
			}
			writeError(w, http.StatusInternalServerError, "internal error")
			return
		}

		w.WriteHeader(http.StatusNoContent)
	}
}

func HandleSetCadence(svc *Service) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		user, ok := middleware.UserFromContext(r.Context())
		if !ok {
			writeError(w, http.StatusUnauthorized, "unauthorized")
			return
		}

		var body struct {
			Days         []string `json:"days"`
			ReminderTime string   `json:"reminderTime"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			writeError(w, http.StatusBadRequest, "invalid request body")
			return
		}
		if body.ReminderTime == "" {
			writeError(w, http.StatusBadRequest, "reminderTime is required")
			return
		}

		if err := svc.SetCadence(r.Context(), user.ID, body.Days, body.ReminderTime); err != nil {
			if errors.Is(err, ErrNotMember) {
				writeError(w, http.StatusForbidden, "not a household member")
				return
			}
			writeError(w, http.StatusBadRequest, err.Error())
			return
		}

		w.WriteHeader(http.StatusNoContent)
	}
}

func writeError(w http.ResponseWriter, status int, msg string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(map[string]string{"error": msg})
}
