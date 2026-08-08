# Deploy 🚀

Full deployment setup for a web application — **frontend, backend, and database** containerized with Docker.

## Overview

Production-ready deployment configuration that packages a web application using Docker Compose and Nginx as a reverse proxy.

## Structure

```
├── FrontEnd/            # Frontend application
├── Backend/             # Backend API
├── Database/            # Database scripts
├── docker-compose.yml   # Multi-service orchestration
├── Deploy.md            # Deployment notes
└── VPS.txt              # VPS setup guide
```

## Getting Started

1. Copy the environment file and fill in your values
2. Build and start all services:

```bash
docker compose up -d --build
```

3. Configure Nginx and SSL for your domain

## Tech Stack

- Docker / Docker Compose
- Nginx (reverse proxy + SSL)
- Node.js backend
- Database service

## Status

Ready for deployment on a VPS.
