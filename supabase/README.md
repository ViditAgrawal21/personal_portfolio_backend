# 🗄️ Supabase Backend Setup

Complete database schema, RLS policies, and Edge Functions for the portfolio backend.

## 📋 Prerequisites

- [Supabase CLI](https://supabase.com/docs/guides/cli) installed
- Supabase project created (cloud or local)
- Node.js 18+ for Edge Functions

## 🚀 Quick Setup

### Option 1: Supabase Cloud (Production)

1. **Create a new project** at [supabase.com](https://supabase.com)

2. **Run migrations** in SQL Editor:
   ```bash
   # Copy content from migrations/001_initial_schema.sql
   # Paste in Supabase SQL Editor and run
   
   # Then run migrations/002_rls_policies.sql
   ```

3. **Configure Auth Settings**:
   - Go to Authentication → Settings
   - **Disable** "Enable email confirmations"
   - **Disable** "Enable email signup"
   - Set JWT expiry to 3600 (1 hour)

4. **Set Environment Variables**:
   ```bash
   # In Supabase Dashboard → Settings → Edge Functions
   RESEND_API_KEY=your_resend_api_key
   SLACK_WEBHOOK_URL=your_slack_webhook_url
   ADMIN_EMAIL=your_admin_email
   ADMIN_DASHBOARD_URL=https://admin.yoursite.com
   ```

5. **Deploy Edge Functions**:
   ```bash
   supabase login
   supabase link --project-ref your-project-ref
   
   supabase functions deploy notify-inquiry
   supabase functions deploy notify-hire-request
   ```

6. **Create Database Webhooks**:
   - Go to Database → Webhooks
   - Create webhook for `service_inquiries` INSERT → `notify-inquiry` function
   - Create webhook for `hire_requests` INSERT → `notify-hire-request` function

### Option 2: Local Development

1. **Initialize Supabase**:
   ```bash
   supabase init
   supabase start
   ```

2. **Run migrations**:
   ```bash
   supabase db reset
   ```

3. **Access local services**:
   - Studio: http://localhost:54323
   - API: http://localhost:54321
   - DB: postgresql://postgres:postgres@localhost:54322/postgres

## 🗂️ Database Schema

### Tables

#### `admin_users`
- `id` (UUID, PK)
- `email` (VARCHAR, UNIQUE)
- `password_hash` (TEXT)
- `role` (ENUM: super_admin, admin, viewer)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### `service_inquiries`
- `id` (UUID, PK)
- `client_name` (VARCHAR)
- `email` (VARCHAR)
- `service_type` (VARCHAR)
- `budget_range` (VARCHAR)
- `requirements` (TEXT)
- `status` (ENUM: new, in_progress, contacted, converted, rejected)
- `internal_notes` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### `hire_requests`
- `id` (UUID, PK)
- `project_name` (VARCHAR)
- `tech_stack` (JSONB)
- `email` (VARCHAR)
- `message` (TEXT)
- `status` (ENUM: new, reviewing, accepted, declined)
- `internal_notes` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## 🔐 Row Level Security (RLS)

### Security Rules:

✅ **Public can**:
- INSERT into `service_inquiries`
- INSERT into `hire_requests`

❌ **Public cannot**:
- SELECT any data
- UPDATE any data
- DELETE any data

✅ **Authenticated admins can**:
- SELECT all inquiries and requests
- UPDATE status and notes (admin/super_admin only)
- DELETE (super_admin only)

## 🔌 Edge Functions

### `notify-inquiry`
Triggers on new service inquiry:
- Sends email via Resend
- Sends Slack notification
- Includes inquiry details and dashboard link

### `notify-hire-request`
Triggers on new hire request:
- Sends email via Resend
- Sends Slack notification
- Includes project details and tech stack

### Required Environment Variables:
```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx/xxx/xxx
ADMIN_EMAIL=admin@portfolio.com
ADMIN_DASHBOARD_URL=https://admin.yoursite.com
```

## 👤 Initial Admin Account

**Default credentials** (from seed.sql):
- Email: `superadmin@portfolio.com`
- Password: `Admin@123`

⚠️ **IMPORTANT**: Change this password immediately in production!

### Generate new password hash:
```javascript
const bcrypt = require('bcrypt');
const hash = await bcrypt.hash('YourNewPassword', 10);
console.log(hash);
```

Then update in SQL:
```sql
UPDATE admin_users 
SET password_hash = 'your_new_hash_here' 
WHERE email = 'superadmin@portfolio.com';
```

## 🔧 Configuration

### Disable Public Signup
```sql
-- Already configured in migrations, but to verify:
-- Go to Authentication → Settings → Enable email signup: OFF
```

### Setup Webhooks
1. Database → Webhooks → Create new webhook
2. For `service_inquiries`:
   - Table: `service_inquiries`
   - Events: INSERT
   - Type: Edge Function
   - Function: `notify-inquiry`

3. For `hire_requests`:
   - Table: `hire_requests`
   - Events: INSERT
   - Type: Edge Function
   - Function: `notify-hire-request`

## 📊 Testing

### Test RLS Policies:
```sql
-- Should return 0 rows (public cannot read)
SELECT * FROM service_inquiries;

-- Login as admin, then should return all rows
SELECT * FROM service_inquiries;
```

### Test Public Insert:
```bash
curl -X POST 'https://your-project.supabase.co/rest/v1/service_inquiries' \
  -H "apikey: your-anon-key" \
  -H "Content-Type: application/json" \
  -d '{
    "client_name": "Test Client",
    "email": "test@example.com",
    "service_type": "Web Development",
    "budget_range": "$5k-$10k",
    "requirements": "Test requirements"
  }'
```

## 🔄 Migrations

All migrations are in `supabase/migrations/`:
- `001_initial_schema.sql` - Tables, indexes, triggers
- `002_rls_policies.sql` - Security policies

To reset database:
```bash
supabase db reset
```

## 🎯 API Endpoints

Get from Supabase Dashboard → Settings → API:
- **Project URL**: `https://xxxxx.supabase.co`
- **Anon Key**: Public key for client-side
- **Service Role Key**: Secret key for server-side (never expose!)

## 📦 Connection String

```
postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```

Use this in your backend's `.env`:
```env
DATABASE_URL=your_connection_string
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
```

## ✅ Success Checklist

- [ ] Tables created with proper indexes
- [ ] RLS enabled on all tables
- [ ] Public signup disabled
- [ ] Edge Functions deployed
- [ ] Webhooks configured
- [ ] Environment variables set
- [ ] Default admin password changed
- [ ] Email notifications working
- [ ] Slack notifications working (optional)
- [ ] Test public insert
- [ ] Test admin authentication

## 🆘 Troubleshooting

### Issue: Public can read data
- Check RLS is enabled: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
- Verify policies are created

### Issue: Admin cannot login
- Check `admin_users` table has entries
- Verify password hash is correct bcrypt hash
- Check JWT configuration in Auth settings

### Issue: Webhooks not triggering
- Verify webhook is enabled
- Check Edge Function logs in Dashboard
- Ensure environment variables are set

### Issue: Notifications not sending
- Check Resend API key is valid
- Verify Slack webhook URL is correct
- Check Edge Function logs for errors

## 🔗 Resources

- [Supabase Docs](https://supabase.com/docs)
- [RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Edge Functions](https://supabase.com/docs/guides/functions)
- [Resend API](https://resend.com/docs)
