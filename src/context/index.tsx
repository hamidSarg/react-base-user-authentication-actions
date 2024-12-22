import React, { createContext, useContext, useState } from 'react';
import LocalStorageService from "../storage";
import {AuthContextType} from "./index.type.ts";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(LocalStorageService.get<string>('token'));

    const login = (newToken: string) => {
        setToken(newToken);
        LocalStorageService.set('token', newToken);
    };

    const logout = () => {
        setToken(null);
        LocalStorageService.remove('token');
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
