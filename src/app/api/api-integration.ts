export type UserProfile = {
  id: string;
  name: string;
  age: number;
  sex: "Male" | "Female" | "";
  email?: string;
  status?: "active" | "inactive";
  current_bmi: number;
  weight: number;
  height: number;
  last_updated?: string;
  must_reset_password?: boolean;
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
  sex: "Male" | "Female" | "";
  email: string;
  status: "active" | "inactive";
  current_bmi: number;
  total_records: number;
  last_measurement?: string;
};

export type AdminLoginResponse = {
  token: string;
  admin: {
    username: string;
    full_name: string;
  };
};

export type UserLoginResponse = {
  token: string;
  user: UserProfile;
};

export type UserAiMessage = {
  role: "assistant" | "user";
  content: string;
};

export type AdminSettings = {
  username: string;
  full_name: string;
  role: string;
  created_at?: number;
  updated_at?: number;
};

export type AdminAnalyticsData = {
  totalUsers: number;
  totalMeasurements: number;
  avgBmi: number;
  measurementsToday: number;
  monthlyUsers: Array<{ month: string; users: number; measurements: number }>;
  dailyMeasurements: Array<{ day: string; count: number }>;
  bmiDistribution: Array<{ name: string; value: number; color: string }>;
  genderDistribution: Array<{ name: string; value: number; color: string }>;
};

export type AdminExportRow = {
  user_id: string;
  full_name: string;
  age: number;
  sex: "Male" | "Female" | "";
  bmi: number;
  category: string;
  weight_kg: number;
  height_cm: number;
  captured_at: string;
  captured_date: string;
  captured_time: string;
  timezone: string;
};

export type SystemMonitoringData = {
  title: string;
  statusLabel: string;
  overview: {
    network: number;
    database: number;
    serverLoad: number;
    uptime: number;
    systemStatus: string;
  };
  hardwareStatus: Array<{
    id: string;
    label: string;
    status: string;
    healthPercent: number;
    lastCheckLabel: string;
    detail: string;
  }>;
  systemLoad: Array<{ time: string; cpu: number; memory: number; network: number }>;
  recentMeasurements: Array<{
    time: string;
    userId: string;
    bmi: number;
    status: "success" | "failed";
  }>;
  systemAlerts: Array<{
    title: string;
    message: string;
    severity: string;
    createdAt?: number;
  }>;
};

const FIREBASE_DB_URL =
  import.meta.env.VITE_FIREBASE_DB_URL ||
  "https://smartbmi-demo-default-rtdb.firebaseio.com";
export const DEFAULT_USER_PASSWORD = "12345";
type FirebaseMeasurement = {
  bmi?: number;
  category?: string;
  capturedAt?: number;
  capturedAtFormatted?: string;
  capturedDate?: string;
  capturedTime?: string;
  capturedTimezone?: string;
  heightCm?: number;
  weightKg?: number;
};

type FirebaseUser = {
  age?: number;
  createdAt?: number;
  createdAtFormatted?: string;
  fullName?: string;
  measurements?: Record<string, FirebaseMeasurement>;
  mustResetPassword?: boolean;
  password?: string;
  sex?: "Male" | "Female" | "";
  updatedAt?: number;
  updatedAtFormatted?: string;
};

type FirebaseUsersResponse = Record<string, FirebaseUser> | null;

type FirebaseAdmin = {
  username?: string;
  password?: string;
  fullName?: string;
  role?: string;
  createdAt?: number;
  updatedAt?: number;
};

type FirebaseMonitoringDashboard = {
  generatedAt?: number;
  hardwareStatus?: Array<{
    id?: string;
    label?: string;
    status?: string;
    healthPercent?: number;
    lastCheckLabel?: string;
    detail?: string;
  }>;
  overview?: {
    network?: { value?: number };
    database?: { value?: number };
    serverLoad?: { value?: number };
    uptime?: { value?: number };
    systemStatus?: { value?: string };
  };
  systemLoad?: {
    points?: Array<{ label?: string; value?: number }>;
  };
  systemAlerts?: Array<{
    title?: string;
    message?: string;
    severity?: string;
    createdAt?: number;
  }>;
  statusLabel?: string;
  title?: string;
};

