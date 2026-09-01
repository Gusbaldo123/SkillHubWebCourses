import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

import type { User } from "../model/User";
import { decode } from "../utils/SessionDecoder";

interface AuthContextType
{
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps
{
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps)
{
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() =>
    {
        const token = localStorage.getItem("session_token");

        if (token)
        {
            const payload = decode(token);

            if (payload)
            {
                setUser(payload.user);
            }
        }

        setLoading(false);
    }, []);

    async function login(email: string, password: string): Promise<boolean>
    {
        try
        {
            const apiUrl = import.meta.env.VITE_API || "/api";
            const url = `${apiUrl}/user`;

            console.log(url);

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok)
                return false;

            const token = await response.text();

            localStorage.setItem("session_token", token);

            const payload = decode(token);

            console.log(payload);

            if (!payload)
                return false;

            setUser(payload.user);

            return true;
        }
        catch
        {
            return false;
        }
    }

    function logout(): void
    {
        localStorage.removeItem("session_token");
        setUser(null);
        window.location.href = "/login";
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
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