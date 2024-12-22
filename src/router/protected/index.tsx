import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import {useAuth} from "@context/index.tsx";

const ProtectedRoute: React.FC = () => {
    const { token } = useAuth();

    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
