import { Outlet } from 'react-router-dom';
import Navbar2 from '../components/Navbar2';

const Layout2 = () => {
    return (
        <>
            <Navbar2 />
            <div className="content">
                <Outlet />
            </div>
        </>
    );
}

export default Layout2;
