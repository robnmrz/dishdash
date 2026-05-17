COMPOSE_FILE   := docker-compose.yaml
COMPOSE_PROJECT := swishdish

GREEN  = \033[0;32m
YELLOW = \033[0;33m
NC     = \033[0m

.DEFAULT_GOAL := help

# ==================== Core ====================

.PHONY: build
build:
	@echo "$(YELLOW)Building services...$(NC)"
	@docker compose -f $(COMPOSE_FILE) -p $(COMPOSE_PROJECT) build
	@echo "$(GREEN)✓ Built$(NC)"

.PHONY: up
up:
	@echo "$(YELLOW)Starting services...$(NC)"
	@docker compose -f $(COMPOSE_FILE) -p $(COMPOSE_PROJECT) up -d
	@echo "$(GREEN)✓ Running — API: http://localhost:8080$(NC)"

.PHONY: down
down:
	@docker compose -f $(COMPOSE_FILE) -p $(COMPOSE_PROJECT) down

.PHONY: restart
restart:
	@docker compose -f $(COMPOSE_FILE) -p $(COMPOSE_PROJECT) restart

# ==================== Development ====================

.PHONY: dev
dev: down build up logs

.PHONY: rebuild
rebuild:
	@docker compose -f $(COMPOSE_FILE) -p $(COMPOSE_PROJECT) up -d --build
	@echo "$(GREEN)✓ Rebuilt and restarted$(NC)"

.PHONY: clean
clean:
	@docker compose -f $(COMPOSE_FILE) -p $(COMPOSE_PROJECT) down -v
	@echo "$(GREEN)✓ Services and volumes removed$(NC)"

# ==================== Logs ====================

.PHONY: logs
logs:
	@docker compose -f $(COMPOSE_FILE) -p $(COMPOSE_PROJECT) logs -f

.PHONY: logs-api
logs-api:
	@docker compose -f $(COMPOSE_FILE) -p $(COMPOSE_PROJECT) logs -f api

.PHONY: logs-db
logs-db:
	@docker compose -f $(COMPOSE_FILE) -p $(COMPOSE_PROJECT) logs -f db

# ==================== Inspect ====================

.PHONY: ps
ps:
	@docker compose -f $(COMPOSE_FILE) -p $(COMPOSE_PROJECT) ps

.PHONY: stats
stats:
	@docker stats $(shell docker compose -f $(COMPOSE_FILE) -p $(COMPOSE_PROJECT) ps -q)

.PHONY: health
health:
	@STATUS=$$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/health); \
	echo "API status: $$STATUS"

.PHONY: sh-api
sh-api:
	@docker compose -f $(COMPOSE_FILE) -p $(COMPOSE_PROJECT) exec api /bin/sh

.PHONY: psql
psql:
	@docker compose -f $(COMPOSE_FILE) -p $(COMPOSE_PROJECT) exec db psql -U swishdish swishdish

# ==================== Help ====================

.PHONY: help
help:
	@echo ""
	@echo "$(GREEN)SwishDish$(NC)"
	@echo ""
	@echo "  make dev        Full cycle: down → build → up → logs"
	@echo "  make rebuild    Rebuild images and restart (no down)"
	@echo "  make up         Start services (detached)"
	@echo "  make down       Stop services"
	@echo "  make clean      Stop and remove volumes"
	@echo ""
	@echo "  make logs       Follow all logs"
	@echo "  make logs-api   Follow API logs"
	@echo "  make logs-db    Follow DB logs"
	@echo ""
	@echo "  make ps         Show running services"
	@echo "  make stats      Live container stats"
	@echo "  make health     Check API health endpoint"
	@echo "  make sh-api     Shell into API container"
	@echo "  make psql       psql session in DB container"
	@echo ""
