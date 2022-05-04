import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactLoading from 'react-loading';
import { useAlert } from 'react-alert';

import { cancelReservation, getAvailableChargers,
    getReservations, getStation } from '../../api/BackendCalls';
import Navbar4 from '../../components/Navbar4';
import useTitle from "../../hooks/useTitle";
import ModalReservation from '../../components/ModalReservation';
import AuthProvider from '../../context/AuthProvider';
import { getTimeString, stringToISOString } from '../../utils/usefulFunctions';
import ModalVehicleState from '../../components/ModalVehicleState';
import ModalReservationEnd from '../../components/ModalReservationEnd';
import ModalReservationView from '../../components/ModalReservationView';

const Reservations = ({title}) => {
    useTitle({title});

    const { id } = useParams();
    const [station, setStation] = useState({name: "", id: -1});
    const { getAuth } = AuthProvider();
    const alert = useAlert();
    const navigate = useNavigate();

    const [startingArrival, setStartingArrival] = useState(
        new Date(new Date().getTime() - 60 * 60 * 1 * 1000).toISOString().substring(0,16));
    const [endingArrival, setEndingArrival] = useState(
        new Date(new Date().getTime() + 60 * 60 * 6 * 1000).toISOString().substring(0,16));
    const [startingDeparture, setStartingDeparture] = useState("");
    const [endingDeparture, setEndingDeparture] = useState("");
    const [reservationState, setReservationState] = useState({
        Canceled: true,
        Success: true,
        Charging: true,
        Failure: true,
        Reserved: true
    });

    const [reservation, setReservation] = useState(null);
    const [reservations, setReservations] = useState(null);

    // the following state variables are needed for ModalReservation
    const [show, setShow] = useState(false);
    const [arrivalTime, setArrivalTime] = useState("");
    const [departureTime, setDepartureTime] = useState("");
    const [owner, setOwner] = useState("");
    const [charger, setCharger] = useState("");
    const [vehicleModel, setVehicleModel] = useState("");
    const [vehicleName, setVehicleName] = useState("");
    const [vehicleLicensePlate, setVehicleLicensePlate] = useState("");
    const [smartV2G, setSmartV2G] = useState(true);
    const [availableChargers, setAvailableChargers] = useState(null);

    // the following state variables are needed for ModalVehicleState
    const [show2, setShow2] = useState(false);
    const [currentBattery, setCurrentBattery] = useState("");
    const [desiredFinalBattery, setDesiredFinalBattery] = useState("");
    const [actualArrivalTime, setActualArrivalTime] = useState("");

    // the following state variables are needed for ModalReservationEnd
    const [show3, setShow3] = useState(false);
    const [actualDepartureTime, setActualDepartureTime] = useState("");
    const [totalPowerTransmitted, setTotalPowerTransmitted] = useState("");
    const [parkingCostExtra, setParkingCostExtra] = useState("");

    // the following state variables are needed for ModalReservationView
    const [show4, setShow4] = useState(false);

    const checkState = (s) => {
        const newReservationState = JSON.parse(JSON.stringify(reservationState));
        newReservationState[s] = !newReservationState[s];
        setReservationState(newReservationState);
    }
    const createReservation = () => {
        setReservation(null);
        setShow(true);
    }
    const handleViewReservation = (reserv) => {
        setReservation(reserv);
        setShow4(true);
    }
    const handleVehicleArrived = (reserv) => {
        setReservation(reserv);
        setShow2(true);
    }
    const handleVehicleEnd = (reserv) => {
        setReservation(reserv);
        setShow3(true);
    }
    const handleEditReservation = async (reserv) => {
        setReservation(reserv);
        let arrival = stringToISOString(reserv.expected_arrival);
        let departure = stringToISOString(reserv.expected_departure);
        setArrivalTime(arrival);
        setDepartureTime(departure);
        let available_chargers = await getAvailables(arrival, departure, reserv.charger);

        for(const charger of available_chargers) {
            if (charger.id === reserv.charger.id) setCharger(charger);
        }

        setOwner(reserv.owner);
        setVehicleName(reserv.vehicle_name);
        setVehicleModel(reserv.model);
        setVehicleLicensePlate(reserv.license_plate);
        setShow(true);
    }
    const handleCancel = async (reservation_id) => {
        const data = await cancelReservation(getAuth(), station.id, reservation_id);
        if (data.ok) {
            alert.success('Reservation canceled successfully!');
            setShow(false);
            initializeInputState();
            searchReservations();
        } else {
            console.log("Something went wrong while canceling Reservation");
        }
    }

    const initializeInputState = () => {
        setArrivalTime("");
        setDepartureTime("");
        setCharger("");
        setAvailableChargers([]);
        setOwner("");
        setVehicleName("");
        setVehicleModel("");
        setVehicleLicensePlate("");
    }

    useEffect(() => {
        if (station.id === -1) return;
        searchReservations();
    }, [station])

    const fetchData = async () => {
        try {
            let {ok, data} = await getStation(getAuth(), id);
            if (!ok) {
                navigate("/app/not-authorized", { replace: true });
            }
            // check if data changed
            if (JSON.stringify(data) !== JSON.stringify(station)) setStation(data);

        } catch (err) {
            console.error(err.message);
        }
    };
    const searchReservations = async () => {
        setReservations(null);
        let starting_arrival = null;
        let ending_arrival = null;
        let starting_departure = null;
        let ending_departure = null;
        
        if (startingArrival === "" && endingArrival === ""
                && startingDeparture === "" && endingDeparture === "") {
            return;
        }
        if (startingArrival !== "") {
            starting_arrival = getTimeString(new Date(startingArrival));
        }
        if (endingArrival !== "") {
            ending_arrival = getTimeString(new Date(endingArrival));
        }
        if (startingDeparture !== "") {
            starting_departure = getTimeString(new Date(startingDeparture));
        }
        if (endingDeparture !== "") {
            ending_departure = getTimeString(new Date(endingDeparture));
        }

        let states = [];
        for (const key in reservationState) {
            if (reservationState[key]) {
                states.push(key);
            }
        }

        const req = await getReservations(getAuth(), station.id, 
                                         starting_arrival,
                                         ending_arrival,
                                         starting_departure,
                                         ending_departure,
                                         states);

        if (req.ok) {
            setReservations(req.data);
        } else {
            console.log("Something went wrong in retrieving reservations");
        }
    }
    const getAvailables = async (arrivalTime, departureTime, extra_charger=null) => {
        if (!arrivalTime || !departureTime) {
            return null;
        }
        let arrival_time = getTimeString(new Date(arrivalTime));
        let departure_time = getTimeString(new Date(departureTime));

        let req = await getAvailableChargers(getAuth(), station.id,
                                             arrival_time, departure_time);
        if (req.ok) {
            let newAvailableChargers = [];
            if (extra_charger !== null) {
                newAvailableChargers.push({
                    name: `${extra_charger["name"]}, ${extra_charger["current_price"]} €/KWh`,
                    id: extra_charger["id"]
                });
            }
            for (let i=0; i<req.data.length; i++) {
                newAvailableChargers.push({
                    name: `${req.data[i]["name"]}, ${req.data[i]["current_price"]} €/KWh`,
                    id: req.data[i]["id"]
                });
            }
            setAvailableChargers(newAvailableChargers);
            return newAvailableChargers;
        }
        else {
            console.error("Something Went wrong while fetching available Chargers");
            return null;
        }
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
        <Navbar4 stationName={station.name} stationId={id} active={"Reservations"}/>
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
                    <div className="flex-row-center-center full-width">
                        <div
                            className="my-checkbox-all"
                            onClick={() => checkState("Success")}>
                            <div className={"my-checkbox" + " " + (reservationState["Success"] ? "my-checkbox-checked" : "")} />
                            <p>Success</p>
                        </div>
                        <div
                            className="my-checkbox-all"
                            onClick={() => checkState("Canceled")}>
                            <div className={"my-checkbox" + " " + (reservationState["Canceled"] ? "my-checkbox-checked" : "")} />
                            <p>Canceled</p>
                        </div>
                        <div
                            className="my-checkbox-all"
                            onClick={() => checkState("Charging")}>
                            <div className={"my-checkbox" + " " + (reservationState["Charging"] ? "my-checkbox-checked" : "")} />
                            <p>Charging</p>
                        </div>
                        <div
                            className="my-checkbox-all"
                            onClick={() => checkState("Failure")}>
                            <div className={"my-checkbox" + " " + (reservationState["Failure"] ? "my-checkbox-checked" : "")} />
                            <p>Failure</p>
                        </div>
                        <div
                            className="my-checkbox-all"
                            onClick={() => checkState("Reserved")}>
                            <div className={"my-checkbox" + " " + (reservationState["Reserved"] ? "my-checkbox-checked" : "")} />
                            <p>Reserved</p>
                        </div>
                    </div>
                    <button
                        className="reservation-button"
                        onClick={searchReservations}
                    >
                        Search
                    </button>

                    {reservations && reservations.length > 0 ? (
                        <ul className={reservations ? "flex-column-start-center station-chargers-ul1" : "no-display"}>
                            {reservations.map(reservation => {
                                return (
                                    <li key={reservation.id} className="flex-row-between-center">

                                        <div>
                                            <h2>Owner: {reservation.owner}</h2>
                                            <p>Arrival Time: {reservation.expected_arrival}</p>
                                            <p>Departure Time: {reservation.expected_departure}</p>
                                            <p>Charger: {reservation.charger.name}</p>
                                            <p>State: 
                                            <>
                                                { ( reservation.state === "Reserved" ) ? (
                                                    <span className="span-state-black">{reservation.state}</span>
                                                ) : ( reservation.state === "Charging" ) ? (
                                                    <span className="span-state-blue">{reservation.state}</span>
                                                ) : ( reservation.state === "Success" ) ? (
                                                    <span className="span-state-green">{reservation.state}</span>
                                                ) : ( reservation.state === "Failure" ) ? (
                                                    <span className="span-state-red">{reservation.state}</span>
                                                ): ( reservation.state === "Canceled" ) ? (
                                                    <span className="span-state-red">{reservation.state}</span>
                                                ) : null}
                                            </>
                                            </p>
                                        </div>
                                        <div className="station-chargers-buttons">
                                            {reservation.state === "Reserved" ? (
                                                <>
                                                    <button
                                                        className="blue-button-transparent"
                                                        onClick={() => handleEditReservation(reservation)}
                                                    >
                                                        Edit Reservation
                                                    </button>
                                                    <button
                                                        onClick={() => handleVehicleArrived(reservation)}
                                                        className="green-button-transparent">Confirm Vehicle Arrived</button>
                                                </>
                                            ) : reservation.state === "Charging" ? (
                                                <button
                                                    onClick={() => handleVehicleEnd(reservation)}
                                                    className="green-button-transparent">End Vehicle Charging Session</button>
                                            ) : (reservation.state === "Success" || reservation.state === "Failure"
                                                    || reservation.state === "Canceled") ? (
                                                <button
                                                    onClick={() => handleViewReservation(reservation)}
                                                    className="black-button-transparent">View Reservation</button>
                                            ) : null}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : ( reservations === null ) ? (
                        <ReactLoading type="spin" color="#202020" height={50} width={50} className="loading"/>
                    ) : ( reservations.length === 0 ) ? (
                        <h3>No reservations to show for the given input.</h3>
                    ) : null}
                </div>
            </section>
            </div>
        </div>

        <ModalReservation
            show={show}
            setShow={setShow}
            id={id}
            stationId={station.id}
            arrivalTime={arrivalTime}
            setArrivalTime={setArrivalTime}
            departureTime={departureTime}
            setDepartureTime={setDepartureTime}
            owner={owner}
            setOwner={setOwner}
            charger={charger}
            setCharger={setCharger}
            reservation={reservation}
            vehicleModel={vehicleModel}
            setVehicleModel={setVehicleModel}
            vehicleName={vehicleName}
            setVehicleName={setVehicleName}
            vehicleLicensePlate={vehicleLicensePlate}
            setVehicleLicensePlate={setVehicleLicensePlate}
            smartV2G={smartV2G}
            setSmartV2G={setSmartV2G}
            getAvailables={getAvailables}
            availableChargers={availableChargers}
            searchReservations={searchReservations}
            initializeInputState={initializeInputState}
            handleCancel={handleCancel}
        />

        <ModalVehicleState
            show2={show2}
            setShow2={setShow2}
            stationId={station.id}
            reservation={reservation}
            currentBattery={currentBattery}
            setCurrentBattery={setCurrentBattery}
            desiredFinalBattery={desiredFinalBattery}
            setDesiredFinalBattery={setDesiredFinalBattery}
            actualArrivalTime={actualArrivalTime}
            setActualArrivalTime={setActualArrivalTime}
            searchReservations={searchReservations}
            initializeInputState={initializeInputState}
        />

        <ModalReservationEnd
            show={show3}
            setShow={setShow3}
            stationId={station.id}
            reservation={reservation}
            actualDepartureTime={actualDepartureTime}
            setActualDepartureTime={setActualDepartureTime}
            totalPowerTransmitted={totalPowerTransmitted}
            setTotalPowerTransmitted={setTotalPowerTransmitted}
            parkingCostExtra={parkingCostExtra}
            setParkingCostExtra={setParkingCostExtra}
            searchReservations={searchReservations}
            initializeInputState={initializeInputState}
        />

        <ModalReservationView
            show={show4}
            setShow={setShow4}
            reservation={reservation}
            initializeInputState={initializeInputState}
        />
    </>
    );
}
 
export default Reservations;
