import { checkAuthentication, checkAuthenticationOwner } from "../api/BackendCalls";

const AuthProvider = () => {
    const getAuth = () => {
        const auth = JSON.parse(localStorage.getItem('auth'));
        return auth;
    }

    const setAuth = (a) => {
        localStorage.setItem('auth', JSON.stringify(a));
    }

    const isAuthenticated = async () => {
        const auth = getAuth();
        const validate_token = await checkAuthentication(auth);

        if (auth && Object.keys(auth).length > 0 && validate_token) {
            return true;
        }
        return false;
    }

    const isAuthenticatedOwner = async () => {
        const auth = getAuth();
        const validate_token = await checkAuthenticationOwner(auth);

        if (auth && Object.keys(auth).length > 0 && validate_token) {
            return true;
        }
        return false;
    }

    const logout = () => {
        localStorage.removeItem('auth');
    }

    return {getAuth, setAuth, isAuthenticated, isAuthenticatedOwner, logout}
}

export default AuthProvider;
