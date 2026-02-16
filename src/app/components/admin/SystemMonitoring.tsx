import { Card } from "../ui/card";
import { Activity, AlertTriangle, CheckCircle2, Wifi, Database, Cpu } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Mock system data
const hardwareStatus = [
  { name: "Raspberry Pi", status: "online", uptime: "99.8%", lastCheck: "2 min ago" },
  { name: "Arduino Uno", status: "online", uptime: "99.5%", lastCheck: "1 min ago" },
  { name: "ToF Sensor", status: "online", uptime: "98.9%", lastCheck: "30 sec ago" },
  { name: "Load Cell", status: "online", uptime: "99.2%", lastCheck: "45 sec ago" },
  { name: "Camera Module", status: "online", uptime: "97.5%", lastCheck: "1 min ago" },
  { name: "OLED Display", status: "warning", uptime: "95.2%", lastCheck: "5 min ago" },
];

const recentMeasurements = [
  { time: "14:30", userId: "12345", bmi: 23.5, status: "success" },
  { time: "14:25", userId: "12346", bmi: 21.2, status: "success" },
  { time: "14:20", userId: "12347", bmi: 26.8, status: "success" },
  { time: "14:15", userId: "12348", bmi: 19.5, status: "success" },
  { time: "14:10", userId: "12349", bmi: 28.3, status: "success" },
  { time: "14:05", userId: "12350", bmi: 22.1, status: "failed" },
];

const systemLoad = [
  { time: "10:00", cpu: 45, memory: 62, network: 35 },
  { time: "11:00", cpu: 52, memory: 65, network: 42 },
  { time: "12:00", cpu: 48, memory: 68, network: 38 },
  { time: "13:00", cpu: 55, memory: 70, network: 45 },
  { time: "14:00", cpu: 60, memory: 72, network: 50 },
  { time: "15:00", cpu: 58, memory: 69, network: 48 },
];

export function SystemMonitoring() {
  return (
    <div className="space-y-6">
      <Card className="p-6 border-[#54acbf]/20">
        <h2 className="text-2xl font-bold text-[#023859] mb-6">System Monitoring</h2>

        {/* System Health Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-gradient-to-br from-[#26658c] to-[#54acbf] rounded-lg text-white">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-6 h-6" />
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="text-sm opacity-90">System Status</p>
            <p className="text-2xl font-bold">Operational</p>
          </div>

          <div className="p-4 bg-[#a7ebf2]/10 rounded-lg border border-[#54acbf]/20">
            <div className="flex items-center justify-between mb-2">
              <Wifi className="w-6 h-6 text-[#54acbf]" />
            </div>
            <p className="text-sm text-[#026658c]/70">Network</p>
            <p className="text-2xl font-bold text-[#023859]">98.5%</p>
            <p className="text-xs text-[#026658c]/60 mt-1">Uptime</p>
          </div>

          <div className="p-4 bg-[#a7ebf2]/10 rounded-lg border border-[#54acbf]/20">
            <div className="flex items-center justify-between mb-2">
              <Database className="w-6 h-6 text-[#26658c]" />
            </div>
            <p className="text-sm text-[#026658c]/70">Database</p>
            <p className="text-2xl font-bold text-[#023859]">45 ms</p>
            <p className="text-xs text-[#026658c]/60 mt-1">Avg Response</p>
          </div>

          <div className="p-4 bg-[#a7ebf2]/10 rounded-lg border border-[#54acbf]/20">
            <div className="flex items-center justify-between mb-2">
              <Cpu className="w-6 h-6 text-[#023859]" />
            </div>
            <p className="text-sm text-[#026658c]/70">Server Load</p>
            <p className="text-2xl font-bold text-[#023859]">58%</p>
            <p className="text-xs text-[#026658c]/60 mt-1">Current</p>
          </div>
        </div>

        {/* Hardware Components Status */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-[#023859] mb-4">Hardware Status</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hardwareStatus.map((component) => (
              <div
                key={component.name}
                className="p-4 bg-[#f0f9fa] rounded-lg border border-[#54acbf]/20"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-[#023859]">{component.name}</p>
                    <p className="text-xs text-[#026658c]/70 mt-1">
                      Last check: {component.lastCheck}
                    </p>
                  </div>
                  {component.status === "online" ? (
                    <CheckCircle2 className="w-5 h-5 text-[#26658c]" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      component.status === "online"
                        ? "bg-[#26658c]/20 text-[#26658c]"
                        : "bg-orange-100 text-orange-600"
                    }`}
                  >
                    {component.status}
                  </span>
                  <span className="text-sm font-semibold text-[#023859]">
                    {component.uptime}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Load Chart */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-[#023859] mb-4">System Load (Last 6 Hours)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={systemLoad}>
              <CartesianGrid strokeDasharray="3 3" stroke="#54acbf20" />
              <XAxis dataKey="time" stroke="#026658c" />
              <YAxis stroke="#026658c" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #54acbf40",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="cpu"
                stroke="#54acbf"
                strokeWidth={2}
                name="CPU %"
              />
              <Line
                type="monotone"
                dataKey="memory"
                stroke="#26658c"
                strokeWidth={2}
                name="Memory %"
              />
              <Line
                type="monotone"
                dataKey="network"
                stroke="#023859"
                strokeWidth={2}
                name="Network %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Measurements */}
        <div>
          <h3 className="text-lg font-semibold text-[#023859] mb-4">
            Recent Measurements Activity
          </h3>
          <div className="space-y-2">
            {recentMeasurements.map((measurement, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-[#a7ebf2]/5 rounded-lg border border-[#54acbf]/10"
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm font-mono text-[#026658c]/70">
                    {measurement.time}
                  </span>
                  <span className="text-sm font-medium text-[#023859]">
                    User ID: {measurement.userId}
                  </span>
                  <span className="text-sm text-[#026658c]">
                    BMI: <span className="font-semibold">{measurement.bmi}</span>
                  </span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    measurement.status === "success"
                      ? "bg-[#26658c]/20 text-[#26658c]"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {measurement.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* System Alerts */}
      <Card className="p-6 border-[#54acbf]/20">
        <h3 className="text-lg font-semibold text-[#023859] mb-4">System Alerts</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-orange-900">OLED Display Warning</p>
              <p className="text-sm text-orange-700 mt-1">
                Display response time is higher than normal. Consider checking connections.
              </p>
              <p className="text-xs text-orange-600 mt-2">5 minutes ago</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-[#26658c]/10 border border-[#26658c]/20 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-[#26658c] mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-[#023859]">System Backup Completed</p>
              <p className="text-sm text-[#026658c]/80 mt-1">
                Automated backup of all user data completed successfully.
              </p>
              <p className="text-xs text-[#026658c]/60 mt-2">1 hour ago</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
