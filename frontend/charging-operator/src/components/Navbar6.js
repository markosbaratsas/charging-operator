import { Link } from 'react-router-dom';

import OnClickMenuOwner from './OnClickMenuOwner';


const Navbar6 = () => {

    return (
        <section className="nav1-background">
            <div className="wrapper">
                <nav className="nav1">
                    <div className="logo flex-column-center-center">
                        <Link to="/">
                            <img src="/logo512.png" alt="Charging Operator Logo" />
                        </Link>
                    </div>
                    <OnClickMenuOwner />
                </nav>
            </div>
        </section>
    );
}

export default Navbar6;
