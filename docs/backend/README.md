# Backend Documentation

This section covers the Go backend implementation of the Evaluation System.

## Directory Structure

```
backend/
├── cmd/
│   └── main.go           # Application entry point
├── internal/
│   ├── handlers/         # HTTP handlers
│   ├── middleware/       # Middleware functions
│   ├── models/          # Data models
│   ├── repository/      # Database operations
│   └── services/        # Business logic
├── pkg/                 # Shared packages
├── config/             # Configuration
└── migrations/         # Database migrations
```

## Core Components

### 1. Authentication

The authentication system uses JWT tokens and supports:
- Google OAuth
- Email verification
- Session management

```go
// Example JWT middleware
func AuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        token := r.Header.Get("Authorization")
        if token == "" {
            http.Error(w, "Unauthorized", http.StatusUnauthorized)
            return
        }
        // Verify JWT token and proceed
    }
}
```

### 2. Evaluation Service

Handles the core evaluation logic:
- Job match evaluation
- Resume analysis
- Practice test scoring

```go
type EvaluationService struct {
    repo repository.Repository
}

func (s *EvaluationService) EvaluateJob(ctx context.Context, req *EvaluationRequest) (*EvaluationResult, error) {
    // Evaluation logic
}
```

### 3. Database Integration

Uses Supabase (PostgreSQL) with repository pattern:

```go
type Repository interface {
    CreateUser(user *models.User) error
    GetUserByEmail(email string) (*models.User, error)
    CreateEvaluation(eval *models.Evaluation) error
    GetUserEvaluations(userID string) ([]models.Evaluation, error)
}
```

## API Endpoints

### Authentication
- `POST /api/auth/google` - Google OAuth
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/refresh` - Refresh token

### Evaluation
- `POST /api/job/evaluate` - Job evaluation
- `POST /api/practice/{id}` - Practice test
- `GET /api/evaluations` - Get user evaluations

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile

## Error Handling

Standardized error responses:

```go
type ErrorResponse struct {
    Error   string `json:"error"`
    Message string `json:"message"`
    Code    int    `json:"code"`
}

func HandleError(w http.ResponseWriter, err error, status int) {
    response := ErrorResponse{
        Error:   err.Error(),
        Message: "An error occurred",
        Code:    status,
    }
    w.WriteHeader(status)
    json.NewEncoder(w).Encode(response)
}
```

## Middleware

1. Authentication
2. CORS
3. Logging
4. Rate Limiting
5. Request ID

Example:
```go
func CorsMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", os.Getenv("CORS_ORIGIN"))
        // CORS configuration
        next.ServeHTTP(w, r)
    })
}
```

## Configuration

Using environment variables with struct tags:

```go
type Config struct {
    Server struct {
        Port string `env:"PORT" default:"8080"`
    }
    Database struct {
        Host     string `env:"DB_HOST"`
        Port     string `env:"DB_PORT" default:"5432"`
        User     string `env:"DB_USER"`
        Password string `env:"DB_PASSWORD"`
        Name     string `env:"DB_NAME"`
    }
    Auth struct {
        JWTSecret string `env:"JWT_SECRET"`
    }
}
```

## Testing

### Unit Tests
```go
func TestEvaluationService_EvaluateJob(t *testing.T) {
    // Test setup and assertions
}
```

### Integration Tests
```go
func TestJobEvaluationAPI(t *testing.T) {
    // API test setup and assertions
}
```

## Logging

Using structured logging with Zap:

```go
func initLogger() *zap.Logger {
    config := zap.NewProductionConfig()
    logger, _ := config.Build()
    return logger
}
```

## Performance Considerations

1. Connection Pooling
```go
func initDB(config Config) *sql.DB {
    db.SetMaxOpenConns(25)
    db.SetMaxIdleConns(25)
    db.SetConnMaxLifetime(5 * time.Minute)
    return db
}
```

2. Caching
```go
func (s *Service) GetEvaluation(ctx context.Context, id string) (*Evaluation, error) {
    // Check cache first
    if cached, ok := s.cache.Get(id); ok {
        return cached.(*Evaluation), nil
    }
    // Fetch from database
}
```

## Security

1. Input Validation
2. SQL Injection Prevention
3. XSS Protection
4. Rate Limiting
5. Secure Headers

## Deployment

See [Deployment Guide](../deployment/README.md) for detailed deployment instructions. 