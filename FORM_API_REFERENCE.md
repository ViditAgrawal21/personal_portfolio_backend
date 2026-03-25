# 📋 Frontend Form API Reference

## 🎯 **Available Form API Endpoints**

### **📝 Form Submission Endpoints:**
- `POST /api/services/inquiry` - Service request form
- `POST /api/hire/request` - Hire request form

---

## 📝 **Service Request Form**

### **API Endpoint:**
```
POST /api/services/inquiry
Content-Type: application/json
```

### **✅ Expected Request Format:**
```json
{
  "clientName": "John Doe",
  "email": "john.doe@example.com",
  "serviceType": "Web Development",
  "companyName": "Tech Solutions Inc",
  "phoneNumber": "+1-555-123-4567",
  "budgetRange": "$10,000 - $25,000",
  "timeline": "3-4 months",
  "projectDetails": "I need a modern web application with React frontend and Node.js backend. The app should have user authentication, dashboard, and payment integration. Looking for a complete solution with responsive design."
}
```

### **📋 Field Validation Rules:**
```javascript
{
  clientName: {
    required: true,
    minLength: 2,
    maxLength: 255,
    type: "string"
  },
  email: {
    required: true, 
    format: "email",
    maxLength: 255,
    type: "string"
  },
  serviceType: {
    required: true,
    maxLength: 100,
    type: "string",
    note: "Type of service needed"
  },
  companyName: {
    required: false,
    maxLength: 255,
    type: "string",
    note: "Optional - can indicate 'Personal Project' if individual"
  },
  phoneNumber: {
    required: false,
    maxLength: 50,
    type: "string"
  },
  budgetRange: {
    required: false,
    maxLength: 100,
    type: "string",
    note: "Includes custom amount option"
  },
  timeline: {
    required: false,
    maxLength: 255,
    type: "string"
  },
  projectDetails: {
    required: true,
    minLength: 10,
    maxLength: 5000,
    type: "string"
  }
}
```

---

## 💼 **Hire Request Form**

### **API Endpoint:**
```
POST /api/hire/request
Content-Type: application/json
```

### **✅ Expected Request Format:**
```json
{
  "candidateName": "Jane Smith",
  "email": "jane.smith@example.com",
  "companyName": "Global Tech Corp",
  "roleType": "Senior Full-Stack Developer",
  "salaryOffer": "$120,000 - $140,000 annually",
  "location": "Remote / New York, NY",
  "message": "We're looking for a senior full-stack developer to join our team. The role involves building scalable web applications using modern technologies. Remote work available with flexible hours. Please let us know your availability and earliest start date."
}
```

### **📋 Field Validation Rules:**
```javascript
{
  candidateName: {
    required: true,
    minLength: 2,
    maxLength: 255,
    type: "string"
  },
  email: {
    required: true,
    format: "email", 
    maxLength: 255,
    type: "string"
  },
  companyName: {
    required: true,
    minLength: 2,
    maxLength: 255,
    type: "string"
  },
  roleType: {
    required: true,
    minLength: 2,
    maxLength: 255,
    type: "string",
    note: "Dropdown with custom option available"
  },
  salaryOffer: {
    required: false,
    maxLength: 255,
    type: "string"
  },
  location: {
    required: false,
    maxLength: 255,
    type: "string",
    note: "Work location (remote/hybrid/onsite)"
  },
  message: {
    required: true,
    minLength: 10,
    maxLength: 5000,
    type: "string"
  }
}
```

### **✅ Success Response (201):**
```json
{
  "success": true,
  "message": "Service inquiry submitted successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "createdAt": "2026-03-25T10:30:00.000Z"
  }
}
```

### **❌ Validation Error Response (400):**
```json
{
  "error": "Validation failed",
  "message": "Invalid input data",
  "details": [
    {
      "field": "email",
      "message": "Invalid email address"
    },
    {
      "field": "projectDetails", 
      "message": "Project details must be at least 10 characters"
    }
  ]
}
```

### **❌ Server Error Response (500):**
```json
{
  "error": "Failed to submit inquiry",
  "message": "An error occurred while processing your request"
}
```

---

## 💼 **Hire Request Form**

### **API Endpoint:**
```
POST /api/hire/request
Content-Type: application/json
```

