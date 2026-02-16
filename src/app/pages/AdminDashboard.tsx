import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Activity,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { UserManagement } from "../components/admin/UserManagement";
import { SystemMonitoring } from "../components/admin/SystemMonitoring";
import { AdminAnalytics } from "../components/admin/AdminAnalytics";
import { getAdminOverview, getAdminUsers } from "../api/api-integration";

export function AdminDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [adminName, setAdminName] = useState("Administrator");
  const [stats, setStats] = useState([
    { label: "Total Users", value: "82", change: "+9%", color: "#54acbf" },
    { label: "Measurements Today", value: "28", change: "+12%", color: "#26658c" },
    { label: "Active Sessions", value: "5", change: "Live", color: "#023859" },
    { label: "System Health", value: "98.5%", change: "Excellent", color: "#26658c" },
  ]);
  const [users, setUsers] = useState<
    Array<{
      id: string;
      name: string;
      age: number;
      sex: string;
      email: string;
      lastMeasurement?: string;
      totalRecords: number;
      currentBMI: number;
      status: "active" | "inactive";
    }>
  >([]);

  useEffect(() => {
    // Check if admin is authenticated
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
    }
    const storedName = localStorage.getItem("adminName");
    if (storedName) {
      setAdminName(storedName);
    }
  }, [navigate]);

  useEffect(() => {
    let isMounted = true;
    const loadAdminData = async () => {
      try {
        const [overview, userList] = await Promise.all([
          getAdminOverview(),
          getAdminUsers(),
        ]);
        if (!isMounted) return;

        setStats([
          {
            label: "Total Users",
            value: String(overview.totalUsers),
            change: `${overview.activeUsers} active`,
            color: "#54acbf",
          },
          {
            label: "Measurements Today",
            value: String(overview.measurementsToday),
            change: `${overview.totalMeasurements} total`,
            color: "#26658c",
          },
          {
            label: "Avg. BMI",
            value: String(overview.avgBmi),
            change: "Live",
            color: "#023859",
          },
          {
            label: "System Health",
            value: `${overview.systemHealth}%`,
            change: "Excellent",
            color: "#26658c",
          },
        ]);

        setUsers(
          userList.users.map((item) => ({
            id: item.id,
            name: item.name,
            age: item.age,
            sex: item.sex,
            email: item.email,
            lastMeasurement: item.last_measurement,
            totalRecords: Number(item.total_records),
            currentBMI: Number(item.current_bmi),
            status: item.status,
          })),
        );
      } catch {
        // Keep static cards as fallback.
      }
    };

    loadAdminData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#a7ebf2]/20 via-white to-[#54acbf]/10" />
        
        <motion.div
          className="absolute top-20 right-20 w-64 h-64 bg-[#a7ebf2]/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="h-full w-full" style={{
            backgroundImage: `linear-gradient(#023859 1px, transparent 1px), linear-gradient(90deg, #023859 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
      </div>

      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#023859]/95 backdrop-blur-md shadow-lg">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-white hover:bg-white/10 lg:hidden"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <Activity className="w-8 h-8 text-[#54acbf]" />
            <div>
              <h1 className="text-xl font-semibold text-white">Admin Dashboard</h1>
              <p className="text-sm text-white/70">Smart BMI System Management</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm text-white/90 font-medium">{adminName}</p>
              <p className="text-xs text-white/60">admin@mpc.edu.ph</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-white hover:bg-white/10 hover:text-white"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-6">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: isSidebarOpen ? 1 : 0,
                x: isSidebarOpen ? 0 : -20,
                display: isSidebarOpen ? "block" : "none"
              }}
              transition={{ duration: 0.3 }}
              className={`w-64 flex-shrink-0 ${isSidebarOpen ? 'block' : 'hidden'} lg:block`}
            >
              <Card className="p-6 bg-white sticky top-28 border-[#54acbf]/20">
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveSection("overview")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeSection === "overview"
                        ? "bg-[#54acbf] text-white"
                        : "hover:bg-[#a7ebf2]/20 text-[#026658c]"
                    }`}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span className="font-medium">Overview</span>
                  </button>

                  <button
                    onClick={() => setActiveSection("users")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeSection === "users"
                        ? "bg-[#54acbf] text-white"
                        : "hover:bg-[#a7ebf2]/20 text-[#026658c]"
                    }`}
                  >
                    <Users className="w-5 h-5" />
                    <span className="font-medium">Users</span>
                  </button>

                  <button
                    onClick={() => setActiveSection("monitoring")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeSection === "monitoring"
                        ? "bg-[#54acbf] text-white"
                        : "hover:bg-[#a7ebf2]/20 text-[#026658c]"
                    }`}
                  >
                    <Activity className="w-5 h-5" />
                    <span className="font-medium">Monitoring</span>
                  </button>

                  <button
                    onClick={() => setActiveSection("analytics")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeSection === "analytics"
                        ? "bg-[#54acbf] text-white"
                        : "hover:bg-[#a7ebf2]/20 text-[#026658c]"
                    }`}
                  >
                    <BarChart3 className="w-5 h-5" />
                    <span className="font-medium">Analytics</span>
                  </button>

                  <button
                    onClick={() => setActiveSection("settings")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeSection === "settings"
                        ? "bg-[#54acbf] text-white"
                        : "hover:bg-[#a7ebf2]/20 text-[#026658c]"
                    }`}
                  >
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Settings</span>
                  </button>
                </nav>

                <div className="mt-8 pt-8 border-t border-[#54acbf]/20">
                  <h3 className="text-sm font-semibold text-[#026658c] mb-4">
                    Quick Actions
                  </h3>
                  <Button
                    onClick={() => navigate("/")}
                    variant="outline"
                    className="w-full border-[#54acbf] text-[#54acbf] hover:bg-[#54acbf] hover:text-white"
                  >
                    View User Site
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {activeSection === "overview" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  {/* Welcome Header */}
                  <Card className="p-6 bg-gradient-to-r from-[#023859] to-[#26658c] text-white">
                    <h2 className="text-2xl font-bold mb-2">
                      Welcome to Admin Dashboard
                    </h2>
                    <p className="text-white/80">
                      Monitor and manage the Smart BMI System
                    </p>
                  </Card>

                  {/* Stats Grid */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card className="p-6 border-[#54acbf]/20 hover:shadow-lg transition-shadow">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <p className="text-sm text-[#026658c]/70 mb-1">
                                {stat.label}
                              </p>
                              <p className="text-3xl font-bold text-[#023859]">
                                {stat.value}
                              </p>
                            </div>
                            <div
                              className="p-3 rounded-lg"
                              style={{ backgroundColor: `${stat.color}20` }}
                            >
                              <Activity
                                className="w-6 h-6"
                                style={{ color: stat.color }}
                              />
                            </div>
                          </div>
                          <p
                            className="text-sm font-medium"
                            style={{ color: stat.color }}
                          >
                            {stat.change}
                          </p>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  {/* Quick Overview Sections */}
                  <div className="grid lg:grid-cols-2 gap-6">
                    <Card className="p-6 border-[#54acbf]/20">
                      <h3 className="text-lg font-semibold text-[#023859] mb-4">
                        Recent Activity
                      </h3>
                      <div className="space-y-3">
                        {[
                          { time: "2 min ago", action: "New user registered", user: "User #12350" },
                          { time: "5 min ago", action: "BMI measurement completed", user: "User #12345" },
                          { time: "10 min ago", action: "System backup completed", user: "System" },
                          { time: "15 min ago", action: "Profile updated", user: "User #12346" },
                        ].map((activity, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 bg-[#a7ebf2]/10 rounded-lg"
                          >
                            <div className="w-2 h-2 bg-[#54acbf] rounded-full mt-2" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-[#023859]">
                                {activity.action}
                              </p>
                              <p className="text-xs text-[#026658c]/70 mt-1">
                                {activity.user} • {activity.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card className="p-6 border-[#54acbf]/20">
                      <h3 className="text-lg font-semibold text-[#023859] mb-4">
                        System Status
                      </h3>
                      <div className="space-y-4">
                        {[
                          { component: "Raspberry Pi", status: "Online", uptime: "99.8%" },
                          { component: "Arduino Uno", status: "Online", uptime: "99.5%" },
                          { component: "Database", status: "Healthy", uptime: "100%" },
                          { component: "API Server", status: "Online", uptime: "99.2%" },
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-[#f0f9fa] rounded-lg"
                          >
                            <div>
                              <p className="text-sm font-medium text-[#023859]">
                                {item.component}
                              </p>
                              <p className="text-xs text-[#026658c]/70 mt-1">
                                Uptime: {item.uptime}
                              </p>
                            </div>
                            <span className="px-3 py-1 bg-[#26658c]/20 text-[#26658c] rounded-full text-xs font-medium">
                              {item.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </motion.div>
              )}

              {activeSection === "users" && <UserManagement users={users} />}
              {activeSection === "monitoring" && <SystemMonitoring />}
              {activeSection === "analytics" && <AdminAnalytics />}

              {activeSection === "settings" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="p-8 border-[#54acbf]/20">
                    <h2 className="text-2xl font-bold text-[#023859] mb-6">
                      System Settings
                    </h2>
                    <p className="text-[#026658c]">
                      Settings configuration panel coming soon...
                    </p>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
