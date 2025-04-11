# Deployment Guide

This guide covers the deployment process for both the frontend and backend components of the Evaluation System.

## Frontend Deployment (Vercel)

### Prerequisites
- Vercel account
- GitHub repository
- Environment variables configured

### Steps

1. Connect repository to Vercel:
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
cd frontend
vercel
```

2. Configure environment variables in Vercel dashboard:
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

3. Set up automatic deployments:
- Connect GitHub repository
- Configure build settings
- Set up branch deployments

### Frontend Build Configuration

```json
// frontend/vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["sfo1"]
}
```

## Backend Deployment

### Option 1: Railway (Recommended)

1. Setup:
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up
```

2. Configuration:
```yaml
# railway.toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "Dockerfile"

[deploy]
startCommand = "./main"
healthcheckPath = "/health"
restartPolicyType = "ON_FAILURE"

[env]
PORT = "8080"
CORS_ORIGIN = "https://yourdomain.com"
```

### Option 2: Google Cloud Run

1. Setup:
```bash
# Install Google Cloud SDK
brew install google-cloud-sdk

# Initialize
gcloud init

# Configure Docker
gcloud auth configure-docker
```

2. Deployment:
```yaml
# cloudbuild.yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/evaluation-api', '.']
  
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/evaluation-api']
    
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'evaluation-api'
      - '--image'
      - 'gcr.io/$PROJECT_ID/evaluation-api'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'
```

## Database Deployment (Supabase)

1. Create production database:
```bash
# Using Supabase CLI
supabase init
supabase link --project-ref your-project-ref
supabase db push
```

2. Configure connection:
```env
DB_HOST=db.supabase.co
DB_USER=postgres
DB_PASSWORD=your-strong-password
DB_NAME=evaluation
```

## Domain Setup

1. Configure custom domain in Vercel
2. Set up SSL certificates
3. Configure DNS records

Example DNS configuration:
```
# A Records
api.yourdomain.com    -> Backend IP
www.yourdomain.com    -> Vercel IP
yourdomain.com        -> Vercel IP

# CNAME Records
_vercel    -> cname.vercel-dns.com
```

## CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Go
        uses: actions/setup-go@v4
        with:
          go-version: '1.21'
          
      - name: Build and test
        run: |
          cd backend
          go test ./...
          go build -o main ./cmd/main.go
          
      - name: Deploy to Railway
        uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## Monitoring and Logging

### Backend Monitoring

1. Health checks:
```go
func healthHandler(w http.ResponseWriter, r *http.Request) {
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(map[string]string{
        "status": "healthy",
        "version": os.Getenv("APP_VERSION"),
    })
}
```

2. Logging setup:
```go
func initLogger() *zap.Logger {
    config := zap.NewProductionConfig()
    logger, _ := config.Build()
    return logger
}
```

### Frontend Monitoring

1. Error tracking:
```typescript
// frontend/lib/monitoring.ts
export function initErrorTracking() {
    if (typeof window !== 'undefined') {
        window.onerror = (msg, url, lineNo, columnNo, error) => {
            // Send to logging service
            console.error(error);
            return false;
        };
    }
}
```

## Security Considerations

1. SSL/TLS configuration
2. CORS settings
3. Rate limiting
4. API authentication
5. Database security

## Backup Strategy

1. Database backups:
```bash
# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d)
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME -F c -f backup_$DATE.dump
```

2. Application state backups
3. Configuration backups

## Scaling Considerations

1. Frontend scaling:
- Vercel handles automatically

2. Backend scaling:
- Configure auto-scaling in Railway/Cloud Run
- Implement caching
- Optimize database queries

3. Database scaling:
- Connection pooling
- Read replicas if needed
- Regular maintenance

## Rollback Procedures

1. Frontend rollback:
```bash
# Using Vercel CLI
vercel rollback
```

2. Backend rollback:
```bash
# Using Railway CLI
railway rollback
```

3. Database rollback:
```bash
# Restore from backup
pg_restore -h $DB_HOST -U $DB_USER -d $DB_NAME -c backup_file.dump
```

## Troubleshooting

Common issues and solutions:

1. CORS errors:
- Verify CORS_ORIGIN in backend
- Check frontend API URL

2. Database connection issues:
- Check connection strings
- Verify network access
- Check credentials

3. Deployment failures:
- Review build logs
- Check environment variables
- Verify dependencies

## Maintenance

Regular maintenance tasks:

1. Update dependencies
2. Security patches
3. Database optimization
4. Log rotation
5. SSL certificate renewal

## Production Checklist

Before deploying:

1. Security
- [ ] SSL certificates installed
- [ ] Environment variables secured
- [ ] API keys rotated
- [ ] Security headers configured

2. Performance
- [ ] Frontend optimized
- [ ] Backend configured for production
- [ ] Database indexed
- [ ] Caching implemented

3. Monitoring
- [ ] Logging configured
- [ ] Error tracking setup
- [ ] Performance monitoring
- [ ] Alerts configured

4. Documentation
- [ ] API documentation updated
- [ ] Deployment procedures documented
- [ ] Rollback procedures documented
- [ ] Contact information updated 