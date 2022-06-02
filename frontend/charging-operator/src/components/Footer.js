import { Link } from 'react-router-dom';
import useWindowDimensions from '../hooks/useWindowDimensions';


const Footer = () => {
    const { width } = useWindowDimensions();

    if (width >= 1000) {
    return (
        <section className="footer flex-column-center-center">
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
                <div className="footer-right flex-column-end-center">
                    <ul>
                        <li>
                            <Link to="/login/">Get Started</Link>
                        </li>
                        <li>
                            <Link to="/pricing-methods/">Pricing Methods</Link>
                        </li>
                    </ul>
                </div>
            </div>
            <p>© Charging Operator, 2022</p>
        </section>
    );
    }
    else {
        return (
            <section className="footer-phone flex-column-center-center">
                <div className="flex-row-center-center">
                    <div className="footer-phone-left">
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
                    <div className="footer-phone-center flex-row-center-center">
                        <img src="/logo512.png" alt="Charging Operator logo" />
                    </div>
                    <div className="footer-phone-right flex-column-end-center">
                        <ul>
                            <li>
                                <Link to="/login/">Get Started</Link>
                            </li>
                            <li>
                                <Link to="/pricing-methods/">Pricing Methods</Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <p>© Charging Operator, 2022</p>
            </section>
        );
    }
}
 
export default Footer;
