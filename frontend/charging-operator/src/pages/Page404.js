import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthProvider from "../context/AuthProvider";
import Navbar1 from '../components/Navbar1';
import Navbar3 from '../components/Navbar3';


const Page404 = () => {
    const { isAuthenticated } = AuthProvider();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated()) navigate("/404-not-found", { replace: true });
    }, [])

    return (
        <>
            {isAuthenticated ? <Navbar3 /> : <Navbar1 />}
            <div className="content">
                <section className="page-404 flex-column-center-center">
                    <h2>404 .... Ooops</h2>
                    <h3>Sorry, but... this page does not exist. <br /> Click here to return to the <Link to="/">main page</Link>.</h3>
                </section>
            </div>
        </>
    );
}
 
export default Page404;
