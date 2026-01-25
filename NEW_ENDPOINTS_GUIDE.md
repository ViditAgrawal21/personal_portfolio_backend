# New Admin Panel Endpoints - Frontend Integration Guide

## 🆕 Recently Added Features

This guide documents the latest endpoints added to the admin panel for enhanced inquiry and hire request management.

---

## 📧 Reply Email Endpoints

### 1. Send Reply to Service Inquiry

**Endpoint:** `POST /api/admin/inquiries/:id/reply`

**Authentication:** Required (JWT Bearer token)

**Description:** Send a reply email directly to a client who submitted a service inquiry. Automatically updates inquiry status from NEW to CONTACTED.

**Request:**
```typescript
// Headers
{
  "Authorization": "Bearer <your-jwt-token>",
  "Content-Type": "application/json"
}

// Body
{
  "subject": "Re: Your Service Inquiry",  // Optional, defaults to "Re: Your Service Inquiry"
  "message": "Hi [ClientName],\n\nThank you for reaching out..."  // Required
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Reply sent successfully"
}
```

**Response (Error - 404):**
```json
{
  "success": false,
  "error": "Inquiry not found"
}
```

**Response (Error - 500):**
```json
{
  "success": false,
  "error": "Failed to send reply"
}
```

**Frontend Example:**
```typescript
const sendInquiryReply = async (inquiryId: string, message: string) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/admin/inquiries/${inquiryId}/reply`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: 'Re: Your Service Inquiry', // Optional
          message: message,
        }),
      }
    );

    const data = await response.json();
    
    if (data.success) {
      alert('Reply sent successfully!');
      // Refresh inquiry list or update UI
    } else {
      alert(`Error: ${data.error}`);
    }
  } catch (error) {
    console.error('Failed to send reply:', error);
  }
};
```

---

### 2. Send Reply to Hire Request

**Endpoint:** `POST /api/admin/hire-requests/:id/reply`

**Authentication:** Required (JWT Bearer token)

**Description:** Send a reply email directly to a client who submitted a hire request. Automatically updates request status from NEW to REVIEWING.

**Request:**
```typescript
// Headers
{
  "Authorization": "Bearer <your-jwt-token>",
  "Content-Type": "application/json"
}

// Body
{
  "subject": "Re: Your Hire Request - Project ABC",  // Optional, defaults to "Re: Your Hire Request - [ProjectName]"
  "message": "Hello,\n\nThank you for your interest..."  // Required
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Reply sent successfully"
}
```

**Response (Error - 404):**
```json
{
  "success": false,
  "error": "Hire request not found"
}
```

**Frontend Example:**
```typescript
const sendHireRequestReply = async (requestId: string, message: string) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/admin/hire-requests/${requestId}/reply`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
        }),
      }
    );

    const data = await response.json();
    
    if (data.success) {
      alert('Reply sent successfully!');
    }
  } catch (error) {
    console.error('Failed to send reply:', error);
  }
};
```

---

## 📊 Export Endpoints

### 3. Export Service Inquiries as CSV

**Endpoint:** `GET /api/admin/inquiries/export/csv`

**Authentication:** Required (JWT Bearer token)

**Description:** Export all service inquiries to a CSV file for offline analysis or backup.

**Request:**
```typescript
// Headers
{
  "Authorization": "Bearer <your-jwt-token>"
}

// No body required
```

**Response:**
- **Content-Type:** `text/csv`
- **Content-Disposition:** `attachment; filename=service-inquiries-YYYY-MM-DD.csv`

**CSV Format:**
```csv
ID,Client Name,Email,Service Type,Budget Range,Status,Created At
uuid-1,John Doe,john@example.com,Web Development,$5000-$10000,NEW,2026-01-25 10:30:00
uuid-2,Jane Smith,jane@example.com,Mobile App,$10000-$20000,IN_PROGRESS,2026-01-24 14:15:00
```

