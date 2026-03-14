import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  Activity,
  TrendingUp,
  Calendar,
  Download,
  LogOut,
  Edit2,
  Save,
  X,
  Heart,
  Scale,
  Ruler,
  AlertCircle,
} from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { BMIGauge } from "../components/BMIGauge";
import { BMIHistoryChart } from "../components/BMIHistoryChart";
import { BMIAnalytics } from "../components/BMIAnalytics";
import { HealthTips } from "../components/HealthTips";
import {
  getBMIHistory,
  getUserData,
  updateUserPassword,
  updateUserProfile,
} from "../api/api-integration";

const emptyUserData = {
  id: "",
  name: "",
  age: 0,
  sex: "",
  currentBMI: 0,
  height: 0,
  weight: 0,
  lastUpdated: "",
  mustResetPassword: false,
  history: [] as Array<{ date: string; bmi: number; weight: number; height: number }>,
};

// --- Animated Background Component ---
function DashboardBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#a7ebf2]/20 via-white to-[#54acbf]/10" />
      <motion.div
        className="absolute top-20 right-20 w-64 h-64 bg-[#a7ebf2]/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-40 left-20 w-96 h-96 bg-[#54acbf]/15 rounded-full blur-3xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(#023859 1px, transparent 1px), linear-gradient(90deg, #023859 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>
    </div>
  );
}

