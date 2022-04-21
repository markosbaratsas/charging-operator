import { useEffect } from "react";
import { Link } from "react-router-dom";

import { logoutUser } from "../api/BackendCalls";
import AuthProvider from "../context/AuthProvider";

const Logout = () => {
    const { logout, getAuth } = AuthProvider();

    useEffect(() => {
        const logoutFunction = async () => {
            await logoutUser(getAuth());
            logout();
        }

        logoutFunction();
    }, [logout, getAuth])

    return (
        <section className="flex-column-center-center">
            <h1 className="app-page-title">You successfully logged out</h1>
            <div className="logout-div flex-column-center-center">
                <Link to="/login">Login again</Link>
                <p>Go to the <Link to="/">main page</Link></p>
            </div>
        </section>
    );
}
 
export default Logout;
