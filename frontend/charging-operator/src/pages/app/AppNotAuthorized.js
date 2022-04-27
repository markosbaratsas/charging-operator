import { Link } from "react-router-dom";


const AppNotAuthorized = () => {
    return (
        <section className="flex-column-center-center">
            <h1 className="app-page-title">You are not authorized to see this page</h1>
            <div className="flex-column-center-center">
                <p>Return to <Link to="/app/dashboard">Dashboard</Link></p>
            </div>
        </section>
    );
}
 
export default AppNotAuthorized;