export function Dashboard() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("overview");
  const [userData, setUserData] = useState(emptyUserData);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedName, setEditedName] = useState(userData.name);
  const [editedAge, setEditedAge] = useState(String(userData.age || ""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isDownloadingCopy, setIsDownloadingCopy] = useState(false);

  useEffect(() => {
    const sessionUserId = localStorage.getItem("userId");
    const sessionToken = localStorage.getItem("userToken");
    if (!userId || !sessionToken || sessionUserId !== userId) {
      navigate("/");
      return;
    }

    let isMounted = true;
    const loadUserData = async () => {
      setIsLoading(true);
      setLoadError("");
      try {
        const [userResponse, historyResponse] = await Promise.all([
          getUserData(userId),
          getBMIHistory(userId),
        ]);

        if (!isMounted) return;
        const user = userResponse.user;
        const history = historyResponse.history || [];

        setUserData({
          id: user.id,
          name: user.name,
          age: user.age,
          sex: user.sex,
          currentBMI: Number(user.current_bmi),
          height: Number(user.height),
          weight: Number(user.weight),
          lastUpdated: user.last_updated || new Date().toISOString(),
          mustResetPassword: Boolean(user.must_reset_password),
          history: history.map((item) => ({
            date: item.date,
            bmi: Number(item.bmi),
            weight: Number(item.weight),
            height: Number(item.height),
          })),
        });
      } catch (error) {
        if (!isMounted) return;
        const message =
          error instanceof Error ? error.message : "Unable to load user data.";
        setLoadError(message.toLowerCase().includes("not found")
          ? "User ID not found in database."
          : "Unable to load user data from the database.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadUserData();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  useEffect(() => {
    setEditedName(userData.name);
    setEditedAge(userData.age ? String(userData.age) : "");
  }, [userData.name, userData.age]);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const handleResetPassword = async () => {
    if (!userId) return;
    if (!newPassword.trim()) {
      setPasswordError("Please enter a new password.");
      return;
    }
    if (newPassword.length < 5) {
      setPasswordError("Password must be at least 5 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setIsUpdatingPassword(true);
    setPasswordError("");
    try {
      const refreshed = await updateUserPassword(userId, newPassword);
      setUserData((current) => ({
        ...current,
        name: refreshed.user.name,
        age: refreshed.user.age,
        mustResetPassword: Boolean(refreshed.user.must_reset_password),
      }));
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : "Failed to update password.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleSaveProfile = async () => {
    const parsedAge = Number(editedAge);
    if (!editedName.trim()) {
      return;
    }

    if (!Number.isInteger(parsedAge) || parsedAge <= 0) {
      return;
    }

    try {
      if (userId) {
        await updateUserProfile(userId, { name: editedName.trim(), age: parsedAge });
      }
    } catch {
      // Keep UI usable even if API update fails.
    } finally {
      setUserData({ ...userData, name: editedName.trim(), age: parsedAge });
      setIsEditingProfile(false);
    }
  };

  const handleDownloadCopy = () => {
    if (!userData.history.length) {
      return;
    }

    setIsDownloadingCopy(true);
    try {
      const header = ["Date", "BMI", "Weight (kg)", "Height (cm)"];
      const rows = userData.history.map((record) => [
        new Date(record.date).toLocaleDateString(),
        record.bmi,
        record.weight,
        record.height,
      ]);
      const escapeCell = (value: string | number) => `"${String(value).replace(/"/g, "\"\"")}"`;
      const content = [header, ...rows]
        .map((row) => row.map((cell) => escapeCell(cell)).join(","))
        .join("\n");

      const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `bmi-history-${userData.id}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloadingCopy(false);
    }
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: "Underweight", color: "#54acbf" };
    if (bmi < 25) return { label: "Normal", color: "#26658c" };
    if (bmi < 30) return { label: "Overweight", color: "#023859" };
    return { label: "Obese", color: "#d4183d" };
  };

  const category = getBMICategory(userData.currentBMI);

  return (
    <div className="min-h-screen relative overflow-hidden tech-surface">
      <DashboardBackground />
      {isLoading && (
        <div className="fixed top-24 right-6 z-50 rounded-md bg-[#023859] px-3 py-2 text-sm text-white">
          Loading user data...
        </div>
      )}

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#023859]/90 backdrop-blur-xl shadow-[0_12px_30px_rgba(2,56,89,0.35)]">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-[#54acbf]" />
            <div>
              <h1 className="text-xl font-semibold text-white">Smart BMI Dashboard</h1>
              <p className="text-sm text-white/70">User ID: {userId}</p>
            </div>
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
      </nav>

      {/* Main Layout */}
      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl mx-auto">
        {loadError && (
          <Card className="mb-6 p-6 border-red-200 bg-red-50">
            <h2 className="text-xl font-semibold text-red-700">Dashboard Unavailable</h2>
            <p className="mt-2 text-red-600">{loadError}</p>
            <Button
              onClick={() => navigate("/")}
              className="mt-4 bg-[#023859] hover:bg-[#26658c] text-white"
            >
              Back to Home
            </Button>
          </Card>
        )}

        {!loadError && (
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <Card className="p-6 glass-card sticky top-28">
              <nav className="space-y-2">
                {[
                  { id: "overview", icon: <Activity className="w-5 h-5" />, label: "Overview" },
                  { id: "profile", icon: <User className="w-5 h-5" />, label: "Profile" },
                  { id: "analytics", icon: <TrendingUp className="w-5 h-5" />, label: "Analytics" },
                  { id: "history", icon: <Calendar className="w-5 h-5" />, label: "History" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSection(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeSection === tab.id
                        ? "bg-[#54acbf] text-white"
                        : "hover:bg-[#a7ebf2]/20 text-[#026658c]"
                    }`}
                  >
                    {tab.icon} <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>

              {/* Quick Stats */}
              <div className="mt-8 pt-8 border-t border-[#54acbf]/20">
                <h3 className="text-sm font-semibold text-[#026658c] mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#026658c]/70">Total Records</span>
                    <span className="font-semibold text-[#023859]">{userData.history.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#026658c]/70">Last Check</span>
                    <span className="font-semibold text-[#023859]">
                      {new Date(userData.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Render Active Section */}
            {activeSection === "overview" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                {userData.mustResetPassword && (
                  <Card className="mb-6 border-amber-200 bg-amber-50 p-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="mt-1 h-5 w-5 text-amber-600" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-amber-900">Security Check</h3>
                        <p className="mt-1 text-sm text-amber-800">
                          If you are still using the default password, reset it now to secure your account.
                        </p>
                        <div className="mt-4 grid gap-3 md:grid-cols-3">
                          <Input
                            type="password"
                            placeholder="New password"
                            value={newPassword}
                            onChange={(e) => {
                              setNewPassword(e.target.value);
                              setPasswordError("");
                            }}
                            className="bg-white"
                          />
                          <Input
                            type="password"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => {
                              setConfirmPassword(e.target.value);
                              setPasswordError("");
                            }}
                            className="bg-white"
                          />
                          <Button
                            onClick={handleResetPassword}
                            disabled={isUpdatingPassword}
                            className="bg-amber-600 text-white hover:bg-amber-700"
                          >
                            {isUpdatingPassword ? "Updating..." : "Reset Password"}
                          </Button>
                        </div>
                        {passwordError && <p className="mt-2 text-sm text-red-600">{passwordError}</p>}
                      </div>
                    </div>
                  </Card>
                )}
                {/* Welcome */}
                <Card className="p-6 bg-gradient-to-r from-[#023859] to-[#26658c] text-white">
                  <h2 className="text-2xl font-bold mb-2">Welcome back, {userData.name}!</h2>
                  <p className="text-white/80">
                    Here's your current health status and BMI information.
                  </p>
                </Card>

                {/* Current BMI */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="p-6 glass-card">
                    <h3 className="text-lg font-semibold text-[#023859] mb-4 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-[#54acbf]" /> Current BMI
                    </h3>
                    <BMIGauge value={userData.currentBMI} />
                    <div className="mt-4 text-center">
                      <p className="text-sm text-[#026658c]/70 mb-1">Category</p>
                      <div
                        className="inline-block px-4 py-2 rounded-full"
                        style={{ backgroundColor: `${category.color}20`, color: category.color }}
                      >
                        <span className="font-semibold">{category.label}</span>
                      </div>
                    </div>
                  </Card>

                  {/* Weight & Height */}
                  <div className="space-y-4">
                    {[
                      { icon: <Scale className="w-6 h-6 text-[#54acbf]" />, label: "Weight", value: `${userData.weight} kg` },
                      { icon: <Ruler className="w-6 h-6 text-[#26658c]" />, label: "Height", value: `${userData.height} cm` },
                    ].map((item, idx) => (
                      <Card key={idx} className="p-6 glass-card">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-3 bg-[#a7ebf2]/20 rounded-lg">{item.icon}</div>
                          <div className="flex-1">
                            <p className="text-sm text-[#026658c]/70">{item.label}</p>
                            <p className="text-2xl font-bold text-[#023859]">{item.value}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* History & Tips */}
                <BMIHistoryChart data={userData.history} />
                <HealthTips category={category.label} />
              </motion.div>
            )}

            {activeSection === "profile" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                {/* Profile Section */}
                <Card className="p-8 glass-card space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-[#023859]">Profile Information</h2>
                    {!isEditingProfile ? (
                      <Button onClick={() => setIsEditingProfile(true)} variant="outline" className="border-[#54acbf] text-[#54acbf] hover:bg-[#54acbf] hover:text-white">
                        <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button onClick={handleSaveProfile} className="bg-[#54acbf] hover:bg-[#26658c] text-white">
                          <Save className="w-4 h-4 mr-2" /> Save
                        </Button>
                        <Button onClick={() => { setIsEditingProfile(false); setEditedName(userData.name); setEditedAge(userData.age ? String(userData.age) : ""); }} variant="outline" className="border-[#d4183d] text-[#d4183d] hover:bg-[#d4183d] hover:text-white">
                          <X className="w-4 h-4 mr-2" /> Cancel
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      { label: "Name", value: userData.name, editable: "name" },
                      { label: "User ID", value: userData.id },
                      { label: "Age", value: `${userData.age} years`, editable: "age" },
                      { label: "Sex", value: userData.sex || "-" },
                      { label: "Current Weight", value: `${userData.weight} kg` },
                      { label: "Current Height", value: `${userData.height} cm` },
                    ].map((field, idx) => (
                      <div key={idx}>
                        <Label className="text-[#026658c]">{field.label}</Label>
                        {field.editable === "name" && isEditingProfile ? (
                          <Input value={editedName} onChange={(e) => setEditedName(e.target.value)} className="mt-2 bg-[#f0f9fa] border-[#54acbf]/30" />
                        ) : field.editable === "age" && isEditingProfile ? (
                          <Input value={editedAge} onChange={(e) => setEditedAge(e.target.value.replace(/\D/g, "").slice(0, 3))} className="mt-2 bg-[#f0f9fa] border-[#54acbf]/30" />
                        ) : (
                          <p className="mt-2 text-lg font-semibold text-[#023859]">{field.value}</p>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-[#54acbf]/20">
                    <Label className="text-[#026658c]">Last Measurement</Label>
                    <p className="mt-2 text-lg font-semibold text-[#023859]">{new Date(userData.lastUpdated).toLocaleString()}</p>
                  </div>

                  <div className="bg-[#a7ebf2]/10 border border-[#54acbf]/20 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-[#54acbf] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-[#023859] mb-1">Data Privacy Notice</p>
                      <p className="text-sm text-[#026658c]/80">
                        Your personal information is stored securely. Only you can access your BMI records using your unique User ID.
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {activeSection === "analytics" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <BMIAnalytics data={userData.history} />
              </motion.div>
            )}

            {activeSection === "history" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card className="p-6 glass-card">
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold text-[#023859]">BMI History Records</h2>
                    <Button
                      onClick={handleDownloadCopy}
                      disabled={isDownloadingCopy || !userData.history.length}
                      className="bg-[#54acbf] hover:bg-[#26658c] text-white"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {isDownloadingCopy ? "Preparing..." : "Get a copy"}
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {userData.history.map((record, idx) => {
                      const cat = getBMICategory(record.bmi);
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-4 bg-[#a7ebf2]/5 rounded-lg border border-[#54acbf]/10 hover:bg-[#a7ebf2]/10 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <p className="text-sm text-[#026658c]/70">Date</p>
                              <p className="font-semibold text-[#023859]">{new Date(record.date).toLocaleDateString()}</p>
                            </div>
                            <div className="h-12 w-px bg-[#54acbf]/20" />
                            <div className="text-center">
                              <p className="text-sm text-[#026658c]/70">BMI</p>
                              <p className="text-xl font-bold text-[#023859]">{record.bmi}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-[#026658c]/70">Weight</p>
                              <p className="font-semibold text-[#023859]">{record.weight} kg</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-[#026658c]/70">Height</p>
                              <p className="font-semibold text-[#023859]">{record.height} cm</p>
                            </div>
                          </div>
                          <div
                            className="px-4 py-2 rounded-full text-sm font-semibold"
                            style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                          >
                            {cat.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
        )}
      </div>

    </div>
  );
}
