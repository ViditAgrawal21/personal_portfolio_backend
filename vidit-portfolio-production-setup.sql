-- 🚀 VIDIT AGRAWAL - PORTFOLIO PRODUCTION SETUP
-- Complete database setup with real resume data
-- Execute this entire file in Supabase SQL Editor

-- ================================================
-- 🧹 STEP 1: CLEAR EXISTING DATA (PRODUCTION RESET)
-- ================================================

-- Clear all data in correct order (respecting foreign keys)
DELETE FROM service_inquiries;
DELETE FROM hire_requests;
DELETE FROM about;
DELETE FROM services;
DELETE FROM projects;
DELETE FROM tech_stack;
DELETE FROM experience;
DELETE FROM education;
DELETE FROM admin_users WHERE email != 'agrawalvidit656@gmail.com';

-- ================================================
-- 👤 STEP 2: PERSONAL INFORMATION (ABOUT)
-- ================================================

INSERT INTO about (
  id,
  full_name,
  title,
  bio,
  email,
  phone,
  location,
  github_url,
  linkedin_url,
  years_of_experience,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'Vidit Agrawal',
  'Full Stack Developer & Software Engineer',
  'Passionate software engineer with expertise in full-stack development, data engineering, and automation. Experienced in building scalable web applications, mobile apps, and data processing solutions. Proficient in modern technologies including React Native, Node.js, Python, and cloud platforms. Strong problem-solving skills with 300+ coding challenges solved and proven track record in developing enterprise-level automation tools.',
  'agrawalvidit656@gmail.com',
  '+91 8530567856',
  'Pune, Maharashtra, India',
  'https://github.com/ViditAgrawal21',
  'https://linkedin.com/in/vidit-agrawal',
  3,
  NOW(),
  NOW()
);

-- ================================================
-- 🎓 STEP 3: EDUCATION (FROM RESUME)
-- ================================================

INSERT INTO education (
  id,
  institution,
  degree,
  field,
  start_date,
  end_date,
  is_current,
  grade,
  location,
  description,
  is_active,
  display_order,
  created_at,
  updated_at
) VALUES 
-- B.Tech - Current/Recent
(
  gen_random_uuid(),
  'Pimpri Chinchwod College of Engineering',
  'B.Tech',
  'Electronics and Telecommunication Engineering',
  '2020-08-01',
  '2024-08-01', 
  false,
  'CGPA: 7.5/10',
  'Pune',
  'Core engineering program focusing on electronics and telecommunication systems with practical project experience.',
  true,
  1,
  NOW(),
  NOW()
),
-- HSC
(
  gen_random_uuid(),
  'Brijlal Birani College of Science',
  'HSC',
  'Science',
  '2018-06-01',
  '2020-03-01',
  false,
  '81%',
  'Amravati',
  'Higher Secondary Certificate in Science stream with focus on Mathematics, Physics, and Chemistry.',
  true,
  2,
  NOW(),
  NOW()
),
-- High School
(
  gen_random_uuid(),
  'Dayananda High School',
  'SSC',
  'General',
  '2016-06-01',
  '2018-03-01',
  false,
  null,
  'Amravati',
  'Secondary School Certificate with strong academic foundation.',
  true,
  3,
  NOW(),
  NOW()
);

-- ================================================
-- 💼 STEP 4: WORK EXPERIENCE (FROM RESUME)
-- ================================================

INSERT INTO experience (
  id,
  company,
  position,
  location,
  start_date,
  end_date,
  is_current,
  description,
  display_order,
  is_active,
  created_at,
  updated_at
) VALUES 
-- Current Role
(
  gen_random_uuid(),
  'Synegi Labs',
  'Software Developer',
  'Pune',
  '2025-10-01',
  null,
  true,
  'Developing platform mobile applications using React Native improving UI performance across Android and iOS. Designed minimalistic UI/UX components improving usability and internal flow. Built optimization UI functionalities to optimize data management improving performance and reducing load latency. Contributed to navigation architecture, caching strategies, authentication flows, debugging, and deployment.',
  1,
  true,
  NOW(),
  NOW()
),
-- Previous Role
(
  gen_random_uuid(),
  'Third Rock Techkno Automation Pvt. Ltd.',
  'Software Engineer',
  'Pune',
  '2025-05-01',
  '2025-10-01',
  false,
  'Built Flutter-based AI Leak Tester mobile app reducing manual testing time by 60%. Developed AMR Fleet Management system managing vehicles with 90.5% uptime. Integrated payment gateways, chat bots with WebSockets achieving sub-100ms real-time interaction. Implemented secure authentication, automated PDF reports, and optimized cross-platform deployment. Collaborated on web application development improving performance and user experience through code reviews.',
  2,
  true,
  NOW(),
  NOW()
),
-- Internship
(
  gen_random_uuid(),
  'Web Dev Monk',
  'Development Intern',
  'Pune',
  '2023-08-01',
  '2023-11-01',
  false,
  'Collaborated on web application development improving performance and user experience through code reviews. Built real-time analytics for monitoring 20+ employees. Implemented analytics for React Native applications and optimized database queries.',
  3,
  true,
  NOW(),
  NOW()
);

