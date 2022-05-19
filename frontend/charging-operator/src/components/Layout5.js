import { Outlet } from 'react-router-dom';
import Navbar6 from '../components/Navbar6';

const Layout5 = () => {
    return (
        <>
            <Navbar6 />
            <div className="content">
                <Outlet />
            </div>
        </>
    );
}

export default Layout5;
