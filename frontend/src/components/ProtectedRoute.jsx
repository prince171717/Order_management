import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = useSelector(s => s.auth.token);
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
}