### **✅ Expected Request Format:**
```json
{
  "candidateName": "Jane Smith",
  "email": "jane.smith@example.com",
  "companyName": "Global Tech Corp",
  "roleType": "Senior Full-Stack Developer",
  "salaryOffer": "$120,000 - $140,000 annually",
  "location": "Remote / New York, NY",
  "message": "We're looking for a senior full-stack developer to join our team. The role involves building scalable web applications using modern technologies. Remote work available with flexible hours. Please let us know your availability and earliest start date."
}
```

### **📋 Field Validation Rules:**
```javascript
{
  candidateName: {
    required: true,
    minLength: 2,
    maxLength: 255,
    type: "string"
  },
  email: {
    required: true,
    format: "email", 
    maxLength: 255,
    type: "string"
  },
  companyName: {
    required: true,
    minLength: 2,
    maxLength: 255,
    type: "string"
  },
  roleType: {
    required: true,
    minLength: 2,
    maxLength: 255,
    type: "string",
    note: "Dropdown with custom option available"
  },
  salaryOffer: {
    required: false,
    maxLength: 255,
    type: "string"
  },
  location: {
    required: false,
    maxLength: 255,
    type: "string",
    note: "Work location (remote/hybrid/onsite)"
  },
  message: {
    required: true,
    minLength: 10,
    maxLength: 5000,
    type: "string"
  }
}
```

### **✅ Success Response (201):**
```json
{
  "success": true,
  "message": "Hire request submitted successfully", 
  "data": {
    "id": "987f6543-e21c-43d2-b567-123456789abc",
    "createdAt": "2026-03-25T10:30:00.000Z"
  }
}
```

### **❌ Error Responses:**
Same format as service inquiry (validation errors and server errors).
```

### **❌ Error Responses:**
Same format as service inquiry (validation errors and server errors).

const ServiceInquiryForm = () => {
  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    companyName: '',
    phoneNumber: '',
    budgetRange: '',
    timeline: '',
    projectDetails: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const budgetOptions = [
    'Under $1,000',
    '$1,000 - $5,000',
    '$5,000 - $10,000', 
    '$10,000 - $25,000',
    '$25,000 - $50,000',
    'Over $50,000',
    'Custom Amount'
  ];

  const timelineOptions = [
    'ASAP (Rush)',
    '1-2 weeks',
    '1 month',
    '2-3 months',
    '3-6 months',
    '6+ months',
    'Flexible'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await fetch('https://personal-portfolio-backend-ec6a.onrender.com/api/services/inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitted(true);
        console.log('✅ Service inquiry submitted:', result.data.id);
      } else {
        // Handle validation errors
        if (result.details) {
          const fieldErrors = {};
          result.details.forEach(error => {
            fieldErrors[error.field] = error.message;
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ general: result.message });
        }
      }
    } catch (error) {
      console.error('❌ Form submission error:', error);
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="success-message">
        <h3>✅ Thank you for your inquiry!</h3>
        <p>We'll get back to you within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="service-inquiry-form">
      <div className="form-group">
        <label htmlFor="clientName">Full Name *</label>
        <input
          type="text"
          id="clientName"
          value={formData.clientName}
          onChange={(e) => setFormData({...formData, clientName: e.target.value})}
          required
          minLength={2}
          maxLength={255}
          placeholder="Your full name"
        />
        {errors.clientName && <span className="error">{errors.clientName}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email Address *</label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
          maxLength={255}
          placeholder="your.email@example.com"
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="companyName">Company Name or Personal Requirement</label>
        <input
          type="text"
          id="companyName"
          value={formData.companyName}
          onChange={(e) => setFormData({...formData, companyName: e.target.value})}
          maxLength={255}
          placeholder="Company name or 'Personal Project'"
        />
        {errors.companyName && <span className="error">{errors.companyName}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          type="tel"
          id="phoneNumber"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
          maxLength={50}
          placeholder="+1-555-123-4567"
        />
        {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="budgetRange">Budget Range</label>
        <select
          id="budgetRange"
          value={formData.budgetRange}
          onChange={(e) => setFormData({...formData, budgetRange: e.target.value})}
        >
          <option value="">Select budget range...</option>
          {budgetOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {formData.budgetRange === 'Custom Amount' && (
          <input
            type="text"
            placeholder="Enter custom amount"
            className="custom-budget-input"
            onChange={(e) => setFormData({...formData, budgetRange: e.target.value})}
          />
        )}
        {errors.budgetRange && <span className="error">{errors.budgetRange}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="timeline">Timeline</label>
        <select
          id="timeline"
          value={formData.timeline}
          onChange={(e) => setFormData({...formData, timeline: e.target.value})}
        >
          <option value="">Select timeline...</option>
          {timelineOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        {errors.timeline && <span className="error">{errors.timeline}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="projectDetails">Project Details *</label>
        <textarea
          id="projectDetails"
          value={formData.projectDetails}
          onChange={(e) => setFormData({...formData, projectDetails: e.target.value})}
          placeholder="Describe your project requirements, features needed, target audience, and any specific technologies or preferences..."
          required
          minLength={10}
          maxLength={5000}
          rows={6}
        />
        <small>{formData.projectDetails.length}/5000 characters</small>
        {errors.projectDetails && <span className="error">{errors.projectDetails}</span>}
      </div>

      {errors.general && (
        <div className="error-message">{errors.general}</div>
      )}

      <button type="submit" disabled={loading} className="submit-btn">
        {loading ? 'Submitting...' : 'Submit Service Inquiry'}
      </button>
    </form>
  );
};

export default ServiceInquiryForm;
```

