import { Link } from "react-router-dom";
import useTitle from "../hooks/useTitle";

const Page404 = ({title}) => {
    useTitle({title});

    return (
        <>
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
