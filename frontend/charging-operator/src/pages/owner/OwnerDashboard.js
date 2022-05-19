import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactLoading from 'react-loading';
import { useAlert } from 'react-alert';

import { deleteVehicle, getOwner, getStations, getVehicles, ownerReservations } from '../../api/BackendCalls';
import AuthProvider from '../../context/AuthProvider';
import useTitle from '../../hooks/useTitle';
import ModalVehicle from '../../components/ModalVehicle';
import ModalOwner from '../../components/ModalOwner';


const OwnerDashboard = ({title}) => {
    useTitle({title});

    const { getAuth } = AuthProvider();
    const alert = useAlert();

    const [owner, setOwner] = useState(null);
    const [vehicles, setVehicles] = useState(null);
    const [reservations, setReservations] = useState(null);

    // ModalOwner
    const [show1, setShow1] = useState(false);
    const [ownerName, setOwnerName] = useState("");
    const [phone, setPhone] = useState("");
    
    // ModalVehicle
    const [show2, setShow2] = useState(false);
    const [name, setName] = useState("");
    const [licensePlate, setLicensePlate] = useState("");

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

            data = await ownerReservations(getAuth());
            if (JSON.stringify(data) !== JSON.stringify(reservations)) {
                setReservations(data);
            }
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
    }, [owner, vehicles])

    const handleEditOwner = () => {
        if (!owner) return;
        setOwnerName(owner.name);
        setPhone(owner.phone);
        setShow1(true);
    }

    const handleDeleteVehicle = async (vehicle_id) => {
        let data = await deleteVehicle(getAuth(), vehicle_id);
        if (data.ok) {
            alert.success('Vehicle deleted successfully');
            setVehicles(null);
        }
        else {
            console.log("Something went wrong while deleting vehicle.");
        }
    }

    const handleAddVehicle = () => {
        if (!owner) return;
        setShow2(true);
    }

    const initializeInputState = () => {
        setName("");
        setLicensePlate("");
        setVehicles(null);
    }

    return (
        <section className="owner-dashboard flex-column-start-center">
            <h1 className="app-page-title">Dashboard </h1>

            <div className="flex-column-center-center owner-div">
                <h2>Your Information</h2>
                {!owner ? <ReactLoading type="balls" color="#202020" height={30} width={30} className="loading"/>
                : (
                    <>
                        <div className="flex-row-between-center">
                            <h3><span>Name:</span> {owner.name}</h3>
                            <h3><span>Phone:</span> {owner.phone}</h3>
                        </div>
                        <button className="owner-button" onClick={handleEditOwner}>
                            <h5>Edit</h5>
                        </button>
                    </>
                )}
            </div>

            <div className="flex-column-center-center owner-div width-800">
                <h2>Your vehicles</h2>
                {!vehicles ? <ReactLoading type="balls" color="#202020" height={30} width={30} className="loading"/>
                : (
                    <>
                        {vehicles.length > 0 ?
                            <ul className="vehicles-ul">
                                {vehicles.map((vehicle) => {
                                    return (
                                        <li key={vehicle.id} className="flex-row-between-center">
                                            <div>
                                                <h2>{vehicle.name}, {vehicle.license_plate}</h2>
                                                <p>{vehicle.model.manufacturer} {vehicle.model.name}</p>
                                                <p>Capacity: {parseFloat(vehicle.model.battery_capacity).toFixed(1)} KWh</p>
                                            </div>
                                            <div className="station-chargers-buttons">
                                                <button
                                                    onClick={() => handleDeleteVehicle(vehicle.id)}
                                                    className="station-chargers-buttons-delete">Delete Vehicle</button>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        : null}
                        <button className="owner-button" onClick={handleAddVehicle}>
                            <h4>+</h4>
                        </button>
                    </>
                )}
            </div>
            
            <Link className="owner-button" to="/owner/create-reservation">
                <h6>Create a new Reservation</h6>
            </Link>
            <br />
            <br />
            <br />

            <div className="flex-column-center-center owner-div width-800">
                <h2>Reservations that you created</h2>
                {!reservations ? <ReactLoading type="balls" color="#202020" height={30} width={30} className="loading"/>
                : (
                    <>
                        {reservations.length > 0 ?
                            <ul className="vehicles-ul">
                                {reservations.map(reservation => {
                                    return (
                                        <li key={reservation.id} className="flex-row-between-center">
                                            <div>
                                                <h2>{reservation.station.name} | {reservation.station.address}</h2>
                                                <p>{reservation.vehicle_name}, {reservation.license_plate}</p>
                                                <p>Arrival Time: {reservation.expected_arrival}</p>
                                                <p>Departure Time: {reservation.expected_departure}</p>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        : null}
                    </>
                )}
            </div>

            <ModalOwner
                initializeInputState={initializeInputState}
                ownerName={ownerName}
                setOwnerName={setOwnerName}
                phone={phone}
                setPhone={setPhone}
                show={show1}
                setShow={setShow1}
            />

            <ModalVehicle
                initializeInputState={initializeInputState}
                name={name}
                setName={setName}
                licensePlate={licensePlate}
                setLicensePlate={setLicensePlate}
                show={show2}
                setShow={setShow2}
            />

        </section>
    );
}

export default OwnerDashboard;
