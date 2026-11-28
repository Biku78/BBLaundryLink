import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import CustomerDesign from "../designs/CustomerDesign";
import DesignShell from "../designs/DesignShell";
import AdminDashboard from "./AdminDashboard";

export default function DashboardPage({ preview = false }) {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  if (!token && !preview)
    return <Navigate to="/login" replace state={{ from: location }} />;
  const role = String(user?.Role || user?.role || "").toLowerCase();
  if (role === "admin") return <AdminDashboard />;
  return (
    <DesignShell>
      <CustomerDesign />
    </DesignShell>
  );
}
