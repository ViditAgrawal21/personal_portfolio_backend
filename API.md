# 📚 Portfolio Backend API Documentation

Complete reference for all API endpoints and usage examples.

## 🌐 Base URL

```
http://localhost:5000
```

## 📋 Table of Contents

1. [Public Endpoints](#public-endpoints)
2. [Admin Endpoints](#admin-endpoints)
3. [Authentication](#authentication)
4. [Error Codes](#error-codes)
5. [Examples](#examples)

---

## 🔓 Public Endpoints

### 1. Submit Service Inquiry

**Endpoint:** `POST /api/services/inquiry`

**Rate Limit:** 10 requests per hour per IP

**Request Body:**
```json
{
  "clientName": "John Doe",
  "email": "john@example.com",
  "serviceType": "Web Development",
  "budgetRange": "$5k-$10k",
  "requirements": "Need a modern e-commerce platform with payment integration and admin dashboard"
}
```

**Request Validation:**
- `clientName` (required): 2-255 characters
- `email` (required): Valid email format, max 255 characters
- `serviceType` (required): 2-100 characters
- `budgetRange` (optional): max 50 characters
- `requirements` (required): 10-5000 characters

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Service inquiry submitted successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2026-01-24T10:30:00.000Z"
  }
}
```

**Response (400 Bad Request) - Validation Error:**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "requirements",
      "message": "String must contain at least 10 character(s)"
    }
  ]
}
```

**Response (429 Too Many Requests):**
```json
{
  "error": "Too many submissions, please try again later."
}
```

**Triggers:**
- Email notification to admin
- Slack notification (if configured)

---

### 2. Submit Hire Request

**Endpoint:** `POST /api/hire/request`

**Rate Limit:** 10 requests per hour per IP

**Request Body:**
```json
{
  "projectName": "SaaS Dashboard",
  "techStack": ["React", "Node.js", "PostgreSQL", "AWS"],
  "email": "founder@startup.com",
  "message": "Looking for a full-stack developer to build our analytics dashboard. We need expertise in real-time data processing and have a 3-month timeline."
}
```

**Request Validation:**
- `projectName` (required): 2-255 characters
- `techStack` (required): array of 1-20 strings
- `email` (required): Valid email format, max 255 characters
- `message` (required): 10-5000 characters

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Hire request submitted successfully",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "createdAt": "2026-01-24T10:30:00.000Z"
  }
}
```

**Triggers:**
- Email notification to admin
- Slack notification (if configured)

---

## 🔐 Admin Endpoints

All admin endpoints require JWT authentication. Include token in header:
```
Authorization: Bearer <your_jwt_token>
```

### 1. Admin Login

**Endpoint:** `POST /api/admin/login`

**Rate Limit:** 5 requests per 15 minutes per IP

**Request Body:**
```json
{
  "email": "admin@portfolio.com",
  "password": "YourPassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "admin@portfolio.com",
    "role": "super_admin"
  }
}
```

**Token Expiry:** 1 hour

**Response (401 Unauthorized):**
```json
{
  "error": "Invalid credentials"
}
```

---

### 2. Get All Service Inquiries

**Endpoint:** `GET /api/admin/inquiries`

**Authentication:** Required (Admin role)

**Query Parameters:**
- `page` (optional): Page number, default: 1
- `limit` (optional): Items per page, default: 20
- `status` (optional): Filter by status (new, in_progress, contacted, converted, rejected)

**Example:**
```
GET /api/admin/inquiries?page=1&limit=10&status=new
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "clientName": "John Doe",
      "email": "john@example.com",
      "serviceType": "Web Development",
      "budgetRange": "$5k-$10k",
      "requirements": "E-commerce platform...",
      "status": "NEW",
      "internalNotes": null,
      "createdAt": "2026-01-24T10:30:00.000Z",
      "updatedAt": "2026-01-24T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

---

### 3. Get Single Service Inquiry

**Endpoint:** `GET /api/admin/inquiries/:id`

**Authentication:** Required

