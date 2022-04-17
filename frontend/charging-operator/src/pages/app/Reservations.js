import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactLoading from 'react-loading';

import { getReservations, getStation } from '../../api/BackendCalls';
import Navbar4 from '../../components/Navbar4';
import useTitle from "../../hooks/useTitle";
import ModalReservation from '../../components/ModalReservation';

const Reservations = ({title}) => {
    useTitle({title});

    const { id } = useParams();
    const [station, setStation] = useState({name: ""});

    const [startingArrival, setStartingArrival] = useState("");
    const [endingArrival, setEndingArrival] = useState("");
    const [startingDeparture, setStartingDeparture] = useState("");
    const [endingDeparture, setEndingDeparture] = useState("");

    const [reservations, setReservations] = useState(null);


    // for the modal
    const [show, setShow] = useState(false);
    const createReservation = () => {
        setShow(true);
    }

    const fetchData = async () => {
        try {
            let data = await getStation(id);
            // check if data changed
            if (JSON.stringify(data) !== JSON.stringify(station)) setStation(data);

        } catch (err) {
            console.error(err.message);
        }
    };
    const searchReservations = async () => {
        // TODO: add extra checks
        let data = await getReservations(startingArrival,
                                         endingArrival,
                                         startingDeparture,
                                         endingDeparture);
        
        setReservations(data);
    }
    useEffect(() => {
        fetchData();
        const interval = setInterval(() => {
            fetchData();
        }, 5000);
        return () => clearInterval(interval);
    }, [station])


    return (
        <>
        <Navbar4 stationName={station.name} stationId={id} active={"Overview"}/>
        <div className="content">
            <div className="flex-column-center-center">
            <section className="wrapper">
                <div className="flex-column-center-center station-reservations">
                    <h1>View Reservations</h1>
                    <button
                        onClick={createReservation}
                        className="reservation-button create-reservation-button"
                    >Create a new Reservation</button>
                    <div className="flex-row-between-center full-width">
                        <div className="label-input-reservations">
                            <h5>Select Starting Arrival:</h5>
                            <input
                                type="datetime-local"
                                className={"my-classic-input"}
                                value={startingArrival}
                                onChange={(e) => setStartingArrival(e.target.value)}
                            />
                        </div>
                        <div className="label-input-reservations">
                            <h5>Select Ending Arrival:</h5>
                            <input
                                type="datetime-local"
                                className={"my-classic-input"}
                                value={endingArrival}
                                onChange={(e) => setEndingArrival(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex-row-between-center full-width">
                        <div className="label-input-reservations">
                            <h5>Select Starting Departure:</h5>
                            <input
                                type="datetime-local"
                                className={"my-classic-input"}
                                value={startingDeparture}
                                onChange={(e) => setStartingDeparture(e.target.value)}
                            />
                        </div>
                        <div className="label-input-reservations">
                            <h5>Select Ending Departure:</h5>
                            <input
                                type="datetime-local"
                                className={"my-classic-input"}
                                value={endingDeparture}
                                onChange={(e) => setEndingDeparture(e.target.value)}
                            />
                        </div>
                    </div>
                    <button
                        className="reservation-button"
                        onClick={searchReservations}
                    >Search</button>

                    {reservations ? (
                        <ul className={reservations ? "station-reservations-ul" : "no-display"}>
                            {reservations.map(reservation => {
                                return (
                                    <li key={reservation.id}>
                                        <h3>Owner: {reservation.owner}</h3>
                                        <h3>Arrival Time: {reservation.expected_arrival}</h3>
                                        <h3>Departure Time: {reservation.expected_departure}</h3>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : null }
                </div>
            </section>
            </div>
        </div>

        <ModalReservation
            show={show}
            setShow={setShow}
            id={id}
        />
    </>
    );
}
 
export default Reservations;
