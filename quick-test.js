// Quick test - Check if server is working
const http = require('http');

http.get('http://localhost:5000/health', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('✅ Server is running!');
    console.log('Response:', data);
  });
}).on('error', (err) => {
  console.error('❌ Server not responding:', err.message);
});

// Test content API
setTimeout(() => {
  http.get('http://localhost:5000/api/content/all', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('\n✅ Content API is working!');
      const parsed = JSON.parse(data);
      console.log('Success:', parsed.success);
      console.log('Has about:', !!parsed.data.about);
      console.log('Services count:', parsed.data.services.length);
      console.log('Projects count:', parsed.data.projects.length);
      console.log('Tech stack count:', parsed.data.techStack.length);
      console.log('Experience count:', parsed.data.experience.length);
      console.log('Education count:', parsed.data.education.length);
    });
  }).on('error', (err) => {
    console.error('❌ Content API error:', err.message);
  });
}, 1000);
