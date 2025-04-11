# Getting Started

This guide will help you set up your local development environment for the Evaluation System.

## Prerequisites

- Node.js (v18 or later)
- Go (v1.21 or later)
- Docker and Docker Compose
- Git

## Local Development Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd evaluation-system
```

2. Install dependencies:
```bash
# Frontend dependencies
cd frontend
npm install

# Backend dependencies
cd ../backend
go mod download
```

3. Set up environment variables:

Frontend (.env.local):
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id
```

Backend (.env):
```env
PORT=8080
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=evaluation
JWT_SECRET=your-secret
CORS_ORIGIN=http://localhost:3000
```

4. Start the development environment:
```bash
# Using Docker Compose (recommended)
docker-compose up

# Or start services individually:
# Terminal 1 - Frontend
cd frontend && npm run dev

# Terminal 2 - Backend
cd backend && air

# Terminal 3 - Database
docker-compose up postgres
```

## Development Tools

### Frontend
- VS Code with recommended extensions
- Chrome DevTools
- React Developer Tools

### Backend
- VS Code with Go extension
- Air (for hot reload)
- sqlc (for type-safe SQL)
- golang-migrate (for database migrations)

### Database
- Supabase CLI
- pgAdmin or DBeaver (database management)

## Common Development Tasks

### Running Tests
```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
go test ./...
```

### Database Migrations
```bash
# Create a new migration
make migrate-create name=add_users_table

# Run migrations
make migrate-up

# Rollback migrations
make migrate-down
```

### Code Generation
```bash
# Generate Go models from SQL
sqlc generate

# Generate TypeScript types
npm run generate-types
```

## Troubleshooting

Common issues and their solutions:

1. **CORS Issues**
   - Verify CORS_ORIGIN in backend .env
   - Check frontend API URL configuration

2. **Database Connection**
   - Ensure PostgreSQL is running
   - Verify database credentials
   - Check network connectivity

3. **Hot Reload Not Working**
   - Restart Air
   - Clear Go build cache
   - Check file permissions

## Next Steps

1. Read the [Architecture Overview](architecture.md)
2. Explore the [Frontend Documentation](../frontend/README.md)
3. Review the [Backend Documentation](../backend/README.md) 