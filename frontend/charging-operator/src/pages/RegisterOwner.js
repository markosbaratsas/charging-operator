import { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import AuthProvider from "../context/AuthProvider";
import useTitle from "../hooks/useTitle";
import { registerUserOwner } from "../api/BackendCalls";

const USER_REGEX = /^[A-z][A-z0-9_]{3,23}$/;
const OWNER_NAME_REGEX = /^[A-z][A-z0-9_\ ]{3,30}$/;
const PHONE_REGEX = /^[0-9]{10}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const RegisterOwner = ({title}) => {
    useTitle({title});

    const { isAuthenticated, isAuthenticatedOwner } = AuthProvider();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/app/dashboard";
    const from_owner = location.state?.from?.pathname || "/owner/dashboard";

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [nameOwner, setNameOwner] = useState('');
    const [validNameOwner, setValidNameOwner] = useState(false);
    const [nameOwnerFocus, setNameOwnerFocus] = useState(false);

    const [phone, setPhone] = useState('');
    const [validPhone, setValidPhone] = useState(false);
    const [phoneFocus, setPhoneFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(async () => {
        const checkAuth = await isAuthenticated();
        const checkAuthOwner = await isAuthenticatedOwner();

        if (checkAuth) navigate(from, { replace: true });
        if (checkAuthOwner) navigate(from_owner, { replace: true });
    }, [])

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setValidName(USER_REGEX.test(user));
    }, [user])

    useEffect(() => {
        setValidNameOwner(OWNER_NAME_REGEX.test(nameOwner));
    }, [nameOwner])

    useEffect(() => {
        setValidPhone(PHONE_REGEX.test(phone));
    }, [phone])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd, nameOwner, phone])

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        console.log()
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);
        const v3 = PHONE_REGEX.test(phone);
        const v4 = OWNER_NAME_REGEX.test(nameOwner);
        if (!v1 || !v2 || !v3 || !v4) {
            setErrMsg("Invalid Entry");
            return;
        }

        let [error, ok] = await registerUserOwner(user, pwd, matchPwd, nameOwner, phone);
        if (error) {
            setErrMsg(error);
            errRef.current.focus();
            return;
        }

        setSuccess(true);
        //clear state and controlled inputs
        setUser('');
        setPwd('');
        setMatchPwd('');
    }

    return (
        <section className="signup-page flex-column-center-center">
            <div className="first-div-signup flex-column-center-center">
                <div className="second-div-signup flex-column-center-center">
                    <div className="third-div-signup flex-column-center-center">
                        {success ? (
                            <div className="signup-success flex-column-center-center">
                                <h1>Successfully registered!</h1>
                                <p>
                                    <Link to="/login">Sign In</Link>
                                </p>
                            </div>
                        ) : (
                            <div>


                                <p ref={errRef} className={errMsg ? "errmsg" : "no-errmsg"}>{errMsg}</p>
                                <h1>Register</h1>
                                <form onSubmit={handleSubmit}>

                                    <div className="input-note">
                                        <div className="input-validation">
                                            <input
                                                placeholder="Username"
                                                type="text"
                                                id="username"
                                                ref={userRef}
                                                autoComplete="off"
                                                onChange={(e) => setUser(e.target.value)}
                                                value={user}
                                                required
                                                onFocus={() => setUserFocus(true)}
                                                onBlur={() => setUserFocus(false)}
                                            />
                                            <div>
                                                <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                                                <FontAwesomeIcon icon={faTimes} className={validName || !user ? "hide" : "invalid"} />
                                            </div>
                                        </div>
                                        <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
                                            <FontAwesomeIcon className="info-icon" icon={faInfoCircle} />
                                            4 to 24 characters.<br />
                                            Must begin with a letter.<br />
                                            Letters, numbers and underscores allowed.
                                        </p>
                                    </div>

                                    <div className="input-note">
                                        <div className="input-validation">
                                            <input
                                                placeholder="Full Name"
                                                type="text"
                                                id="ownername"
                                                autoComplete="off"
                                                onChange={(e) => setNameOwner(e.target.value)}
                                                value={nameOwner}
                                                required
                                                onFocus={() => setNameOwnerFocus(true)}
                                                onBlur={() => setNameOwnerFocus(false)}
                                            />
                                            <div>
                                                <FontAwesomeIcon icon={faCheck} className={validNameOwner ? "valid" : "hide"} />
                                                <FontAwesomeIcon icon={faTimes} className={validNameOwner || !nameOwner ? "hide" : "invalid"} />
                                            </div>
                                        </div>
                                        <p id="uidnote" className={nameOwnerFocus && nameOwner && !validNameOwner ? "instructions" : "offscreen"}>
                                            <FontAwesomeIcon className="info-icon" icon={faInfoCircle} />
                                            4 to 31 characters.<br />
                                            Must begin with a letter.<br />
                                            Letters, numbers, spaces and underscores allowed.
                                        </p>
                                    </div>


                                    <div className="input-note">
                                        <div className="input-validation">
                                            <input
                                                placeholder="Phone"
                                                type="tel"
                                                id="phone"
                                                autoComplete="off"
                                                onChange={(e) => setPhone(e.target.value)}
                                                value={phone}
                                                required
                                                onFocus={() => setPhoneFocus(true)}
                                                onBlur={() => setPhoneFocus(false)}
                                            />
                                            <div>
                                                <FontAwesomeIcon icon={faCheck} className={validPhone ? "valid" : "hide"} />
                                                <FontAwesomeIcon icon={faTimes} className={validPhone || !phone ? "hide" : "invalid"} />
                                            </div>
                                        </div>
                                        <p id="uidnote" className={phoneFocus && phone && !validPhone ? "instructions" : "offscreen"}>
                                            <FontAwesomeIcon className="info-icon" icon={faInfoCircle} />
                                            Phone should have exactly 10 digits
                                        </p>
                                    </div>

                                    <div className="input-note">
                                        <div className="input-validation">
                                            <input
                                                placeholder="Password"
                                                type="password"
                                                id="password"
                                                onChange={(e) => setPwd(e.target.value)}
                                                value={pwd}
                                                required
                                                onFocus={() => setPwdFocus(true)}
                                                onBlur={() => setPwdFocus(false)}
                                            />
                                            <div>
                                                <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                                                <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
                                            </div>
                                        </div>
                                        <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                                            <FontAwesomeIcon className="info-icon" icon={faInfoCircle} />
                                            8 to 24 characters.<br />
                                            Must include an uppercase, a lowercase letter, a number and a special character.<br />
                                            Allowed special characters: <span>!</span> <span>@</span> <span>#</span> <span>$</span> <span>%</span>
                                        </p>
                                    </div>

                                    <div className="input-note">
                                        <div className="input-validation">
                                            <input
                                                placeholder="Repeat Password"
                                                type="password"
                                                id="confirm_pwd"
                                                onChange={(e) => setMatchPwd(e.target.value)}
                                                value={matchPwd}
                                                required
                                                onFocus={() => setMatchFocus(true)}
                                                onBlur={() => setMatchFocus(false)}
                                            />
                                            <div>
                                                <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                                                <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                                            </div>
                                        </div>
                                        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                                            <FontAwesomeIcon className="info-icon" icon={faInfoCircle} />
                                            Must match the first password input field.
                                        </p>
                                    </div>

                                    <button disabled={!validName || !validPwd || !validMatch ? true : false}>Sign Up</button>
                                </form>

                                <p className="already-registered">Already registered?<br />
                                    <Link to="/login">Sign In</Link>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default RegisterOwner;
