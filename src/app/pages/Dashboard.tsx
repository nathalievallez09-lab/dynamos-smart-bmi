import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  Activity,
  TrendingUp,
  Calendar,
  Download,
  FileText,
  LogOut,
  Edit2,
  Save,
  X,
  Trash2,
  Heart,
  Scale,
  Ruler,
  AlertCircle,
  Eye,
  EyeOff,
  Settings,
  ShieldCheck,
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
  deleteBMIHistoryEntry,
  getBMIHistory,
  getUserData,
  updateUserPassword,
  updateUserProfile,
} from "../api/api-integration";
import { generateBMICertificate } from "../utils/bmiCertificate";

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
  history: [] as Array<{ id: string; date: string; bmi: number; weight: number; height: number }>,
};

type WeightUnit = "kg" | "lb";
type HeightUnit = "cm" | "ft-in";

const kgToLb = (weightKg: number) => weightKg * 2.20462;

const cmToFeetInches = (heightCm: number) => {
  const totalInches = Math.round(heightCm / 2.54);
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return { feet, inches };
};

const formatWeight = (weightKg: number, unit: WeightUnit) => {
  if (!Number.isFinite(weightKg)) return "-";
  return unit === "kg" ? `${weightKg.toFixed(1)} kg` : `${kgToLb(weightKg).toFixed(1)} lb`;
};

