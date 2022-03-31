import { Outlet } from 'react-router-dom';
import Navbar1 from '../components/Navbar1';
import Footer from '../components/Footer';

const Layout1 = () => {
    return (
        <>
            <Navbar1 />
            <div className="content">
                <Outlet />
            </div>
            <Footer />
        </>
    );
}

export default Layout1;
