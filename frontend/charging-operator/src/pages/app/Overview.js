import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ReactLoading from 'react-loading';

import { getStation,
    getStationChargerGroupsInfo,
    getStationPrices,
    getStationReservations,
    getStationVehicles } from '../../api/BackendCalls';
import Navbar4 from '../../components/Navbar4';
import useTitle from "../../hooks/useTitle";
import { next_hours, upTo } from '../../utils/usefulFunctions';
import AuthProvider from '../../context/AuthProvider';

const Overview = ({title}) => {
    useTitle({title});

    const { id } = useParams();
    const { getAuth } = AuthProvider();
    const navigate = useNavigate();

    const [station, setStation] = useState({name: ""});
    const [chargers, setChargers] = useState(null);
    const [prices, setPrices] = useState(null);
    const [reservations, setReservations] = useState(null);
    const [vehicles, setVehicles] = useState(null);

    const fetchData = async () => {
        try {
            let {ok, data} = await getStation(getAuth(), id);
            if (!ok) {
                navigate("/app/not-authorized", { replace: true });
            }
            // check if data changed
            if (JSON.stringify(data) !== JSON.stringify(station)) setStation(data);

            data = await getStationChargerGroupsInfo(getAuth(), id);
            // check if data changed
            if (JSON.stringify(data) !== JSON.stringify(chargers)) setChargers(data);

            data = await getStationPrices(getAuth(), id);
            // check if data changed
            if (JSON.stringify(data) !== JSON.stringify(prices)) setPrices(data);

            data = await getStationVehicles(getAuth(), id);
            // check if data changed
            if (JSON.stringify(data) !== JSON.stringify(vehicles)) setVehicles(data);

            data = await getStationReservations(getAuth(), id);
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
                                                <h4>{charger.occupied_chargers}/{charger.all_chargers} occupied</h4>
                                                <div className="flex-row-center-center">
                                                    <div className="percentage-availability">
                                                        <div style={{
                                                            width: `${200*(charger.occupied_chargers/charger.all_chargers)}px`,
                                                            backgroundColor: "#202020",
                                                            height: "10px"
                                                        }}/>
                                                        <div style={{
                                                            width: `${200*(1-charger.occupied_chargers/charger.all_chargers)}px`,
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
                                <>
                                    {vehicles.length === 0 ? (
                                        <>
                                            <p>There is no vehicle charging now...</p>
                                            <br />
                                        </>
                                        ) : (
                                        <ul className="overview-station-ul2 flex-column-start-center">
                                            {vehicles.map(vehicle => {
                                                return (
                                                    <li key={vehicle.id} className="flex-column-start-start">
                                                        <Link to={`/app/station-${id}/vehicle-state/${vehicle.id}`}>
                                                            <h4>{upTo(vehicle.model, 30)}, {vehicle.license_plate}</h4>
                                                            <h5>Expected Departure: <span>{vehicle.expected_departure}</span></h5>
                                                            <h5>Charger: <span>{upTo(vehicle.charging_in,30)}</span></h5>
                                                        </Link>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </>
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
                                                <h5>{price.current_price} €/KWh</h5>
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

                                    {(reservations.filter(reservation => next_hours(reservation.expected_arrival, 0)).length > 0) ? (
                                    <>
                                        <p>Overdue (in the past hour)</p>
                                        <ul className="overview-station-ul2 flex-column-start-center">
                                            {reservations.filter(reservation => next_hours(reservation.expected_arrival, 0)).map(reservation => {
                                                return (
                                                    <li key={reservation.id} className="flex-column-start-start light-red-background">
                                                        <h4>{upTo(reservation.model, 30)}, {reservation.license_plate}</h4>
                                                        <h5>Owner: <span>{upTo(reservation.owner, 30)}</span></h5>
                                                        <h5>Owner's Phone: <span>{upTo(reservation.owner_phone, 30)}</span></h5>
                                                        <h5>Expected Arrival: <span>{reservation.expected_arrival}</span></h5>
                                                        <h5>Expected Departure: <span>{reservation.expected_departure}</span></h5>
                                                        <h5>Charger: <span>{reservation.charger.name}</span></h5>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </>
                                    ) : null}

                                    {(reservations.filter(reservation => (
                                        ! next_hours(reservation.expected_arrival, 0) && next_hours(reservation.expected_arrival, 12)
                                    )).length > 0) ? (
                                    <>
                                        <p>For the next 12 hours</p>
                                        <ul className="overview-station-ul2 flex-column-start-center">
                                            {reservations.filter(reservation => (
                                                ! next_hours(reservation.expected_arrival, 0) && next_hours(reservation.expected_arrival, 12)
                                            )).map(reservation => {
                                                return (
                                                    <li key={reservation.id} className="flex-column-start-start">
                                                        <h4>{upTo(reservation.model, 30)}, {reservation.license_plate}</h4>
                                                        <h5>Owner: <span>{upTo(reservation.owner, 30)}</span></h5>
                                                        <h5>Owner's Phone: <span>{upTo(reservation.owner_phone, 30)}</span></h5>
                                                        <h5>Expected Arrival: <span>{reservation.expected_arrival}</span></h5>
                                                        <h5>Expected Departure: <span>{reservation.expected_departure}</span></h5>
                                                        <h5>Charger: <span>{reservation.charger.name}</span></h5>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </>
                                    ) : null}

                                    {reservations.filter(reservation =>( ! next_hours(reservation.expected_arrival, 12) && next_hours(reservation.expected_arrival, 24))).length > 0 ? (
                                    <>
                                        <p>For the next 24 hours</p>
                                        <ul className="overview-station-ul2 flex-column-start-center">
                                            {reservations.filter(reservation =>( ! next_hours(reservation.expected_arrival, 12) && next_hours(reservation.expected_arrival, 24))).map(reservation => {
                                                return (
                                                    <li key={reservation.id} className="flex-column-start-start">
                                                        <h4>{reservation.model}, {reservation.license_plate}</h4>
                                                        <h5>Owner: <span>{reservation.owner}</span></h5>
                                                        <h5>Owner's Phone: <span>{upTo(reservation.owner_phone, 30)}</span></h5>
                                                        <h5>Expected Departure: <span>{reservation.expected_arrival}</span></h5>
                                                        <h5>Expected Departure: <span>{reservation.expected_departure}</span></h5>
                                                        <h5>Charger: <span>{reservation.charger.name}</span></h5>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </>
                                    ) : null}

                                    {reservations.length === 0 ? (
                                        <>
                                            <p>There are no reservations in the next 24 hours.</p>
                                            <br />
                                        </>
                                    ) : null}
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
