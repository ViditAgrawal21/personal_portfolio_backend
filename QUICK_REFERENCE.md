# 🚀 Quick Reference - Portfolio CMS APIs

## 🔐 Admin Credentials
- **Email:** `agrawalvidit656@gmail.com`
- **Password:** `Vidit@2002`

## 🌐 Base URL
- **Local:** `http://localhost:5000`

## 📋 Quick API Reference

### 1. Login (Get Token)
```bash
POST /api/admin/login
{
  "email": "agrawalvidit656@gmail.com",
  "password": "Vidit@2002"
}
```

### 2. Public APIs (No Auth)
```
GET /api/content/all          # Everything in one call
GET /api/content/about         # Personal info
GET /api/content/services      # Your services
GET /api/content/projects      # Portfolio projects
GET /api/content/stack         # Tech skills
GET /api/content/experience    # Work history
GET /api/content/education     # Education
```

### 3. Admin APIs (With Token)
All require: `Authorization: Bearer YOUR_TOKEN`

#### About
```
GET  /api/admin/content/about
PUT  /api/admin/content/about
```

#### Services
```
GET    /api/admin/content/services
POST   /api/admin/content/services
PUT    /api/admin/content/services/:id
DELETE /api/admin/content/services/:id
```

#### Projects
```
GET    /api/admin/content/projects
POST   /api/admin/content/projects
PUT    /api/admin/content/projects/:id
DELETE /api/admin/content/projects/:id
```

#### Tech Stack
```
GET    /api/admin/content/stack
POST   /api/admin/content/stack
PUT    /api/admin/content/stack/:id
DELETE /api/admin/content/stack/:id
```

#### Experience
```
GET    /api/admin/content/experience
POST   /api/admin/content/experience
PUT    /api/admin/content/experience/:id
DELETE /api/admin/content/experience/:id
```

#### Education
```
GET    /api/admin/content/education
POST   /api/admin/content/education
PUT    /api/admin/content/education/:id
DELETE /api/admin/content/education/:id
```

## 🧪 Test Commands

### Test with curl
```bash
# Login
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"agrawalvidit656@gmail.com","password":"Vidit@2002"}'

# Get all content (public)
curl http://localhost:5000/api/content/all

# Create service (replace YOUR_TOKEN)
curl -X POST http://localhost:5000/api/admin/content/services \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"Web Dev","description":"Building apps","isActive":true}'
```

### Test with JavaScript
```bash
node test-content-api.js
```

## 📦 Sample Data

### Create About
```json
{
  "fullName": "Vidit Agrawal",
  "title": "Full Stack Developer",
  "bio": "Passionate about building web applications",
  "email": "agrawalvidit656@gmail.com",
  "githubUrl": "https://github.com/yourusername",
  "linkedinUrl": "https://linkedin.com/in/yourusername",
  "yearsOfExp": 3
}
```

### Create Service
```json
{
  "title": "Web Development",
  "description": "Building responsive web applications",
  "icon": "Code",
  "features": ["React", "Node.js", "TypeScript"],
  "pricing": "Starting at $1000",
  "isActive": true,
  "displayOrder": 1
}
```

### Create Project
```json
{
  "title": "Portfolio Website",
  "description": "Modern portfolio with CMS",
  "techStack": ["React", "TypeScript", "Node.js", "PostgreSQL"],
  "demoUrl": "https://demo.example.com",
  "githubUrl": "https://github.com/user/repo",
  "category": "Web App",
  "isFeatured": true,
  "isActive": true,
  "displayOrder": 1
}
```

### Create Tech Stack
```json
{
  "name": "React",
  "category": "Frontend",
  "icon": "react",
  "proficiency": 90,
  "isActive": true,
  "displayOrder": 1
}
```

### Create Experience
```json
{
  "company": "Tech Company",
  "position": "Full Stack Developer",
  "description": "Built web applications",
  "startDate": "2022-01-01",
  "endDate": "2024-12-31",
  "isCurrent": false,
  "location": "Remote",
  "techUsed": ["React", "Node.js"],
  "isActive": true,
  "displayOrder": 1
}
```

### Create Education
```json
{
  "institution": "University Name",
  "degree": "Bachelor of Technology",
  "field": "Computer Science",
  "startDate": "2018-08-01",
  "endDate": "2022-05-31",
  "isCurrent": false,
  "grade": "8.5 CGPA",
  "location": "India",
  "isActive": true,
  "displayOrder": 1
}
```

## 🎯 Common Use Cases

### 1. Initial Setup
```bash
# 1. Login and save token
# 2. Create about section
# 3. Add 3-5 services
# 4. Add 5-10 projects
# 5. Add 10-15 tech stack items
# 6. Add work experience
# 7. Add education
```

### 2. Update Content
```bash
# Update service with id
PUT /api/admin/content/services/:id

# Hide item without deleting
PUT /api/admin/content/projects/:id
{"isActive": false}

# Change order
PUT /api/admin/content/services/:id
{"displayOrder": 5}
```

### 3. Frontend Integration
```javascript
// On page load
const res = await fetch('http://localhost:5000/api/content/all');
const { data } = await res.json();

// Use data.about, data.services, data.projects, etc.
```

## 📚 Full Documentation
- [CONTENT_API.md](./CONTENT_API.md) - Complete API docs
- [CMS_COMPLETE.md](./CMS_COMPLETE.md) - Implementation guide
- [API.md](./API.md) - All backend APIs

## ✅ Server Status
- Running on: `http://localhost:5000`
- Health check: `http://localhost:5000/health`
- Database: Connected to Supabase
