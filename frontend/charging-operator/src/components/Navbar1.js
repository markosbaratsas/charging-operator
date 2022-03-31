import { Link } from 'react-router-dom';

const Navbar1 = () => {
    return (
        <section className="nav1-background">
            <div className="wrapper">
                <nav className="nav1">
                    <div className="logo">
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
 
export default Navbar1;