async function firebaseRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${FIREBASE_DB_URL}${path}`, init);
  const data = (await response.json().catch(() => null)) as T;

  if (!response.ok) {
    throw new Error(`Firebase request failed with status ${response.status}`);
  }

  return data;
}

function sortMeasurements(measurements?: Record<string, FirebaseMeasurement>) {
  return Object.values(measurements || {}).sort(
    (a, b) => (a.capturedAt || 0) - (b.capturedAt || 0),
  );
}

function getLastMeasurement(measurements?: Record<string, FirebaseMeasurement>) {
  const sorted = sortMeasurements(measurements);
  return sorted[sorted.length - 1];
}

function toIsoDate(timestamp?: number, fallback?: string) {
  if (typeof timestamp === "number") {
    return new Date(timestamp).toISOString();
  }

  if (fallback) {
    const parsed = new Date(fallback);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }

  return new Date().toISOString();
}

function formatFirebaseDate(timestamp: number) {
  const date = new Date(timestamp);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

function monthLabel(date: Date) {
  return date.toLocaleString("en-US", { month: "short" });
}

function dayLabel(date: Date) {
  return date.toLocaleString("en-US", { weekday: "short" });
}

function inputDate(timestamp?: number) {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function toUserProfile(userId: string, firebaseUser: FirebaseUser): UserProfile {
  const latest = getLastMeasurement(firebaseUser.measurements);

  return {
    id: userId,
    name: firebaseUser.fullName || "Unknown User",
    age: Number(firebaseUser.age || 0),
    sex: firebaseUser.sex || "",
    email: "",
    status:
      firebaseUser.measurements && Object.keys(firebaseUser.measurements).length > 0
        ? "active"
        : "inactive",
    current_bmi: Number(latest?.bmi || 0),
    weight: Number(latest?.weightKg || 0),
    height: Number(latest?.heightCm || 0),
    last_updated: toIsoDate(
      latest?.capturedAt || firebaseUser.updatedAt,
      latest?.capturedAtFormatted || firebaseUser.updatedAtFormatted,
    ),
    must_reset_password: Boolean(
      firebaseUser.mustResetPassword || !firebaseUser.password || firebaseUser.password === DEFAULT_USER_PASSWORD,
    ),
  };
}

function toBmiHistory(measurements?: Record<string, FirebaseMeasurement>): BMIHistoryEntry[] {
  return sortMeasurements(measurements).map((measurement) => ({
    date: toIsoDate(measurement.capturedAt, measurement.capturedAtFormatted),
    bmi: Number(measurement.bmi || 0),
    weight: Number(measurement.weightKg || 0),
    height: Number(measurement.heightCm || 0),
  }));
}

export async function adminLogin(username: string, password: string): Promise<AdminLoginResponse> {
  const admin = await firebaseRequest<FirebaseAdmin | null>(`/admins/${username}.json`);
  if (!admin || admin.password !== password) {
    throw new Error("Invalid username or password");
  }

  return {
    token: `admin-${Date.now()}`,
    admin: {
      username,
      full_name: admin.fullName || username,
    },
  };
}

export async function getAdminSettings(username: string): Promise<AdminSettings> {
  const admin = await firebaseRequest<FirebaseAdmin | null>(`/admins/${username}.json`);
  if (!admin) {
    throw new Error("Admin not found");
  }

  return {
    username: admin.username || username,
    full_name: admin.fullName || username,
    role: admin.role || "admin",
    created_at: admin.createdAt,
    updated_at: admin.updatedAt,
  };
}

export async function updateAdminSettings(
  username: string,
  data: { full_name: string; password?: string },
): Promise<AdminSettings> {
  const payload: Record<string, string | number> = {
    username,
    fullName: data.full_name.trim(),
    updatedAt: Date.now(),
  };

  if (data.password?.trim()) {
    payload.password = data.password;
  }

  await firebaseRequest(`/admins/${username}.json`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return getAdminSettings(username);
}

export async function getUserData(userId: string) {
  const user = await firebaseRequest<FirebaseUser | null>(`/users/${userId}.json`);
  if (!user) {
    throw new Error("User not found");
  }

  return { user: toUserProfile(userId, user) };
}

export async function userLogin(userId: string, password: string): Promise<UserLoginResponse> {
  const user = await firebaseRequest<FirebaseUser | null>(`/users/${userId}.json`);
  if (!user) {
    throw new Error("User not found");
  }

  const currentPassword = user.password || DEFAULT_USER_PASSWORD;
  if (currentPassword !== password) {
    throw new Error("Invalid credentials");
  }

  return {
    token: `user-${userId}-${Date.now()}`,
    user: toUserProfile(userId, user),
  };
}

export async function askUserAi(input: {
  user: {
    id: string;
    name: string;
    age: number;
    sex: string;
    currentBMI: number;
    category: string;
    height: number;
    weight: number;
    lastUpdated: string;
  };
  history: BMIHistoryEntry[];
  messages: UserAiMessage[];
}) {
  const response = await fetch("/api/user-ai-chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const data = (await response.json().catch(() => ({}))) as { reply?: string; error?: string };
  if (!response.ok) {
    throw new Error(data.error || "AI request failed");
  }

  return { reply: data.reply || "" };
}

export async function getBMIHistory(userId: string) {
  const user = await firebaseRequest<FirebaseUser | null>(`/users/${userId}.json`);
  if (!user) {
    throw new Error("User not found");
  }

  return { history: toBmiHistory(user.measurements) };
}

export async function updateUserProfile(userId: string, data: { name: string; age?: number }) {
  const payload: Record<string, string | number> = {
    fullName: data.name,
    updatedAt: Date.now(),
    updatedAtFormatted: new Date().toLocaleString("en-US", {
      timeZone: "Asia/Manila",
      hour12: false,
    }),
  };

  if (typeof data.age === "number" && Number.isFinite(data.age)) {
    payload.age = data.age;
  }

  await firebaseRequest(`/users/${userId}.json`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const refreshed = await getUserData(userId);
  const { id, name, age, sex, email, status } = refreshed.user;
  return { user: { id, name, age, sex, email, status } };
}

export async function updateUserPassword(userId: string, newPassword: string) {
  if (!newPassword.trim()) {
    throw new Error("Password is required");
  }

  await firebaseRequest(`/users/${userId}.json`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      password: newPassword,
      mustResetPassword: false,
      updatedAt: Date.now(),
      updatedAtFormatted: new Date().toLocaleString("en-US", {
        timeZone: "Asia/Manila",
        hour12: false,
      }),
    }),
  });

  return getUserData(userId);
}

export async function adminUpdateUser(
  userId: string,
  data: { name: string; age: number; sex: "Male" | "Female" | "" },
) {
  await firebaseRequest(`/users/${userId}.json`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fullName: data.name,
      age: data.age,
      sex: data.sex,
      updatedAt: Date.now(),
      updatedAtFormatted: new Date().toLocaleString("en-US", {
        timeZone: "Asia/Manila",
        hour12: false,
      }),
    }),
  });

  const refreshed = await getUserData(userId);
  return refreshed.user;
}

export async function adminDeleteUser(userId: string) {
  await firebaseRequest(`/users/${userId}.json`, {
    method: "DELETE",
  });
}

export async function adminCreateUser(data: {
  id: string;
  name: string;
  age: number;
  sex: "Male" | "Female" | "";
}) {
  const existing = await firebaseRequest<FirebaseUser | null>(`/users/${data.id}.json`);
  if (existing) {
    throw new Error("User ID already exists");
  }

  const now = Date.now();
  await firebaseRequest(`/users/${data.id}.json`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fullName: data.name,
      age: data.age,
      mustResetPassword: true,
      password: DEFAULT_USER_PASSWORD,
      sex: data.sex,
      createdAt: now,
      createdAtFormatted: new Date(now).toLocaleString("en-US", {
        timeZone: "Asia/Manila",
        hour12: false,
      }),
      updatedAt: now,
      updatedAtFormatted: new Date(now).toLocaleString("en-US", {
        timeZone: "Asia/Manila",
        hour12: false,
      }),
      measurements: {},
    }),
  });

  const refreshed = await getUserData(data.id);
  return refreshed.user;
}

export async function getAdminOverview() {
  const users = (await firebaseRequest<FirebaseUsersResponse>("/users.json")) || {};
  const userEntries = Object.entries(users);
  const allMeasurements = userEntries.flatMap(([, user]) =>
    Object.values(user.measurements || {}),
  );
  const today = formatFirebaseDate(Date.now());
  const bmiValues = allMeasurements
    .map((measurement) => Number(measurement.bmi))
    .filter((value) => Number.isFinite(value) && value > 0);

  return {
    totalUsers: userEntries.length,
    measurementsToday: allMeasurements.filter(
      (measurement) => measurement.capturedDate === today,
    ).length,
    activeUsers: userEntries.filter(([, user]) => Object.keys(user.measurements || {}).length > 0)
      .length,
    totalMeasurements: allMeasurements.length,
    avgBmi: bmiValues.length
      ? Number((bmiValues.reduce((sum, value) => sum + value, 0) / bmiValues.length).toFixed(1))
      : 0,
    systemHealth: 100,
  };
}

export async function getAdminUsers() {
  const users = (await firebaseRequest<FirebaseUsersResponse>("/users.json")) || {};
  const rows: AdminUserRow[] = Object.entries(users).map(([id, user]) => {
    const latest = getLastMeasurement(user.measurements);

    return {
      id,
      name: user.fullName || "Unknown User",
      age: Number(user.age || 0),
      sex: user.sex || "",
      email: "",
      status:
        user.measurements && Object.keys(user.measurements).length > 0
          ? "active"
          : "inactive",
      current_bmi: Number(latest?.bmi || 0),
      total_records: Object.keys(user.measurements || {}).length,
      last_measurement: latest?.capturedAt
        ? new Date(latest.capturedAt).toISOString()
        : undefined,
    };
  });

  rows.sort((a, b) => a.id.localeCompare(b.id));
  return { users: rows };
}

export async function getAdminAnalytics(): Promise<AdminAnalyticsData> {
  const users = (await firebaseRequest<FirebaseUsersResponse>("/users.json")) || {};
  const userEntries = Object.entries(users);
  const allMeasurements = userEntries.flatMap(([, user]) =>
    Object.values(user.measurements || {}),
  );
  const now = new Date();
  const today = formatFirebaseDate(now.getTime());
  const bmiValues = allMeasurements
    .map((measurement) => Number(measurement.bmi))
    .filter((value) => Number.isFinite(value) && value > 0);

  const monthBuckets = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    return {
      key,
      month: monthLabel(date),
      users: 0,
      measurements: 0,
    };
  });

  const monthLookup = new Map(monthBuckets.map((bucket) => [bucket.key, bucket]));
  userEntries.forEach(([, user]) => {
    if (typeof user.createdAt === "number") {
      const date = new Date(user.createdAt);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const bucket = monthLookup.get(key);
      if (bucket) {
        bucket.users += 1;
      }
    }

    Object.values(user.measurements || {}).forEach((measurement) => {
      if (typeof measurement.capturedAt === "number") {
        const date = new Date(measurement.capturedAt);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        const bucket = monthLookup.get(key);
        if (bucket) {
          bucket.measurements += 1;
        }
      }
    });
  });

  const dayBuckets = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (6 - index));
    return {
      key: formatFirebaseDate(date.getTime()),
      day: dayLabel(date),
      count: 0,
    };
  });
  const dayLookup = new Map(dayBuckets.map((bucket) => [bucket.key, bucket]));
  allMeasurements.forEach((measurement) => {
    if (typeof measurement.capturedAt === "number") {
      const key = formatFirebaseDate(measurement.capturedAt);
      const bucket = dayLookup.get(key);
      if (bucket) {
        bucket.count += 1;
      }
    }
  });

  const bmiCounters = {
    Underweight: 0,
    Normal: 0,
    Overweight: 0,
    Obese: 0,
  };
  bmiValues.forEach((bmi) => {
    if (bmi < 18.5) bmiCounters.Underweight += 1;
    else if (bmi < 25) bmiCounters.Normal += 1;
    else if (bmi < 30) bmiCounters.Overweight += 1;
    else bmiCounters.Obese += 1;
  });

  const genderCounters = {
    Male: 0,
    Female: 0,
  };
  userEntries.forEach(([, user]) => {
    if (user.sex === "Male") genderCounters.Male += 1;
    if (user.sex === "Female") genderCounters.Female += 1;
  });

  return {
    totalUsers: userEntries.length,
    totalMeasurements: allMeasurements.length,
    avgBmi: bmiValues.length
      ? Number((bmiValues.reduce((sum, value) => sum + value, 0) / bmiValues.length).toFixed(1))
      : 0,
    measurementsToday: allMeasurements.filter(
      (measurement) => measurement.capturedDate === today,
    ).length,
    monthlyUsers: monthBuckets.map(({ month, users: countUsers, measurements }) => ({
      month,
      users: countUsers,
      measurements,
    })),
    dailyMeasurements: dayBuckets.map(({ day, count }) => ({ day, count })),
    bmiDistribution: [
      { name: "Underweight", value: bmiCounters.Underweight, color: "#54acbf" },
      { name: "Normal", value: bmiCounters.Normal, color: "#26658c" },
      { name: "Overweight", value: bmiCounters.Overweight, color: "#023859" },
      { name: "Obese", value: bmiCounters.Obese, color: "#d4183d" },
    ],
    genderDistribution: [
      { name: "Male", value: genderCounters.Male, color: "#54acbf" },
      { name: "Female", value: genderCounters.Female, color: "#26658c" },
    ],
  };
}

export async function getAdminExportRows(filters?: {
  from?: string;
  to?: string;
  search?: string;
}): Promise<AdminExportRow[]> {
  const users = (await firebaseRequest<FirebaseUsersResponse>("/users.json")) || {};
  const from = filters?.from || "";
  const to = filters?.to || "";
  const search = filters?.search?.trim().toLowerCase() || "";

  const rows = Object.entries(users).flatMap(([userId, user]) =>
    sortMeasurements(user.measurements).flatMap((measurement) => {
      if (
        search &&
        !userId.toLowerCase().includes(search) &&
        !(user.fullName || "").toLowerCase().includes(search)
      ) {
        return [];
      }

      const measurementDate = inputDate(measurement.capturedAt);
      if (from && measurementDate && measurementDate < from) {
        return [];
      }
      if (to && measurementDate && measurementDate > to) {
        return [];
      }

      return [
        {
          user_id: userId,
          full_name: user.fullName || "Unknown User",
          age: Number(user.age || 0),
          sex: (user.sex || "") as "Male" | "Female" | "",
          bmi: Number(measurement.bmi || 0),
          category: measurement.category || "",
          weight_kg: Number(measurement.weightKg || 0),
          height_cm: Number(measurement.heightCm || 0),
          captured_at: toIsoDate(measurement.capturedAt, measurement.capturedAtFormatted),
          captured_date: measurement.capturedDate || "",
          captured_time: measurement.capturedTime || "",
          timezone: measurement.capturedTimezone || "",
        },
      ];
    }),
  );

  rows.sort((a, b) => a.captured_at.localeCompare(b.captured_at));
  return rows;
}

export async function getSystemMonitoringData(
  deviceId = "smartbmi-kiosk-1",
): Promise<SystemMonitoringData> {
  const [dashboard, exportRows] = await Promise.all([
    firebaseRequest<FirebaseMonitoringDashboard | null>(
      `/systemMonitoring/${deviceId}/dashboard.json`,
    ),
    getAdminExportRows(),
  ]);

  const recentMeasurements = [...exportRows]
    .sort((a, b) => b.captured_at.localeCompare(a.captured_at))
    .slice(0, 6)
    .map((row) => ({
      time: row.captured_time || new Date(row.captured_at).toLocaleTimeString(),
      userId: row.user_id,
      bmi: row.bmi,
      status: row.bmi > 0 ? "success" as const : "failed" as const,
    }));

  const loadPoints = dashboard?.systemLoad?.points || [];
  const systemLoad = loadPoints.map((point) => ({
    time: point.label || "",
    cpu: Number(point.value || 0),
    memory: Number(point.value || 0),
    network: Number(dashboard?.overview?.network?.value || 0),
  }));

  return {
    title: dashboard?.title || "System Monitoring",
    statusLabel: dashboard?.statusLabel || "Unknown",
    overview: {
      network: Number(dashboard?.overview?.network?.value || 0),
      database: Number(dashboard?.overview?.database?.value || 0),
      serverLoad: Number(dashboard?.overview?.serverLoad?.value || 0),
      uptime: Number(dashboard?.overview?.uptime?.value || 0),
      systemStatus: dashboard?.overview?.systemStatus?.value || "Unknown",
    },
    hardwareStatus: (dashboard?.hardwareStatus || []).map((component) => ({
      id: component.id || component.label || "component",
      label: component.label || "Component",
      status: component.status || "unknown",
      healthPercent: Number(component.healthPercent || 0),
      lastCheckLabel: component.lastCheckLabel || "Unknown",
      detail: component.detail || "",
    })),
    systemLoad,
    recentMeasurements,
    systemAlerts: (dashboard?.systemAlerts || []).map((alert) => ({
      title: alert.title || "Alert",
      message: alert.message || "",
      severity: alert.severity || "info",
      createdAt: alert.createdAt,
    })),
  };
}
