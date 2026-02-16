export type UserProfile = {
  id: string;
  name: string;
  age: number;
  sex: "Male" | "Female";
  email?: string;
  status?: "active" | "inactive";
  current_bmi: number;
  weight: number;
  height: number;
  last_updated?: string;
};

export type BMIHistoryEntry = {
  date: string;
  bmi: number;
  weight: number;
  height: number;
};

export type AdminOverview = {
  totalUsers: number;
  measurementsToday: number;
  activeUsers: number;
  totalMeasurements: number;
  avgBmi: number;
  systemHealth: number;
};

export type AdminUserRow = {
  id: string;
  name: string;
  age: number;
  sex: "Male" | "Female";
  email: string;
  status: "active" | "inactive";
  current_bmi: number;
  total_records: number;
  last_measurement?: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    ...init,
  });

  const data = (await response.json().catch(() => ({}))) as T & {
    error?: string;
  };

  if (!response.ok) {
    const message = (data as { error?: string }).error || "API request failed";
    throw new Error(message);
  }

  return data;
}

export async function adminLogin(username: string, password: string) {
  return request<{ token: string; admin: { username: string; full_name: string } }>(
    "/api/admin/login",
    {
      method: "POST",
      body: JSON.stringify({ username, password }),
    },
  );
}

export async function getUserData(userId: string) {
  return request<{ user: UserProfile }>(`/api/users/${userId}`);
}

export async function getBMIHistory(userId: string) {
  return request<{ history: BMIHistoryEntry[] }>(`/api/users/${userId}/bmi-history`);
}

export async function updateUserProfile(userId: string, data: { name: string }) {
  return request<{ user: Pick<UserProfile, "id" | "name" | "age" | "sex" | "email" | "status"> }>(
    `/api/users/${userId}`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
  );
}

export async function getAdminOverview() {
  return request<AdminOverview>("/api/admin/overview");
}

export async function getAdminUsers() {
  return request<{ users: AdminUserRow[] }>("/api/admin/users");
}
