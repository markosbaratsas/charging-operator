import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import AuthProvider from '../context/AuthProvider';
import useTitle from '../hooks/useTitle';
import { loginUser } from '../api/BackendCalls';


const Login = ({title}) => {
    useTitle({title});

    const { isAuthenticated, setAuth, isAuthenticatedOwner } = AuthProvider();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/app/dashboard";
    const from_owner = location.state?.from?.pathname || "/owner/dashboard";
    const[loggedIn, setLoggedIn] = useState(false);

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(async () => {
        const checkAuth = await isAuthenticated();
        const checkAuthOwner = await isAuthenticatedOwner();

        if (checkAuth) navigate(from, { replace: true });
        if (checkAuthOwner) navigate(from_owner, { replace: true });
    }, [loggedIn])

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();

        let [error, accessToken] = await loginUser(user, pwd);
        if (error) {
            setErrMsg(error);
            errRef.current.focus();
            return;
        }

        setAuth({ accessToken });
        setUser('');
        setPwd('');
        setLoggedIn(true);
    }
    
    return (
        <section className="signin-page flex-column-center-center">
            <div className="first-div flex-column-center-center">
                <div className="second-div flex-column-center-center">
                    <div className="third-div flex-column-center-center">
                        <p ref={errRef} className={errMsg ? "errmsg" : "no-errmsg"}>{errMsg}</p>
                        <h1>Sign In</h1>
                        <form onSubmit={handleSubmit}>
                            <input
                                placeholder="Username"
                                type="text"
                                id="username"
                                ref={userRef}
                                autoComplete="off"
                                onChange={(e) => setUser(e.target.value)}
                                value={user}
                                required
                            />

                            <input
                                placeholder="Password"
                                type="password"
                                id="password"
                                onChange={(e) => setPwd(e.target.value)}
                                value={pwd}
                                required
                            />
                            <button>Sign In</button>
                        </form>
                        <p className="need-acount">Need an Account?<br />
                            <Link to="/register-owner">Register as a vehicle owner</Link><br />
                            <Link to="/register">Register as a station operator</Link>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
 
export default Login;
