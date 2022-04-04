import { Outlet } from 'react-router-dom';
import Navbar3 from '../components/Navbar3';

const Layout3 = () => {
    return (
        <>
            <Navbar3 />
            <div className="content">
                <Outlet />
            </div>
        </>
    );
}

export default Layout3;
