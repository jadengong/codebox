# Deployment Guide

## Overview

This guide covers deploying the Code Execution Sandbox to various platforms.

## Prerequisites

- Docker installed and running
- Node.js (v16 or higher)
- Git

## Local Development

### Quick Start

```bash
# Clone repository
git clone <repository-url>
cd code-execution-sandbox

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..

# Start development servers
npm run dev
```

## Production Deployment

### Option 1: Traditional Server Deployment

#### Backend Deployment

1. **Build and start backend:**
```bash
cd backend
npm install --production
npm start
```

2. **Build and serve frontend:**
```bash
cd frontend
npm install
npm run build
# Serve the build folder with nginx/apache
```

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # Frontend
    location / {
        root /path/to/frontend/build;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Option 2: Docker Deployment

#### Backend Docker

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/ .
EXPOSE 5000
CMD ["npm", "start"]
```

#### Frontend Docker

```dockerfile
FROM node:16-alpine as build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose

```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
    depends_on:
      - docker-daemon
  
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
  
  docker-daemon:
    image: docker:dind
    privileged: true
```

### Option 3: Vercel Deployment

#### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set build command: `cd frontend && npm run build`
3. Set output directory: `frontend/build`
4. Set environment variables if needed

#### Backend (Vercel Functions)

1. Move backend code to `api/` directory in root
2. Update `vercel.json` configuration
3. Deploy to Vercel

## Environment Variables

### Production Environment Variables

#### Backend
- `NODE_ENV=production`
- `PORT=5000`

#### Frontend
- `REACT_APP_API_URL=https://your-api-domain.com`

## Security Considerations

### Production Security

1. **Enable HTTPS** - Use SSL certificates
2. **Rate Limiting** - Implement API rate limiting
3. **CORS Configuration** - Restrict to your domain
4. **Docker Security** - Run containers with limited privileges
5. **Input Validation** - Validate all user inputs
6. **Resource Limits** - Set memory and CPU limits

### Docker Security

```bash
# Run containers with security constraints
docker run --rm \
  --memory=100m \
  --cpus=0.5 \
  --network=none \
  --read-only \
  --tmpfs /tmp \
  your-image
```

## Monitoring

### Health Checks

The API provides health check endpoints:

- `GET /api/health` - System status
- Monitor memory usage, uptime, and supported languages

### Logging

Implement proper logging for:
- Code execution requests
- Error tracking
- Performance monitoring
- Security events

## Scaling

### Horizontal Scaling

1. **Load Balancer** - Use nginx or cloud load balancer
2. **Multiple Backend Instances** - Run multiple backend containers
3. **Stateless Design** - Ensure backend is stateless
4. **Shared Storage** - Use external storage for temp files

### Performance Optimization

1. **Caching** - Cache frequently used data
2. **CDN** - Use CDN for frontend assets
3. **Database** - Add database for persistent data if needed
4. **Monitoring** - Implement performance monitoring

## Troubleshooting

### Common Issues

1. **Docker Not Running** - Ensure Docker daemon is running
2. **Port Conflicts** - Check if ports 3000/5000 are available
3. **Permission Issues** - Check file permissions
4. **Memory Issues** - Monitor memory usage

### Debug Commands

```bash
# Check Docker status
docker ps
docker logs <container-id>

# Check backend logs
cd backend && npm start

# Check frontend build
cd frontend && npm run build
```

## Backup and Recovery

### Important Data

- Configuration files
- Environment variables
- Docker images
- Source code

### Backup Strategy

1. **Code Repository** - Use Git with remote backup
2. **Configuration** - Version control all configs
3. **Database** - Regular backups if using database
4. **Docker Images** - Push to registry for backup
