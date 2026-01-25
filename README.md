# Portfolio Backend API

Complete backend API for portfolio + service inquiry platform with admin management.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL (via Supabase)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your credentials

# Generate Prisma client
npm run prisma:generate

# Push schema to database
npm run prisma:push

# Start development server
npm run dev
```

## 📦 Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Auth**: JWT + bcrypt
- **Validation**: Zod
- **Security**: Helmet, CORS, Rate Limiting

## 🔌 API Endpoints

### Public Endpoints

#### Submit Service Inquiry
```http
POST /api/services/inquiry
Content-Type: application/json

{
  "clientName": "John Doe",
  "email": "john@example.com",
  "serviceType": "Web Development",
  "budgetRange": "$5k-$10k",
  "requirements": "Need a modern e-commerce platform"
}
```

#### Submit Hire Request
```http
POST /api/hire/request
Content-Type: application/json

{
  "projectName": "SaaS Dashboard",
  "techStack": ["React", "Node.js", "PostgreSQL"],
  "email": "founder@startup.com",
  "message": "Looking for a full-stack developer"
}
```

### Admin Endpoints

All admin endpoints require `Authorization: Bearer <token>` header.

#### Login
```http
POST /api/admin/login
Content-Type: application/json

{
  "email": "admin@portfolio.com",
  "password": "your_password"
}
```

#### Get All Inquiries
```http
GET /api/admin/inquiries?page=1&limit=20&status=new
Authorization: Bearer <token>
```

#### Get Single Inquiry
```http
GET /api/admin/inquiries/:id
Authorization: Bearer <token>
```

#### Update Inquiry Status
```http
PATCH /api/admin/inquiry/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "in_progress",
  "internalNotes": "Contacted via email"
}
```

#### Get All Hire Requests
```http
GET /api/admin/hire-requests?page=1&limit=20
Authorization: Bearer <token>
```

#### Get Single Hire Request
```http
GET /api/admin/hire-requests/:id
Authorization: Bearer <token>
```

#### Update Hire Request Status
```http
PATCH /api/admin/hire-request/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "accepted",
  "internalNotes": "Scheduled interview"
}
```

#### Get Dashboard Statistics
```http
GET /api/admin/stats
Authorization: Bearer <token>
```

#### Export Inquiries to CSV
```http
GET /api/admin/inquiries/export/csv
Authorization: Bearer <token>
```

## 🔐 Authentication

JWT-based authentication for admin users only. Token expires after 1 hour (configurable).

### Creating Admin Users

Use the Supabase SQL Editor or Prisma Studio:

```sql
-- Generate password hash first (use bcrypt)
INSERT INTO admin_users (email, password_hash, role) VALUES
('admin@example.com', '$2b$10$...', 'admin');
```

Or use Node.js script:
```javascript
const bcrypt = require('bcrypt');
const hash = await bcrypt.hash('YourPassword123', 10);
console.log(hash);
```

## 🛡️ Security Features

- ✅ Helmet (Security headers)
- ✅ CORS with whitelist
- ✅ Rate limiting (100 req/15min general, 5 req/15min auth)
- ✅ Request validation (Zod)
- ✅ Input sanitization
- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ SQL injection protection (Prisma)

## 📊 Database Schema

### Admin Users
- `id` (UUID)
- `email` (unique)
- `password_hash`
- `role` (super_admin, admin, viewer)
- `created_at`, `updated_at`

### Service Inquiries
- `id` (UUID)
- `client_name`, `email`, `service_type`
- `budget_range`, `requirements`
- `status` (new, in_progress, contacted, converted, rejected)
- `internal_notes`
- `created_at`, `updated_at`

### Hire Requests
- `id` (UUID)
- `project_name`, `tech_stack` (JSONB), `email`, `message`
- `status` (new, reviewing, accepted, declined)
- `internal_notes`
- `created_at`, `updated_at`

## 🔔 Notifications

Automatic notifications sent when new inquiries/requests are submitted:
- Email via Resend API
- Slack webhook (optional)

Configure in `.env`:
```env
RESEND_API_KEY=re_xxxxx
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
ADMIN_EMAIL=admin@portfolio.com
```

## 🛠️ Scripts

```bash
# Development
npm run dev              # Start with hot reload

# Production
npm run build            # Compile TypeScript
npm start                # Run compiled code

# Database
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run prisma:push      # Push schema to DB
npm run prisma:studio    # Open Prisma Studio

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format with Prettier
```

## 📁 Project Structure

```
backend/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── config/
│   │   ├── index.ts
│   │   └── database.ts
│   ├── controllers/
│   │   ├── admin.controller.ts
│   │   └── public.controller.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── rateLimiter.middleware.ts
│   │   └── validation.middleware.ts
│   ├── routes/
│   │   ├── admin.routes.ts
│   │   └── public.routes.ts
│   ├── services/
│   │   └── notification.service.ts
│   ├── utils/
│   │   ├── auth.ts
│   │   └── logger.ts
│   ├── validators/
│   │   └── schemas.ts
│   ├── app.ts
│   └── server.ts
├── .env
├── .env.example
├── package.json
└── tsconfig.json
```

## 🌍 Environment Variables

See `.env.example` for all required variables:
- Database connection
- Supabase credentials
- JWT secret
- CORS origins
- Rate limit settings
- Email/Slack config

## 🧪 Testing

```bash
# Health check
curl http://localhost:5000/health

# Test public endpoint
curl -X POST http://localhost:5000/api/services/inquiry \
  -H "Content-Type: application/json" \
  -d '{"clientName":"Test","email":"test@example.com","serviceType":"Testing","requirements":"Test inquiry"}'

# Test admin login
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@portfolio.com","password":"your_password"}'
```

## 🚨 Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` in `.env`
- Check Supabase project is running
- Ensure IP is whitelisted in Supabase

### Authentication Fails
- Verify JWT_SECRET is set
- Check password hash is correct
- Ensure admin user exists in database

### Rate Limit Errors
- Adjust rate limit settings in `.env`
- Clear rate limit by restarting server

## 📝 License

MIT
