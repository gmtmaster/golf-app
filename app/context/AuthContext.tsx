// app/context/AuthContext.tsx
import React, { createContext, useState, useEffect } from "react";
import { getToken, saveToken, clearToken } from "../lib/secureStore";

export const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: any) {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const t = await getToken();
            setToken(t);
        })();
    }, []);

    const login = async (newToken: string) => {
        await saveToken(newToken);
        setToken(newToken);
    };

    const logout = async () => {
        await clearToken();
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
