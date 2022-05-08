import { useState } from 'react';
import { Link } from 'react-router-dom';
import OnClickMenu from './OnClickMenu';

const Navbar2 = () => {
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const openMenu = () => {
        if (!menuIsOpen) setMenuIsOpen(true);
        else setMenuIsOpen(false);
    }

    return (
        <section className="nav1-background">
            <div className="wrapper">
                <nav className="nav1">
                    <div className="logo flex-column-center-center">
                        <Link to="/">
                            <img src="/logo512.png" alt="Charging Operator Logo" />
                        </Link>
                    </div>
                    <OnClickMenu />
                </nav>
            </div>
        </section>
    );
}
 
export default Navbar2;
