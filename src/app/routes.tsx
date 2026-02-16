import { createBrowserRouter } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { Dashboard } from "./pages/Dashboard";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminDashboard } from "./pages/AdminDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/dashboard/:userId",
    Component: Dashboard,
  },
  {
    path: "/admin/login",
    Component: AdminLogin,
  },
  {
    path: "/admin/dashboard",
    Component: AdminDashboard,
  },
]);
