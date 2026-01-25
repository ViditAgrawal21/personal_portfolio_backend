# 🎨 Frontend API Guide - Portfolio Backend

Complete guide for frontend developers to integrate the portfolio CMS APIs.

---

## 🌐 API Base URL

```
Development: http://localhost:5000
Production: https://your-domain.com
```

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Public APIs](#public-apis)
3. [TypeScript Types](#typescript-types)
4. [React Integration](#react-integration)
5. [Error Handling](#error-handling)
6. [Best Practices](#best-practices)

---

## 🚀 Quick Start

### Fetch All Portfolio Content (Recommended)

```javascript
// Single request to get everything
const response = await fetch('http://localhost:5000/api/content/all');
const { success, data } = await response.json();

// data contains:
// - about: Personal information
// - services: Array of services
// - projects: Array of projects
// - techStack: Array of technologies
// - experience: Array of work experience
// - education: Array of education
```

### Response Structure

```json
{
  "success": true,
  "data": {
    "about": { /* about object */ },
    "services": [ /* array */ ],
    "projects": [ /* array */ ],
    "techStack": [ /* array */ ],
    "experience": [ /* array */ ],
    "education": [ /* array */ ]
  }
}
```

---

## 📡 Public APIs

All endpoints return JSON with format: `{ success: boolean, data: any, error?: string }`

### 1. Get All Content

**Best for initial page load - fetches everything in one request**

```http
GET /api/content/all
```

**Example:**
```javascript
const getPortfolioContent = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/content/all');
    const { success, data } = await res.json();
    
    if (success) {
      return data;
    }
  } catch (error) {
    console.error('Failed to fetch content:', error);
  }
};
```

---

### 2. Get About Section

```http
GET /api/content/about
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "fullName": "John Doe",
    "title": "Full Stack Developer",
    "bio": "Passionate developer building modern web applications...",
    "email": "john@example.com",
    "phone": "+1234567890",
    "location": "San Francisco, CA",
    "resumeUrl": "https://example.com/resume.pdf",
    "githubUrl": "https://github.com/johndoe",
    "linkedinUrl": "https://linkedin.com/in/johndoe",
    "twitterUrl": "https://twitter.com/johndoe",
    "profileImageUrl": "https://example.com/profile.jpg",
    "yearsOfExp": 5,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Usage:**
```javascript
const getAbout = async () => {
  const res = await fetch('http://localhost:5000/api/content/about');
  const { data } = await res.json();
  return data;
};
```

---

### 3. Get Services

```http
GET /api/content/services
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Web Development",
      "description": "Building responsive and modern web applications",
      "icon": "Code",
      "features": ["React", "Node.js", "TypeScript"],
      "pricing": "Starting at $1000",
      "displayOrder": 1
    }
  ]
}
```

**Usage:**
```javascript
const getServices = async () => {
  const res = await fetch('http://localhost:5000/api/content/services');
  const { data } = await res.json();
  return data; // Returns array of services
};
```

---

### 4. Get Projects

```http
GET /api/content/projects
GET /api/content/projects?featured=true
GET /api/content/projects?category=Web App
GET /api/content/projects?featured=true&category=Web App
```

**Query Parameters:**
- `featured` (boolean) - Filter only featured projects
- `category` (string) - Filter by category

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "E-Commerce Platform",
      "description": "Full-featured online store with payment integration",
      "techStack": ["React", "Node.js", "PostgreSQL", "Stripe"],
      "imageUrl": "https://example.com/project.jpg",
      "demoUrl": "https://demo.example.com",
      "githubUrl": "https://github.com/user/repo",
      "category": "Web App",
      "isFeatured": true,
      "displayOrder": 1
    }
  ]
}
```

**Usage:**
```javascript
// Get all projects
const getAllProjects = async () => {
  const res = await fetch('http://localhost:5000/api/content/projects');
  const { data } = await res.json();
  return data;
};

// Get only featured projects
const getFeaturedProjects = async () => {
  const res = await fetch('http://localhost:5000/api/content/projects?featured=true');
  const { data } = await res.json();
  return data;
};

// Get projects by category
const getProjectsByCategory = async (category) => {
  const res = await fetch(`http://localhost:5000/api/content/projects?category=${category}`);
  const { data } = await res.json();
  return data;
};
```

---

### 5. Get Tech Stack

```http
GET /api/content/stack
GET /api/content/stack?category=Frontend
```

**Query Parameters:**
- `category` (string) - Filter by category (e.g., Frontend, Backend, Database, Tools)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "React",
      "category": "Frontend",
      "icon": "react",
      "proficiency": 90,
      "displayOrder": 1
    },
    {
      "id": "uuid",
      "name": "Node.js",
      "category": "Backend",
      "icon": "nodejs",
      "proficiency": 85,
      "displayOrder": 2
    }
  ]
}
```

**Usage:**
```javascript
// Get all tech stack
const getTechStack = async () => {
  const res = await fetch('http://localhost:5000/api/content/stack');
  const { data } = await res.json();
  return data;
};

// Get by category
const getFrontendTech = async () => {
  const res = await fetch('http://localhost:5000/api/content/stack?category=Frontend');
  const { data } = await res.json();
  return data;
};

// Group by category
const getTechStackGrouped = async () => {
  const res = await fetch('http://localhost:5000/api/content/stack');
  const { data } = await res.json();
  
  const grouped = data.reduce((acc, tech) => {
    if (!acc[tech.category]) acc[tech.category] = [];
    acc[tech.category].push(tech);
    return acc;
  }, {});
  
  return grouped;
};
```

---

### 6. Get Experience

```http
GET /api/content/experience
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "company": "Tech Company Inc",
      "position": "Senior Developer",
      "description": "Led development of microservices architecture...",
      "startDate": "2020-01-15T00:00:00.000Z",
      "endDate": "2023-06-30T00:00:00.000Z",
      "isCurrent": false,
      "location": "San Francisco, CA",
      "companyUrl": "https://company.com",
      "techUsed": ["Node.js", "React", "AWS"],
      "displayOrder": 1
    }
  ]
}
```

**Usage:**
```javascript
const getExperience = async () => {
  const res = await fetch('http://localhost:5000/api/content/experience');
  const { data } = await res.json();
  return data;
};

// Format dates for display
const formatExperience = (exp) => {
  const start = new Date(exp.startDate).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short' 
  });
  const end = exp.isCurrent 
    ? 'Present' 
    : new Date(exp.endDate).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      });
  
  return `${start} - ${end}`;
};
```

---

### 7. Get Education

```http
GET /api/content/education
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "institution": "University Name",
      "degree": "Bachelor of Science",
      "field": "Computer Science",
      "startDate": "2016-09-01T00:00:00.000Z",
      "endDate": "2020-05-15T00:00:00.000Z",
      "isCurrent": false,
      "grade": "3.8 GPA",
      "location": "City, State",
      "description": "Focused on software engineering and algorithms",
      "displayOrder": 1
    }
  ]
}
```

**Usage:**
```javascript
const getEducation = async () => {
  const res = await fetch('http://localhost:5000/api/content/education');
  const { data } = await res.json();
  return data;
};
```

---

## 🔷 TypeScript Types

```typescript
// Response wrapper
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

// About
interface About {
  id: string;
  fullName: string;
  title: string;
  bio: string;
  email: string;
  phone?: string;
  location?: string;
  resumeUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  profileImageUrl?: string;
  yearsOfExp?: number;
  createdAt: string;
  updatedAt: string;
}

// Service
interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string;
  features?: string[];
  pricing?: string;
  displayOrder: number;
}

// Project
interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  imageUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
  category?: string;
  isFeatured: boolean;
  displayOrder: number;
}

// Tech Stack
interface TechStack {
  id: string;
  name: string;
  category: string;
  icon?: string;
  proficiency: number;
  displayOrder: number;
}

// Experience
interface Experience {
  id: string;
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  location?: string;
  companyUrl?: string;
  techUsed?: string[];
  displayOrder: number;
}

// Education
interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  grade?: string;
  location?: string;
  description?: string;
  displayOrder: number;
}

// All Content
interface PortfolioContent {
  about: About | null;
  services: Service[];
  projects: Project[];
  techStack: TechStack[];
  experience: Experience[];
  education: Education[];
}
```

---

## ⚛️ React Integration

### 1. Custom Hook - usePortfolio

```typescript
import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:5000';

export const usePortfolio = () => {
  const [data, setData] = useState<PortfolioContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/content/all`);
        const { success, data, error } = await res.json();
        
        if (success) {
          setData(data);
        } else {
          setError(error || 'Failed to fetch portfolio');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  return { data, loading, error };
};
```

**Usage:**
```tsx
import { usePortfolio } from './hooks/usePortfolio';

