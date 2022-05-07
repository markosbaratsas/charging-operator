import { Outlet } from 'react-router-dom';
import Navbar4 from '../components/Navbar4';

const Layout4 = ({activePage, station}) => {
    return (
        <>
            <Navbar4 stationName={station.name} stationId={station.id} active={activePage}/>
            <div className="content">
                <Outlet />
            </div>
        </>
    );
}

export default Layout4;