**Example:**
```
GET /api/admin/inquiries/550e8400-e29b-41d4-a716-446655440000
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "clientName": "John Doe",
    "email": "john@example.com",
    "serviceType": "Web Development",
    "budgetRange": "$5k-$10k",
    "requirements": "Full e-commerce platform...",
    "status": "NEW",
    "internalNotes": null,
    "createdAt": "2026-01-24T10:30:00.000Z",
    "updatedAt": "2026-01-24T10:30:00.000Z"
  }
}
```

**Response (404 Not Found):**
```json
{
  "error": "Inquiry not found"
}
```

---

### 4. Update Service Inquiry Status

**Endpoint:** `PATCH /api/admin/inquiry/:id/status`

**Authentication:** Required (Admin or Super Admin role only)

**Request Body:**
```json
{
  "status": "in_progress",
  "internalNotes": "Reached out via email, waiting for detailed requirements"
}
```

**Status Values:**
- `new`
- `in_progress`
- `contacted`
- `converted`
- `rejected`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "clientName": "John Doe",
    "status": "IN_PROGRESS",
    "internalNotes": "Reached out via email, waiting for detailed requirements",
    "updatedAt": "2026-01-24T11:00:00.000Z"
  }
}
```

**Response (403 Forbidden) - Viewer role:**
```json
{
  "error": "Insufficient permissions"
}
```

---

### 5. Get All Hire Requests

**Endpoint:** `GET /api/admin/hire-requests`

**Authentication:** Required

**Query Parameters:**
- `page` (optional): default 1
- `limit` (optional): default 20
- `status` (optional): Filter by status (new, reviewing, accepted, declined)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "projectName": "SaaS Dashboard",
      "techStack": ["React", "Node.js", "PostgreSQL", "AWS"],
      "email": "founder@startup.com",
      "message": "Looking for full-stack developer...",
      "status": "NEW",
      "internalNotes": null,
      "createdAt": "2026-01-24T10:30:00.000Z",
      "updatedAt": "2026-01-24T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "totalPages": 1
  }
}
```

---

### 6. Get Single Hire Request

**Endpoint:** `GET /api/admin/hire-requests/:id`

**Authentication:** Required

**Response (200 OK):** Returns single hire request object

---

### 7. Update Hire Request Status

**Endpoint:** `PATCH /api/admin/hire-request/:id/status`

**Authentication:** Required (Admin or Super Admin only)

**Request Body:**
```json
{
  "status": "accepted",
  "internalNotes": "Scheduled initial interview for Jan 26"
}
```

**Status Values:**
- `new`
- `reviewing`
- `accepted`
- `declined`

**Response (200 OK):** Returns updated hire request

---

### 8. Get Dashboard Statistics

**Endpoint:** `GET /api/admin/stats`

**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalInquiries": 42,
      "totalHireRequests": 15,
      "total": 57
    },
    "inquiries": {
      "byStatus": {
        "NEW": 8,
        "IN_PROGRESS": 5,
        "CONTACTED": 12,
        "CONVERTED": 15,
        "REJECTED": 2
      },
      "recent": [
        {
          "id": "550e8400-e29b-41d4-a716-446655440000",
          "clientName": "John Doe",
          "serviceType": "Web Development",
          "status": "NEW",
          "createdAt": "2026-01-24T10:30:00.000Z"
        }
      ]
    },
    "hireRequests": {
      "byStatus": {
        "NEW": 3,
        "REVIEWING": 4,
        "ACCEPTED": 5,
        "DECLINED": 3
      },
      "recent": [
        {
          "id": "660e8400-e29b-41d4-a716-446655440001",
          "projectName": "SaaS Dashboard",
          "status": "NEW",
          "createdAt": "2026-01-24T10:30:00.000Z"
        }
      ]
    }
  }
}
```

---

### 9. Export Inquiries as CSV

**Endpoint:** `GET /api/admin/inquiries/export/csv`

**Authentication:** Required

**Response:** CSV file download

**CSV Format:**
```
ID,Client Name,Email,Service Type,Budget Range,Status,Created At
550e8400-e29b-41d4-a716-446655440000,"John Doe",john@example.com,"Web Development","$5k-$10k",NEW,2026-01-24T10:30:00.000Z
```

---

## 🔑 Authentication

### JWT Token Structure

The JWT token contains:
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "email": "admin@portfolio.com",
  "role": "super_admin",
  "iat": 1705932600,
  "exp": 1705936200
}
```

