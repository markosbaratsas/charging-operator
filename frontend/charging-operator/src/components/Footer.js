import { Link } from 'react-router-dom';


const Footer = () => {
    return (
        <section className="footer flex-row-center-center">
            <div className="wrapper flex-row-center-start">
                <div className="footer-left">
                    <ul className="flex-column-center-start">
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/about/">About</Link>
                        </li>
                        <li>
                            <Link to="/contact/">Contact</Link>
                        </li>
                    </ul>
                </div>
                <div className="footer-center flex-row-center-center">
                    <img src="/logo512.png" alt="Charging Operator logo" />
                </div>
                <div className="footer-right flex-column-center-center">
                    <ul>
                        <li>
                            <Link to="/login/">Get Started</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    );
}
 
export default Footer;