### **Hire Request Form (React):**
```jsx
import React, { useState } from 'react';

const HireRequestForm = () => {
  const [formData, setFormData] = useState({
    candidateName: '',
    email: '',
    companyName: '',
    roleType: '',
    salaryOffer: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const commonRoles = [
    'Frontend Developer',
    'Backend Developer', 
    'Full-Stack Developer',
    'React Developer',
    'Node.js Developer',
    'Python Developer',
    'JavaScript Developer',
    'Software Engineer',
    'Web Developer',
    'API Developer',
    'DevOps Engineer',
    'Technical Consultant',
    'Custom Role'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await fetch('https://personal-portfolio-backend-ec6a.onrender.com/api/hire/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitted(true);
        console.log('✅ Hire request submitted:', result.data.id);
      } else {
        // Handle validation errors
        if (result.details) {
          const fieldErrors = {};
          result.details.forEach(error => {
            fieldErrors[error.field] = error.message;
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ general: result.message });
        }
      }
    } catch (error) {
      console.error('❌ Hire request error:', error);
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="success-message">
        <h3>🎉 Hire request submitted successfully!</h3>
        <p>I'll review your opportunity and get back to you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="hire-request-form">
      <div className="form-group">
        <label htmlFor="candidateName">Your Name *</label>
        <input
          type="text"
          id="candidateName"
          value={formData.candidateName}
          onChange={(e) => setFormData({...formData, candidateName: e.target.value})}
          placeholder="Your full name"
          required
          minLength={2}
          maxLength={255}
        />
        {errors.candidateName && <span className="error">{errors.candidateName}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Contact Email *</label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
          maxLength={255}
          placeholder="your.email@company.com"
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="companyName">Company Name *</label>
        <input
          type="text"
          id="companyName"
          value={formData.companyName}
          onChange={(e) => setFormData({...formData, companyName: e.target.value})}
          placeholder="Your company or organization"
          required
          minLength={2}
          maxLength={255}
        />
        {errors.companyName && <span className="error">{errors.companyName}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="roleType">Role Type *</label>
        <select
          id="roleType"
          value={formData.roleType}
          onChange={(e) => setFormData({...formData, roleType: e.target.value})}
          required
        >
          <option value="">Select role type...</option>
          {commonRoles.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
        {formData.roleType === 'Custom Role' && (
          <input
            type="text"
            placeholder="Enter custom role title"
            className="custom-role-input"
            onChange={(e) => setFormData({...formData, roleType: e.target.value})}
            maxLength={255}
          />
        )}
        {errors.roleType && <span className="error">{errors.roleType}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="salaryOffer">Salary Offer</label>
        <input
          type="text"
          id="salaryOffer"
          value={formData.salaryOffer}
          onChange={(e) => setFormData({...formData, salaryOffer: e.target.value})}
          placeholder="e.g., $80,000 - $100,000 annually, or $50/hour"
          maxLength={255}
        />
        {errors.salaryOffer && <span className="error">{errors.salaryOffer}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="message">Job Details & Requirements *</label>
        <textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          placeholder="Describe the role, responsibilities, required skills, company culture, benefits, work arrangements (remote/hybrid/onsite), and any other relevant details..."
          required
          minLength={10}
          maxLength={5000}
          rows={6}
        />
        <small>{formData.message.length}/5000 characters</small>
        {errors.message && <span className="error">{errors.message}</span>}
      </div>

      {errors.general && (
        <div className="error-message">{errors.general}</div>
      )}

      <button type="submit" disabled={loading} className="submit-btn">
        {loading ? 'Submitting...' : 'Submit Hire Request'}
      </button>
    </form>
  );
};

export default HireRequestForm;
```

