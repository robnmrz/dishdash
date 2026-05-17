package household

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strings"

	"github.com/lib/pq"
)

type User struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Email       string `json:"email"`
	AvatarColor string `json:"avatarColor"`
}

type Household struct {
	ID           string   `json:"id"`
	Name         string   `json:"name"`
	Members      []User   `json:"members"`
	PlanningDays []string `json:"planningDays"`
	ReminderTime string   `json:"reminderTime"`
}

type Service struct {
	db *sql.DB
}

func NewService(db *sql.DB) *Service {
	return &Service{db: db}
}

func (s *Service) Create(ctx context.Context, userID, name string) (Household, error) {
	existing, err := s.householdIDForUser(ctx, userID)
	if err == nil && existing != "" {
		return Household{}, ErrAlreadyInHousehold
	}

	var hhID string
	err = s.db.QueryRowContext(ctx,
		`INSERT INTO households (name) VALUES ($1) RETURNING id`, name,
	).Scan(&hhID)
	if err != nil {
		return Household{}, fmt.Errorf("create household: %w", err)
	}

	_, err = s.db.ExecContext(ctx,
		`INSERT INTO household_members (household_id, user_id, role) VALUES ($1, $2, 'owner')`,
		hhID, userID,
	)
	if err != nil {
		return Household{}, fmt.Errorf("add owner member: %w", err)
	}

	return s.GetForUser(ctx, userID)
}

func (s *Service) GetForUser(ctx context.Context, userID string) (Household, error) {
	hhID, err := s.householdIDForUser(ctx, userID)
	if err != nil {
		return Household{}, err
	}

	var hh Household
	var days pq.StringArray
	err = s.db.QueryRowContext(ctx,
		`SELECT id, name, planning_days, reminder_time FROM households WHERE id = $1`, hhID,
	).Scan(&hh.ID, &hh.Name, &days, &hh.ReminderTime)
	if err != nil {
		return Household{}, fmt.Errorf("get household: %w", err)
	}
	hh.PlanningDays = []string(days)
	if hh.PlanningDays == nil {
		hh.PlanningDays = []string{}
	}

	members, err := s.membersOf(ctx, hhID)
	if err != nil {
		return Household{}, err
	}
	hh.Members = members
	return hh, nil
}

func (s *Service) InviteMember(ctx context.Context, userID, emailOrPhone string) error {
	hhID, err := s.householdIDForUser(ctx, userID)
	if err != nil {
		return ErrNotMember
	}

	_, err = s.db.ExecContext(ctx,
		`INSERT INTO pending_invites (household_id, email_or_phone, invited_by) VALUES ($1, $2, $3)`,
		hhID, emailOrPhone, userID,
	)
	return err
}

func (s *Service) SetCadence(ctx context.Context, userID string, days []string, reminderTime string) error {
	hhID, err := s.householdIDForUser(ctx, userID)
	if err != nil {
		return ErrNotMember
	}

	validDays := map[string]bool{
		"monday": true, "tuesday": true, "wednesday": true, "thursday": true,
		"friday": true, "saturday": true, "sunday": true,
	}
	for _, d := range days {
		if !validDays[d] {
			return fmt.Errorf("invalid day: %s", d)
		}
	}

	_, err = s.db.ExecContext(ctx,
		`UPDATE households SET planning_days = $1, reminder_time = $2 WHERE id = $3`,
		pq.Array(days), reminderTime, hhID,
	)
	return err
}

func (s *Service) householdIDForUser(ctx context.Context, userID string) (string, error) {
	var hhID string
	err := s.db.QueryRowContext(ctx,
		`SELECT household_id FROM household_members WHERE user_id = $1 LIMIT 1`, userID,
	).Scan(&hhID)
	if errors.Is(err, sql.ErrNoRows) {
		return "", ErrNotMember
	}
	if err != nil {
		return "", fmt.Errorf("lookup household: %w", err)
	}
	return hhID, nil
}

func (s *Service) membersOf(ctx context.Context, hhID string) ([]User, error) {
	rows, err := s.db.QueryContext(ctx,
		`SELECT u.id, u.name, u.email, u.avatar_color
		 FROM users u
		 JOIN household_members hm ON hm.user_id = u.id
		 WHERE hm.household_id = $1
		 ORDER BY hm.joined_at`, hhID,
	)
	if err != nil {
		return nil, fmt.Errorf("query members: %w", err)
	}
	defer rows.Close()

	var members []User
	for rows.Next() {
		var u User
		if err := rows.Scan(&u.ID, &u.Name, &u.Email, &u.AvatarColor); err != nil {
			return nil, err
		}
		members = append(members, u)
	}
	if members == nil {
		members = []User{}
	}
	return members, rows.Err()
}

func isValidReminderTime(t string) bool {
	parts := strings.Split(t, ":")
	if len(parts) != 2 {
		return false
	}
	return len(parts[0]) == 2 && len(parts[1]) == 2
}

var (
	ErrAlreadyInHousehold = errors.New("user already belongs to a household")
	ErrNotMember          = errors.New("user is not a household member")
)