**Frontend Example:**
```typescript
const exportInquiriesCSV = async () => {
  try {
    const response = await fetch(
      'http://localhost:5000/api/admin/inquiries/export/csv',
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `service-inquiries-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error('Export failed:', error);
  }
};
```

---

### 4. Export Hire Requests as CSV

**Endpoint:** `GET /api/admin/hire-requests/export/csv`

**Authentication:** Required (JWT Bearer token)

**Description:** Export all hire requests to a CSV file.

**Response:**
- **Content-Type:** `text/csv`
- **Content-Disposition:** `attachment; filename=hire-requests-YYYY-MM-DD.csv`

**CSV Format:**
```csv
ID,Project Name,Email,Tech Stack,Status,Created At
uuid-1,E-commerce Platform,client@example.com,"React, Node.js, PostgreSQL",NEW,2026-01-25 09:00:00
uuid-2,Mobile Banking App,another@example.com,"React Native, Firebase",REVIEWING,2026-01-23 11:30:00
```

**Frontend Example:**
```typescript
const exportHireRequestsCSV = async () => {
  try {
    const response = await fetch(
      'http://localhost:5000/api/admin/hire-requests/export/csv',
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hire-requests-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error('Export failed:', error);
  }
};
```

---

## 📄 PDF Generation Endpoints

### 5. Generate PDF for Service Inquiry

**Endpoint:** `GET /api/admin/inquiries/:id/pdf`

**Authentication:** Required (JWT Bearer token)

**Description:** Generate a formatted HTML document for a specific service inquiry. The HTML is designed to be printed as PDF using the browser's Print dialog (Ctrl+P → Save as PDF).

**Request:**
```typescript
// Headers
{
  "Authorization": "Bearer <your-jwt-token>"
}
```

**Response:**
- **Content-Type:** `text/html`
- **Content-Disposition:** `inline`
- Returns styled HTML document with inquiry details

**PDF Sections Include:**
- Header with title and inquiry ID
- Inquiry Details (service type, budget, status, date)
- Client Information (name, email)
- Service Details (requirements)
- Internal Notes (admin-only section)
- Professional styling with print-optimized CSS

**Frontend Example (Option 1 - Open in New Tab):**
```typescript
const viewInquiryPDF = (inquiryId: string) => {
  const url = `http://localhost:5000/api/admin/inquiries/${inquiryId}/pdf`;
  const authUrl = `${url}?token=${token}`;
  
  // Open in new tab - user can print manually
  window.open(authUrl, '_blank');
};
```

**Frontend Example (Option 2 - Auto Print Dialog):**
```typescript
const printInquiryPDF = async (inquiryId: string) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/admin/inquiries/${inquiryId}/pdf`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    const html = await response.text();
    
    // Create iframe for printing
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();
      
      // Trigger print dialog
      iframe.contentWindow?.print();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }
  } catch (error) {
    console.error('Print failed:', error);
  }
};
```

**Response (Error - 404):**
```json
{
  "success": false,
  "error": "Inquiry not found"
}
```

---

### 6. Generate PDF for Hire Request

**Endpoint:** `GET /api/admin/hire-requests/:id/pdf`

**Authentication:** Required (JWT Bearer token)

**Description:** Generate a formatted HTML document for a specific hire request.

**PDF Sections Include:**
- Header with title and request ID
- Project Information (name, tech stack)
- Client Information (email)
- Project Message/Description
- Status and Timeline
- Internal Notes
- Green-themed professional styling

**Frontend Example:**
```typescript
const viewHireRequestPDF = (requestId: string) => {
  const url = `http://localhost:5000/api/admin/hire-requests/${requestId}/pdf`;
  window.open(url, '_blank');
};

// Or use the same auto-print approach from inquiry PDF
```

---

## � File Upload Endpoint

### 7. Upload Image Files

**Endpoint:** `POST /api/admin/upload`

**Authentication:** Required (JWT Bearer token)

**Description:** Upload image files for use in projects, profile photos, or other content. Files are stored locally and accessible via URL. Only image files are allowed with a maximum size of 5MB.

**Request:**
```typescript
// Headers
{
  "Authorization": "Bearer <your-jwt-token>",
  "Content-Type": "multipart/form-data"
}

