# 🐳 Docker Compose Setup - Complete

## ✅ Requirements Met

### 1. Docker Compose with Multiple Services ✓

- **Backend**: Django REST API
- **Frontend**: React Application
- **Database**: PostgreSQL 15

### 2. Internal Network Communication ✓

- Custom bridge network: `blog_network`
- Services communicate using service names (db, backend, frontend)
- No external dependencies required

### 3. Persistent Database Storage ✓

- Named volume: `postgres_data`
- Survives container restarts
- Data persists until explicitly removed

## 🏗️ Architecture Overview

```
┌──────────────────────────────────────────────────┐
│         blog_network (Bridge Network)            │
│                                                  │
│  ┌─────────────┐    ┌─────────────┐    ┌──────┐│
│  │  frontend   │───→│   backend   │───→│  db  ││
│  │  (React)    │    │  (Django)   │    │ (PG) ││
│  │  Port: 3000 │    │  Port: 8000 │    │ 5432 ││
│  └─────────────┘    └─────────────┘    └──────┘│
│                                            ↓     │
│                                     postgres_data│
│                                        (Volume)  │
└──────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Option 1: Using PowerShell Script (Easiest)

```powershell
cd "c:\Users\mudas\Documents\mid lab\Blog-django-react-postgres"
.\start-docker.ps1
```

### Option 2: Manual Commands

```powershell
# Navigate to project root
cd "c:\Users\mudas\Documents\mid lab\Blog-django-react-postgres"

# Start all services
docker-compose up --build
```

## 📦 Services Breakdown

### 1. Database Service (`db`)

```yaml
Image: postgres:15-alpine
Container: blog_postgres_db
Port: 5432:5432
Network: blog_network
Volume: postgres_data:/var/lib/postgresql/data
Health Check: Enabled (every 10s)
```

**Environment:**

- `POSTGRES_DB=blogdb`
- `POSTGRES_USER=bloguser`
- `POSTGRES_PASSWORD=blogpass123`

### 2. Backend Service (`backend`)

```yaml
Build: ./Blog/Dockerfile
Container: blog_backend
Port: 8000:8000
Network: blog_network
Depends On: db (with health check)
```

**Features:**

- Auto-runs migrations on startup
- Connected to PostgreSQL via `db:5432`
- JWT authentication enabled
- CORS configured for frontend

### 3. Frontend Service (`frontend`)

```yaml
Build: ./blog-frontend/Dockerfile
Container: blog_frontend
Port: 3000:3000
Network: blog_network
Depends On: backend
```

**Features:**

- Hot-reload enabled (CHOKIDAR_USEPOLLING)
- Connects to backend via `http://localhost:8000`
- Node modules cached in anonymous volume

## 🗄️ Persistent Storage Details

### Volume Configuration

```yaml
volumes:
  postgres_data:
    driver: local
```

**What's Stored:**

- All PostgreSQL data files
- Database tables (auth_user, posts)
- User accounts and blog posts

**Persistence:**

- ✅ Data survives `docker-compose down`
- ✅ Data survives `docker-compose restart`
- ❌ Data deleted with `docker-compose down -v`

### View Volume Info

```powershell
docker volume ls
docker volume inspect blog-django-react-postgres_postgres_data
```

## 🌐 Network Configuration

### Network Details

```yaml
networks:
  blog_network:
    driver: bridge
```

**Internal Communication:**

- Frontend → Backend: `http://backend:8000`
- Backend → Database: `postgresql://bloguser:blogpass123@db:5432/blogdb`

**External Access:**

- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Database: localhost:5432

### Test Network Connectivity

```powershell
# From backend container to database
docker-compose exec backend ping db

# From frontend container to backend
docker-compose exec frontend ping backend
```

## 🛠️ Common Commands

### Starting Services

```powershell
# Start in foreground (see logs)
docker-compose up

# Start in background
docker-compose up -d

# Rebuild and start
docker-compose up --build
```

### Stopping Services

```powershell
# Stop containers (keep data)
docker-compose down

# Stop and remove volumes (delete data)
docker-compose down -v

# Stop specific service
docker-compose stop backend
```

### View Logs

```powershell
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f db

# Last 100 lines
docker-compose logs --tail=100
```

### Execute Commands

```powershell
# Django shell
docker-compose exec backend python manage.py shell

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Run migrations
docker-compose exec backend python manage.py migrate

# PostgreSQL shell
docker-compose exec db psql -U bloguser -d blogdb
```

### Check Status