function Portfolio() {
  const { data, loading, error } = usePortfolio();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data</div>;

  return (
    <div>
      <About data={data.about} />
      <Services services={data.services} />
      <Projects projects={data.projects} />
      <TechStack stack={data.techStack} />
      <Experience experience={data.experience} />
      <Education education={data.education} />
    </div>
  );
}
```

---

### 2. Component Examples

#### About Section
```tsx
interface AboutProps {
  data: About | null;
}

const About: React.FC<AboutProps> = ({ data }) => {
  if (!data) return null;

  return (
    <section className="about">
      {data.profileImageUrl && (
        <img src={data.profileImageUrl} alt={data.fullName} />
      )}
      <h1>{data.fullName}</h1>
      <h2>{data.title}</h2>
      <p>{data.bio}</p>
      
      <div className="contact">
        <a href={`mailto:${data.email}`}>{data.email}</a>
        {data.phone && <span>{data.phone}</span>}
        {data.location && <span>{data.location}</span>}
      </div>

      <div className="social-links">
        {data.githubUrl && <a href={data.githubUrl}>GitHub</a>}
        {data.linkedinUrl && <a href={data.linkedinUrl}>LinkedIn</a>}
        {data.twitterUrl && <a href={data.twitterUrl}>Twitter</a>}
        {data.resumeUrl && <a href={data.resumeUrl}>Resume</a>}
      </div>

      {data.yearsOfExp && (
        <p>{data.yearsOfExp}+ years of experience</p>
      )}
    </section>
  );
};
```

#### Services List
```tsx
interface ServicesProps {
  services: Service[];
}

