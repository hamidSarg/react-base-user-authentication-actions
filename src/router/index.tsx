import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import {AuthProvider} from "@context/index.tsx";
import ProtectedRoute from "@router/protected";
import Login from "@components/login";
import Dashboard from "@components/dashboard";


const AppRouter: React.FC = () => {
    return (
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
    );
};

export default AppRouter;
