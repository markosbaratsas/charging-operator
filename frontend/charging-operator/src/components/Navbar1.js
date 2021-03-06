import { Link } from 'react-router-dom';
import useWindowDimensions from '../hooks/useWindowDimensions';

const Navbar1 = () => {
    const { width } = useWindowDimensions();

    if (width >= 1000) {
    return (
        <section className="nav1-background">
            <div className="wrapper">
                <nav className="nav1">
                    <div className="logo flex-column-center-center">
                        <Link to="/">
                            <img src="/logo512.png" alt="Charging Operator Logo" />
                        </Link>
                    </div>
                    <div className="right-nav1">
                        <ul>
                            <li>
                                <Link to="/about/">About</Link>
                            </li>
                            <li>
                                <Link to="/contact/">Contact</Link>
                            </li>
                        </ul>
                        <Link to="/login/">
                            <button>Get Started</button>
                        </Link>
                    </div>
                </nav>
            </div>
        </section>
    );
    }
    else {
    return (
        <section className="nav1-background-phone">
            <nav className="nav1">
                <div className="logo-phone flex-column-center-center">
                    <Link to="/">
                        <img src="/logo512.png" alt="Charging Operator Logo" />
                    </Link>
                </div>
                <div className="right-nav1-phone">
                    <ul>
                        <li>
                            <Link to="/about/">About</Link>
                        </li>
                        <li>
                            <Link to="/contact/">Contact</Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </section>
    );
    }
}
 
export default Navbar1;
