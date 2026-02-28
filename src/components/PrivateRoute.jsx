import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getMe, isAuthed, logout } from "../api/auth";

export default function PrivateRoute() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let mounted = true;
    const verify = async () => {
      if (!isAuthed()) {
        if (mounted) setStatus("denied");
        return;
      }
      try {
        const me = await getMe();
        if (!me?.is_staff) {
          logout();
          if (mounted) setStatus("denied");
          return;
        }
        if (mounted) setStatus("ok");
      } catch {
        logout();
        if (mounted) setStatus("denied");
      }
    };

    verify();
    return () => {
      mounted = false;
    };
  }, []);

  if (status === "checking") return null;
  return status === "ok" ? <Outlet /> : <Navigate to="/admin/login" replace />;
}
