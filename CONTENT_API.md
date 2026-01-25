# 🎨 Portfolio Content Management API

Complete CMS for managing your portfolio content via admin API.

## 📋 Overview

Control everything displayed on your portfolio from the backend:
- **About Section** - Personal info, bio, social links
- **Services** - Service offerings with descriptions
- **Projects** - Portfolio projects with tech stacks
- **Tech Stack** - Technologies with proficiency levels
- **Experience** - Work history
- **Education** - Academic background

---

## 🌐 Public APIs (No Auth Required)

### Get All Content
```http
GET /api/content/all
```
**Response:** Returns all portfolio content in one request
```json
{
  "success": true,
  "data": {
    "about": { /* about data */ },
    "services": [ /* services array */ ],
    "projects": [ /* projects array */ ],
    "techStack": [ /* tech stack array */ ],
    "experience": [ /* experience array */ ],
    "education": [ /* education array */ ]
  }
}
```

### Get About Section
```http
GET /api/content/about
```

### Get Services
```http
GET /api/content/services
```

### Get Projects
```http
GET /api/content/projects?featured=true&category=Web App
```
Query params:
- `featured` (boolean) - Filter featured projects
- `category` (string) - Filter by category

### Get Tech Stack
```http
GET /api/content/stack?category=Frontend
```
Query params:
- `category` (string) - Filter by category

### Get Experience
```http
GET /api/content/experience
```

### Get Education
```http
GET /api/content/education
```

---

## 🔐 Admin APIs (Auth Required)

**All admin endpoints require**: `Authorization: Bearer <token>`

### About Section

#### Get About
```http
GET /api/admin/content/about
Authorization: Bearer <token>
```

#### Update About
```http
PUT /api/admin/content/about
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "Your Name",
  "title": "Full Stack Developer",
  "bio": "Passionate developer with X years of experience...",
  "email": "your@email.com",
  "phone": "+1234567890",
  "location": "City, Country",
  "resumeUrl": "https://example.com/resume.pdf",
  "githubUrl": "https://github.com/username",
  "linkedinUrl": "https://linkedin.com/in/username",
  "twitterUrl": "https://twitter.com/username",
  "profileImageUrl": "https://example.com/profile.jpg",
  "yearsOfExp": 5
}
```

### Services

#### Get All Services
```http
GET /api/admin/content/services
Authorization: Bearer <token>
```

#### Create Service
```http
POST /api/admin/content/services
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Web Development",
  "description": "Custom web applications built with modern technologies",
  "icon": "Code",
  "features": ["Responsive Design", "SEO Optimized", "Fast Performance"],
  "pricing": "Starting at $5,000",
  "isActive": true,
  "displayOrder": 1
}
```

#### Update Service
```http
PUT /api/admin/content/services/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Service Name",
  "isActive": false
}
```

#### Delete Service
```http
DELETE /api/admin/content/services/:id
Authorization: Bearer <token>
```

### Projects

#### Get All Projects
```http
GET /api/admin/content/projects
Authorization: Bearer <token>
```

#### Create Project
```http
POST /api/admin/content/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "E-Commerce Platform",
  "description": "Full-featured online store with payment integration",
  "techStack": ["React", "Node.js", "PostgreSQL", "Stripe"],
  "imageUrl": "https://example.com/project.jpg",
  "demoUrl": "https://demo.example.com",
  "githubUrl": "https://github.com/user/repo",
  "category": "Web App",
  "isFeatured": true,
  "isActive": true,
  "displayOrder": 1
}
```

#### Update Project
```http
PUT /api/admin/content/projects/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "isFeatured": false,
  "displayOrder": 5
}
```

#### Delete Project
```http
DELETE /api/admin/content/projects/:id
Authorization: Bearer <token>
```

### Tech Stack

#### Get All Tech Stack
```http
GET /api/admin/content/stack
Authorization: Bearer <token>
```

#### Create Tech Stack Item
```http
POST /api/admin/content/stack
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "React",
  "category": "Frontend",
  "icon": "react-icon",
  "proficiency": 90,
  "isActive": true,
  "displayOrder": 1
}
```

#### Update Tech Stack
```http
PUT /api/admin/content/stack/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "proficiency": 95
}
```

#### Delete Tech Stack
```http
DELETE /api/admin/content/stack/:id
Authorization: Bearer <token>
```

### Experience

#### Get All Experience
```http
GET /api/admin/content/experience
Authorization: Bearer <token>
```

#### Create Experience
```http
POST /api/admin/content/experience
Authorization: Bearer <token>
Content-Type: application/json

{
  "company": "Tech Company Inc",
  "position": "Senior Developer",
  "description": "Led development of microservices architecture...",
  "startDate": "2020-01-15",
  "endDate": "2023-06-30",
  "isCurrent": false,
  "location": "San Francisco, CA",
  "companyUrl": "https://company.com",
  "techUsed": ["Node.js", "React", "AWS"],
  "isActive": true,
  "displayOrder": 1
}
```

#### Update Experience
```http
PUT /api/admin/content/experience/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "isCurrent": false,
  "endDate": "2024-01-15"
}
```

#### Delete Experience
```http
DELETE /api/admin/content/experience/:id
Authorization: Bearer <token>
```

### Education

#### Get All Education
```http
GET /api/admin/content/education
Authorization: Bearer <token>
```

#### Create Education
```http
POST /api/admin/content/education
Authorization: Bearer <token>
Content-Type: application/json

{
  "institution": "University Name",
  "degree": "Bachelor of Science",
  "field": "Computer Science",
  "startDate": "2016-09-01",
  "endDate": "2020-05-15",
  "isCurrent": false,
  "grade": "3.8 GPA",
  "location": "City, State",
  "description": "Focused on software engineering and algorithms",
  "isActive": true,
  "displayOrder": 1
}
```

#### Update Education
```http
PUT /api/admin/content/education/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "grade": "3.9 GPA"
}
```

#### Delete Education
```http
DELETE /api/admin/content/education/:id
Authorization: Bearer <token>
```

---

## 🎯 Common Patterns

### Display Order
All content types support `displayOrder` field (integer) to control display sequence.
Lower numbers appear first.

### Active/Inactive
Most content types have `isActive` field to hide items without deleting them.

### Featured Content
Projects support `isFeatured` flag to highlight important work.

### Filtering
Public APIs automatically filter by `isActive: true`.
Admin APIs return all records.

---

## 📊 Response Format

All endpoints return consistent JSON format:

**Success:**
```json
{
  "success": true,
  "data": { /* response data */ }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message"
}
```

---

## 🚀 Quick Setup

1. **Push new schema to database:**
   ```bash
   npx prisma db push
   ```

2. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

3. **Start the server:**
   ```bash
   npm run dev
   ```

4. **Login to get auth token:**
   ```bash
   curl -X POST http://localhost:5000/api/admin/login \
     -H "Content-Type: application/json" \
     -d '{"email":"your@email.com","password":"your_password"}'
   ```

5. **Add your content via admin APIs!**

---

## 💡 Usage Example

**Frontend Integration:**
```javascript
// Fetch all portfolio content on page load
const response = await fetch('http://localhost:5000/api/content/all');
const { data } = await response.json();

// Use data in your React/Vue/etc components
const { about, services, projects, techStack, experience, education } = data;
```

**Admin Panel:**
```javascript
// Add authentication header
const token = localStorage.getItem('authToken');

// Create new project
await fetch('http://localhost:5000/api/admin/content/projects', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'New Project',
    description: 'Project description',
    techStack: ['React', 'Node.js'],
    isActive: true
  })
});
```
