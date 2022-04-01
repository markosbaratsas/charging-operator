import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import AuthProvider from '../context/AuthProvider';
import axios from '../api/axios';
import useTitle from '../hooks/useTitle';

const LOGIN_URL = '/login';

const Login = ({title}) => {
    useTitle({title});

    const { isAuthenticated, setAuth } = AuthProvider();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/app/dashboard";

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        if (isAuthenticated()) navigate(from, { replace: true });
    }, [])

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(user, pwd)


        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ user: user, password: pwd }),
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            console.log(JSON.stringify(response?.data));
            //console.log(JSON.stringify(response));
            const accessToken = response?.data?.accessToken;
            setAuth({ accessToken });
            setUser('');
            setPwd('');
            navigate(from, { replace: true });
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response.');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password.');
            } else if (err.response?.status === 401) {
                setErrMsg('Username and password do not match.');
            } else {
                setErrMsg('Something went wrong. Please try again.');
            }
            errRef.current.focus();
        }
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
                            <Link to="/register">Register for free</Link>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
 
export default Login;
