import { useEffect, useState } from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import ReactLoading from 'react-loading';
import { useAlert } from 'react-alert';

import AuthProvider from '../context/AuthProvider';

const RequireAuth = () => {
    const { isAuthenticated } = AuthProvider();
    const [authenticated, setAuthenticated] = useState("loading");
    const alert = useAlert();

    const location = useLocation();

    useEffect(async () => {
        const checkAuth = await isAuthenticated();

        if (checkAuth) setAuthenticated("authenticated");
        else {
            alert.success('Please log in to continue');
            setAuthenticated("not-authenticated");
        }
    }, [])

    return (
        (authenticated === "loading") ? <ReactLoading type="spin" color="#202020" height={80} width={80} className="loading-big"/>
        : (authenticated === "authenticated") ? <Outlet />
        : (authenticated === "not-authenticated") ? <Navigate to="/login" state={{ from: location }} replace />
        : null
    );
}

export default RequireAuth;
