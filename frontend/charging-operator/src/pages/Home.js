import LandingPageView from '../components/LandingPageView';
import useTitle from '../hooks/useTitle';

const Home = ({title}) => {
    useTitle({title});

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
        </main>
    );
}
 
export default Home;
