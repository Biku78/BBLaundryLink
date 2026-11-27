import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DesignShell from "../designs/DesignShell";
import FreshPass from "../designs/FreshPass";
import "./AccountPage.css";

export default function AccountPage() {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  const navigate = useNavigate();
  if (user) return <Navigate to="/dashboard" replace />;
  return (
    <DesignShell showPreview={false}>
      <FreshPass
        initial={location.pathname === "/register" ? "register" : "login"}
        onBack={() => navigate("/")}
        onSuccess={() => navigate("/dashboard", { replace: true })}
        onModeChange={(register) =>
          navigate(register ? "/register" : "/login", { replace: true })
        }
      />
    </DesignShell>
  );
}
