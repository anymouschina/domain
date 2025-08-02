# Domain Price Checker - Docker Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed
- At least 2GB of available RAM
- Ports 3000, 3307, 8081, 6379 available

### One-Click Deployment

1. **Start all services:**
   ```bash
   ./start.sh
   ```

2. **Stop all services:**
   ```bash
   ./stop.sh
   ```

## 📋 Services Overview

| Service | Port | Description |
|---------|------|-------------|
| **App** | 3000 | Next.js application |
| **Database** | 3307 | MySQL database |
| **Adminer** | 8081 | Database management UI |
| **Redis** | 6379 | Caching layer |
| **Nginx** | 80/443 | Reverse proxy |

## 🔧 Manual Commands

### Start Services
```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d app

# Build and start
docker-compose up -d --build
```

### Stop Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f db
```

### Database Management
```bash
# Run migrations
docker-compose exec app npx prisma migrate deploy

# Generate Prisma client
docker-compose exec app npx prisma generate

# Open database shell
docker-compose exec db mysql -u domain_user -p domain_pricing
```

## 🌐 Access URLs

- **Application**: http://localhost:3000
- **Adminer**: http://localhost:8081
- **Database**: localhost:3307

## 🔐 Database Credentials

- **Server**: localhost
- **Port**: 3307
- **Database**: domain_pricing
- **Username**: domain_user
- **Password**: domain_password

## 📊 Monitoring

### Check Service Status
```bash
docker-compose ps
```

### Resource Usage
```bash
docker stats
```

### Application Health
```bash
curl http://localhost:3000/api/health
```

## 🔄 Updates

### Update Application
```bash
# Pull latest code
git pull

# Rebuild and restart app
docker-compose up -d --build app
```

### Update All Services
```bash
docker-compose down
docker-compose up -d --build
```

## 🛠️ Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Check what's using the port
   lsof -i :3000
   
   # Kill the process
   kill -9 <PID>
   ```

2. **Database connection issues**
   ```bash
   # Check database logs
   docker-compose logs db
   
   # Restart database
   docker-compose restart db
   ```

3. **Application not starting**
   ```bash
   # Check app logs
   docker-compose logs app
   
   # Rebuild app
   docker-compose up -d --build app
   ```

### Reset Everything
```bash
# Stop and remove everything
docker-compose down -v
docker system prune -f

# Start fresh
./start.sh
```

## 📁 File Structure

```
next-pro/
├── Dockerfile              # Application container
├── docker-compose.yml      # Service orchestration
├── nginx.conf             # Reverse proxy config
├── start.sh               # Startup script
├── stop.sh                # Stop script
├── ecosystem.config.js    # PM2 configuration
└── logs/                  # Application logs
```

## 🔒 Security Notes

- Change default passwords in production
- Use SSL certificates for HTTPS
- Configure firewall rules
- Regular security updates

## 📈 Production Considerations

- Use external database for production
- Configure proper SSL certificates
- Set up monitoring and alerting
- Implement backup strategies
- Use environment-specific configurations 