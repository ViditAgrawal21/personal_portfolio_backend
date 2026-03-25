// Test script to verify new fields work
const testAPI = async () => {
  try {
    console.log('🧪 Testing Service Inquiry with serviceType...');
    
    // Test Service Inquiry with new serviceType field
    const serviceResponse = await fetch('http://localhost:3000/api/services/inquiry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientName: "Test User", 
        email: "test@example.com",
        serviceType: "Web Development",
        companyName: "Test Company",
        phoneNumber: "+1-555-123-4567",
        budgetRange: "$5,000 - $10,000",
        timeline: "2-3 months",
        projectDetails: "Test project details for verification"
      }),
    });

    const serviceResult = await serviceResponse.json();
    console.log('✅ Service Inquiry Response:', serviceResult);

    console.log('\n🧪 Testing Hire Request with location...');
    
    // Test Hire Request with new location field
    const hireResponse = await fetch('http://localhost:3000/api/hire/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        candidateName: "Test Recruiter",
        email: "recruiter@company.com",
        companyName: "Test Corp",
        roleType: "Full-Stack Developer",
        salaryOffer: "$80,000 - $100,000",
        location: "Remote / New York",
        message: "We are looking for a talented developer to join our team"
      }),
    });

    const hireResult = await hireResponse.json();
    console.log('✅ Hire Request Response:', hireResult);

  } catch (error) {
    console.error('❌ Test Error:', error.message);
  }
};

testAPI();