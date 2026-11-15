import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import API from "../services/api";

export default function ProtectedRoute({ roles, permission, children }) {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [session, setSession] = useState(null);
  const [failure, setFailure] = useState(null);
  useEffect(() => {
    const expired = () => setFailure(401);
    window.addEventListener("auth-expired", expired);
    return () => window.removeEventListener("auth-expired", expired);
  }, []);
  useEffect(() => {
    let active = true;
    if (!token) return () => { active = false; };
    API.get("/profil").then(({ data }) => {
      if (!active) return;
      if (!data.data) { setFailure(401); return; }
      localStorage.setItem("user", JSON.stringify(data.data));
      window.dispatchEvent(new Event("user-updated"));
      setSession({ token, user: data.data });
    }).catch((error) => {
      if (active) setFailure(error.response?.status || 500);
    });
    return () => { active = false; };
  }, [token, location.pathname]);
  if (!token || failure === 401) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (failure === 403) return <Navigate to="/unauthorized" replace />;
  if (failure) return <div className="ds-container py-12" role="alert">Gagal memverifikasi sesi. Muat ulang halaman untuk mencoba kembali.</div>;
  if (!session || session.token !== token) return <div className="ds-container py-12" role="status">Memverifikasi sesi…</div>;
  if ((roles && !roles.includes(session.user.role)) || (permission && !session.user.permissions?.includes(permission))) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
}
