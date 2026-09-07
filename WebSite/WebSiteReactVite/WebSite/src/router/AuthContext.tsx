import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

import type { User, Credentials } from "../model/User";
import authService from "../utils/AuthProvider";

interface AuthContextType
{
    user: User | null;
    loading: boolean;
    login: (credentials: Credentials) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps
{
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps)
{
    const [localUser, setLocalUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() =>
    {
        const user = authService.getUser();

        setLocalUser(user);
        setLoading(false);
    }, []);

    async function login(credentials: Credentials): Promise<boolean>
    {
        const user = await authService.authenticate(credentials);

        if (!user)
            return false;

        setLocalUser(user);

        return true;
    }

    function logout(): void
    {
        authService.logout();
        setLocalUser(null);
        window.location.href = "/login";
    }

    return (
        <AuthContext.Provider value={{ user: localUser, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType
{
    const ctx = useContext(AuthContext);

    if (!ctx)
        throw new Error("useAuth must be used within AuthProvider");

    return ctx;
}