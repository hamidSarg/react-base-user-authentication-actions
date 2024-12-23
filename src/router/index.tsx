import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import {AuthProvider} from "@context/auth";
import ProtectedRoute from "@router/protected";
import Login from "@pages/login/index.tsx";
import Dashboard from "@pages/dashboard/index.tsx";
import {NetworkServiceProvider} from "@context/http";


const AppRouter: React.FC = () => {
    return (
        <NetworkServiceProvider>
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={<ProtectedRoute />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                        </Route>
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                </Router>
            </AuthProvider>
        </NetworkServiceProvider>
    );
};

export default AppRouter;
