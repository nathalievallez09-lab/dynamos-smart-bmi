import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, User, Activity, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import { adminLogin } from "../api/api-integration";

export function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await adminLogin(username, password);
      localStorage.setItem("adminToken", response.token);
      localStorage.setItem("adminName", response.admin.full_name);
      navigate("/admin/dashboard");
    } catch {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#023859] via-[#26658c] to-[#011c40]" />

        {/* Floating Shapes */}
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-[#54acbf]/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-96 h-96 bg-[#a7ebf2]/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.05]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `linear-gradient(#a7ebf2 1px, transparent 1px), linear-gradient(90deg, #a7ebf2 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>
      </div>

      {/* Login Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#54acbf] rounded-full mb-4">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-white/70">Smart BMI System Administration</p>
          </div>

          {/* Login Card */}
          <Card className="p-8 bg-white/95 backdrop-blur-sm border-[#54acbf]/20 shadow-2xl">
            <form onSubmit={handleLogin} className="space-y-6 relative">
              {/* Username */}
              <div>
                <Label htmlFor="username" className="text-[#026658c]">
                  Username
                </Label>
                <div className="relative mt-2">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#026658c]/50" />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setError("");
                    }}
                    placeholder="Enter admin username"
                    className="pl-10 bg-[#f0f9fa] border-[#54acbf]/30 focus:border-[#54acbf] focus:ring-2 focus:ring-[#54acbf]/50"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password" className="text-[#026658c]">
                  Password
                </Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#026658c]/50" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="Enter password"
                    className="pl-10 pr-20 bg-[#f0f9fa] border-[#54acbf]/30 focus:border-[#54acbf] focus:ring-2 focus:ring-[#54acbf]/50"
                    required
                  />
                  <Button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#026658c]/50 hover:text-[#023859]"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </div>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-sm text-red-600">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full bg-[#54acbf] hover:bg-[#26658c] text-white py-6 text-lg"
              >
                Sign In
              </Button>

            </form>
          </Card>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              ← Back to Home
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
