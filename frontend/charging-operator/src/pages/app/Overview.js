import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactLoading from 'react-loading';

import { getStation,
    getStationChargers,
    getStationPrices,
    getStationReservations,
    getStationVehicles } from '../../api/BackendCalls';
import Navbar4 from '../../components/Navbar4';
import useTitle from "../../hooks/useTitle";
import { upTo } from '../../utils/usefulFunctions';

const Overview = ({title}) => {
    useTitle({title});

    const { id } = useParams();

    const [station, setStation] = useState({name: ""});
    const [chargers, setChargers] = useState(null);
    const [prices, setPrices] = useState(null);
    const [reservations, setReservations] = useState(null);
    const [vehicles, setVehicles] = useState(null);

    const fetchData = async () => {
        try {
            let data = await getStation(id);
            // check if data changed
            if (JSON.stringify(data) !== JSON.stringify(station)) setStation(data);

            data = await getStationChargers(id);
            // check if data changed
            if (JSON.stringify(data) !== JSON.stringify(chargers)) setChargers(data);

            data = await getStationPrices(id);
            // check if data changed
            if (JSON.stringify(data) !== JSON.stringify(prices)) setPrices(data);

            data = await getStationVehicles(id);
            // check if data changed
            if (JSON.stringify(data) !== JSON.stringify(vehicles)) setVehicles(data);

            data = await getStationReservations(id);
            // check if data changed
            if (JSON.stringify(data) !== JSON.stringify(reservations)) setReservations(data);

        } catch (err) {
            console.error(err.message);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(() => {
            fetchData();
        }, 5000);
        return () => clearInterval(interval);
    }, [station, chargers, prices, reservations, vehicles])


    return (
    <>
        <Navbar4 stationName={station.name} stationId={id} active={"Overview"}/>
        <div className="content">
            <div className="flex-column-center-center">
            <section className="wrapper">
                <div className="flex-row-around-start station-overview">
                    <div className="flex-column-start-start">
                        <div className="overview-station-div1">
                            <div className="flex-row-center-center text-icon">
                                <h2>Chargers</h2>
                                <img src="/icons/charger-icon.png" alt="Charger icon" />
                            </div>
                            {!chargers ? <ReactLoading type="spin" color="#202020" height={30} width={30} className="loading"/>
                            : (
                                <ul className="overview-station-ul1 flex-column-center-center">
                                    {chargers.map(charger => {
                                        return (
                                            <li key={charger.id} className="flex-column-center-center">
                                                <h3>{charger.name}</h3>
                                                <h4>{charger.taken}/{charger.total_count} taken</h4>
                                                <div className="flex-row-center-center">
                                                    <div className="percentage-availability">
                                                        <div style={{
                                                            width: `${200*(charger.taken/charger.total_count)}px`,
                                                            backgroundColor: "#202020",
                                                            height: "10px"
                                                        }}/>
                                                        <div style={{
                                                            width: `${200*(1-charger.taken/charger.total_count)}px`,
                                                            backgroundColor: "#f3f3f3",
                                                            height: "10px"
                                                        }} />
                                                    
                                                    </div>

                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                        <div className="overview-station-div1">
                            <div className="flex-row-center-center text-icon">
                                <h2>Vehicles Charging Now</h2>
                                <img src="/icons/live.png" alt="Charger icon" />
                            </div>

                            {!vehicles ? <ReactLoading type="spin" color="#202020" height={30} width={30} className="loading"/>
                            : (
                            
                                <ul className="overview-station-ul2 flex-column-start-center">
                                    {vehicles.map(vehicle => {
                                        return (
                                            <li key={vehicle.id} className="flex-column-start-start">
                                                <Link to={`/app/station-${id}/vehicle-state/${vehicle.id}`}>
                                                    <h4>{upTo(vehicle.model, 30)}, {vehicle.licence_plate}</h4>
                                                    <h5>Expected Departure: <span>{vehicle.expected_departure}</span></h5>
                                                    <h5>Charger: <span>{upTo(vehicle.charging_in,30)}</span></h5>
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    </div>
                    <div className="flex-column-start-start">
                        <div className="overview-station-div1">
                            <div className="flex-row-center-center text-icon">
                                <h2>Prices</h2>
                                <img src="/icons/price-tag.png" alt="Charger icon" />
                            </div>

                            {!prices ? <ReactLoading type="spin" color="#202020" height={30} width={30} className="loading"/>
                            : (
                                <ul className="overview-station-ul1 flex-column-center-center">
                                    {prices.map(price => {
                                        return (
                                            <li key={price.id} className="flex-column-center-center">
                                                <h3>{price.name}</h3>
                                                <h5>{price.current_price} €/kWh</h5>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                        <div className="overview-station-div1">
                            <div className="flex-row-center-center text-icon">
                                <h2>Future Reservations</h2>
                                <img src="/icons/booking.png" alt="Charger icon" />
                            </div>
                            
                            
                            {!reservations ? <ReactLoading type="spin" color="#202020" height={30} width={30} className="loading"/>
                            : (
                                <>
                                    <p>For the next 12 hours</p>
                                    <ul className="overview-station-ul2 flex-column-start-center">
                                        {reservations.next_12_hours.map(reservation => {
                                            return (
                                                <li key={reservation.id} className="flex-column-start-start">
                                                    <h4>{upTo(reservation.model, 30)}, {reservation.licence_plate}</h4>
                                                    <h5>Owner: <span>{upTo(reservation.owner, 30)}</span></h5>
                                                    <h5>Expected Arrival: <span>{reservation.expected_arrival}</span></h5>
                                                    <h5>Expected Departure: <span>{reservation.expected_departure}</span></h5>
                                                    <h5>Charger: <span>{reservation.charging_in}</span></h5>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                    
                                    <p>For the next 24 hours</p>
                                    <ul className="overview-station-ul2 flex-column-start-center">
                                        {reservations.next_24_hours.map(reservation => {
                                            return (
                                                <li key={reservation.id} className="flex-column-start-start">
                                                    <h4>{reservation.model}, {reservation.licence_plate}</h4>
                                                    <h5>Owner: <span>{reservation.owner}</span></h5>
                                                    <h5>Expected Departure: <span>{reservation.expected_arrival}</span></h5>
                                                    <h5>Expected Departure: <span>{reservation.expected_departure}</span></h5>
                                                    <h5>Charger: <span>{reservation.charging_in}</span></h5>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </>
                            )}
                        </div>
                        
                    </div>
                </div>

            </section>

            </div>


            
            
        </div>
    </>
    );
}
 
export default Overview;
