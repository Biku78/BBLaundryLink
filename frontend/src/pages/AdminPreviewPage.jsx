import AdminDashboard from "../designs/AdminDesign";
import DesignShell from "../designs/DesignShell";

// Standalone admin preview — lets you review the console without an admin
// login. It reads local sample data only (services/adminApi.js).
export default function AdminPreviewPage() {
  return (
    <DesignShell showPreview={false}>
      <AdminDashboard />
    </DesignShell>
  );
}
