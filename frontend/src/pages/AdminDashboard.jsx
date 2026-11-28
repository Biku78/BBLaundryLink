import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";
import { api } from "../services/api";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signOut = () => {
    dispatch(logout());
    dispatch(api.util.resetApiState());
    navigate("/login");
  };

  const stats = [
    { label: "Total Orders", value: "1,284" },
    { label: "Active Partners", value: "120" },
    { label: "Customers", value: "12,430" },
    { label: "Revenue", value: "₹4.2L" },
  ];

  return (
    <main id="main-content" className="admin">
      <header className="admin__bar">
        <h1>Admin Dashboard</h1>
        <div>
          <span>{user?.Name || user?.name || "Admin"}</span>
          <button onClick={signOut}>Logout</button>
        </div>
      </header>

      <section className="admin__stats">
        {stats.map((s) => (
          <div key={s.label} className="admin__card">
            <p>{s.label}</p>
            <strong>{s.value}</strong>
          </div>
        ))}
      </section>
    </main>
  );
}