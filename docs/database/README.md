# Database Documentation

This guide covers the database setup and management for the Evaluation System using Supabase.

## Database Schema

### Core Tables

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    is_email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Evaluations table
CREATE TABLE evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    type TEXT NOT NULL,
    score INTEGER,
    feedback JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Practice tests table
CREATE TABLE practice_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    score INTEGER,
    answers JSONB,
    analysis JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Supabase Setup

1. Create a new Supabase project
2. Set up database tables using migrations
3. Configure Row Level Security (RLS)
4. Set up authentication

### Row Level Security Policies

```sql
-- Users table policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Evaluations table policies
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own evaluations" ON evaluations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own evaluations" ON evaluations
    FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## Go Integration

### Database Connection

```go
func NewSupabaseConnection(config Config) (*sql.DB, error) {
    connStr := fmt.Sprintf(
        "host=%s port=%s user=%s password=%s dbname=%s sslmode=require",
        config.Host,
        config.Port,
        config.User,
        config.Password,
        config.DBName,
    )
    
    db, err := sql.Open("postgres", connStr)
    if err != nil {
        return nil, err
    }
    
    // Configure connection pool
    db.SetMaxOpenConns(25)
    db.SetMaxIdleConns(25)
    db.SetConnMaxLifetime(5 * time.Minute)
    
    return db, nil
}
```

### Repository Implementation

```go
type UserRepository struct {
    db *sql.DB
}

func (r *UserRepository) CreateUser(user *models.User) error {
    query := `
        INSERT INTO users (id, email, name, is_email_verified)
        VALUES ($1, $2, $3, $4)
        RETURNING id`
    
    return r.db.QueryRow(
        query,
        user.ID,
        user.Email,
        user.Name,
        user.IsEmailVerified,
    ).Scan(&user.ID)
}

func (r *UserRepository) GetUserEvaluations(userID string) ([]models.Evaluation, error) {
    query := `
        SELECT id, type, score, feedback, created_at
        FROM evaluations
        WHERE user_id = $1
        ORDER BY created_at DESC`
    
    rows, err := r.db.Query(query, userID)
    if err != nil {
        return nil, err
    }
    defer rows.Close()
    
    var evaluations []models.Evaluation
    for rows.Next() {
        var eval models.Evaluation
        if err := rows.Scan(
            &eval.ID,
            &eval.Type,
            &eval.Score,
            &eval.Feedback,
            &eval.CreatedAt,
        ); err != nil {
            return nil, err
        }
        evaluations = append(evaluations, eval)
    }
    
    return evaluations, nil
}
```

## Migrations

Using golang-migrate for database migrations:

```go
func RunMigrations(dbURL string) error {
    m, err := migrate.New(
        "file://migrations",
        dbURL,
    )
    if err != nil {
        return err
    }
    
    if err := m.Up(); err != nil && err != migrate.ErrNoChange {
        return err
    }
    
    return nil
}
```

Migration files:

```sql
-- 20240101000000_create_users.up.sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    is_email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20240101000000_create_users.down.sql
DROP TABLE users;
```

## Backup and Recovery

### Automated Backups

Supabase provides automated daily backups. Additional backup script:

```go
func BackupDatabase(config Config) error {
    cmd := exec.Command(
        "pg_dump",
        "-h", config.Host,
        "-U", config.User,
        "-d", config.DBName,
        "-F", "c",
        "-f", fmt.Sprintf("backup_%s.dump", time.Now().Format("20060102")),
    )
    
    cmd.Env = append(
        os.Environ(),
        fmt.Sprintf("PGPASSWORD=%s", config.Password),
    )
    
    return cmd.Run()
}
```

### Recovery Process

```go
func RestoreDatabase(config Config, backupFile string) error {
    cmd := exec.Command(
        "pg_restore",
        "-h", config.Host,
        "-U", config.User,
        "-d", config.DBName,
        "-c",
        backupFile,
    )
    
    cmd.Env = append(
        os.Environ(),
        fmt.Sprintf("PGPASSWORD=%s", config.Password),
    )
    
    return cmd.Run()
}
```

## Monitoring

### Connection Health Check

```go
func (db *Database) HealthCheck() error {
    ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
    defer cancel()
    
    return db.PingContext(ctx)
}
```

### Query Performance

```go
func (db *Database) SlowQueryCheck() error {
    query := `
        SELECT pid, now() - pg_stat_activity.query_start AS duration, query
        FROM pg_stat_activity
        WHERE pg_stat_activity.query != ''
        AND state != 'idle'
        AND now() - pg_stat_activity.query_start > interval '5 seconds'`
    
    rows, err := db.Query(query)
    if err != nil {
        return err
    }
    defer rows.Close()
    
    // Process slow queries
    return nil
}
```

## Best Practices

1. Always use prepared statements
2. Implement proper connection pooling
3. Use transactions for multi-table operations
4. Implement retry logic for transient failures
5. Regular backup verification
6. Monitor query performance
7. Use appropriate indexes

## Security

1. Enable SSL/TLS connections
2. Implement Row Level Security
3. Use least privilege principle
4. Regular security audits
5. Password rotation
6. Audit logging

## Maintenance

1. Regular vacuum operations
2. Index maintenance
3. Statistics updates
4. Connection monitoring
5. Backup verification

See [Deployment Guide](../deployment/README.md) for production database setup. 