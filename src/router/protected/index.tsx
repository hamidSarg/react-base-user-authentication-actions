import React, {useEffect} from 'react';
import {Navigate, Outlet, useNavigate} from 'react-router-dom';
import {useAuth} from "@context/auth";

const ProtectedRoute: React.FC = () => {
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            navigate("/dashboard");
        }
    }, [token]);

    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
