import { Link } from 'react-router-dom';
import { upTo } from '../utils/usefulFunctions';
import OnClickMenu from './OnClickMenu';

const Navbar3 = ({stationName, stationId}) => {
    return (
        <section className="nav1-background">
            <div className="wrapper">
                <nav className="nav1">
                    <Link className="back-to-dashboard flex-row-center-center" to="/app/dashboard">
                        <img src="/icons/left-arrow.png" alt="Charging Operator Logo" />
                        <p>Dashboard</p>
                    </Link>
                    <h1>{upTo(stationName, 26)}</h1>
                    <ul className="station-nav-ul">
                        <li><Link to={`/app/station-${stationId}`}>Overview</Link></li>
                        <li><Link to={`/app/station-${stationId}/prices`}>Prices</Link></li>
                        <li><Link to={`/app/station-${stationId}/chargers`}>Chargers</Link></li>
                        <li><Link to={`/app/station-${stationId}/reservations`}>Reservations</Link></li>
                    </ul>
                    <OnClickMenu />
                </nav>
            </div>
        </section>
    );
}
 
export default Navbar3;