-- ================================================
-- 🛠️ STEP 5: SERVICES (BASED ON SKILLS)
-- ================================================

INSERT INTO services (
  id,
  title,
  icon,
  description,
  features,
  pricing,
  display_order,
  is_active,
  created_at,
  updated_at
) VALUES 
-- Web Development
(
  gen_random_uuid(),
  'Web Development',
  '💻',
  'Full-stack web applications built with modern technologies. Responsive design, secure authentication, and optimized performance for enterprise solutions.',
  '["React.js & Node.js", "Database Design", "API Development", "Performance Optimization", "Authentication Systems", "Responsive Design"]'::jsonb,
  'Starting from $2,000',
  1,
  true,
  NOW(),
  NOW()
),
-- Mobile Development
(
  gen_random_uuid(),
  'Mobile Development', 
  '📱',
  'Cross-platform mobile applications using React Native and Flutter. Native performance with real-time features and seamless user experience.',
  '["React Native", "Flutter", "iOS & Android", "Real-time Features", "Performance Optimization", "App Store Deployment"]'::jsonb,
  'Starting from $3,000',
  2,
  true,
  NOW(),
  NOW()
),
-- Data Engineering & Automation
(
  gen_random_uuid(),
  'Data Engineering & Automation',
  '⚙️',
  'ETL/ELT pipelines, data processing automation, and business process optimization. From data ingestion to actionable insights.',
  '["ETL Pipelines", "Data Processing", "API Integration", "Process Automation", "Database Optimization", "Cloud Solutions"]'::jsonb,
  'Starting from $2,500',
  3,
  true,
  NOW(),
  NOW()
),
-- Custom Software Solutions
(
  gen_random_uuid(),
  'Custom Software Solutions',
  '🔧',
  'Tailored software solutions including desktop applications, automation tools, and system integrations for specific business needs.',
  '["Desktop Applications", "System Integration", "Custom APIs", "Database Solutions", "Automation Tools", "Legacy System Migration"]'::jsonb,
  'Starting from $4,000',
  4,
  true,
  NOW(),
  NOW()
);

-- ================================================
-- 🚀 STEP 6: FEATURED PROJECTS (FROM RESUME & EXPERIENCE)
-- ================================================

INSERT INTO projects (
  id,
  title,
  description,
  tech_stack,
  image_url,
  demo_url,
  github_url,
  category,
  is_featured,
  is_active,
  display_order,
  created_at,
  updated_at
) VALUES 
-- Government Portal Automation
(
  gen_random_uuid(),
  'Government Portal Automation Suite',
  'Comprehensive automation solution for government portal data processing with Excel datasets handling 30+ columns and automated ID generation for thousands of records.',
  '["Python", "Playwright", "Tkinter", "OpenCV", "Excel Processing", "Data Automation"]'::jsonb,
  null,
  null,
  'https://github.com/ViditAgrawal21/government-automation',
  'Automation',
  true,
  true,
  1,
  NOW(),
  NOW()
),
-- Real Estate CRM
(
  gen_random_uuid(),
  'Real Estate CRM Platform',
  'Multi-platform CRM system managing 100+ leads/day with role hierarchy, session persistence, and batch data processing capabilities.',
  '["React Native", "Node.js", "Supabase", "Real-time Updates", "Role Management"]'::jsonb,
  null,
  null,
  'https://github.com/ViditAgrawal21/real-estate-crm',
  'Mobile & Web',
  true,
  true,
  2,
  NOW(),
  NOW()
),
-- AI Leak Tester App
(
  gen_random_uuid(),
  'AI Leak Tester Mobile App',
  'Flutter-based mobile application for automated testing reducing manual testing time by 60% with real-time analytics and reporting.',
  '["Flutter", "AI Integration", "Mobile Testing", "Real-time Analytics", "Automated Reporting"]'::jsonb,
  null,
  null,
  null,
  'Mobile Development',
  true,
  true,
  3,
  NOW(),
  NOW()
),
-- AMR Fleet Management
(
  gen_random_uuid(),
  'AMR Fleet Management System',
  'Autonomous Mobile Robot fleet management system achieving 90.5% uptime with real-time monitoring and automated reporting.',
  '["React", "Node.js", "WebSockets", "Real-time Monitoring", "Fleet Management", "Automated Reports"]'::jsonb,
  null,
  null,
  null,
  'Web Development',
  true,
  true,
  4,
  NOW(),
  NOW()
),
-- Portfolio Backend API
(
  gen_random_uuid(),
  'Portfolio Backend API',
  'Complete RESTful API for portfolio management with admin panel, file uploads, email integration, and comprehensive analytics.',
  '["Node.js", "Express", "PostgreSQL", "Prisma", "JWT Auth", "File Upload"]'::jsonb,
  null,
  'https://portfolio-api.vidit.dev',
  'https://github.com/ViditAgrawal21/personal_portfolio_backend',
  'API Development',
  true,
  true,
  5,
  NOW(),
  NOW()
),
-- Analytics Dashboard
(
  gen_random_uuid(),
  'Real-time Analytics Dashboard',
  'Employee monitoring and analytics system for 20+ team members with performance metrics and data visualization.',
  '["React", "Node.js", "Charts.js", "Real-time Data", "Performance Analytics"]'::jsonb,
  null,
  null,
  null,
  'Web Development', 
  false,
  true,
  6,
  NOW(),
  NOW()
);

