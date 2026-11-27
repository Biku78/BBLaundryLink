import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import CustomerDesign from "../designs/CustomerDesign";
import DesignShell from "../designs/DesignShell";

export default function DashboardPage({ preview = false }) {
  const token = useSelector((state) => state.auth.token);
  const location = useLocation();
  if (!token && !preview)
    return <Navigate to="/login" replace state={{ from: location }} />;
  return (
    <DesignShell>
      <CustomerDesign />
    </DesignShell>
  );
}
