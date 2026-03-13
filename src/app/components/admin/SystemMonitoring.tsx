import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Wifi,
  Database,
  Cpu,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "../ui/card";
import { getSystemMonitoringData, type SystemMonitoringData } from "../../api/api-integration";

const emptyMonitoring: SystemMonitoringData = {
  title: "System Monitoring",
  statusLabel: "Unknown",
  overview: {
    network: 0,
    database: 0,
    serverLoad: 0,
    uptime: 0,
    systemStatus: "Unknown",
  },
  hardwareStatus: [],
  systemLoad: [],
  recentMeasurements: [],
  systemAlerts: [],
};

export function SystemMonitoring() {
  const [monitoring, setMonitoring] = useState<SystemMonitoringData>(emptyMonitoring);

  useEffect(() => {
    let isMounted = true;
    const loadMonitoring = async () => {
      try {
        const data = await getSystemMonitoringData();
        if (isMounted) {
          setMonitoring(data);
        }
      } catch {
        if (isMounted) {
          setMonitoring(emptyMonitoring);
        }
      }
    };

    loadMonitoring();
    return () => {
      isMounted = false;
    };
  }, []);

  const isOperational = monitoring.statusLabel.toLowerCase() === "operational";

  return (
    <div className="space-y-6">
      <Card className="p-6 glass-card">
        <h2 className="text-2xl font-bold text-[#023859] mb-6">{monitoring.title}</h2>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-gradient-to-br from-[#26658c] to-[#54acbf] rounded-lg text-white">
            <div className="flex items-center justify-between mb-2">
              <Activity className="w-6 h-6" />
              {isOperational ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            </div>
            <p className="text-sm opacity-90">System Status</p>
            <p className="text-2xl font-bold">{monitoring.statusLabel}</p>
          </div>

          <div className="p-4 bg-[#a7ebf2]/10 rounded-lg border border-[#54acbf]/20">
            <div className="flex items-center justify-between mb-2">
              <Wifi className="w-6 h-6 text-[#54acbf]" />
            </div>
            <p className="text-sm text-[#026658c]/70">Network</p>
            <p className="text-2xl font-bold text-[#023859]">{monitoring.overview.network}%</p>
            <p className="text-xs text-[#026658c]/60 mt-1">Uptime</p>
          </div>

          <div className="p-4 bg-[#a7ebf2]/10 rounded-lg border border-[#54acbf]/20">
            <div className="flex items-center justify-between mb-2">
              <Database className="w-6 h-6 text-[#26658c]" />
            </div>
            <p className="text-sm text-[#026658c]/70">Database</p>
            <p className="text-2xl font-bold text-[#023859]">{monitoring.overview.database} ms</p>
            <p className="text-xs text-[#026658c]/60 mt-1">Avg Response</p>
          </div>

          <div className="p-4 bg-[#a7ebf2]/10 rounded-lg border border-[#54acbf]/20">
            <div className="flex items-center justify-between mb-2">
              <Cpu className="w-6 h-6 text-[#023859]" />
            </div>
            <p className="text-sm text-[#026658c]/70">Server Load</p>
            <p className="text-2xl font-bold text-[#023859]">{monitoring.overview.serverLoad}%</p>
            <p className="text-xs text-[#026658c]/60 mt-1">Current</p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-[#023859] mb-4">Hardware Status</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {monitoring.hardwareStatus.map((component) => (
              <div
                key={component.id}
                className="p-4 bg-[#f0f9fa] rounded-lg border border-[#54acbf]/20"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-[#023859]">{component.label}</p>
                    <p className="text-xs text-[#026658c]/70 mt-1">
                      Last check: {component.lastCheckLabel}
                    </p>
                  </div>
                  {component.status === "ok" ? (
                    <CheckCircle2 className="w-5 h-5 text-[#26658c]" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                  )}
                </div>
                <p className="text-xs text-[#026658c]/70 mb-3">{component.detail}</p>
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      component.status === "ok"
                        ? "bg-[#26658c]/20 text-[#26658c]"
                        : "bg-orange-100 text-orange-600"
                    }`}
                  >
                    {component.status}
                  </span>
                  <span className="text-sm font-semibold text-[#023859]">
                    {component.healthPercent}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-[#023859] mb-4">System Load (Last 6 Hours)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monitoring.systemLoad}>
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
              <Line type="monotone" dataKey="cpu" stroke="#54acbf" strokeWidth={2} name="CPU %" />
              <Line type="monotone" dataKey="memory" stroke="#26658c" strokeWidth={2} name="Memory %" />
              <Line type="monotone" dataKey="network" stroke="#023859" strokeWidth={2} name="Network %" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[#023859] mb-4">
            Recent Measurements Activity
          </h3>
          <div className="space-y-2">
            {monitoring.recentMeasurements.map((measurement, index) => (
              <div
                key={`${measurement.userId}-${measurement.time}-${index}`}
                className="flex items-center justify-between p-3 bg-[#a7ebf2]/5 rounded-lg border border-[#54acbf]/10"
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm font-mono text-[#026658c]/70">{measurement.time}</span>
                  <span className="text-sm font-medium text-[#023859]">User ID: {measurement.userId}</span>
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

      <Card className="p-6 glass-card">
        <h3 className="text-lg font-semibold text-[#023859] mb-4">System Alerts</h3>
        <div className="space-y-3">
          {monitoring.systemAlerts.map((alert) => (
            <div
              key={`${alert.title}-${alert.createdAt}`}
              className={`flex items-start gap-3 p-4 rounded-lg border ${
                alert.severity === "info"
                  ? "bg-[#26658c]/10 border-[#26658c]/20"
                  : "bg-orange-50 border-orange-200"
              }`}
            >
              {alert.severity === "info" ? (
                <CheckCircle2 className="w-5 h-5 text-[#26658c] mt-0.5 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              )}
              <div>
                <p
                  className={`font-semibold ${
                    alert.severity === "info" ? "text-[#023859]" : "text-orange-900"
                  }`}
                >
                  {alert.title}
                </p>
                <p
                  className={`text-sm mt-1 ${
                    alert.severity === "info" ? "text-[#026658c]/80" : "text-orange-700"
                  }`}
                >
                  {alert.message}
                </p>
                <p
                  className={`text-xs mt-2 ${
                    alert.severity === "info" ? "text-[#026658c]/60" : "text-orange-600"
                  }`}
                >
                  {alert.createdAt ? new Date(alert.createdAt).toLocaleString() : "-"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
