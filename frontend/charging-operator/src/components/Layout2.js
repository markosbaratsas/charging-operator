import { Outlet } from 'react-router-dom';
import Navbar2 from '../components/Navbar2';
import Footer from '../components/Footer';

const Layout2 = () => {
    return (
        <>
            <Navbar2 />
            <div className="content">
                <Outlet />
            </div>
            <Footer />
        </>
    );
}

export default Layout2;