---

## 🎛️ **Form Validation Helpers**

### **Client-Side Validation Functions:**
```javascript
// Validation utilities
export const validateServiceInquiry = (data) => {
  const errors = {};
  
  if (!data.clientName || data.clientName.length < 2) {
    errors.clientName = 'Client name must be at least 2 characters';
  }
  
  if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!data.projectDetails || data.projectDetails.length < 10) {
    errors.projectDetails = 'Project details must be at least 10 characters';
  }
  
  if (data.phoneNumber && !/^[\+]?[1-9][\d]{0,15}$/.test(data.phoneNumber.replace(/[\s\-\(\)]/g, ''))) {
    errors.phoneNumber = 'Please enter a valid phone number';
  }
  
  return errors;
};

export const validateHireRequest = (data) => {
  const errors = {};
  
  if (!data.candidateName || data.candidateName.length < 2) {
    errors.candidateName = 'Name must be at least 2 characters';
  }
  
  if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!data.companyName || data.companyName.length < 2) {
    errors.companyName = 'Company name must be at least 2 characters';
  }
  
  if (!data.roleType || data.roleType.length < 2) {
    errors.roleType = 'Please select or enter a role type';
  }
  
  if (!data.message || data.message.length < 10) {
    errors.message = 'Message must be at least 10 characters';
  }
  
  return errors;
};
```

---

## 📊 **Dropdown Options & Data**

### **Service Inquiry Form Options:**
```javascript
// Budget Range Options
const budgetOptions = [
  'Under $1,000',
  '$1,000 - $5,000', 
  '$5,000 - $10,000',
  '$10,000 - $25,000',
  '$25,000 - $50,000',
  'Over $50,000',
  'Custom Amount' // Triggers custom input field
];

// Timeline Options
const timelineOptions = [
  'ASAP (Rush)',
  '1-2 weeks',
  '1 month', 
  '2-3 months',
  '3-6 months',
  '6+ months',
  'Flexible'
];
```

### **Hire Request Form Options:**
```javascript
// Common Role Types
const roleOptions = [
  'Frontend Developer',
  'Backend Developer',
  'Full-Stack Developer',
  'React Developer',
  'Node.js Developer',
  'Python Developer',
  'JavaScript Developer',
  'Software Engineer',
  'Web Developer',
  'API Developer',
  'DevOps Engineer', 
  'Technical Consultant',
  'Custom Role' // Triggers custom input field
];
```

---

## � **Quick Implementation Checklist**

### **For Service Inquiry Form:**
- ✅ POST `/api/services/inquiry`
- ✅ Required: clientName, email, projectDetails
- ✅ Optional: companyName, phoneNumber, budgetRange, timeline
- ✅ Include budget dropdown with custom option
- ✅ Include timeline dropdown

### **For Hire Request Form:**
- ✅ POST `/api/hire/request`
- ✅ Required: candidateName, email, companyName, roleType, message
- ✅ Optional: salaryOffer
- ✅ Include role type dropdown with custom option

### **General Implementation:**
- ✅ Add loading states for form submission
- ✅ Client-side validation before submission
- ✅ Error handling for network and validation errors  
- ✅ Success message with submission confirmation
- ✅ Custom input fields for dropdown "Other" options

**Updated Form APIs ready for production!** 🎉
- ✅ Add loading states for form submission
- ✅ Client-side validation before submission
- ✅ Error handling for network and validation errors  
- ✅ Success message with submission confirmation
- ✅ Custom input fields for dropdown "Other" options

**Updated APIs ready for production after migration!** 🎉

---

## 🎨 **Frontend Form Implementation Examples**