-- ================================================
-- ⚡ STEP 7: TECHNOLOGY STACK (FROM RESUME SKILLS)
-- ================================================

INSERT INTO tech_stack (
  id,
  name,
  category,
  proficiency,
  icon,
  display_order,
  is_active,
  created_at,
  updated_at
) VALUES 
-- Programming Languages
(gen_random_uuid(), 'JavaScript', 'Programming Languages', 90, 'https://unpkg.com/simple-icons@v9/icons/javascript.svg', 1, true, NOW(), NOW()),
(gen_random_uuid(), 'Python', 'Programming Languages', 85, 'https://unpkg.com/simple-icons@v9/icons/python.svg', 2, true, NOW(), NOW()),
(gen_random_uuid(), 'C++', 'Programming Languages', 88, 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg', 3, true, NOW(), NOW()),
(gen_random_uuid(), 'SQL', 'Programming Languages', 85, 'https://www.svgrepo.com/show/255832/sql.svg', 4, true, NOW(), NOW()),

-- Frontend Technologies
(gen_random_uuid(), 'React Native', 'Frontend', 90, 'https://unpkg.com/simple-icons@v9/icons/react.svg', 5, true, NOW(), NOW()),
(gen_random_uuid(), 'Flutter', 'Frontend', 80, 'https://unpkg.com/simple-icons@v9/icons/flutter.svg', 6, true, NOW(), NOW()),
(gen_random_uuid(), 'Tkinter', 'Frontend', 75, 'https://unpkg.com/simple-icons@v9/icons/python.svg', 7, true, NOW(), NOW()),

-- Backend Technologies  
(gen_random_uuid(), 'Node.js', 'Backend', 88, 'https://unpkg.com/simple-icons@v9/icons/nodedotjs.svg', 8, true, NOW(), NOW()),
(gen_random_uuid(), 'REST APIs', 'Backend', 90, 'https://img.icons8.com/dusk/64/000000/api.png', 9, true, NOW(), NOW()),
(gen_random_uuid(), 'Firebase', 'Backend', 75, 'https://unpkg.com/simple-icons@v9/icons/firebase.svg', 10, true, NOW(), NOW()),

-- Databases
(gen_random_uuid(), 'PostgreSQL', 'Database', 90, 'https://unpkg.com/simple-icons@v9/icons/postgresql.svg', 11, true, NOW(), NOW()),
(gen_random_uuid(), 'MySQL', 'Database', 85, 'https://unpkg.com/simple-icons@v9/icons/mysql.svg', 12, true, NOW(), NOW()),
(gen_random_uuid(), 'Cloud SQL', 'Database', 80, 'https://unpkg.com/simple-icons@v9/icons/googlecloud.svg', 13, true, NOW(), NOW()),
(gen_random_uuid(), 'Supabase', 'Database', 85, 'https://supabase.com/favicon.ico', 14, true, NOW(), NOW()),

-- Data Engineering
(gen_random_uuid(), 'ETL Pipelines', 'Data Engineering', 85, 'https://img.icons8.com/fluency/48/000000/data-configuration.png', 15, true, NOW(), NOW()),
(gen_random_uuid(), 'API Data Ingestion', 'Data Engineering', 80, 'https://img.icons8.com/color/48/000000/api.png', 16, true, NOW(), NOW()),
(gen_random_uuid(), 'Data Automation', 'Data Engineering', 88, 'https://img.icons8.com/color/48/000000/automation.png', 17, true, NOW(), NOW()),
(gen_random_uuid(), 'Data Processing', 'Data Engineering', 85, 'https://img.icons8.com/color/48/000000/data-sheet.png', 18, true, NOW(), NOW()),

-- Cloud & Tools
(gen_random_uuid(), 'AWS Lambda', 'Cloud', 70, 'https://unpkg.com/simple-icons@v9/icons/amazonaws.svg', 19, true, NOW(), NOW()),
(gen_random_uuid(), 'Amazon S3', 'Cloud', 70, 'https://unpkg.com/simple-icons@v9/icons/amazonaws.svg', 20, true, NOW(), NOW()),
(gen_random_uuid(), 'Docker', 'DevOps', 75, 'https://unpkg.com/simple-icons@v9/icons/docker.svg', 21, true, NOW(), NOW()),
(gen_random_uuid(), 'Linux', 'Tools', 80, 'https://unpkg.com/simple-icons@v9/icons/linux.svg', 22, true, NOW(), NOW()),
(gen_random_uuid(), 'GitHub', 'Tools', 90, 'https://unpkg.com/simple-icons@v9/icons/github.svg', 23, true, NOW(), NOW()),

-- Analysis & Visualization
(gen_random_uuid(), 'Tableau', 'Analytics', 60, 'https://logos-world.net/wp-content/uploads/2021/10/Tableau-Symbol.png', 24, true, NOW(), NOW()),
(gen_random_uuid(), 'Snowflake', 'Analytics', 55, 'https://logo.clearbit.com/snowflake.com', 25, true, NOW(), NOW()),

-- Automation Tools
(gen_random_uuid(), 'Playwright', 'Automation', 85, 'https://playwright.dev/img/playwright-logo.svg', 26, true, NOW(), NOW()),
(gen_random_uuid(), 'OpenCV', 'Automation', 70, 'https://opencv.org/wp-content/uploads/2020/07/OpenCV_logo_no_text_.png', 27, true, NOW(), NOW());

-- ================================================
-- 📋 STEP 8: SAMPLE INQUIRIES & HIRE REQUESTS
-- ================================================

-- Sample Service Inquiries
INSERT INTO service_inquiries (
  id,
  service_type,
  client_name,
  email,
  requirements,
  status,
  created_at,
  updated_at
) VALUES 
(
  gen_random_uuid(),
  'Web Development',
  'Rahul Kumar',
  'rahul.kumar@techcorp.in',
  'We need a modern web application for our inventory management system with real-time updates and role-based access. Company: TechCorp Solutions',
  'new',
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '2 days'
),
(
  gen_random_uuid(),
  'Mobile Development',
  'Priya Sharma',
  'priya@startupventure.com',
  'Looking for a React Native app for food delivery with GPS tracking and payment integration. Company: StartupVenture',
  'in_progress',
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '1 day'
),
(
  gen_random_uuid(),
  'Data Engineering & Automation',
  'Amit Patel',
  'amit.patel@dataflow.io',
  'Need ETL pipeline setup for processing large datasets from multiple sources and automated reporting. Company: DataFlow Analytics',
  'converted',
  NOW() - INTERVAL '10 days',
  NOW() - INTERVAL '3 days'
);

-- Sample Hire Requests
INSERT INTO hire_requests (
  id,
  project_name,
  tech_stack,
  email,
  message,
  status,
  created_at,
  updated_at
) VALUES 
(
  gen_random_uuid(),
  'E-commerce Platform Redesign',
  '["React", "Node.js", "PostgreSQL", "Payment Gateway", "AWS"]'::jsonb,
  'hiring@ecommerce-solutions.com',
  'We are looking to completely redesign our e-commerce platform with modern UI/UX and improved performance. The project involves migrating existing data and implementing new features.',
  'new',
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '1 day'
),
(
  gen_random_uuid(),
  'Healthcare Management System',
  '["React Native", "Node.js", "Firebase", "HIPAA Compliance"]'::jsonb,
  'contact@healthtech.in',
  'Developing a comprehensive healthcare management system with patient records, appointment scheduling, and telemedicine capabilities. HIPAA compliance is essential.',
  'reviewing',
  NOW() - INTERVAL '7 days',
  NOW() - INTERVAL '2 days'
);

-- ================================================
-- ✅ SETUP COMPLETE! 
-- ================================================

-- Verify setup
SELECT 'Setup completed successfully!' as status;
SELECT 'About entries: ' || COUNT(*) as about_count FROM about;
SELECT 'Education entries: ' || COUNT(*) as education_count FROM education;  
SELECT 'Experience entries: ' || COUNT(*) as experience_count FROM experience;
SELECT 'Services: ' || COUNT(*) as services_count FROM services;
SELECT 'Projects: ' || COUNT(*) as projects_count FROM projects;
SELECT 'Tech stack entries: ' || COUNT(*) as tech_count FROM tech_stack;
SELECT 'Sample inquiries: ' || COUNT(*) as inquiries_count FROM service_inquiries;
SELECT 'Sample hire requests: ' || COUNT(*) as hire_requests_count FROM hire_requests;