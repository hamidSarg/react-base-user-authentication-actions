import React, {createContext, useContext, useEffect, useState} from 'react';
import LocalStorageService from "../../storage";
import {AuthContextType} from "./index.type.ts";
import {useHttpService} from "@context/http";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(LocalStorageService.get<string>('token'));
    const [user, setUser] = useState<AuthContextType["user"]>(null);
    const httpService = useHttpService();

    const fetchCurrentUser = async () => {
        if (!token) return;

        try {
            const response = await httpService.get<{ data: { id: number; avatar: string; first_name: string; last_name: string; email: string } }>(
                "/users/2" // Replace with the actual endpoint for fetching current user
            );
            const userData = response.data;
            setUser({
                id: userData.id,
                avatar: userData.avatar,
                name: `${userData.first_name} ${userData.last_name}`,
                email: userData.email,
            });
        } catch (error) {
            console.error("Error fetching current user details:", error);
        }
    };

    const login = (newToken: string) => {
        setToken(newToken);
        LocalStorageService.set('token', newToken);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        LocalStorageService.remove("token");
    };

    useEffect(() => {
        if (token) {
            fetchCurrentUser();
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ token, login, logout,user }}>
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
