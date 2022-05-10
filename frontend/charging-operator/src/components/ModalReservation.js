import { useEffect, useState } from "react";
import { Modal } from 'react-bootstrap';
import '../bootstrap.css';
import { useAlert } from 'react-alert';

import Select from "./Select2/Select";
import { createReservation, updateReservation } from "../api/BackendCalls";
import AuthProvider from "../context/AuthProvider";
import { getTimeString, stringToDatetime } from "../utils/usefulFunctions";


const OWNER_REGEX = /^[A-z0-9_\ ]{2,31}$/;
const VEHICLE_NAME_REGEX = /^[A-z0-9_\ ]{2,31}$/;
const VEHICLE_MODEL_REGEX = /^[A-z0-9_\ ]{2,31}$/;
const VEHICLE_LICENSE_PLATE = /^[A-z0-9\ ]{2,31}$/;


const ModalReservation = ({show, setShow, stationId, arrivalTime, setArrivalTime,
    departureTime, setDepartureTime, owner, setOwner, charger, setCharger,
    vehicleModel, setVehicleModel, vehicleName, setVehicleName, initializeInputState,
    vehicleLicensePlate, setVehicleLicensePlate, getAvailables, smartV2G, setSmartV2G,
    availableChargers, handleCancel, reservation, searchReservations}) => {

    const alert = useAlert();
    const { getAuth } = AuthProvider();

    const [arrivalTimeError, setArrivalTimeError] = useState(false);
    const [departureTimeError, setDepartureTimeError] = useState(false);
    const [chargerError, setChargerError] = useState(false);
    const [ownerError, setOwnerError] = useState(false);
    const [vehicleModelError, setVehicleModelError] = useState(false);
    const [vehicleNameError, setVehicleNameError] = useState(false);
    const [vehicleLicensePlateError, setVehicleLicensePlateError] = useState(false);

    useEffect(async () => {
        if (reservation !== null) {
            const expected_arrival = stringToDatetime(reservation.expected_arrival);
            const expected_departure = stringToDatetime(reservation.expected_departure);
            if (new Date(arrivalTime) <= expected_arrival
                    && expected_departure <= new Date(departureTime)) {
                await getAvailables(arrivalTime, departureTime, reservation.charger);
            }
            else {
                await getAvailables(arrivalTime, departureTime);
            }
        }
        else {
            await getAvailables(arrivalTime, departureTime);
        }
    }, [arrivalTime, departureTime])

    
    const handleClose = () => {
        setShow(false);
        initializeInputState();
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
        if (!OWNER_REGEX.test(owner)) {
            setOwnerError(true);
            errors = true;
        }
        if (!VEHICLE_NAME_REGEX.test(vehicleName)) {
            setVehicleNameError(true);
            errors = true;
        }
        if (!VEHICLE_MODEL_REGEX.test(vehicleModel)) {
            setVehicleModelError(true);
            errors = true;
        }
        if (!VEHICLE_LICENSE_PLATE.test(vehicleLicensePlate)) {
            setVehicleLicensePlateError(true);
            errors = true;
        }

        if (errors) return;

        let departure_time = getTimeString(new Date(departureTime));
        let arrival_time = getTimeString(new Date(arrivalTime));

        if (reservation === null) {
            const data = await createReservation(getAuth(), {
                departure_time: departure_time,
                arrival_time: arrival_time,
                charger_id: charger.id,
                station_id: stationId,
                owner_name: owner,
                vehicle_name: vehicleName,
                vehicle_model: vehicleModel,
                vehicle_license_plate: vehicleLicensePlate,
                smart_vtg: smartV2G
            });
            if (data.ok) {
                alert.success('Reservation created successfully');
                setShow(false);
                initializeInputState();
            }
            else {
                console.log("Something went wrong while creating reservation.");
            }
        } else {
            const data = await updateReservation(getAuth(), {
                reservation_id: reservation.id,
                departure_time: departure_time,
                arrival_time: arrival_time,
                charger_id: charger.id,
                station_id: stationId,
                owner_name: owner,
                vehicle_name: vehicleName,
                vehicle_model: vehicleModel,
                vehicle_license_plate: vehicleLicensePlate,
                smart_vtg: smartV2G
            });

            if (data.ok) {
                alert.success('Reservation updated successfully');
                setShow(false);
                initializeInputState();
            }
            else {
                console.log("Something went wrong while creating reservation.");
            }
        }
        searchReservations();
    }

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

    useEffect(() => {
        setChargerError(false);
        setOwnerError(false);
        setVehicleModelError(false);
        setVehicleNameError(false);
        setVehicleLicensePlateError(false);
    }, [charger, owner, vehicleName, vehicleModel, vehicleLicensePlate])
    

    return (
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            dialogClassName="my-modal-dialog"
            contentClassName="my-modal-content"
        >
            <Modal.Header  className="modal-header">
                <h1 className="modal-h1">Create Reservation</h1>
            </Modal.Header>
            <Modal.Body>
                <div className="charger-inputs">

                    <div className="label-input-reservations1">
                        <h5>Expected Arrival Date & Time:</h5>
                        <input
                            type="datetime-local"
                            className={"my-classic-input" + " " + (arrivalTimeError ? "error-selected" : "")}
                            value={arrivalTime}
                            onChange={(e) => setArrivalTime(e.target.value)}
                        />
                    </div>

                    {arrivalTime ? (
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
                                <Select
                                    initialText="Select Charger"
                                    options={availableChargers}
                                    label="Charger:"
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

                    {(arrivalTime && departureTime && availableChargers !== null
                            && availableChargers.length > 0 && charger) ? (
                        <>
                            <div className="label-input-reservations1">
                                <h5>Owner Name</h5>
                                <input
                                    type="text"
                                    className={"my-classic-input" + " " + (ownerError ? "error-selected" : "")}
                                    placeholder="Input Owner's name"
                                    value={owner}
                                    onChange={(e) => setOwner(e.target.value)}
                                />
                            </div>
                            {ownerError ?
                                <p className="error-p">Specify a Owner Name. 2-31 characters and
                                can include letters, numbers, spaces and underscores.</p>
                            : null}

                            <div className="label-input-reservations1">
                                <h5>Vehicle Name</h5>
                                <input
                                    type="text"
                                    className={"my-classic-input" + " " + (vehicleNameError ? "error-selected" : "")}
                                    placeholder="Input Vehicle's name"
                                    value={vehicleName}
                                    onChange={(e) => setVehicleName(e.target.value)}
                                />
                            </div>
                            {vehicleNameError ?
                                <p className="error-p">Specify a Vehicle Name. 2-31 characters and
                                can include letters, numbers, spaces and underscores.</p>
                            : null}

                            <div className="label-input-reservations1">
                                <h5>Vehicle Model</h5>
                                <input
                                    type="text"
                                    className={"my-classic-input" + " " + (vehicleModelError ? "error-selected" : "")}
                                    placeholder="Input Vehicle's model"
                                    value={vehicleModel}
                                    onChange={(e) => setVehicleModel(e.target.value)}
                                />
                            </div>
                            {vehicleModelError ?
                                <p className="error-p">Specify a Vehicle Model. 2-31 characters and
                                can include letters, numbers, spaces and underscores.</p>
                            : null}

                            <div className="label-input-reservations1">
                                <h5>Vehicle License Plate</h5>
                                <input
                                    type="text"
                                    className={"my-classic-input" + " " + (vehicleLicensePlateError ? "error-selected" : "")}
                                    placeholder="Input Vehicle's License Plate"
                                    value={vehicleLicensePlate}
                                    onChange={(e) => setVehicleLicensePlate(e.target.value)}
                                />
                            </div>
                            {vehicleLicensePlateError ?
                                <p className="error-p">Specify the Vehicle's license plate. 2-31 characters and
                                can include letters, numbers and spaces.</p>
                            : null}

                            <div className="flex-column-center-center full-width">
                                <div
                                    className="my-checkbox-all"
                                    onClick={() => setSmartV2G(!smartV2G)}>
                                    <div className={"my-checkbox" + " " + (smartV2G ? "my-checkbox-checked" : "")} />
                                    <p>Participate in V2G</p>
                                </div>
                            </div>
                        </>
                    ) : null}
                </div>
            </Modal.Body>
            <Modal.Footer className="modal-footer">
                <>
                    <button className="cancel-charger" onClick={handleClose}>
                        Close
                    </button>
                    {reservation === null ?(
                        <>
                            <button className="submit-charger" onClick={handleSubmit}>
                                Add Reservation
                            </button>
                        </>
                        ) : (
                        <>
                            <button className="delete-charger" onClick={() => handleCancel(reservation.id)}>
                                Cancel Reservation
                            </button>
                            <button className="submit-charger" onClick={handleSubmit}>
                                Update Reservation
                            </button>
                        </>
                        )}
                </>
            </Modal.Footer>
        </Modal>
    );
}
 
export default ModalReservation;
