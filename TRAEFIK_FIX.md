# ✅ Fix untuk Traefik Not Found

## Masalah
Traefik menunjukkan "not found" saat akses melalui Docker.

## Perbaikan yang Dilakukan

### 1. **Update docker-compose.yml**
- ✅ Hapus `127.0.0.1` binding (hanya accessible dari localhost)
- ✅ Ubah port dari `127.0.0.1:80:80` menjadi `80:80`
- ✅ Ubah port dari `127.0.0.1:8080:8080` menjadi `8080:8080`
- ✅ Tambah `--api.insecure=true` untuk akses dashboard tanpa SSL
- ✅ Tambah labels untuk Traefik dashboard routing
- ✅ Tambah `depends_on: traefik` pada service nextjs
- ✅ Ubah volume traefik path

### 2. **File Konfigurasi**
- ✅ Buat `traefik/traefik.yml` untuk konfigurasi yang lebih baik

## Cara Menggunakan

### 1. **Bersihkan container lama**
```bash
docker-compose down
```

### 2. **Rebuild dan jalankan**
```bash
docker-compose up -d --build
```

### 3. **Akses Traefik Dashboard**
- Browser: `http://localhost:8080/dashboard/` (dengan trailing slash)
- atau: `http://localhost:8080/api/`

### 4. **Cek logs Traefik**
```bash
docker-compose logs -f traefik
```

## Jika Masih Tidak Muncul

### Problem 1: Docker Desktop Windows
Jika masih error, pastikan Docker Desktop dijalankan dengan:
- Klik kanan Docker Desktop → Settings
- Resources → WSL 2 integration
- Pastikan integrated

### Problem 2: Port Conflict
```bash
# Cek apakah port 80 atau 8080 sudah digunakan
netstat -ano | findstr :80
netstat -ano | findstr :8080
```

### Problem 3: Reset Total
```bash
# Hapus semua container dan volume
docker system prune -a --volumes
docker-compose up -d --build
```

## Akses Service
- **Next.js App**: `http://localhost:3000` atau `http://APP_DOMAIN` (jika sudah set DOMAIN di .env)
- **MinIO Console**: `http://localhost:9001`
- **Traefik Dashboard**: `http://localhost:8080/dashboard/`

## Troubleshooting

### Cek Traefik Running
```bash
docker ps | grep traefik
```

### Cek Network Connection
```bash
docker network ls
docker network inspect akschim-network
```

### Lihat Detail Service di Traefik
```bash
curl http://localhost:8080/api/entrypoints
curl http://localhost:8080/api/routers
curl http://localhost:8080/api/services
```
