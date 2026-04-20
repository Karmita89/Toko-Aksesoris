# Docker Configuration untuk AksChim

Saat ini, hanya PostgreSQL yang berjalan di Docker. Berikut adalah konfigurasi lengkap untuk production deployment.

## Current Setup

```yaml
Services berjalan:
- PostgreSQL 15: localhost:5432
- Next.js Dev Server: localhost:3000
```

## Production Dockerfile (Frontend + Backend)

Jika ingin containerize Next.js juga, buat `Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production=false

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## Production docker-compose.yml

Untuk deployment full-stack:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: akschim
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  nextjs:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: "postgresql://user:password@postgres:5432/akschim"
      NEXTAUTH_URL: "http://localhost:3000"
      NEXTAUTH_SECRET: "supersecretkey"
    depends_on:
      - postgres

volumes:
  postgres_data:
```

## Commands

### Development (Current)
```bash
# Run only PostgreSQL
docker-compose up -d

# Run Next.js separately
npm run dev
```

### Production
```bash
# Build and run everything
docker-compose up -d --build

# Check logs
docker-compose logs -f

# Stop all
docker-compose down
```

## Database Backup & Restore

```bash
# Backup
docker-compose exec postgres pg_dump -U user akschim > backup.sql

# Restore
docker-compose exec -T postgres psql -U user akschim < backup.sql
```

## Scaling untuk High Traffic

1. **Load Balancer**
   - Nginx/HAProxy di depan multiple Next.js instances
   
2. **Database**
   - Read replicas untuk optimization
   - Connection pooling dengan pgBouncer

3. **Caching**
   - Redis untuk session dan cache data
   - CDN untuk static files

---

Referensi: [Docker Documentation](https://docs.docker.com/)