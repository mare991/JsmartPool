# React Frontend - Makefile

.PHONY: help install build up down logs clean dev prod restart status

# Default target
help:
	@echo "React Frontend - Available Commands:"
	@echo ""
	@echo "Development:"
	@echo "  dev          Start development server (npm start)"
	@echo ""
	@echo "Production:"
	@echo "  prod         Start production environment (Docker)"
	@echo "  prod-build   Build and start production environment"
	@echo ""
	@echo "Management:"
	@echo "  up           Start Docker services"
	@echo "  down         Stop Docker services"
	@echo "  restart      Restart Docker services"
	@echo "  logs         Show Docker logs"
	@echo "  logs-frontend Show frontend logs"
	@echo ""
	@echo "Utilities:"
	@echo "  status       Show service status"
	@echo "  clean        Remove all containers and volumes"
	@echo "  clean-all    Remove everything including images"
	@echo ""
	@echo "Build:"
	@echo "  build        Build production bundle"
	@echo "  install      Install dependencies"

# Development environment
dev:
	@echo "Starting development server..."
	@echo "Make sure your Flask backend is running on http://localhost:5000"
	npm start

# Production environment
prod:
	docker compose up -d

prod-build:
	docker compose up -d --build

# General commands
up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose restart

# Logs
logs:
	docker compose logs -f

logs-frontend:
	docker compose logs -f frontend

# Status and health
status:
	docker compose ps

# Cleanup
clean:
	docker compose down -v
	docker system prune -f

clean-all:
	docker compose down -v --rmi all
	docker system prune -af

# Install dependencies
install:
	npm install

# Build production bundle
build:
	npm run build

# Run tests
test:
	npm test

# Format code
format:
	npx prettier --write "src/**/*.{js,jsx,ts,tsx,json,css,md}"

# Lint code
lint:
	npx eslint src/
