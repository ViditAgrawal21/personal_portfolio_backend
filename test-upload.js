// Test file upload endpoint
const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function testFileUpload() {
  // First, get admin token
  console.log('🔑 Getting admin token...');
  
  const loginResponse = await fetch('http://localhost:5000/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'agrawalvidit656@gmail.com',
      password: 'Vidit@2002',
    }),
  });

  const loginData = await loginResponse.json();
  
  if (!loginData.success) {
    console.error('❌ Login failed:', loginData);
    return;
  }

  const token = loginData.token;
  console.log('✅ Login successful, got token');

  // Create a test image file (1x1 pixel PNG)
  const testImageData = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  );
  
  fs.writeFileSync('test-image.png', testImageData);

  try {
    // Test file upload
    console.log('📤 Testing file upload...');

    const formData = new FormData();
    formData.append('file', fs.createReadStream('test-image.png'), {
      filename: 'test-image.png',
      contentType: 'image/png',
    });

    const uploadResponse = await fetch('http://localhost:5000/api/admin/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        ...formData.getHeaders(),
      },
      body: formData,
    });

    const uploadData = await uploadResponse.json();

    if (uploadResponse.ok) {
      console.log('✅ File upload successful!');
      console.log('📁 Upload response:', uploadData);
      
      // Test accessing the uploaded file
      const fileUrl = `http://localhost:5000${uploadData.data.url}`;
      console.log('🔗 File accessible at:', fileUrl);
      
      const fileCheckResponse = await fetch(fileUrl);
      if (fileCheckResponse.ok) {
        console.log('✅ Uploaded file is accessible via URL');
      } else {
        console.log('❌ Uploaded file is not accessible via URL');
      }
    } else {
      console.error('❌ File upload failed:', uploadData);
    }

  } finally {
    // Clean up test file
    if (fs.existsSync('test-image.png')) {
      fs.unlinkSync('test-image.png');
      console.log('🧹 Cleaned up test image file');
    }
  }
}

// Test with error handling
testFileUpload().catch(error => {
  console.error('❌ Test failed:', error);
  // Clean up on error
  if (fs.existsSync('test-image.png')) {
    fs.unlinkSync('test-image.png');
  }
});