# 🐳 Docker Setup Guide - Blog Application

## 📦 What's Included

This Docker Compose setup includes:

1. **PostgreSQL Database** (`db` service)

   - Image: `postgres:15-alpine`
   - Persistent storage via Docker volume
   - Health checks enabled

2. **Django Backend** (`backend` service)

   - Built from `./Blog/Dockerfile`
   - Auto-runs migrations on startup
   - Connected to PostgreSQL via internal network

3. **React Frontend** (`frontend` service)
   - Built from `./blog-frontend/Dockerfile`
   - Hot-reload enabled for development
   - Communicates with backend via internal network

## 🚀 Quick Start

### Prerequisites

- Docker Desktop installed and running
- No other services running on ports 3000, 8000, or 5432

### 1. Start All Services

```powershell
# Navigate to project root
cd "c:\Users\mudas\Documents\mid lab\Blog-django-react-postgres"

# Build and start all containers
docker-compose up --build
```

This will:

- ✅ Create a PostgreSQL database with persistent storage
- ✅ Build and start the Django backend
- ✅ Run database migrations automatically
- ✅ Build and start the React frontend
- ✅ Set up internal networking between containers

### 2. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Django Admin**: http://localhost:8000/admin

### 3. Stop All Services

```powershell
# Stop containers (keeps data)
docker-compose down

# Stop and remove volumes (deletes data)
docker-compose down -v
```

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                  blog_network                       │
│                (Docker Network)                     │
│                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │
│  │  frontend    │  │   backend    │  │    db    │ │
│  │   :3000      │→ │    :8000     │→ │  :5432   │ │
│  │   React      │  │   Django     │  │ Postgres │ │
│  └──────────────┘  └──────────────┘  └──────────┘ │
│                                           ↓         │
│                                    ┌──────────────┐ │
│                                    │postgres_data │ │
│                                    │  (Volume)    │ │
│                                    └──────────────┘ │
└─────────────────────────────────────────────────────┘
```

## 📁 File Structure

```
Blog-django-react-postgres/
├── docker-compose.yml          # Orchestrates all services
├── Blog/
│   ├── Dockerfile             # Backend container definition
│   ├── .dockerignore          # Excludes unnecessary files
│   ├── .env.docker            # Docker environment variables
│   └── ...
├── blog-frontend/
│   ├── Dockerfile             # Frontend container definition
│   ├── .dockerignore          # Excludes node_modules
│   └── ...
```

## 🔧 Detailed Commands

### Build and Start (Detached Mode)

```powershell
docker-compose up -d --build
```

### View Logs

```powershell
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Run Django Commands

```powershell
# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Run migrations
docker-compose exec backend python manage.py migrate

# Make new migrations
docker-compose exec backend python manage.py makemigrations

# Django shell
docker-compose exec backend python manage.py shell
```

### Database Access

```powershell
# Connect to PostgreSQL
docker-compose exec db psql -U bloguser -d blogdb

# Backup database
docker-compose exec db pg_dump -U bloguser blogdb > backup.sql

# Restore database
cat backup.sql | docker-compose exec -T db psql -U bloguser blogdb
```

### Container Management

```powershell
# List running containers
docker-compose ps

# Stop specific service
docker-compose stop backend

# Restart specific service
docker-compose restart backend

# Remove all containers
docker-compose down

# Remove containers and volumes
docker-compose down -v
```

## 🗄️ Database Configuration

### Docker Environment (default):

- **Host**: `db` (Docker service name)
- **Database**: `blogdb`
- **User**: `bloguser`
- **Password**: `blogpass123`
- **Port**: `5432`

### Persistent Storage:

- Data stored in Docker volume: `postgres_data`
- Survives container restarts
- Only deleted with `docker-compose down -v`

## 🌐 Network Configuration

### Internal Network (`blog_network`):

- Type: Bridge
- Containers can communicate using service names
- Backend connects to database via `db:5432`
- Frontend connects to backend via `backend:8000`

### Port Mappings:

- `3000:3000` - Frontend (host:container)
- `8000:8000` - Backend (host:container)
- `5432:5432` - Database (host:container)

## 🔐 Environment Variables

### Backend (.env.docker):

```env
DATABASE_URL=postgresql://bloguser:blogpass123@db:5432/blogdb
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,backend
```

### Frontend (docker-compose.yml):

```env
REACT_APP_API_URL=http://localhost:8000/api
CHOKIDAR_USEPOLLING=true  # Enables hot-reload
```

## 🛠️ Development Workflow

### 1. Make Code Changes

- Edit files in `./Blog` or `./blog-frontend`
- Changes are reflected immediately (hot-reload enabled)

### 2. Add Python Dependencies

```powershell
# Add to requirements.txt, then:
docker-compose down
docker-compose up --build
```

### 3. Add npm Dependencies

```powershell
# Add to package.json, then:
docker-compose down
docker-compose up --build frontend
```

### 4. Database Changes

```powershell
# 1. Edit models.py
# 2. Create migrations
docker-compose exec backend python manage.py makemigrations

# 3. Apply migrations
docker-compose exec backend python manage.py migrate
```

## 🐛 Troubleshooting

### Port Already in Use

```powershell
# Find process using port
netstat -ano | findstr :3000
netstat -ano | findstr :8000
netstat -ano | findstr :5432

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### Database Connection Error

```powershell
# Check if db service is healthy
docker-compose ps

# View database logs
docker-compose logs db

# Restart database
docker-compose restart db
```

### Frontend Can't Connect to Backend

- Check backend is running: http://localhost:8000/api/posts/
- Verify CORS settings in `settings.py`
- Check browser console for errors

### Container Won't Start

```powershell
# View detailed logs
docker-compose logs <service-name>

# Rebuild from scratch
docker-compose down
docker-compose build --no-cache
docker-compose up
```

### Reset Everything

```powershell
# Stop all containers
docker-compose down -v

# Remove images
docker-compose down --rmi all -v

# Rebuild from scratch
docker-compose up --build
```

## 📊 Monitoring

### Container Stats

```powershell
docker stats
```

### Disk Usage

```powershell
docker system df
```

### Cleanup Unused Resources

```powershell
docker system prune -a
```

## 🚀 Production Deployment

For production, update:

1. **Change database credentials** in `docker-compose.yml`
2. **Set DEBUG=False** in environment
3. **Use proper SECRET_KEY** in Django settings
4. **Configure ALLOWED_HOSTS** properly
5. **Use production server** (gunicorn instead of runserver)
6. **Enable HTTPS** with reverse proxy (nginx)
7. **Set up proper logging** and monitoring

## ✅ Verification Checklist

- [ ] Docker Desktop is running
- [ ] Ports 3000, 8000, 5432 are available
- [ ] All containers start successfully
- [ ] Database has persistent volume
- [ ] Backend connects to database
- [ ] Frontend loads at http://localhost:3000
- [ ] Can create account and login
- [ ] Can create posts
- [ ] Hot-reload works in development

## 📚 Useful Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Docker Networking](https://docs.docker.com/network/)
- [Docker Volumes](https://docs.docker.com/storage/volumes/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)

---

**Note**: This setup is optimized for development. For production, consider using Docker secrets, environment-specific compose files, and proper orchestration (Kubernetes, Docker Swarm).
