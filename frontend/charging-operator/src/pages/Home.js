import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LandingPageView from '../components/LandingPageView';
import useTitle from '../hooks/useTitle';
import useWindowDimensions from '../hooks/useWindowDimensions';

const Home = ({title}) => {
    useTitle({title});
    const { width } = useWindowDimensions();

    const [image, setImage] = useState("overview-screenshot2");
    const [image2, setImage2] = useState("owner-dashboard-screenshot2");

    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])

    if (width >= 1300) {
    return (
        <main className="flex-column-center-center">
            <LandingPageView/>
            <div className="wrapper flex-column-center-center">
                <section className="home-icons">
                    <div className="icon flex-column-center-center">
                        <img src="./icons/price-tag.png" alt="Price tag icon" />
                        <p>Get charging pricing <br></br>suggestions dynamically</p>
                    </div>
                    <div className="icon flex-column-center-center">
                        <img src="./icons/live.png" alt="Live icon" />
                        <p>Get a live view of the state <br></br>of your charging stations</p>
                    </div>
                    <div className="icon flex-column-center-center">
                        <img src="./icons/booking.png" alt="Booking icon" />
                        <p>Check future and past <br></br>charge-reservations</p>
                    </div>
                </section>
            </div>

            <section className="few-words">
                <h2>
                    EV Station Operators: This app is made for you!
                </h2>
                <p>
                    Manage your stations with the most efficient way possible.<br />
                    Our app focuses on  making it easier for you to control your stations'<br />
                    pricing strategies, providing you the best tools to make that happen!<br />
                    Monitor your chargers' health, easily view and arrange the reservations<br />
                    and, of course, get view insightful statistics for all of your stations!
                </p>
            </section>

            <div className="width-1300">
                <section className="cards">
                    <ul className="flex-column-start-start">
                        <li
                            onClick={() => setImage("overview-screenshot2")}
                            className={image === "overview-screenshot2" ? "active-card" : ""}>
                            <h3>Dashboard</h3>
                            <h4>View all the critical things for <br />
                                a station in one place</h4>
                        </li>
                        <li
                            onClick={() => setImage("prices-screenshot2")}
                            className={image === "prices-screenshot2" ? "active-card" : ""}>
                            <h3>Prices</h3>
                            <h4>Manage pricing strategies for <br />
                                each charger group</h4>
                        </li>
                        <li
                            onClick={() => setImage("chargers-screenshot2")}
                            className={image === "chargers-screenshot2" ? "active-card" : ""}>
                            <h3>Chargers</h3>
                            <h4>Control your chargers info<br />
                                and check their health</h4>
                        </li>
                        <li
                            onClick={() => setImage("reservations-screenshot2")}
                            className={image === "reservations-screenshot2" ? "active-card" : ""}>
                            <h3>Reservations</h3>
                            <h4>Easily view future and past<br />
                                reservations from EV owners</h4>
                        </li>
                        <li
                            onClick={() => setImage("statistics-screenshot2")}
                            className={image === "statistics-screenshot2" ? "active-card" : ""}>
                            <h3>Statistics</h3>
                            <h4>Get insightful statistics for <br />
                                your stations</h4>
                        </li>
                    </ul>
                    <div>
                        <img src={`./img/screenshots/${image}.png`} alt="Screenshot" />
                    </div>
                </section>
            </div>

            <hr className="big-hr"/>

            <section className="few-words">
                <h2>
                    EV Vehicle Owners: You can use it too!
                </h2>
                <p>
                    Easily create reservations for stations you are going to visit. <br />
                    Manage your information and different cars you may have, <br />
                    so that your visits to EV stations will be as easy as they can be.
                </p>
            </section>

            <div className="width-1300">
                <section className="cards">
                    <ul className="flex-column-start-start">
                        <li
                            onClick={() => setImage2("owner-dashboard-screenshot2")}
                            className={image2 === "owner-dashboard-screenshot2" ? "active-card" : ""}>
                            <h3>Owner Dashboard</h3>
                            <h4>View your information, your <br />
                            cars and past reservations</h4>
                        </li>
                        <li
                            onClick={() => setImage2("owner-reservation-screenshot2")}
                            className={image2 === "owner-reservation-screenshot2" ? "active-card" : ""}>
                            <h3>Owner Reservations</h3>
                            <h4>Check station prices for each <br />
                            charger and create reservations</h4>
                        </li>
                    </ul>
                    <div>
                        <img src={`./img/screenshots/${image2}.png`} alt="Screenshot" />
                    </div>
                </section>
            </div>

            <div className="flex-column-center-center learn-more">
                <h4>Want to learn more?</h4>
                <Link to="/contact">Contact us!</Link>
            </div>
        </main>
    );
    }
    else {
        return (
            <main className="flex-column-center-center home-phone-view">
                <section className="landing-page">
                    <div className="landing-wrapper">
                        <div className="charging-operator-phone">
                            <h1>Charging <br/>
                                Operator</h1>
                        </div>
                    </div>
                </section>
                <div className="wrapper flex-column-center-center">
                    <section className="home-icons">
                        <div className="icon-phone flex-column-center-center">
                            <img src="./icons/price-tag.png" alt="Price tag icon" />
                            <p>Get charging pricing <br></br>suggestions dynamically</p>
                        </div>
                        <div className="icon-phone flex-column-center-center">
                            <img src="./icons/live.png" alt="Live icon" />
                            <p>Get a live view of the state <br></br>of your charging stations</p>
                        </div>
                        <div className="icon-phone flex-column-center-center">
                            <img src="./icons/booking.png" alt="Booking icon" />
                            <p>Check future and past <br></br>charge-reservations</p>
                        </div>
                    </section>
                </div>

                <section className="few-words-phone">
                    <h2>
                        EV Station Operators: <br />
                        This app is made for you!
                    </h2>
                    <p>
                        Manage your stations with the most efficient way possible.
                        Our app focuses on  making it easier for you to control your stations'
                        pricing strategies, providing you the best tools to make that happen!
                        Monitor your chargers' health, easily view and arrange the reservations
                        and, of course, get view insightful statistics for all of your stations!
                    </p>
                </section>

                <section className="cards-phone">
                    <ul className="flex-column-center-center">
                        <li>
                            <img src={`./img/screenshots/overview-screenshot2.png`} alt="Screenshot" />
                            <h3>Dashboard</h3>
                            <h4>View all the critical things for <br />
                                a station in one place</h4>
                        </li>
                        <li>
                            <img src={`./img/screenshots/prices-screenshot2.png`} alt="Screenshot" />
                            <h3>Prices</h3>
                            <h4>Manage pricing strategies for <br />
                                each charger group</h4>
                        </li>
                        <li>
                            <img src={`./img/screenshots/chargers-screenshot2.png`} alt="Screenshot" />
                            <h3>Chargers</h3>
                            <h4>Control your chargers info<br />
                                and check their health</h4>
                        </li>
                        <li>
                            <img src={`./img/screenshots/reservations-screenshot2.png`} alt="Screenshot" />
                            <h3>Reservations</h3>
                            <h4>Easily view future and past<br />
                                reservations from EV owners</h4>
                        </li>
                        <li>
                            <img src={`./img/screenshots/statistics-screenshot2.png`} alt="Screenshot" />
                            <h3>Statistics</h3>
                            <h4>Get insightful statistics for <br />
                                your stations</h4>
                        </li>
                    </ul>
                </section>

                <hr className="big-hr"/>

                <section className="few-words-phone">
                    <h2>
                        EV Vehicle Owners: You can use it too!
                    </h2>
                    <p>
                        Easily create reservations for stations you are going to visit.
                        Manage your information and different cars you may have,
                        so that your visits to EV stations will be as easy as they can be.
                    </p>
                </section>

                <section className="cards-phone">
                    <ul className="flex-column-center-center">
                        <li>
                            <img src={`./img/screenshots/owner-dashboard-screenshot2.png`} alt="Screenshot" />
                            <h3>Owner Dashboard</h3>
                            <h4>View your information, your <br />
                            cars and past reservations</h4>
                        </li>
                        <li>
                            <img src={`./img/screenshots/owner-reservation-screenshot2.png`} alt="Screenshot" />
                            <h3>Owner Reservations</h3>
                            <h4>Check station prices for each <br />
                            charger and create reservations</h4>
                        </li>
                    </ul>
                </section>

                <div className="flex-column-center-center learn-more-phone">
                    <h4>Want to learn more?</h4>
                    <Link to="/contact">Contact us!</Link>
                </div>
            </main>
        );
    }
}
 
export default Home;