const formatHeight = (heightCm: number, unit: HeightUnit) => {
  if (!Number.isFinite(heightCm)) return "-";
  if (unit === "cm") return `${heightCm.toFixed(1)} cm`;

  const { feet, inches } = cmToFeetInches(heightCm);
  return `${feet} ft ${inches} in`;
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
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isDownloadingCopy, setIsDownloadingCopy] = useState(false);
  const [isGeneratingCertificate, setIsGeneratingCertificate] = useState(false);
  const [historyMessage, setHistoryMessage] = useState("");
  const [isDeletingHistoryId, setIsDeletingHistoryId] = useState("");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(() => (
    localStorage.getItem("dashboardWeightUnit") === "lb" ? "lb" : "kg"
  ));
  const [heightUnit, setHeightUnit] = useState<HeightUnit>(() => (
    localStorage.getItem("dashboardHeightUnit") === "ft-in" ? "ft-in" : "cm"
  ));

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
            id: item.id,
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

  useEffect(() => {
    if (userData.mustResetPassword) {
      setActiveSection("settings");
    }
  }, [userData.mustResetPassword]);

  useEffect(() => {
    localStorage.setItem("dashboardWeightUnit", weightUnit);
  }, [weightUnit]);

  useEffect(() => {
    localStorage.setItem("dashboardHeightUnit", heightUnit);
  }, [heightUnit]);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const handleResetPassword = async () => {
    if (!userId) return;
    if (!newPassword.trim()) {
      setPasswordError("Please enter a new password.");
      setPasswordMessage("");
      return;
    }
    if (newPassword.length < 5) {
      setPasswordError("Password must be at least 5 characters.");
      setPasswordMessage("");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      setPasswordMessage("");
      return;
    }

    setIsUpdatingPassword(true);
    setPasswordError("");
    setPasswordMessage("");
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
      setPasswordMessage("Password updated successfully.");
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : "Failed to update password.");
      setPasswordMessage("");
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
      const header = [
        "Date",
        "BMI",
        `Weight (${weightUnit})`,
        `Height (${heightUnit === "cm" ? "cm" : "ft/in"})`,
      ];
      const rows = userData.history.map((record) => [
        new Date(record.date).toLocaleDateString(),
        record.bmi,
        formatWeight(record.weight, weightUnit),
        formatHeight(record.height, heightUnit),
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

  const handleGenerateCertificate = () => {
    if (!userData.history.length) {
      setHistoryMessage("No BMI records available to generate certificate.");
      return;
    }

    setIsGeneratingCertificate(true);
    setHistoryMessage("");

    try {
      generateBMICertificate({
        user: userData,
        weightUnit,
        heightUnit,
        formatWeight,
        formatHeight,
        getBMICategory,
      });
    } finally {
      setIsGeneratingCertificate(false);
    }
  };

  const handleDeleteHistoryRecord = async (entryId: string) => {
    if (!userId) return;

    const confirmed = window.confirm("Delete this BMI history record?");
    if (!confirmed) {
      return;
    }

    setIsDeletingHistoryId(entryId);
    setHistoryMessage("");

    try {
      const refreshed = await deleteBMIHistoryEntry(userId, entryId);
      setUserData((current) => ({
        ...current,
        name: refreshed.user.name,
        age: refreshed.user.age,
        sex: refreshed.user.sex,
        currentBMI: Number(refreshed.user.current_bmi),
        height: Number(refreshed.user.height),
        weight: Number(refreshed.user.weight),
        lastUpdated: refreshed.user.last_updated || current.lastUpdated,
        mustResetPassword: Boolean(refreshed.user.must_reset_password),
        history: refreshed.history.map((item) => ({
          id: item.id,
          date: item.date,
          bmi: Number(item.bmi),
          weight: Number(item.weight),
          height: Number(item.height),
        })),
      }));
      setHistoryMessage("BMI history record deleted.");
    } catch (error) {
      setHistoryMessage(
        error instanceof Error ? error.message : "Failed to delete BMI history record.",
      );
    } finally {
      setIsDeletingHistoryId("");
    }
  };

  const category = getBMICategory(userData.currentBMI);

  const unitToggle = (
    <div className="flex flex-wrap items-center gap-3">
      <div className="rounded-lg border border-[#54acbf]/25 bg-white/80 p-1 shadow-sm">
        <button
          type="button"
          onClick={() => setWeightUnit("kg")}
          className={`min-w-16 rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${
            weightUnit === "kg"
              ? "bg-[#54acbf] text-white"
              : "text-[#026658c] hover:bg-[#a7ebf2]/25"
          }`}
        >
          kg
        </button>
        <button
          type="button"
          onClick={() => setWeightUnit("lb")}
          className={`min-w-16 rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${
            weightUnit === "lb"
              ? "bg-[#54acbf] text-white"
              : "text-[#026658c] hover:bg-[#a7ebf2]/25"
          }`}
        >
          lb
        </button>
      </div>
      <div className="rounded-lg border border-[#54acbf]/25 bg-white/80 p-1 shadow-sm">
        <button
          type="button"
          onClick={() => setHeightUnit("cm")}
          className={`min-w-16 rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${
            heightUnit === "cm"
              ? "bg-[#54acbf] text-white"
              : "text-[#026658c] hover:bg-[#a7ebf2]/25"
          }`}
        >
          cm
        </button>
        <button
          type="button"
          onClick={() => setHeightUnit("ft-in")}
          className={`min-w-16 rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${
            heightUnit === "ft-in"
              ? "bg-[#54acbf] text-white"
              : "text-[#026658c] hover:bg-[#a7ebf2]/25"
          }`}
        >
          ft / in
        </button>
      </div>
    </div>
  );

  const passwordSettingsForm = (
    <div className="rounded-lg border border-[#54acbf]/20 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-lg bg-[#54acbf]/15 p-3">
          <ShieldCheck className="h-5 w-5 text-[#54acbf]" />
        </div>
        <div>
          <p className="font-semibold text-[#023859]">Password Reset</p>
          <p className="text-sm text-[#026658c]/80">
            No old password needed. Enter your new password twice to confirm it.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-[#026658c]">New Password</Label>
          <div className="relative">
            <Input
              type={showNewPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setPasswordError("");
                setPasswordMessage("");
              }}
              className="bg-white pr-12"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((current) => !current)}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md border border-[#54acbf]/30 bg-white text-[#26658c] shadow-sm transition-colors hover:bg-[#a7ebf2]/20 hover:text-[#023859]"
              aria-label={showNewPassword ? "Hide new password" : "Show new password"}
            >
              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-[#026658c]">Confirm New Password</Label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setPasswordError("");
                setPasswordMessage("");
              }}
              className="bg-white pr-12"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((current) => !current)}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md border border-[#54acbf]/30 bg-white text-[#26658c] shadow-sm transition-colors hover:bg-[#a7ebf2]/20 hover:text-[#023859]"
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-[#026658c]/80">
          Use at least 5 characters.
        </p>
        <Button
          onClick={handleResetPassword}
          disabled={isUpdatingPassword}
          className="bg-[#54acbf] text-white hover:bg-[#26658c]"
        >
          {isUpdatingPassword ? "Updating..." : "Save New Password"}
        </Button>
      </div>

      {passwordError && <p className="mt-4 text-sm text-red-600">{passwordError}</p>}
      {passwordMessage && <p className="mt-4 text-sm text-[#26658c]">{passwordMessage}</p>}
    </div>
  );

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
                  { id: "settings", icon: <Settings className="w-5 h-5" />, label: "Settings" },
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
                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          <Button
                            onClick={() => setActiveSection("settings")}
                            className="bg-amber-600 text-white hover:bg-amber-700"
                          >
                            Open Settings
                          </Button>
                          <p className="text-sm text-amber-800">
                            You will be asked to enter your new password twice.
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
                {userData.mustResetPassword && passwordSettingsForm}
                {/* Welcome */}
                <Card className="p-6 bg-gradient-to-r from-[#023859] to-[#26658c] text-white">
                  <h2 className="text-2xl font-bold mb-2">Welcome back, {userData.name}!</h2>
                  <p className="text-white/80">
                    Here's your current health status and BMI information.
                  </p>
                </Card>

                {/* Current BMI */}
                <div className="grid gap-6">
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
                </div>

                {/* Weight & Height */}
                <div className="mt-6 flex flex-col gap-3 rounded-lg border border-[#54acbf]/20 bg-white/70 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-[#023859]">Measurement Units</p>
                    <p className="text-sm text-[#026658c]/70">Choose how weight and height are shown.</p>
                  </div>
                  {unitToggle}
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { icon: <Scale className="w-6 h-6 text-[#54acbf]" />, label: "Weight", value: formatWeight(userData.weight, weightUnit) },
                    { icon: <Ruler className="w-6 h-6 text-[#26658c]" />, label: "Height", value: formatHeight(userData.height, heightUnit) },
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

                {/* History & Tips */}
                <BMIHistoryChart data={userData.history} />
                <HealthTips
                  category={category.label}
                  bmi={userData.currentBMI}
                  history={userData.history}
                />
              </motion.div>
            )}

            {activeSection === "profile" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                {/* Profile Section */}
                <Card className="p-8 glass-card space-y-6">
                  <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
                    <h2 className="text-2xl font-bold text-[#023859]">Profile Information</h2>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      {unitToggle}
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
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      { label: "Name", value: userData.name, editable: "name" },
                      { label: "User ID", value: userData.id },
                      { label: "Age", value: `${userData.age} years`, editable: "age" },
                      { label: "Sex", value: userData.sex || "-" },
                      { label: "Current Weight", value: formatWeight(userData.weight, weightUnit) },
                      { label: "Current Height", value: formatHeight(userData.height, heightUnit) },
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

                  <div className="rounded-lg border border-[#54acbf]/20 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-[#54acbf]/15 p-3">
                          <ShieldCheck className="h-5 w-5 text-[#54acbf]" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#023859]">Password Reset</p>
                          <p className="text-sm text-[#026658c]/80">
                            Change your password here. You only need to enter the new password and confirm it.
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => setActiveSection("settings")}
                        className="bg-[#54acbf] text-white hover:bg-[#26658c]"
                      >
                        Open Password Settings
                      </Button>
                    </div>
                  </div>

                  {passwordSettingsForm}
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
                    <div className="flex flex-wrap items-center justify-end gap-3">
                      {unitToggle}
                      <Button
                        onClick={handleDownloadCopy}
                        disabled={isDownloadingCopy || !userData.history.length}
                        className="bg-[#54acbf] hover:bg-[#26658c] text-white"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        {isDownloadingCopy ? "Preparing..." : "Get a copy"}
                      </Button>
                      <Button
                        onClick={handleGenerateCertificate}
                        disabled={isGeneratingCertificate || !userData.history.length}
                        className="bg-[#023859] hover:bg-[#26658c] text-white"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        {isGeneratingCertificate ? "Generating..." : "Generate BMI Certificate"}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {historyMessage && (
                      <p className="text-sm text-[#26658c]">{historyMessage}</p>
                    )}
                    {userData.history.map((record, idx) => {
                      const cat = getBMICategory(record.bmi);
                      const isDeleting = isDeletingHistoryId === record.id;
                      return (
                        <div
                          key={record.id || idx}
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
                              <p className="font-semibold text-[#023859]">{formatWeight(record.weight, weightUnit)}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-[#026658c]/70">Height</p>
                              <p className="font-semibold text-[#023859]">{formatHeight(record.height, heightUnit)}</p>
                            </div>
                          </div>
                          <div
                            className="flex items-center gap-3"
                          >
                            <div
                              className="px-4 py-2 rounded-full text-sm font-semibold"
                              style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                            >
                              {cat.label}
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => handleDeleteHistoryRecord(record.id)}
                              disabled={isDeleting}
                              className="border-[#d4183d]/30 text-[#d4183d] hover:bg-[#d4183d] hover:text-white"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {isDeleting ? "Deleting..." : "Delete"}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </motion.div>
            )}

            {activeSection === "settings" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card className="p-8 glass-card">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-lg bg-[#54acbf]/15 p-3">
                      <ShieldCheck className="h-6 w-6 text-[#54acbf]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-[#023859]">Security Settings</h2>
                      <p className="text-[#026658c]/70">
                        Update your account password here. Enter the same new password twice to confirm it.
                      </p>
                    </div>
                  </div>

                  <div className="mb-6 grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-[#026658c]">User ID</Label>
                      <Input value={userData.id} disabled className="bg-[#f0f9fa]" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[#026658c]">Password Status</Label>
                      <Input
                        value={userData.mustResetPassword ? "Reset required" : "Password already updated"}
                        disabled
                        className="bg-[#f0f9fa]"
                      />
                    </div>
                  </div>

                  {passwordSettingsForm}
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
