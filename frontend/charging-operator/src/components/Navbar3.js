import { Link } from 'react-router-dom';
import OnClickMenu from './OnClickMenu';

const Navbar3 = () => {
    return (
        <section className="nav1-background">
            <div className="wrapper">
                <nav className="nav1">
                    <Link className="back-to-dashboard flex-row-center-center" to="/app/dashboard">
                        <img src="/icons/left-arrow.png" alt="Charging Operator Logo" />
                        <p>Dashboard</p>
                    </Link>
                    <OnClickMenu />
                </nav>
            </div>
        </section>
    );
}
 
export default Navbar3;
