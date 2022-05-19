import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReactLoading from 'react-loading';
import { useAlert } from 'react-alert';

import Map from "../../components/Map1/Map";
import { getAvailableChargers, getMarkers, getOwner, getVehicles, ownerCreateReservation } from '../../api/BackendCalls';
import AuthProvider from '../../context/AuthProvider';
import useTitle from '../../hooks/useTitle';
import Select from "../../components/Select3/Select";
import { getTimeString } from '../../utils/usefulFunctions';


const OwnerReservation = ({title}) => {
    useTitle({title});

    const { getAuth } = AuthProvider();
    const navigate = useNavigate();
    const alert = useAlert();

    const [owner, setOwner] = useState(null);
    const [markers, setMarkers] = useState(null);
    const [vehicles, setVehicles] = useState(null);
    const [availableChargers, setAvailableChargers] = useState(null);

    const [station, setStation] = useState(null);
    const [vehicle, setVehicle] = useState(null);
    const [arrivalTime, setArrivalTime] = useState("");
    const [departureTime, setDepartureTime] = useState("");
    const [charger, setCharger] = useState("");
    const [smartV2G, setSmartV2G] = useState(true);

    const [vehicleError, setVehicleError] = useState(false);
    const [arrivalTimeError, setArrivalTimeError] = useState(false);
    const [departureTimeError, setDepartureTimeError] = useState(false);
    const [chargerError, setChargerError] = useState(false);

    const fetchData = async () => {
        try {
            let data = await getOwner(getAuth());
            if (JSON.stringify(data) !== JSON.stringify(owner)) {
                setOwner(data);
            }

            data = await getVehicles(getAuth());
            if (JSON.stringify(data) !== JSON.stringify(vehicles)) {
                setVehicles(data);
            }

            data = await getMarkers(getAuth());
            if (JSON.stringify(data) !== JSON.stringify(markers)) {
                setMarkers(data);
            }

        } catch (err) {
            console.error(err.message);
        }
    };

    const getAvailables = async (arrivalTime, departureTime, extra_charger=null) => {
        if (!arrivalTime || !departureTime || !station) {
            return null;
        }
        let arrival_time = getTimeString(new Date(arrivalTime));
        let departure_time = getTimeString(new Date(departureTime));

        let req = await getAvailableChargers(getAuth(), station.id,
                                             arrival_time, departure_time);
        console.log(req.ok)
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
            console.log("Something Went wrong while fetching available Chargers");
            return null;
        }
    }

    useEffect(() => {
        fetchData();
        const interval = setInterval(() => {
            fetchData();
        }, 5000);
        return () => clearInterval(interval);
    }, [owner, vehicles, markers])

    useEffect(() => {
        if (new Date(arrivalTime).getTime() >= new Date(departureTime).getTime()) {
            setArrivalTimeError(true);
            setDepartureTimeError(true);
        }
        else {
            setArrivalTimeError(false);
            setDepartureTimeError(false);
        }
    }, [arrivalTime, departureTime])

    useEffect(async () => {
        await getAvailables(arrivalTime, departureTime);
    }, [arrivalTime, departureTime])

    useEffect(async () => {
        setAvailableChargers(null);
        await getAvailables(arrivalTime, departureTime);
    }, [station])

    useEffect(async () => {
        setVehicleError(false);
    }, [vehicle])

    const initializeInputState = () => {
        setAvailableChargers(null);
        setStation(null);
        setVehicle(null);
        setArrivalTime("");
        setDepartureTime("");
        setCharger("");
        setSmartV2G(true);
    }

    const handleSubmit = async () => {
        let errors = false;
        if (!arrivalTime || !departureTime) {
            setArrivalTimeError(true);
            setDepartureTimeError(true);
            errors = true;
        }
        if (new Date(arrivalTime).getTime() >= new Date(departureTime).getTime()) {
            setArrivalTimeError(true);
            setDepartureTimeError(true);
            errors = true;
        }
        if (!vehicle) {
            setVehicleError(true);
            errors = true;
        }
        if (!charger) {
            setChargerError(true);
            errors = true;
        }

        if (errors) return;

        let departure_time = getTimeString(new Date(departureTime));
        let arrival_time = getTimeString(new Date(arrivalTime));

        const data = await ownerCreateReservation(getAuth(), {
            departure_time: departure_time,
            arrival_time: arrival_time,
            charger_id: charger.id,
            station_id: station.id,
            vehicle_id: vehicle.id,
            smart_vtg: smartV2G
        });
        if (data.ok) {
            alert.success('Reservation created successfully');
            initializeInputState();
            navigate('/owner/dashboard', { replace: true });
        }
        else {
            console.log("Something went wrong while creating reservation.");
        }

    }

    return (
        <div className="flex-column-center-center">
            <section className="owner-reservation flex-column-start-center">
                <h1 className="app-page-title">Create a new Reservation</h1>

                <div className="flex-column-center-center owner-div">
                    <h2>Your Information</h2>
                    {!owner ? <ReactLoading type="balls" color="#202020" height={30} width={30} className="loading"/>
                    : (
                        <>
                            <div className="flex-row-between-center">
                                <h3><span>Name:</span> {owner.name}</h3>
                                <h3><span>Phone:</span> {owner.phone}</h3>
                            </div>
                            <p className="disclosure-p">This information will be shared to the Station's operators.</p>
                        </>
                    )}
                </div>

                <p className="change-info-p">If you want to add another car <br />
                or change your information,<br />
                <Link to='/owner/dashboard'>go to Dashboard</Link>.</p>
                <br />


                {markers ?
                <div className="map-div">
                    <Map
                        stationSelected={station}
                        setStationSelected={setStation}
                        markers={markers}
                    />
                </div>
                : null}
                
                {station ? (
                    <div className="selected-station">
                        <h4>Selected station:</h4>
                        <h5>Name: <span>{station.name}</span></h5>
                        <h5>Address: <span>{station.address}</span></h5>
                    </div>
                ) : (
                    <h6 className="disclosure-p">Please select a station</h6>
                )}

                {station && vehicles ?
                    <div className="label-input-reservations1">
                        <h5>Select vehicle:</h5>
                        <Select
                            initialText="Select"
                            options={vehicles}
                            selected={vehicle}
                            setSelected={setVehicle}
                            width="100%"
                            tabIndex={0}
                            reset={[]}
                        />
                    </div>
                : null}
                {vehicleError ? <p className="error-p">Please select a vehicle.</p>
                : null}
                <br />

                {station && vehicle ?
                    <div className="label-input-reservations1">
                        <h5>Expected Arrival Date & Time:</h5>
                        <input
                            type="datetime-local"
                            className={"my-classic-input" + " " + (arrivalTimeError ? "error-selected" : "")}
                            value={arrivalTime}
                            onChange={(e) => setArrivalTime(e.target.value)}
                        />
                    </div>
                : null}

                {station && vehicle && arrivalTime ? (
                    <div className="label-input-reservations1">
                        <h5>Expected Departure Date & Time:</h5>
                        <input
                            type="datetime-local"
                            className={"my-classic-input" + " " + (departureTimeError ? "error-selected" : "")}
                            value={departureTime}
                            onChange={(e) => setDepartureTime(e.target.value)}
                        />
                    </div>
                ) : null}

                {arrivalTimeError || departureTimeError ? (
                    <p className="error-p">Arrival should be a later Date & Time than Departure Date & Time.
                    Also, arrival should be a future date.</p>
                ) : null}

                {!(arrivalTimeError || departureTimeError) && arrivalTime && departureTime && availableChargers !== null ? (
                    availableChargers.length > 0 ? (
                        <div className="label-input-reservations1">
                            <h5>Select Charger:</h5>
                            <Select
                                initialText="Select Charger"
                                options={availableChargers}
                                selected={charger}
                                setSelected={setCharger}
                                width="100%"
                                error={chargerError}
                                setError={setChargerError}
                                tabIndex={0}
                                reset={[]}
                            />
                        </div>
                    ) : (
                        <p>Sorry, there are no available chargers for the given combination of arrival and departure.</p>
                    )
                ) : null}

                {arrivalTime && departureTime && charger ?
                    <div className="flex-column-center-center full-width">
                        <div
                            className="my-checkbox-all"
                            onClick={() => setSmartV2G(!smartV2G)}>
                            <div className={"my-checkbox" + " " + (smartV2G ? "my-checkbox-checked" : "")} />
                            <p>Participate in V2G</p>
                        </div>
                    </div>
                : null}

                {arrivalTime && departureTime && charger ?
                    <button className="owner-button" onClick={handleSubmit}>
                        <h6>Create a new Reservation</h6>
                    </button>
                : null}
            </section>
        </div>
    );
}

export default OwnerReservation;
