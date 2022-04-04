 const AuthProvider = () => {
    const getAuth = () => {
        const auth = JSON.parse(localStorage.getItem('auth'));
        return auth;
    }

    const setAuth = (a) => {
        localStorage.setItem('auth', JSON.stringify(a));
    }

    const isAuthenticated = (a) => {
        const auth = getAuth();
        if (auth && Object.keys(auth).length > 0) {
            return true;
        }
        return false;
    }

    return {getAuth, setAuth, isAuthenticated}
}

export default AuthProvider;