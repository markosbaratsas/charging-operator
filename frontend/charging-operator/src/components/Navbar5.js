import { Link } from 'react-router-dom';
import { upTo } from '../utils/usefulFunctions';
import OnClickMenu from './OnClickMenu';

const Navbar5 = ({stationName, stationId, active}) => {
    return (
        <section className="nav1-background">
            <div className="wrapper">
                <nav className="nav1">
                    <Link
                        className="back-to-dashboard flex-row-center-center"
                        to={`/app/station-${stationId}`}
                    >
                        <img src="/icons/left-arrow.png" alt="Charging Operator Logo" />
                        <p>Back</p>
                    </Link>
                    <h1>{upTo(stationName, 26)}</h1>
                    <ul className="station-nav-ul">
                        <li className={active === "Overview" ? "item-active": null}>
                            <Link to={`/app/station-${stationId}`}>Overview</Link>
                        </li>
                        <li className={active === "Prices" ? "item-active": null}>
                            <Link to={`/app/station-${stationId}/prices`}>Prices</Link>
                        </li>
                        <li className={active === "Chargers" ? "item-active": null}>
                            <Link to={`/app/station-${stationId}/chargers`}>Chargers</Link>
                        </li>
                        <li className={active === "Reservations" ? "item-active": null}>
                            <Link to={`/app/station-${stationId}/reservations`}>Reservations</Link>
                        </li>
                    </ul>
                    <OnClickMenu />
                </nav>
            </div>
        </section>
    );
}
 
export default Navbar5;
