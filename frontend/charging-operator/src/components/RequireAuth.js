import { useLocation, Navigate, Outlet } from 'react-router-dom';

import AuthProvider from '../context/AuthProvider';

const RequireAuth = () => {
    const { isAuthenticated } = AuthProvider();

    const location = useLocation();

    return (
        isAuthenticated()
            ? <Outlet />
            : <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default RequireAuth;