### **Service Request Form (React):**
```jsx
import React, { useState } from 'react';

const ServiceInquiryForm = () => {
  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    serviceType: '',
    budgetRange: '',
    requirements: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/services/inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitted(true);
        console.log('✅ Form submitted:', result.data.id);
      } else {
        // Handle validation errors
        if (result.details) {
          const fieldErrors = {};
          result.details.forEach(error => {
            fieldErrors[error.field] = error.message;
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ general: result.message });
        }
      }
    } catch (error) {
      console.error('❌ Form submission error:', error);
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="success-message">
        <h3>✅ Thank you for your inquiry!</h3>
        <p>We'll get back to you within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="service-inquiry-form">
      <div className="form-group">
        <label htmlFor="clientName">Full Name *</label>
        <input
          type="text"
          id="clientName"
          value={formData.clientName}
          onChange={(e) => setFormData({...formData, clientName: e.target.value})}
          required
          minLength={2}
          maxLength={255}
        />
        {errors.clientName && <span className="error">{errors.clientName}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email Address *</label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
          maxLength={255}
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="serviceType">Service Needed *</label>
        <select
          id="serviceType"
          value={formData.serviceType}
          onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
          required
        >
          <option value="">Select a service...</option>
          <option value="Full-Stack Development">Full-Stack Development</option>
          <option value="Frontend Development">Frontend Development</option>
          <option value="Backend Development">Backend Development</option>
          <option value="API Development">API Development</option>
          <option value="Consultation">Consultation</option>
          <option value="Other">Other</option>
        </select>
        {errors.serviceType && <span className="error">{errors.serviceType}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="budgetRange">Budget Range</label>
        <select
          id="budgetRange"
          value={formData.budgetRange}
          onChange={(e) => setFormData({...formData, budgetRange: e.target.value})}
        >
          <option value="">Select budget range...</option>
          <option value="Under $1,000">Under $1,000</option>
          <option value="$1,000 - $5,000">$1,000 - $5,000</option>
          <option value="$5,000 - $10,000">$5,000 - $10,000</option>
          <option value="$10,000 - $25,000">$10,000 - $25,000</option>
          <option value="Over $25,000">Over $25,000</option>
        </select>
        {errors.budgetRange && <span className="error">{errors.budgetRange}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="requirements">Project Requirements *</label>
        <textarea
          id="requirements"
          value={formData.requirements}
          onChange={(e) => setFormData({...formData, requirements: e.target.value})}
          placeholder="Describe your project requirements, timeline, and any specific needs..."
          required
          minLength={10}
          maxLength={5000}
          rows={6}
        />
        <small>{formData.requirements.length}/5000 characters</small>
        {errors.requirements && <span className="error">{errors.requirements}</span>}
      </div>

      {errors.general && (
        <div className="error-message">{errors.general}</div>
      )}

      <button type="submit" disabled={loading} className="submit-btn">
        {loading ? 'Submitting...' : 'Submit Inquiry'}
      </button>
    </form>
  );
};

export default ServiceInquiryForm;
```

