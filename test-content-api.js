/**
 * Test script for Content Management APIs
 * Run with: node test-content-api.js
 */

const API_BASE = 'http://localhost:5000';
let authToken = '';

// Helper function for API requests
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (authToken && !options.skipAuth) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();
  console.log(`\n${options.method || 'GET'} ${endpoint}`);
  console.log('Status:', response.status);
  console.log('Response:', JSON.stringify(data, null, 2));
  return data;
}

async function testContentAPIs() {
  console.log('🧪 Testing Content Management APIs\n');
  console.log('=' .repeat(50));

  try {
    // 1. Login
    console.log('\n📋 Step 1: Login to get auth token');
    const loginData = await apiRequest('/api/admin/login', {
      method: 'POST',
      skipAuth: true,
      body: JSON.stringify({
        email: 'agrawalvidit656@gmail.com',
        password: 'Vidit@2002',
      }),
    });

    if (loginData.success && loginData.token) {
      authToken = loginData.token;
      console.log('✅ Login successful!');
    } else {
      console.error('❌ Login failed');
      return;
    }

    // 2. Update About Section
    console.log('\n📋 Step 2: Update About Section');
    await apiRequest('/api/admin/content/about', {
      method: 'PUT',
      body: JSON.stringify({
        fullName: 'Vidit Agrawal',
        title: 'Full Stack Developer',
        bio: 'Passionate developer building modern web applications',
        email: 'agrawalvidit656@gmail.com',
        githubUrl: 'https://github.com/yourusername',
        linkedinUrl: 'https://linkedin.com/in/yourusername',
        yearsOfExp: 3,
      }),
    });

    // 3. Create a Service
    console.log('\n📋 Step 3: Create Service');
    const serviceData = await apiRequest('/api/admin/content/services', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Web Development',
        description: 'Building responsive and modern web applications',
        icon: 'Code',
        features: ['React', 'Node.js', 'TypeScript'],
        pricing: 'Starting at $1000',
        isActive: true,
        displayOrder: 1,
      }),
    });

    const serviceId = serviceData.data?.id;

    // 4. Create a Project
    console.log('\n📋 Step 4: Create Project');
    const projectData = await apiRequest('/api/admin/content/projects', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Portfolio Website',
        description: 'Modern portfolio website with CMS backend',
        techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
        demoUrl: 'https://demo.example.com',
        githubUrl: 'https://github.com/user/repo',
        category: 'Web App',
        isFeatured: true,
        isActive: true,
        displayOrder: 1,
      }),
    });

    const projectId = projectData.data?.id;

    // 5. Create Tech Stack Items
    console.log('\n📋 Step 5: Create Tech Stack Items');
    await apiRequest('/api/admin/content/stack', {
      method: 'POST',
      body: JSON.stringify({
        name: 'React',
        category: 'Frontend',
        icon: 'react',
        proficiency: 90,
        isActive: true,
        displayOrder: 1,
      }),
    });

    await apiRequest('/api/admin/content/stack', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Node.js',
        category: 'Backend',
        icon: 'nodejs',
        proficiency: 85,
        isActive: true,
        displayOrder: 2,
      }),
    });

    // 6. Create Experience
    console.log('\n📋 Step 6: Create Experience');
    await apiRequest('/api/admin/content/experience', {
      method: 'POST',
      body: JSON.stringify({
        company: 'Tech Company',
        position: 'Full Stack Developer',
        description: 'Developed web applications using React and Node.js',
        startDate: '2022-01-01',
        endDate: '2024-12-31',
        isCurrent: false,
        location: 'Remote',
        techUsed: ['React', 'Node.js', 'PostgreSQL'],
        isActive: true,
        displayOrder: 1,
      }),
    });

    // 7. Create Education
    console.log('\n📋 Step 7: Create Education');
    await apiRequest('/api/admin/content/education', {
      method: 'POST',
      body: JSON.stringify({
        institution: 'University Name',
        degree: 'Bachelor of Technology',
        field: 'Computer Science',
        startDate: '2018-08-01',
        endDate: '2022-05-31',
        isCurrent: false,
        grade: '8.5 CGPA',
        location: 'India',
        isActive: true,
        displayOrder: 1,
      }),
    });

    // 8. Fetch All Content (Public API)
    console.log('\n📋 Step 8: Fetch All Content (Public API)');
    await apiRequest('/api/content/all', {
      skipAuth: true,
    });

    // 9. Fetch Individual Sections
    console.log('\n📋 Step 9: Fetch Individual Sections');
    await apiRequest('/api/content/about', { skipAuth: true });
    await apiRequest('/api/content/services', { skipAuth: true });
    await apiRequest('/api/content/projects', { skipAuth: true });
    await apiRequest('/api/content/stack', { skipAuth: true });

    // 10. Update Service
    if (serviceId) {
      console.log('\n📋 Step 10: Update Service');
      await apiRequest(`/api/admin/content/services/${serviceId}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: 'Web Development (Updated)',
          pricing: 'Starting at $1500',
        }),
      });
    }

    console.log('\n\n✅ All tests completed!');
    console.log('\n📝 Summary:');
    console.log('- About section created/updated');
    console.log('- Service created and updated');
    console.log('- Project created');
    console.log('- Tech stack items created');
    console.log('- Experience added');
    console.log('- Education added');
    console.log('- Public APIs tested');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

// Run tests
testContentAPIs();
