import { Outlet } from 'react-router-dom';
import Navbar1 from '../components/Navbar1';
import Footer from '../components/Footer';

const Layout2 = () => {
    return (
        <>
            <Navbar1 />
            <div className="content">
            <h1>layout2</h1>
                <Outlet />
            </div>
            <Footer />
        </>
    );
}

export default Layout2;