```powershell
# List running containers
docker-compose ps

# View resource usage
docker stats

# Check health
docker-compose exec db pg_isready -U bloguser
```

## 🔍 Verification Steps

### 1. Check All Containers Running

```powershell
docker-compose ps
```

Expected output:

```
NAME              STATUS        PORTS
blog_backend      Up            0.0.0.0:8000->8000/tcp
blog_frontend     Up            0.0.0.0:3000->3000/tcp
blog_postgres_db  Up (healthy)  0.0.0.0:5432->5432/tcp
```

### 2. Verify Database Connection

```powershell
docker-compose exec backend python manage.py dbshell
```

### 3. Test API Endpoints

```powershell
# PowerShell
Invoke-WebRequest http://localhost:8000/api/posts/
```

### 4. Check Volume

```powershell
docker volume ls | Select-String postgres_data
```

### 5. Test Network

```powershell
docker network inspect blog-django-react-postgres_blog_network
```

## 📊 Database Management

### Backup Database

```powershell
docker-compose exec db pg_dump -U bloguser blogdb > backup.sql
```

### Restore Database

```powershell
Get-Content backup.sql | docker-compose exec -T db psql -U bloguser blogdb
```

### Reset Database

```powershell
# Stop services
docker-compose down -v

# Start fresh
docker-compose up -d
```

### Access Database

```powershell
# Using psql
docker-compose exec db psql -U bloguser -d blogdb

# List tables
\dt

# View users
SELECT * FROM auth_user;

# View posts
SELECT * FROM posts;
```

## 🐛 Troubleshooting

### Container Won't Start

```powershell
# View logs
docker-compose logs backend

# Check if port is in use
netstat -ano | findstr :8000

# Rebuild from scratch
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

### Database Connection Failed

```powershell
# Check db health
docker-compose ps

# View db logs
docker-compose logs db

# Restart db service
docker-compose restart db
```

### Volume Data Lost

```powershell
# Check volume exists
docker volume ls

# Inspect volume
docker volume inspect blog-django-react-postgres_postgres_data

# If accidentally deleted, restart to recreate
docker-compose up -d
```

### Network Issues

```powershell
# Inspect network
docker network inspect blog-django-react-postgres_blog_network

# Recreate network
docker-compose down
docker-compose up
```

## 📝 Development Workflow

### Make Code Changes

1. Edit files in `./Blog` or `./blog-frontend`
2. Changes auto-reload (no rebuild needed)

### Add Dependencies

```powershell
# Python packages
# 1. Add to requirements.txt
# 2. Rebuild backend
docker-compose up -d --build backend

# npm packages
# 1. Add to package.json
# 2. Rebuild frontend
docker-compose up -d --build frontend
```

### Database Schema Changes

```powershell
# 1. Edit models.py
# 2. Make migrations
docker-compose exec backend python manage.py makemigrations

# 3. Apply migrations
docker-compose exec backend python manage.py migrate
```

## 🎯 Testing Checklist

- [ ] All 3 containers start successfully
- [ ] Database has persistent volume
- [ ] Backend connects to database
- [ ] Frontend connects to backend
- [ ] Can access http://localhost:3000
- [ ] Can create user account
- [ ] Can login with JWT
- [ ] Can create blog posts
- [ ] Can view all posts
- [ ] Data persists after `docker-compose down`
- [ ] Data persists after restart

## 📚 Files Created

```
Blog-django-react-postgres/
├── docker-compose.yml          # Main orchestration file
├── DOCKER_SETUP.md            # Detailed documentation
├── DOCKER_REQUIREMENTS.md     # This file
├── start-docker.ps1           # Quick start script
├── Blog/
│   ├── Dockerfile            # Backend image
│   ├── .dockerignore         # Excludes
│   └── .env.docker           # Docker env vars
└── blog-frontend/
    ├── Dockerfile            # Frontend image
    └── .dockerignore         # Excludes
```

## ✅ Requirements Compliance

| Requirement        | Implementation                       | Status |
| ------------------ | ------------------------------------ | ------ |
| Docker Compose     | `docker-compose.yml` with 3 services | ✅     |
| App Service        | Backend (Django) + Frontend (React)  | ✅     |
| Database Service   | PostgreSQL 15                        | ✅     |
| Internal Network   | `blog_network` (bridge driver)       | ✅     |
| Persistent Storage | `postgres_data` volume               | ✅     |
| Communication      | Services use internal DNS            | ✅     |

---

**Ready to use! Run `.\start-docker.ps1` to get started!** 🚀
