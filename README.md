# AksChim - E-Commerce Website untuk Aksesoris

Website e-commerce profesional untuk penjualan aksesoris dengan fitur lengkap, autentikasi user, admin dashboard untuk SCM dan manufactory management.

## 🎯 Fitur Utama

1. **Registrasi & Login** - Sistem autentikasi dengan NextAuth.js
2. **Katalog Produk** - Menampilkan koleksi aksesoris dengan detail lengkap
3. **Keranjang Belanja** - Sistem shopping cart untuk memudahkan transaksi
4. **Checkout & Pembayaran** - Integrasi Stripe untuk pembayaran online
5. **Admin Dashboard** - Mengelola inventory, suppliers, orders, dan reports
6. **Supply Chain Management (SCM)** - Kelola supplier dan inventory
7. **Manufactory Management** - Tracking produksi dan supplier
8. **Halaman Info/About** - Informasi tentang perusahaan dan produk
9. **Real-time Scalability** - Dirancang untuk menangani high traffic dengan load balancing
10. **Responsive Design** - Kompatibel dengan desktop, tablet, dan mobile

## 🛠️ Tech Stack

### Frontend & Backend
- **Next.js 14** - React framework dengan SSR/SSG
- **TypeScript** - Type-safe code
- **Tailwind CSS** - Styling
- **NextAuth.js** - Authentication

### Database
- **PostgreSQL 15** - Database relational
- **Prisma ORM** - Database management
- **Navicat** - Visual database management

### DevOps & Deployment
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 📋 Prerequisites

Sebelum memulai, pastikan Anda sudah install:
- Docker & Docker Compose
- Node.js v20+
- npm atau yarn
- Navicat (optional, untuk UI database management)

## 🚀 Cara Setup

### 1. Clone atau Download Project

```bash
cd "c:\Toko Aksesoris"
```

### 2. Jalankan PostgreSQL dengan Docker

```bash
docker-compose up -d
```

Database akan berjalan di `localhost:5432`

### 3. Install Dependencies

```bash
npm install
```

### 4. Setup Database

```bash
npx prisma generate
npx prisma db push
```

### 5. Jalankan Development Server

```bash
npm run dev
```

Server akan berjalan di **http://localhost:3000**

## 📁 Struktur Project

```
app/
├── (routes)/
│   ├── page.tsx              # Homepage
│   ├── products/             # Halaman katalog produk
│   ├── cart/                 # Halaman keranjang belanja
│   ├── about/                # Halaman informasi
│   ├── auth/
│   │   ├── signin/           # Halaman login
│   │   └── register/         # Halaman registrasi
│   └── admin/                # Dashboard admin
│       ├── inventory/        # Manajemen inventory
│       ├── suppliers/        # Manajemen supplier
│       ├── orders/           # Manajemen orders
│       ├── products/         # Manajemen produk
│       ├── users/            # Manajemen users
│       └── reports/          # Laporan & analytics
├── api/
│   ├── auth/[...nextauth]/   # NextAuth API routes
│   ├── products/             # Product API
│   ├── orders/               # Order API
│   └── register/             # Registration API
├── layout.tsx
├── globals.css
└── page.tsx

lib/
├── prisma.ts                 # Prisma client
└── auth.ts                   # NextAuth configuration

prisma/
└── schema.prisma             # Database schema

public/                        # Static files

.env.local                      # Environment variables
docker-compose.yml            # Docker configuration
tsconfig.json                 # TypeScript config
next.config.js                # Next.js config
package.json                  # Dependencies
```

## 🗄️ Database Schema

### Users
- id, email, name, password, role, createdAt, updatedAt

### Products
- id, name, description, price, image, category, stock, supplierId
- Relasi: supplier (through supplierId)

### Orders
- id, userId, total, status, createdAt, updatedAt
- Items: array of order items dengan product details

### OrderItems
- id, orderId, productId, quantity, price

### Inventory
- id, productId, quantity, location
- Tracking stok per lokasi gudang

### Suppliers
- id, name, contact
- Manajemen supplier/manufactory

## 🔗 Koneksi Database dengan Navicat

1. Buka Navicat
2. Klik "Connection" → "New" → "PostgreSQL"
3. Isi data:
   - **Host:** `localhost`
   - **Port:** `5432`
   - **User Name:** `user`
   - **Password:** `password`
   - **Database:** `akschim`
4. Klik "Test Connection" untuk verifikasi
5. Klik "OK"

## 🚁 API Endpoints

### Authentication
- `POST /api/auth/signin` - Login user
- `POST /api/auth/register` - Registrasi user baru

### Products
- `GET /api/products` - List semua produk
- `POST /api/products` - Tambah produk baru
- `PUT /api/products/[id]` - Update produk
- `DELETE /api/products/[id]` - Hapus produk

### Orders
- `GET /api/orders` - List semua orders
- `POST /api/orders` - Buat order baru
- `GET /api/orders/[id]` - Detail order

### Users
- `GET /api/users` - List semua users
- `POST /api/register` - Registrasi user

## 🏗️ Scalability untuk High Traffic

### Built-in Optimizations

1. **Next.js Features**
   - Server-Side Rendering (SSR)
   - Static Site Generation (SSG)
   - Image Optimization
   - Code Splitting

2. **Database**
   - Connection pooling dengan Prisma
   - Database indexing pada fields penting
   - Query optimization

3. **Caching**
   - Browser caching
   - Server-side caching dengan Next.js
   - CDN support untuk static assets

### Recommendations untuk Production

1. **Deployment**
   - Deploy ke Vercel (Next.js optimal)
   - Atau gunakan dedicated server dengan load balancer (Nginx/HAProxy)

2. **Database**
   - Scale database dengan read replicas
   - Implement database connection pooling
   - Use Redis untuk caching

3. **Load Balancing**
   - Nginx atau HAProxy untuk distribusi traffic
   - Database load balancer
   - Implement rate limiting

4. **Monitoring**
   - Setup monitoring dengan tools seperti Datadog, New Relic
   - Log aggregation dengan ELK Stack
   - Performance monitoring

## 🔐 Environment Variables

Update `.env.local` dengan nilai Anda:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/akschim"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
STRIPE_SECRET_KEY="sk_test_your_stripe_key"
```

## 🧪 Development

### Running Tests
```bash
npm run test
```

### Build Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## 📚 Dokumentasi Tambahan

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)

## 🤝 Support

Untuk informasi lebih lanjut atau bantuan:
- Email: info@akschim.com
- Phone: +62 123 4567 8900
- Address: Jl. Aksesoris No. 123, Jakarta, Indonesia

## 📝 License

© 2026 AksChim. All rights reserved.

---

**Happy Coding! 🎉**