const Services: React.FC<ServicesProps> = ({ services }) => {
  return (
    <section className="services">
      <h2>Services</h2>
      <div className="services-grid">
        {services.map((service) => (
          <div key={service.id} className="service-card">
            {service.icon && <span className="icon">{service.icon}</span>}
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            
            {service.features && service.features.length > 0 && (
              <ul>
                {service.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
            )}
            
            {service.pricing && (
              <p className="pricing">{service.pricing}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
```

#### Projects Grid
```tsx
interface ProjectsProps {
  projects: Project[];
}

const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  const featured = projects.filter(p => p.isFeatured);
  const others = projects.filter(p => !p.isFeatured);

  return (
    <section className="projects">
      <h2>Projects</h2>
      
      {featured.length > 0 && (
        <div className="featured-projects">
          <h3>Featured Projects</h3>
          <ProjectGrid projects={featured} />
        </div>
      )}
      
      {others.length > 0 && (
        <div className="other-projects">
          <h3>Other Projects</h3>
          <ProjectGrid projects={others} />
        </div>
      )}
    </section>
  );
};

const ProjectGrid: React.FC<{ projects: Project[] }> = ({ projects }) => (
  <div className="projects-grid">
    {projects.map((project) => (
      <div key={project.id} className="project-card">
        {project.imageUrl && (
          <img src={project.imageUrl} alt={project.title} />
        )}
        <h4>{project.title}</h4>
        <p>{project.description}</p>
        
        <div className="tech-stack">
          {project.techStack.map((tech, i) => (
            <span key={i} className="tech-badge">{tech}</span>
          ))}
        </div>
        
        <div className="project-links">
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
              Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          )}
        </div>
        
        {project.category && (
          <span className="category">{project.category}</span>
        )}
      </div>
    ))}
  </div>
);
```

#### Tech Stack
```tsx
interface TechStackProps {
  stack: TechStack[];
}

const TechStack: React.FC<TechStackProps> = ({ stack }) => {
  // Group by category
  const grouped = stack.reduce((acc, tech) => {
    if (!acc[tech.category]) acc[tech.category] = [];
    acc[tech.category].push(tech);
    return acc;
  }, {} as Record<string, TechStack[]>);

  return (
    <section className="tech-stack">
      <h2>Tech Stack</h2>
      {Object.entries(grouped).map(([category, techs]) => (
        <div key={category} className="tech-category">
          <h3>{category}</h3>
          <div className="tech-items">
            {techs.map((tech) => (
              <div key={tech.id} className="tech-item">
                {tech.icon && <span className="icon">{tech.icon}</span>}
                <span className="name">{tech.name}</span>
                <div className="proficiency-bar">
                  <div 
                    className="fill" 
                    style={{ width: `${tech.proficiency}%` }}
                  />
                </div>
                <span className="percentage">{tech.proficiency}%</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};
```

#### Experience Timeline
```tsx
interface ExperienceProps {
  experience: Experience[];
}

const Experience: React.FC<ExperienceProps> = ({ experience }) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  return (
    <section className="experience">
      <h2>Experience</h2>
      <div className="timeline">
        {experience.map((exp) => (
          <div key={exp.id} className="timeline-item">
            <div className="timeline-date">
              {formatDate(exp.startDate)} - {' '}
              {exp.isCurrent ? 'Present' : formatDate(exp.endDate!)}
            </div>
            
            <div className="timeline-content">
              <h3>{exp.position}</h3>
              <h4>
                {exp.companyUrl ? (
                  <a href={exp.companyUrl} target="_blank" rel="noopener noreferrer">
                    {exp.company}
                  </a>
                ) : (
                  exp.company
                )}
              </h4>
              
              {exp.location && <p className="location">{exp.location}</p>}
              
              <p>{exp.description}</p>
              
              {exp.techUsed && exp.techUsed.length > 0 && (
                <div className="tech-used">
                  {exp.techUsed.map((tech, i) => (
                    <span key={i} className="tech-badge">{tech}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
```

---

## ⚠️ Error Handling

```typescript
// API helper with error handling
async function fetchAPI<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const { success, data, error } = await response.json();
    
    if (!success) {
      throw new Error(error || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
}

// Usage
const getAllContent = () => fetchAPI<PortfolioContent>('/api/content/all');
const getProjects = () => fetchAPI<Project[]>('/api/content/projects');
```

---

## 💡 Best Practices

### 1. Caching
```typescript
// Cache portfolio data in localStorage
const CACHE_KEY = 'portfolio_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const usePortfolioWithCache = () => {
  const [data, setData] = useState<PortfolioContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Check cache first
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setData(data);
          setLoading(false);
          return;
        }
      }

      // Fetch fresh data
      const res = await fetch(`${API_BASE}/api/content/all`);
      const { success, data } = await res.json();
      
      if (success) {
        setData(data);
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data,
          timestamp: Date.now()
        }));
      }
      
      setLoading(false);
    };

    fetchData();
  }, []);

  return { data, loading };
};
```

### 2. Environment Variables
```typescript
// .env
VITE_API_BASE_URL=http://localhost:5000

// config.ts
export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
```

### 3. Loading States
```tsx
function Portfolio() {
  const { data, loading, error } = usePortfolio();

  if (loading) {
    return (
      <div className="loading">
        <Spinner />
        <p>Loading portfolio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>Failed to load portfolio</p>
        <button onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return <PortfolioContent data={data} />;
}
```

### 4. Filtering & Sorting
```typescript
// Filter featured projects
const featuredProjects = projects.filter(p => p.isFeatured);

// Filter by category
const webApps = projects.filter(p => p.category === 'Web App');

// Sort by display order (already sorted from API)
// But if needed:
const sorted = [...projects].sort((a, b) => a.displayOrder - b.displayOrder);

// Group tech by category
const techByCategory = techStack.reduce((acc, tech) => {
  if (!acc[tech.category]) acc[tech.category] = [];
  acc[tech.category].push(tech);
  return acc;
}, {} as Record<string, TechStack[]>);
```

### 5. Responsive Images
```tsx
<img 
  src={project.imageUrl} 
  alt={project.title}
  loading="lazy"
  onError={(e) => {
    e.currentTarget.src = '/placeholder.jpg';
  }}
/>
```

---

## 🧪 Testing

```typescript
// Mock data for testing
export const mockPortfolioData: PortfolioContent = {
  about: {
    id: '1',
    fullName: 'John Doe',
    title: 'Full Stack Developer',
    bio: 'Passionate developer...',
    email: 'john@example.com',
    yearsOfExp: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  services: [
    {
      id: '1',
      title: 'Web Development',
      description: 'Building web apps',
      displayOrder: 1,
    },
  ],
  projects: [],
  techStack: [],
  experience: [],
  education: [],
};
```

---

## 📞 API Endpoint Summary

| Endpoint | Method | Description | Query Params |
|----------|--------|-------------|--------------|
| `/api/content/all` | GET | Get all content | - |
| `/api/content/about` | GET | Get about section | - |
| `/api/content/services` | GET | Get services | - |
| `/api/content/projects` | GET | Get projects | `featured`, `category` |
| `/api/content/stack` | GET | Get tech stack | `category` |
| `/api/content/experience` | GET | Get experience | - |
| `/api/content/education` | GET | Get education | - |

---

## 🎯 Quick Integration Checklist

- [ ] Set up API base URL in environment variables
- [ ] Copy TypeScript types to your project
- [ ] Create `usePortfolio` hook
- [ ] Fetch data on app mount
- [ ] Implement loading and error states
- [ ] Create components for each section
- [ ] Add caching if needed
- [ ] Handle missing/null data gracefully
- [ ] Test with real API
- [ ] Optimize images and assets

---

## 📚 Additional Resources

- Backend API Documentation: `API.md`
- Content Management Guide: `CONTENT_API.md`
- Quick Reference: `QUICK_REFERENCE.md`

---

**Happy Coding! 🚀**
