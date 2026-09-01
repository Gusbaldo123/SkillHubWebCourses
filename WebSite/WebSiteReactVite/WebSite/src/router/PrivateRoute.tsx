import { Navigate } from "react-router";
import { useAuth } from "./AuthContext";
import type { ReactElement } from "react";

export function PrivateRoute({ children }: { children: ReactElement }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Carregando...</p>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}