// Body: FormData with 'file' field
const formData = new FormData();
formData.append('file', imageFile);
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "url": "/assets/uploads/1674654123456-image.png",
    "filename": "1674654123456-image.png",
    "originalName": "my-image.png",
    "size": 245760
  }
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "error": "No file uploaded"
}
```

**Response (Error - 400 - Invalid file type):**
```json
{
  "success": false,
  "error": "Only image files are allowed"
}
```

**Response (Error - 413 - File too large):**
```json
{
  "success": false,
  "error": "File too large. Maximum size is 5MB"
}
```

**Frontend Example (React with File Input):**
```typescript
const uploadImage = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(
      'http://localhost:5000/api/admin/upload',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type - let browser set it with boundary
        },
        body: formData,
      }
    );

    const data = await response.json();
    
    if (data.success) {
      console.log('Upload successful:', data.data);
      // File accessible at: http://localhost:5000${data.data.url}
      return data.data.url;
    } else {
      alert(`Upload failed: ${data.error}`);
    }
  } catch (error) {
    console.error('Upload error:', error);
    alert('Upload failed');
  }
};

// Usage with file input
const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    const url = await uploadImage(file);
    if (url) {
      // Use the URL for profile image, project image, etc.
      setImageUrl(url);
    }
  }
};
```

**Frontend Example (Drag & Drop):**
```typescript
const ImageUploadDropzone: React.FC<{ onUpload: (url: string) => void }> = ({
  onUpload,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const token = localStorage.getItem('adminToken');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      await uploadFile(files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Only image files are allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        'http://localhost:5000/api/admin/upload',
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData,
        }
      );

      const data = await response.json();
      if (data.success) {
        onUpload(data.data.url);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className={`upload-dropzone ${dragActive ? 'active' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {uploading ? (
        <p>Uploading...</p>
      ) : (
        <div>
          <p>Drag & drop an image here, or</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0])}
          />
        </div>
      )}
    </div>
  );
};
```

**File Specifications:**
- **Allowed Types:** `image/*` (PNG, JPG, JPEG, GIF, WebP, etc.)
- **Maximum Size:** 5MB per file
- **Storage Location:** `public/assets/uploads/` directory
- **File Naming:** `timestamp-randomnumber.extension` (e.g., `1674654123456-789.png`)
- **Access URL:** `/assets/uploads/filename` (served statically)

**Use Cases:**
- Upload project screenshots
- Upload profile photos for About section
- Upload service icons
- Upload any images needed for portfolio content

---

## �🔒 Authentication Notes

All these endpoints require a valid JWT token in the Authorization header:

```typescript
const headers = {
  'Authorization': `Bearer ${yourJWTToken}`,
  'Content-Type': 'application/json',  // For POST requests
};
```

Get the token from the login endpoint:
```typescript
const login = async (email: string, password: string) => {
  const response = await fetch('http://localhost:5000/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  return data.token; // Store this for subsequent requests
};
```

---

## 📋 Complete Admin Panel Features

### Inquiry Management
- ✅ List all inquiries (paginated)
- ✅ View single inquiry details
- ✅ Update inquiry status
- ✅ Export all inquiries as CSV
- ✅ Generate PDF for inquiry
- ✅ Send reply email to client

### Hire Request Management
- ✅ List all hire requests (paginated)
- ✅ View single hire request details
- ✅ Update hire request status
- ✅ Export all hire requests as CSV
- ✅ Generate PDF for hire request
- ✅ Send reply email to client

### Dashboard Stats
- ✅ Total inquiries/hire requests
- ✅ Status breakdown
- ✅ Recent items

---

## ⚙️ Environment Configuration

**Required for Email Functionality:**
```bash
# .env file
RESEND_API_KEY=re_xxxxxxxxxxxx  # Get from https://resend.com/api-keys
ADMIN_EMAIL=your-email@example.com  # Your email for "From" address
```

**Optional Slack Notifications:**
```bash
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx/yyy/zzz
```

If `RESEND_API_KEY` is not configured, reply email endpoints will return an error.

---

## 🎨 React Component Example

Complete example for inquiry management with reply:

```typescript
import React, { useState } from 'react';

interface Inquiry {
  id: string;
  clientName: string;
  email: string;
  serviceType: string;
  budgetRange: string;
  requirements: string;
  status: string;
  createdAt: string;
}

const InquiryManagement: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const token = localStorage.getItem('adminToken');

  // Fetch inquiries
  const fetchInquiries = async () => {
    const response = await fetch('http://localhost:5000/api/admin/inquiries', {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const data = await response.json();
    setInquiries(data.data);
  };

  // Send reply
  const sendReply = async (inquiryId: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/inquiries/${inquiryId}/reply`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: replyMessage,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        alert('Reply sent!');
        setReplyMessage('');
        fetchInquiries(); // Refresh list to show updated status
      }
    } catch (error) {
      console.error('Failed to send reply:', error);
    }
  };

  // Export CSV
  const exportCSV = async () => {
    const response = await fetch(
      'http://localhost:5000/api/admin/inquiries/export/csv',
      {
        headers: { 'Authorization': `Bearer ${token}` },
      }
    );

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inquiries-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // View PDF
  const viewPDF = (inquiryId: string) => {
    const url = `http://localhost:5000/api/admin/inquiries/${inquiryId}/pdf`;
    window.open(url, '_blank');
  };

  return (
    <div>
      <button onClick={exportCSV}>Export All as CSV</button>
      
      {inquiries.map(inquiry => (
        <div key={inquiry.id} className="inquiry-card">
          <h3>{inquiry.clientName}</h3>
          <p>{inquiry.email} - {inquiry.serviceType}</p>
          <p>Status: {inquiry.status}</p>
          
          <button onClick={() => viewPDF(inquiry.id)}>View PDF</button>
          <button onClick={() => setSelectedInquiry(inquiry)}>Reply</button>
        </div>
      ))}

      {selectedInquiry && (
        <div className="reply-modal">
          <h3>Reply to {selectedInquiry.clientName}</h3>
          <textarea
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            placeholder="Type your message..."
            rows={10}
          />
          <button onClick={() => sendReply(selectedInquiry.id)}>
            Send Reply
          </button>
          <button onClick={() => setSelectedInquiry(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default InquiryManagement;
```

---

## 🔄 Status Auto-Update Behavior

**Important:** When sending a reply email, the status automatically updates:

- **Service Inquiries:** `NEW` → `CONTACTED` (after sending reply)
- **Hire Requests:** `NEW` → `REVIEWING` (after sending reply)

This means you don't need to manually update the status after sending a reply. The frontend should refresh the inquiry/request list to reflect the new status.

---

## 📝 Complete Admin API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Login and get JWT token |

### Service Inquiries
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/inquiries` | List all inquiries (paginated) |
| PATCH | `/api/admin/inquiries/:id/status` | Update inquiry status |
| GET | `/api/admin/inquiries/export/csv` | Export all as CSV |
| GET | `/api/admin/inquiries/:id/pdf` | Generate PDF for inquiry |
| POST | `/api/admin/inquiries/:id/reply` | **NEW** - Send reply email |

### Hire Requests
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/hire-requests` | List all requests (paginated) |
| PATCH | `/api/admin/hire-requests/:id/status` | Update request status |
| GET | `/api/admin/hire-requests/export/csv` | **NEW** - Export all as CSV |
| GET | `/api/admin/hire-requests/:id/pdf` | **NEW** - Generate PDF |
| POST | `/api/admin/hire-requests/:id/reply` | **NEW** - Send reply email |

### Dashboard Stats
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Get dashboard statistics |

### File Upload
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/upload` | **NEW** - Upload image files |

### Content Management (CMS)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/content/about` | Get about section |
| PUT | `/api/admin/content/about` | Update about section |
| GET/POST/PUT/DELETE | `/api/admin/content/services` | Manage services |
| GET/POST/PUT/DELETE | `/api/admin/content/projects` | Manage projects |
| GET/POST/PUT/DELETE | `/api/admin/content/stack` | Manage tech stack |
| GET/POST/PUT/DELETE | `/api/admin/content/experience` | Manage experience |
| GET/POST/PUT/DELETE | `/api/admin/content/education` | Manage education |

---

## 🚀 Quick Start Checklist

For frontend engineers integrating these new features:

1. **Environment Setup**
   - [ ] Ensure backend is running on `http://localhost:5000`
   - [ ] Configure RESEND_API_KEY in backend `.env` for email functionality
   - [ ] Get admin JWT token from `/api/admin/login`

2. **Reply Email Feature**
   - [ ] Add "Reply" button to inquiry/hire request detail views
   - [ ] Create reply modal/form with message textarea
   - [ ] Send POST request to reply endpoints
   - [ ] Refresh list after successful reply to show updated status

3. **Export Features**
   - [ ] Add "Export CSV" button to inquiry list page
   - [ ] Add "Export CSV" button to hire request list page
   - [ ] Handle CSV blob download and save as file
   - [ ] Add loading state during export

4. **PDF Generation**
   - [ ] Add "View PDF" or "Print" button to detail views
   - [ ] Open PDF in new tab OR trigger print dialog
   - [ ] Ensure Authorization header is passed correctly

5. **File Upload**
   - [ ] Add file input or drag & drop component
   - [ ] Handle image file validation (type and size)
   - [ ] Display upload progress/loading state
   - [ ] Show uploaded image preview
   - [ ] Use returned URL in forms (projects, about section, etc.)

6. **Error Handling**
   - [ ] Handle 401 (unauthorized) - redirect to login
   - [ ] Handle 404 (not found) - show error message
   - [ ] Handle 500 (server error) - show generic error
   - [ ] Show loading states during API calls

---

## 💡 Implementation Tips

### 1. CSV Download Helper Function
```typescript
const downloadCSV = async (url: string, filename: string) => {
  try {
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) throw new Error('Export failed');

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Download failed:', error);
    throw error;
  }
};

// Usage
await downloadCSV(
  'http://localhost:5000/api/admin/inquiries/export/csv',
  'inquiries.csv'
);
```

### 2. PDF Print Helper
```typescript
const printPDF = (url: string) => {
  // Simple approach - open in new tab
  window.open(url, '_blank');
};
```

### 3. Reply Email Form Component
```typescript
interface ReplyFormProps {
  type: 'inquiry' | 'hireRequest';
  id: string;
  recipientEmail: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const ReplyForm: React.FC<ReplyFormProps> = ({
  type,
  id,
  recipientEmail,
  onSuccess,
  onCancel,
}) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('adminToken');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = type === 'inquiry'
      ? `http://localhost:5000/api/admin/inquiries/${id}/reply`
      : `http://localhost:5000/api/admin/hire-requests/${id}/reply`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subject, message }),
      });

      const data = await response.json();
      if (data.success) {
        onSuccess();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Failed to send reply:', error);
      alert('Failed to send reply');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Send Reply to {recipientEmail}</h3>
      
      <input
        type="text"
        placeholder="Subject (optional)"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />
      
      <textarea
        placeholder="Your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
        rows={10}
      />
      
      <button type="submit" disabled={loading || !message.trim()}>
        {loading ? 'Sending...' : 'Send Reply'}
      </button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};
```

---

## 🎯 TypeScript Interfaces

```typescript
// Reply email request
interface ReplyEmailRequest {
  subject?: string;  // Optional, has smart defaults
  message: string;   // Required
}

// API response
interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// Status enums
enum InquiryStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

enum HireStatus {
  NEW = 'NEW',
  REVIEWING = 'REVIEWING',
  INTERESTED = 'INTERESTED',
  NOT_INTERESTED = 'NOT_INTERESTED',
  IN_DISCUSSION = 'IN_DISCUSSION',
  HIRED = 'HIRED'
}
```

---

## 🐛 Error Handling

All endpoints follow consistent error response format:

```typescript
// Success response
{
  "success": true,
  "message": "Operation completed"
}

// Error response
{
  "success": false,
  "error": "Error description"
}
```

**Common HTTP Status Codes:**
- `200 OK` - Success
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Missing or invalid JWT token
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

**Frontend Error Handling Pattern:**
```typescript
const handleApiCall = async (apiCall: () => Promise<Response>) => {
  try {
    const response = await apiCall();
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        // Redirect to login
        window.location.href = '/admin/login';
      }
      throw new Error(data.error || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    alert(error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
};
```

---

## 📦 API Response Formats

### Reply Email Response
```json
{
  "success": true,
  "message": "Reply sent successfully"
}
```

### CSV Export Response
- Binary CSV file with proper headers
- Filename format: `service-inquiries-2026-01-25.csv` or `hire-requests-2026-01-25.csv`

### PDF Generation Response
- HTML document with inline CSS styling
- Optimized for browser print (Ctrl+P → Save as PDF)
- Professional layout with company branding

---

## 🔐 Security Notes

1. **Always validate JWT token** - All admin endpoints require authentication
2. **Store tokens securely** - Use httpOnly cookies or secure localStorage
3. **Handle token expiration** - Redirect to login on 401 responses
4. **Sanitize user input** - Message content is already sanitized on backend
5. **CORS Configuration** - Backend allows `http://localhost:3000` by default

---

## 📞 Testing the Endpoints

### Using cURL

**Send Reply to Inquiry:**
```bash
curl -X POST http://localhost:5000/api/admin/inquiries/YOUR_INQUIRY_ID/reply \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Thank you for your inquiry..."}'
```

**Export Hire Requests CSV:**
```bash
curl http://localhost:5000/api/admin/hire-requests/export/csv \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -o hire-requests.csv
```

**View Inquiry PDF:**
```bash
curl http://localhost:5000/api/admin/inquiries/YOUR_INQUIRY_ID/pdf \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -o inquiry.html
```

### Using Postman

1. **Setup:**
   - Create new request collection "Admin Panel"
   - Add environment variable `baseURL` = `http://localhost:5000`
   - Add environment variable `token` = your JWT token from login

2. **Test Reply Email:**
   - Method: POST
   - URL: `{{baseURL}}/api/admin/inquiries/:id/reply`
   - Headers: `Authorization: Bearer {{token}}`
   - Body (JSON):
     ```json
     {
       "subject": "Test Reply",
       "message": "This is a test reply message"
     }
     ```

3. **Test CSV Export:**
   - Method: GET
   - URL: `{{baseURL}}/api/admin/hire-requests/export/csv`
   - Headers: `Authorization: Bearer {{token}}`
   - Click "Send and Download"

---

## 🎉 Feature Summary

### What's New?

1. **Email Reply System** - Send direct replies to clients from admin panel
2. **CSV Export for Hire Requests** - Download hire requests for analysis
3. **PDF Generation** - Create printable documents for both inquiry types
4. **File Upload System** - Upload and manage image files for portfolio content

### Benefits:

- **Streamlined Communication:** Reply to clients without leaving admin panel
- **Data Portability:** Export data for offline analysis or reporting
- **Professional Documentation:** Generate PDFs for record-keeping or sharing
- **Status Automation:** Status updates automatically when sending replies
- **Asset Management:** Upload and organize images directly through admin panel

---

## 📚 Additional Resources

- **Full API Documentation:** See `API.md` for all endpoints
- **Content Management Guide:** See `CONTENT_API.md` for CMS endpoints
- **Frontend Integration:** See `FRONTEND_API_GUIDE.md` for general API usage
- **Quick Reference:** See `QUICK_REFERENCE.md` for endpoint summary

---

## 💬 Support

For issues or questions:
- Check backend logs: `logs/combined.log`
- Verify environment variables are set correctly
- Ensure Resend API key is configured for email features
- Check JWT token validity (tokens expire after configured time)

---

**Last Updated:** January 25, 2026
**Backend Version:** 1.0.0
**New Features Added:** Reply Emails, Hire Request CSV Export, PDF Generation
