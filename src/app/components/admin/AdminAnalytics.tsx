import { Card } from "../ui/card";
import { TrendingUp, Users, Activity, Calendar } from "lucide-react";
import type { AdminAnalyticsData } from "../../api/api-integration";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const emptyAnalytics: AdminAnalyticsData = {
  totalUsers: 0,
  totalMeasurements: 0,
  avgBmi: 0,
  measurementsToday: 0,
  monthlyUsers: [],
  dailyMeasurements: [],
  bmiDistribution: [
    { name: "Underweight", value: 0, color: "#54acbf" },
    { name: "Normal", value: 0, color: "#26658c" },
    { name: "Overweight", value: 0, color: "#023859" },
    { name: "Obese", value: 0, color: "#d4183d" },
  ],
  genderDistribution: [
    { name: "Male", value: 0, color: "#54acbf" },
    { name: "Female", value: 0, color: "#26658c" },
  ],
};

export function AdminAnalytics({
  analytics = emptyAnalytics,
}: {
  analytics?: AdminAnalyticsData | null;
}) {
  const data = analytics || emptyAnalytics;
  const averageMeasurementsPerUser = data.totalUsers
    ? (data.totalMeasurements / data.totalUsers).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-6">
      <Card className="p-6 glass-card">
        <h2 className="text-2xl font-bold text-[#023859] mb-6">Analytics & Reports</h2>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-gradient-to-br from-[#54acbf] to-[#26658c] rounded-lg text-white">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-sm opacity-90">Total Users</p>
            <p className="text-3xl font-bold">{data.totalUsers}</p>
            <p className="text-xs opacity-75 mt-1">Live Firebase data</p>
          </div>

          <div className="p-4 bg-[#a7ebf2]/10 rounded-lg border border-[#54acbf]/20">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-6 h-6 text-[#54acbf]" />
            </div>
            <p className="text-sm text-[#026658c]/70">Total Measurements</p>
            <p className="text-3xl font-bold text-[#023859]">{data.totalMeasurements}</p>
            <p className="text-xs text-[#026658c]/60 mt-1">All records</p>
          </div>

          <div className="p-4 bg-[#a7ebf2]/10 rounded-lg border border-[#54acbf]/20">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-6 h-6 text-[#26658c]" />
            </div>
            <p className="text-sm text-[#026658c]/70">Avg. BMI</p>
            <p className="text-3xl font-bold text-[#023859]">{data.avgBmi}</p>
            <p className="text-xs text-[#026658c]/60 mt-1">All users</p>
          </div>

          <div className="p-4 bg-[#a7ebf2]/10 rounded-lg border border-[#54acbf]/20">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-6 h-6 text-[#023859]" />
            </div>
            <p className="text-sm text-[#026658c]/70">Today</p>
            <p className="text-3xl font-bold text-[#023859]">{data.measurementsToday}</p>
            <p className="text-xs text-[#026658c]/60 mt-1">Measurements</p>
          </div>
        </div>

        {/* Growth Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-[#023859] mb-4">
              User Growth & Measurements
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.monthlyUsers}>
                <CartesianGrid strokeDasharray="3 3" stroke="#54acbf20" />
                <XAxis dataKey="month" stroke="#026658c" />
                <YAxis stroke="#026658c" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #54acbf40",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#54acbf"
                  strokeWidth={2}
                  name="Users"
                  dot={{ fill: "#54acbf", r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="measurements"
                  stroke="#26658c"
                  strokeWidth={2}
                  name="Measurements"
                  dot={{ fill: "#26658c", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#023859] mb-4">
              Daily Measurements (This Week)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.dailyMeasurements}>
                <CartesianGrid strokeDasharray="3 3" stroke="#54acbf20" />
                <XAxis dataKey="day" stroke="#026658c" />
                <YAxis stroke="#026658c" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #54acbf40",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" fill="#26658c" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-[#023859] mb-4">
              BMI Category Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.bmiDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.bmiDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {data.bmiDistribution.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-2 p-2 bg-[#a7ebf2]/10 rounded"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-[#026658c]">
                    {item.name}: <span className="font-semibold">{item.value}%</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#023859] mb-4">Gender Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.genderDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.genderDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {data.genderDistribution.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-2 p-2 bg-[#a7ebf2]/10 rounded"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-[#026658c]">
                    {item.name}: <span className="font-semibold">{item.value}%</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Insights & Recommendations */}
      <Card className="p-6 glass-card bg-gradient-to-r from-[#a7ebf2]/15 to-white/80">
        <h3 className="text-lg font-semibold text-[#023859] mb-4">Key Insights</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-[#54acbf]/20">
            <TrendingUp className="w-5 h-5 text-[#26658c] mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-[#023859]">User Growth Trending Upward</p>
              <p className="text-sm text-[#026658c]/80 mt-1">
                User registrations and measurement counts are sourced directly from Firebase for the last six months.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-[#54acbf]/20">
            <Activity className="w-5 h-5 text-[#54acbf] mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-[#023859]">Healthy BMI Majority</p>
              <p className="text-sm text-[#026658c]/80 mt-1">
                Current BMI category totals reflect the latest live records stored for each captured measurement.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-[#54acbf]/20">
            <Users className="w-5 h-5 text-[#023859] mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-[#023859]">Engagement Analysis</p>
              <p className="text-sm text-[#026658c]/80 mt-1">
                Average of {averageMeasurementsPerUser} measurements per user based on the active Firebase dataset.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
