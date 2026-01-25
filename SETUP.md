# 🚀 Backend Setup Instructions

## ⚠️ Important: Database Connection Required

Before running the backend, you need to update the DATABASE_URL in `.env` file.

### Step 1: Get Database Password from Supabase

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: `yqwkrnxublqaudjeosp`
3. Go to **Settings** → **Database**
4. Find **Connection String** section
5. Copy the password from the connection string

### Step 2: Update .env File

Open `g:\personal_portfolio\backend\.env` and update line 6:

```env
DATABASE_URL=postgresql://postgres.yqwkrnxublqaudjeosp:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

Replace `[YOUR-PASSWORD]` with the actual password from Supabase.

### Step 3: Push Database Schema

```bash
cd g:\personal_portfolio\backend
npx prisma db push
```

This will create all tables in your Supabase database.

### Step 4: Create Admin User

Run the setup script:

```bash
node scripts/create-admin.js
```

Follow the prompts to create your admin account. Then copy the SQL command and run it in Supabase SQL Editor.

**Or manually in Supabase SQL Editor:**

```sql
-- First, generate hash using Node.js:
-- const bcrypt = require('bcrypt');
-- const hash = await bcrypt.hash('YourPassword123', 10);

INSERT INTO admin_users (email, password_hash, role) VALUES
('admin@portfolio.com', '$2b$10$YOUR_HASH_HERE', 'super_admin');
```

### Step 5: Optional - Configure Email & Slack

In `.env` file, add:

```env
# Email via Resend
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Slack webhook (optional)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx/xxx/xxx
```

Get Resend API key: https://resend.com/api-keys

### Step 6: Start the Backend

```bash
# Development mode (hot reload)
npm run dev

# Production mode
npm run build
npm start
```

### Step 7: Test the API

```bash
# Health check
curl http://localhost:5000/health

# Test login (after creating admin user)
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@portfolio.com","password":"YourPassword123"}'
```

## 🎯 Quick Reference

### Backend is running at:
- **Base URL**: http://localhost:5000
- **Health**: http://localhost:5000/health
- **Public API**: http://localhost:5000/api
- **Admin API**: http://localhost:5000/api/admin

### Database (Supabase):
- **Project URL**: https://yqwkrnxublqaudjeosp.supabase.co
- **Dashboard**: https://supabase.com/dashboard/project/yqwkrnxublqaudjeosp

### Next Steps:
1. ✅ Fixed Edge Function errors
2. ✅ Built complete Express backend
3. ✅ Configured Supabase credentials
4. ⏳ Update DATABASE_URL password
5. ⏳ Run `npx prisma db push`
6. ⏳ Create admin user
7. ⏳ Start backend with `npm run dev`

## 📚 API Documentation

See `README.md` for complete API documentation including:
- All endpoint details
- Request/response examples
- Authentication guide
- Error codes
- Security features