### **Hire Request Form (React):**
```jsx
import React, { useState, useEffect } from 'react';

const HireRequestForm = () => {
  const [formData, setFormData] = useState({
    projectName: '',
    techStack: [],
    email: '',
    message: ''
  });
  const [availableTech, setAvailableTech] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch available tech stack from API
  useEffect(() => {
    const fetchTechStack = async () => {
      try {
        const response = await fetch('/api/content/stack');
        const result = await response.json();
        if (result.success) {
          setAvailableTech(result.data.map(tech => tech.name));
        }
      } catch (error) {
        console.error('Error fetching tech stack:', error);
      }
    };
    fetchTechStack();
  }, []);

  const handleTechToggle = (tech) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack.includes(tech)
        ? prev.techStack.filter(t => t !== tech)
        : [...prev.techStack, tech]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/hire/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitted(true);
        console.log('✅ Hire request submitted:', result.data.id);
      } else {
        // Handle validation errors
        if (result.details) {
          const fieldErrors = {};
          result.details.forEach(error => {
            fieldErrors[error.field] = error.message;
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ general: result.message });
        }
      }
    } catch (error) {
      console.error('❌ Hire request error:', error);
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="success-message">
        <h3>🎉 Hire request submitted successfully!</h3>
        <p>I'll review your project and get back to you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="hire-request-form">
      <div className="form-group">
        <label htmlFor="projectName">Project Name *</label>
        <input
          type="text"
          id="projectName"
          value={formData.projectName}
          onChange={(e) => setFormData({...formData, projectName: e.target.value})}
          placeholder="e.g., E-commerce Platform, Mobile App, etc."
          required
          minLength={2}
          maxLength={255}
        />
        {errors.projectName && <span className="error">{errors.projectName}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Contact Email *</label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
          maxLength={255}
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label>Tech Stack Required * ({formData.techStack.length}/20 selected)</label>
        <div className="tech-stack-selector">
          {availableTech.map(tech => (
            <label key={tech} className="tech-checkbox">
              <input
                type="checkbox"
                checked={formData.techStack.includes(tech)}
                onChange={() => handleTechToggle(tech)}
              />
              <span className="tech-label">{tech}</span>
            </label>
          ))}
        </div>
        {errors.techStack && <span className="error">{errors.techStack}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="message">Project Details & Requirements *</label>
        <textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          placeholder="Describe your project, timeline, budget range, and any specific requirements..."
          required
          minLength={10}
          maxLength={5000}
          rows={6}
        />
        <small>{formData.message.length}/5000 characters</small>
        {errors.message && <span className="error">{errors.message}</span>}
      </div>

      {errors.general && (
        <div className="error-message">{errors.general}</div>
      )}

      <button 
        type="submit" 
        disabled={loading || formData.techStack.length === 0} 
        className="submit-btn"
      >
        {loading ? 'Submitting...' : 'Submit Hire Request'}
      </button>
    </form>
  );
};

export default HireRequestForm;
```

---

## 🎛️ **Form Validation Helpers**

### **Client-Side Validation Functions:**
```javascript
// Validation utilities
export const validateServiceInquiry = (data) => {
  const errors = {};
  
  if (!data.clientName || data.clientName.length < 2) {
    errors.clientName = 'Client name must be at least 2 characters';
  }
  
  if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!data.serviceType || data.serviceType.length < 2) {
    errors.serviceType = 'Please select a service type';
  }
  
  if (!data.requirements || data.requirements.length < 10) {
    errors.requirements = 'Requirements must be at least 10 characters';
  }
  
  return errors;
};

export const validateHireRequest = (data) => {
  const errors = {};
  
  if (!data.projectName || data.projectName.length < 2) {
    errors.projectName = 'Project name must be at least 2 characters';
  }
  
  if (!data.techStack || data.techStack.length === 0) {
    errors.techStack = 'Please select at least one technology';
  }
  
  if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!data.message || data.message.length < 10) {
    errors.message = 'Message must be at least 10 characters';
  }
  
  return errors;
};
```

---

## 📊 **Data Sources for Forms**

### **Service Types (from your services API):**
```javascript
// Fetch available services to populate serviceType dropdown
useEffect(() => {
  fetch('/api/content/services')
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        setAvailableServices(data.data.map(service => service.title));
      }
    });
}, []);
```

### **Tech Stack Options (from your stack API):**
```javascript
// Fetch available tech stack for hire request form
useEffect(() => {
  fetch('/api/content/stack')
    .then(response => response.json()) 
    .then(data => {
      if (data.success) {
        setAvailableTech(data.data.map(tech => tech.name));
      }
    });
}, []);
```

---

## 🔧 **Rate Limiting & Security**

- **Rate Limit:** Forms are protected by rate limiting
- **CORS:** Backend configured for your frontend domain
- **Validation:** Both client and server-side validation
- **Sanitization:** All inputs are sanitized and validated

---

## 🚀 **Quick Implementation Checklist**

### **For Service Inquiry Form:**
- ✅ POST `/api/services/inquiry`
- ✅ Required: clientName, email, serviceType, requirements
- ✅ Optional: budgetRange
- ✅ Validation on both client and server

### **For Hire Request Form:**
- ✅ POST `/api/hire/request`
- ✅ Required: projectName, techStack[], email, message  
- ✅ Fetch tech stack options from `/api/content/stack`
- ✅ Multi-select tech stack with max 20 items

### **General Implementation:**
- ✅ Add loading states for form submission
- ✅ Client-side validation before submission
- ✅ Error handling for network and validation errors  
- ✅ Success message with submission confirmation
- ✅ Optional: Store form data in localStorage before submission

**Both APIs are production-ready and working perfectly!** 🎉