### Admin Roles

| Role | Permissions |
|------|-------------|
| `super_admin` | Full access, can manage users |
| `admin` | Can view all data, update status |
| `viewer` | Can only view data (read-only) |

### Headers

All authenticated requests require:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

---

## ❌ Error Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Successful request |
| 201 | Created | Inquiry/request successfully submitted |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Internal server error |

### Common Error Responses

**400 - Validation Error:**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

**401 - No Token:**
```json
{
  "error": "No token provided"
}
```

**401 - Invalid Token:**
```json
{
  "error": "Invalid or expired token"
}
```

**429 - Rate Limited:**
```json
{
  "error": "Too many requests from this IP, please try again later."
}
```

---

## 💻 Examples

### cURL Examples

**Submit Service Inquiry:**
```bash
curl -X POST http://localhost:5000/api/services/inquiry \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "John Doe",
    "email": "john@example.com",
    "serviceType": "Web Development",
    "budgetRange": "$5k-$10k",
    "requirements": "Need a modern e-commerce platform with payment integration"
  }'
```

**Admin Login:**
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@portfolio.com",
    "password": "YourPassword123"
  }'
```

**Get Inquiries (with token):**
```bash
curl -X GET http://localhost:5000/api/admin/inquiries \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Update Inquiry Status:**
```bash
curl -X PATCH http://localhost:5000/api/admin/inquiry/550e8400-e29b-41d4-a716-446655440000/status \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress",
    "internalNotes": "Initial contact made"
  }'
```

### JavaScript/Fetch Examples

**Submit Inquiry:**
```javascript
const response = await fetch('http://localhost:5000/api/services/inquiry', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    clientName: 'John Doe',
    email: 'john@example.com',
    serviceType: 'Web Development',
    budgetRange: '$5k-$10k',
    requirements: 'Need an e-commerce platform'
  })
});

const data = await response.json();
console.log(data);
```

**Admin Login & Get Inquiries:**
```javascript
// Login
const loginRes = await fetch('http://localhost:5000/api/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@portfolio.com',
    password: 'YourPassword123'
  })
});

const { token } = await loginRes.json();

// Get inquiries
const inquiriesRes = await fetch('http://localhost:5000/api/admin/inquiries?page=1&limit=10', {
  headers: { 'Authorization': `Bearer ${token}` }
});

const inquiries = await inquiriesRes.json();
console.log(inquiries);
```

---

## 📊 Rate Limits

| Endpoint | Limit |
|----------|-------|
| Public (inquiry/hire) | 10/hour per IP |
| Login | 5/15min per IP |
| Admin API | 100/15min per IP |

---

## 🔗 Webhooks & Notifications

### Automatic Triggers

**On New Service Inquiry:**
- Email sent to admin
- Slack message (if configured)

**On New Hire Request:**
- Email sent to admin
- Slack message (if configured)

### Slack Message Format

```json
{
  "blocks": [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "🆕 New Service Inquiry"
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "Client details..."
      }
    }
  ]
}
```

---

## 🚀 Testing Checklist

- [ ] Health check: `GET /health`
- [ ] Submit inquiry: `POST /api/services/inquiry`
- [ ] Submit hire request: `POST /api/hire/request`
- [ ] Admin login: `POST /api/admin/login`
- [ ] Get inquiries: `GET /api/admin/inquiries`
- [ ] Update status: `PATCH /api/admin/inquiry/:id/status`
- [ ] Get statistics: `GET /api/admin/stats`
- [ ] Export CSV: `GET /api/admin/inquiries/export/csv`

---

## 📞 Support

For issues or questions about the API, check:
1. Error response message
2. Validation details in response
3. Rate limit headers
4. JWT token expiration
