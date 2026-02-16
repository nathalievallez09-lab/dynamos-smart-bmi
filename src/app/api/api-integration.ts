// API Integration Helper
// This file shows how to integrate your Neon database and backend API

const API_BASE_URL = "http://localhost:5000"; // Update with your backend URL
//const NEON_DB_URL = "postgresql://neondb_owner:npg_dr0Yge9iXLqM@ep-restless-mode-a1zx5bj0-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

// Example API calls to integrate with your backend:

// 1. Get user data by ID
export async function getUserData(userId: string, token: string) {
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}

// 2. Get BMI history for a user
export async function getBMIHistory(userId: string, token: string) {
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}/bmi-history`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}

// 3. Update user profile
export async function updateUserProfile(userId: string, data: any, token: string) {
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

// 4. Add new BMI record (from Arduino/Raspberry Pi)
export async function addBMIRecord(userId: string, data: any, token: string) {
  const response = await fetch(`${API_BASE_URL}/api/bmi-records`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      ...data,
    }),
  });
  return response.json();
}

// To use these functions in your components:
// 1. Import the function: import { getUserData } from '../api/api-integration';
// 2. Call it in useEffect or event handlers:
//    const data = await getUserData(userId, 'YOUR_JWT_TOKEN');
// 3. Update state with the returned data

// Note: Currently using mock data in Dashboard.tsx
// Replace the mockUserData with actual API calls when backend is ready
