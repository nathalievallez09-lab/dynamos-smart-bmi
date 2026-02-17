import { Card } from "../ui/card";
import { TrendingUp, Users, Activity, Calendar } from "lucide-react";
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

// Mock analytics data
const monthlyUsers = [
  { month: "Sep", users: 45, measurements: 156 },
  { month: "Oct", users: 52, measurements: 189 },
  { month: "Nov", users: 61, measurements: 234 },
  { month: "Dec", users: 68, measurements: 278 },
  { month: "Jan", users: 75, measurements: 312 },
  { month: "Feb", users: 82, measurements: 354 },
];

const bmiDistribution = [
  { name: "Underweight", value: 12, color: "#54acbf" },
  { name: "Normal", value: 58, color: "#26658c" },
  { name: "Overweight", value: 23, color: "#023859" },
  { name: "Obese", value: 7, color: "#d4183d" },
];

const dailyMeasurements = [
  { day: "Mon", count: 18 },
  { day: "Tue", count: 22 },
  { day: "Wed", count: 25 },
  { day: "Thu", count: 20 },
  { day: "Fri", count: 28 },
  { day: "Sat", count: 15 },
  { day: "Sun", count: 12 },
];

const genderDistribution = [
  { name: "Male", value: 55, color: "#54acbf" },
  { name: "Female", value: 45, color: "#26658c" },
];

export function AdminAnalytics() {
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
            <p className="text-3xl font-bold">82</p>
            <p className="text-xs opacity-75 mt-1">+9% from last month</p>
          </div>

          <div className="p-4 bg-[#a7ebf2]/10 rounded-lg border border-[#54acbf]/20">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-6 h-6 text-[#54acbf]" />
            </div>
            <p className="text-sm text-[#026658c]/70">Total Measurements</p>
            <p className="text-3xl font-bold text-[#023859]">354</p>
            <p className="text-xs text-[#026658c]/60 mt-1">This month</p>
          </div>

          <div className="p-4 bg-[#a7ebf2]/10 rounded-lg border border-[#54acbf]/20">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-6 h-6 text-[#26658c]" />
            </div>
            <p className="text-sm text-[#026658c]/70">Avg. BMI</p>
            <p className="text-3xl font-bold text-[#023859]">22.8</p>
            <p className="text-xs text-[#026658c]/60 mt-1">All users</p>
          </div>

          <div className="p-4 bg-[#a7ebf2]/10 rounded-lg border border-[#54acbf]/20">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-6 h-6 text-[#023859]" />
            </div>
            <p className="text-sm text-[#026658c]/70">Today</p>
            <p className="text-3xl font-bold text-[#023859]">28</p>
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
              <LineChart data={monthlyUsers}>
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
              <BarChart data={dailyMeasurements}>
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
                  data={bmiDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {bmiDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {bmiDistribution.map((item) => (
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
                  data={genderDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {genderDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {genderDistribution.map((item) => (
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
                9% increase in active users this month. Friday shows highest measurement activity.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-[#54acbf]/20">
            <Activity className="w-5 h-5 text-[#54acbf] mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-[#023859]">Healthy BMI Majority</p>
              <p className="text-sm text-[#026658c]/80 mt-1">
                58% of users maintain normal BMI levels, indicating positive health awareness.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-[#54acbf]/20">
            <Users className="w-5 h-5 text-[#023859] mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-[#023859]">Engagement Analysis</p>
              <p className="text-sm text-[#026658c]/80 mt-1">
                Average of 4.3 measurements per user. Consider incentive programs for regular tracking.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
