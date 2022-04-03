import { getElementError } from '@testing-library/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

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
                    <div onClick={openMenu} className={ menuIsOpen ? "three-lines-x" : "three-lines" }>
                        <div className={ menuIsOpen ? "three-lines-menu" : "no-display"}>
                            <ul>
                                <li>
                                    <Link to="/app/settings">Settings</Link>
                                </li>
                                <li>
                                    <Link to="/logout">Logout</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        </section>
    );
}
 
export default Navbar2;
