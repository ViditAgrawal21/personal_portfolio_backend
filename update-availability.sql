-- Update About table with availability status
UPDATE about SET 
  is_available = true,
  availability_status = 'Available for projects',
  hourly_rate = '$25-50/hour',
  updated_at = NOW()
WHERE email = 'agrawalvidit656@gmail.com';

SELECT 'Availability status updated successfully!' as status;