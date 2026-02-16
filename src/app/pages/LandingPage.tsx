import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, Heart, Scale, Users, Award, TrendingUp } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { BMIStatistics } from "../components/BMIStatistics";
import { SystemArchitecture } from "../components/SystemArchitecture";
import { Authors } from "../components/Authors";
import { Footer } from "../components/Footer";
import { getUserData } from "../api/api-integration";

// --- Animated Background as a child component ---
function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#a7ebf2]/20 via-white to-[#54acbf]/10" />

      {/* Animated Circles */}
      <motion.div
        className="absolute -top-20 -left-20 w-96 h-96 bg-[#a7ebf2]/30 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/4 -right-32 w-80 h-80 bg-[#54acbf]/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute bottom-20 left-1/3 w-72 h-72 bg-[#26658c]/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Floating Icons */}
      <motion.div
        className="absolute top-32 left-1/4 opacity-10"
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Heart className="w-16 h-16 text-[#54acbf]" />
      </motion.div>
      <motion.div
        className="absolute top-1/2 right-1/4 opacity-10"
        animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <Activity className="w-20 h-20 text-[#26658c]" />
      </motion.div>
      <motion.div
        className="absolute bottom-1/3 left-1/2 opacity-10"
        animate={{ y: [0, -15, 0], rotate: [0, 15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <Scale className="w-12 h-12 text-[#023859]" />
      </motion.div>
    </div>
  );
}

export function LandingPage() {
  const [userId, setUserId] = useState("");
  const [idError, setIdError] = useState("");
  const [isCheckingId, setIsCheckingId] = useState(false);
  const navigate = useNavigate();

  const handleAccessDashboard = async () => {
    if (!(userId.length === 5 && /^\d+$/.test(userId))) {
      setIdError("Please enter a valid 5-digit User ID.");
      return;
    }

    setIdError("");
    setIsCheckingId(true);
    try {
      await getUserData(userId);
      navigate(`/dashboard/${userId}`);
    } catch {
      setIdError("User ID not found in the database.");
    } finally {
      setIsCheckingId(false);
    }
  };

  const handleKeyPress = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      await handleAccessDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <AnimatedBackground />

      {/* Main content */}
      <div className="relative z-10">
        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#023859]/95 backdrop-blur-md shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <Activity className="w-8 h-8 text-[#54acbf]" />
                <span className="text-xl font-semibold text-white">
                  Smart BMI System
                </span>
              </div>
              <div className="hidden md:flex items-center gap-8">
                <a href="#about" className="text-white/90 hover:text-[#a7ebf2] transition-colors">About</a>
                <a href="#system" className="text-white/90 hover:text-[#a7ebf2] transition-colors">System</a>
                <a href="#authors" className="text-white/90 hover:text-[#a7ebf2] transition-colors">Authors</a>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-[#54acbf]/10 px-4 py-2 rounded-full mb-6">
                <Heart className="w-5 h-5 text-[#26658c]" />
                <span className="text-[#026658c] font-medium">Automated Health Monitoring</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-[#011c40] mb-6">
                Know Your Body,<br />
                <span className="text-[#26658c]">Know Your Health</span>
              </h1>

              <p className="text-xl text-[#023859]/80 mb-12 max-w-2xl mx-auto">
                Advanced BMI calculation system with facial recognition, real-time measurements,
                and comprehensive health analytics for students and faculty.
              </p>

              <Card className="max-w-md mx-auto p-8 bg-white shadow-xl border-[#54acbf]/20">
                <div className="flex items-center gap-3 mb-6">
                  <Users className="w-6 h-6 text-[#54acbf]" />
                  <h3 className="text-xl font-semibold text-[#023859]">Access Your Dashboard</h3>
                </div>
                <p className="text-[#026658c]/70 mb-4 text-sm">
                  Enter your 5-digit User ID to view your BMI records and analytics
                </p>
                <div className="flex gap-3">
                  <Input
                    type="text"
                    placeholder="Enter 5-digit ID"
                    value={userId}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 5);
                      setUserId(value);
                      setIdError("");
                    }}
                    onKeyPress={handleKeyPress}
                    className="text-center text-lg tracking-widest bg-[#f0f9fa] border-[#54acbf]/30 focus:border-[#54acbf]"
                    maxLength={5}
                  />
                  <Button
                    onClick={handleAccessDashboard}
                    disabled={isCheckingId}
                    className="bg-[#54acbf] hover:bg-[#26658c] text-white transition-all duration-300 shadow-lg hover:shadow-xl px-8"
                  >
                    {isCheckingId ? "Checking..." : "Access"}
                  </Button>
                </div>
                {idError && (
                  <p className="mt-3 text-sm text-red-600 text-left">{idError}</p>
                )}
              </Card>
            </motion.div>
          </div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative z-10 max-w-6xl mx-auto mt-20 grid md:grid-cols-3 gap-6 px-4"
          >
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-[#54acbf]/20 hover:shadow-lg transition-shadow">
              <Scale className="w-12 h-12 text-[#54acbf] mb-4" />
              <h3 className="text-lg font-semibold text-[#023859] mb-2">Accurate Measurements</h3>
              <p className="text-[#026658c]/70 text-sm">
                Advanced ToF sensors and load cells ensure precise height and weight readings
              </p>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm border-[#54acbf]/20 hover:shadow-lg transition-shadow">
              <Award className="w-12 h-12 text-[#26658c] mb-4" />
              <h3 className="text-lg font-semibold text-[#023859] mb-2">Facial Recognition</h3>
              <p className="text-[#026658c]/70 text-sm">
                Secure user authentication with Raspberry Pi Camera Module v3
              </p>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-sm border-[#54acbf]/20 hover:shadow-lg transition-shadow">
              <TrendingUp className="w-12 h-12 text-[#023859] mb-4" />
              <h3 className="text-lg font-semibold text-[#023859] mb-2">Real-Time Analytics</h3>
              <p className="text-[#026658c]/70 text-sm">
                Track your BMI trends and receive personalized health insights
              </p>
            </Card>
          </motion.div>
        </section>

        {/* About / System / Authors */}
        <BMIStatistics />
        <SystemArchitecture />
        <Authors />
        <Footer />
      </div>
    </div>
  );
}
