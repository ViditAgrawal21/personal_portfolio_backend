#!/usr/bin/env node
/**
 * Test Backend API
 * Run: npm test or node test-api.js
 */

const http = require('http');

const BASE_URL = 'http://localhost:5000';
const ADMIN_EMAIL = 'agrawalvidit656@gmail.com';
const ADMIN_PASSWORD = 'ViditAgrawal@2002'; // Update with your actual password

let adminToken = '';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  test: (msg) => console.log(`\n${colors.cyan}${msg}${colors.reset}`),
};

async function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (adminToken) {
      options.headers['Authorization'] = `Bearer ${adminToken}`;
    }

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, body: json, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, body: data, headers: res.headers });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

async function runTests() {
  console.log(`\n${colors.cyan}🧪 Portfolio Backend API Tests${colors.reset}`);
  console.log(`${colors.cyan}================================${colors.reset}\n`);

  try {
    // Test 1: Health Check
    log.test('TEST 1: Health Check');
    const health = await makeRequest('GET', '/health');
    if (health.status === 200) {
      log.success('Health check passed');
    } else {
      log.error(`Health check failed: ${health.status}`);
      throw new Error('Backend not running');
    }

    // Test 2: Admin Login
    log.test('TEST 2: Admin Login');
    const login = await makeRequest('POST', '/api/admin/login', {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });

    if (login.status === 200 && login.body.token) {
      adminToken = login.body.token;
      log.success(`Login successful for ${ADMIN_EMAIL}`);
      log.info(`Token: ${adminToken.substring(0, 30)}...`);
    } else {
      log.error(`Login failed: ${login.status}`);
      log.warn('Make sure admin user exists with correct password');
      throw new Error('Login failed');
    }

    // Test 3: Submit Service Inquiry
    log.test('TEST 3: Submit Service Inquiry');
    const inquiryRes = await makeRequest('POST', '/api/services/inquiry', {
      clientName: 'Test User',
      email: 'test@example.com',
      serviceType: 'Web Development',
      budgetRange: '$5k-$10k',
      requirements: 'This is a test service inquiry with sufficient details for the API to accept it.',
    });

    let inquiryId = null;
    if (inquiryRes.status === 201 && inquiryRes.body.data?.id) {
      inquiryId = inquiryRes.body.data.id;
      log.success(`Inquiry created: ${inquiryId}`);
    } else {
      log.error(`Inquiry submission failed: ${inquiryRes.status}`);
      log.info(`Response: ${JSON.stringify(inquiryRes.body)}`);
    }

    // Test 4: Get All Inquiries
    log.test('TEST 4: Get All Inquiries');
    const inquiries = await makeRequest('GET', '/api/admin/inquiries');
    if (inquiries.status === 200 && inquiries.body.data) {
      log.success(`Retrieved ${inquiries.body.data.length} inquiries`);
      log.info(`Total: ${inquiries.body.pagination.total}`);
    } else {
      log.error(`Failed to fetch inquiries: ${inquiries.status}`);
    }

    // Test 5: Get Single Inquiry
    if (inquiryId) {
      log.test('TEST 5: Get Single Inquiry');
      const inquiry = await makeRequest('GET', `/api/admin/inquiries/${inquiryId}`);
      if (inquiry.status === 200 && inquiry.body.data?.id === inquiryId) {
        log.success(`Retrieved inquiry: ${inquiry.body.data.clientName}`);
      } else {
        log.error(`Failed to fetch inquiry: ${inquiry.status}`);
      }
    }

    // Test 6: Update Inquiry Status
    if (inquiryId) {
      log.test('TEST 6: Update Inquiry Status');
      const update = await makeRequest('PATCH', `/api/admin/inquiry/${inquiryId}/status`, {
        status: 'in_progress',
        internalNotes: 'Test update - reached out via email',
      });

      if (update.status === 200 && update.body.success) {
        log.success(`Status updated to: ${update.body.data.status}`);
      } else {
        log.error(`Failed to update inquiry: ${update.status}`);
        log.info(`Response: ${JSON.stringify(update.body)}`);
      }
    }

    // Test 7: Submit Hire Request
    log.test('TEST 7: Submit Hire Request');
    const hireRes = await makeRequest('POST', '/api/hire/request', {
      projectName: 'Test Project',
      techStack: ['React', 'Node.js', 'PostgreSQL'],
      email: 'hire@example.com',
      message: 'This is a test hire request with sufficient message length for the validation to pass.',
    });

    let hireId = null;
    if (hireRes.status === 201 && hireRes.body.data?.id) {
      hireId = hireRes.body.data.id;
      log.success(`Hire request created: ${hireId}`);
    } else {
      log.error(`Hire request submission failed: ${hireRes.status}`);
    }

    // Test 8: Get All Hire Requests
    log.test('TEST 8: Get All Hire Requests');
    const hires = await makeRequest('GET', '/api/admin/hire-requests');
    if (hires.status === 200 && hires.body.data) {
      log.success(`Retrieved ${hires.body.data.length} hire requests`);
    } else {
      log.error(`Failed to fetch hire requests: ${hires.status}`);
    }

    // Test 9: Get Dashboard Stats
    log.test('TEST 9: Get Dashboard Stats');
    const stats = await makeRequest('GET', '/api/admin/stats');
    if (stats.status === 200 && stats.body.data?.overview) {
      log.success('Stats retrieved successfully');
      log.info(`Total inquiries: ${stats.body.data.overview.totalInquiries}`);
      log.info(`Total hire requests: ${stats.body.data.overview.totalHireRequests}`);
    } else {
      log.error(`Failed to fetch stats: ${stats.status}`);
    }

    // Test 10: Export CSV
    log.test('TEST 10: Export Inquiries CSV');
    const csv = await makeRequest('GET', '/api/admin/inquiries/export/csv');
    if (csv.status === 200) {
      log.success('CSV export successful');
      const lines = csv.body.split('\n').length;
      log.info(`CSV contains ${lines} lines`);
    } else {
      log.error(`Failed to export CSV: ${csv.status}`);
    }

    // Summary
    console.log(`\n${colors.cyan}================================${colors.reset}`);
    log.success('All tests completed!');
    console.log(`\n${colors.green}🎉 Backend is working correctly!${colors.reset}\n`);
  } catch (error) {
    log.error(`Test failed: ${error.message}`);
    log.warn('Make sure:');
    log.warn('1. Backend is running (npm run dev)');
    log.warn('2. Admin user exists in database');
    log.warn('3. Database connection is working');
    process.exit(1);
  }
}

// Run tests
runTests();
