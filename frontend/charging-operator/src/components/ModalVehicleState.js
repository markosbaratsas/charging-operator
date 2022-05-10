import { useEffect, useState } from "react";
import { Modal } from 'react-bootstrap';
import '../bootstrap.css';
import { useAlert } from 'react-alert';

import AuthProvider from "../context/AuthProvider";
import { vehicleArrived } from "../api/BackendCalls";


const ModalVehicleState = ({ show2, setShow2, stationId, reservation, currentBattery,
    setCurrentBattery, desiredFinalBattery, setDesiredFinalBattery, searchReservations,
    initializeInputState, actualArrivalTime, setActualArrivalTime}) => {

    const alert = useAlert();
    const { getAuth } = AuthProvider();

    const [currentBatteryError, setCurrentBatteryError] = useState(false);
    const [desiredFinalBatteryError, setDesiredFinalBatteryError] = useState(false);
    const [actualArrivalTimeError, setActualArrivalTimeError] = useState(false);

    const handleClose = () => {
        setShow2(false);
        initializeInputState();
    }
    const handleSubmit = async () => {
        let errors = false;
        if (currentBattery === "" || currentBattery*1.0 > 500 || currentBattery*1.0 < 1) {
            setCurrentBatteryError(true);
            errors = true;
        }
        if (desiredFinalBattery === "" || desiredFinalBattery*1.0 > 500 || desiredFinalBattery*1.0 < 0) {
            setDesiredFinalBatteryError(true);
            errors = true;
        }
        if (!actualArrivalTime) {
            setActualArrivalTimeError(true);
            errors = true;
        }

        if (errors) return;

        const req = await vehicleArrived(getAuth(), stationId, 
                        reservation.id, actualArrivalTime,
                        currentBattery, desiredFinalBattery);
        if (req.ok) {
            alert.success('State updated successfully');
            setShow2(false);
            initializeInputState();
            searchReservations();
        }
        else {
            console.log("Something went wrong while updating vehicle state.");
        }
    }

    useEffect(() => {
        setCurrentBatteryError(false);
        setDesiredFinalBatteryError(false);
        setActualArrivalTimeError(false);
    }, [currentBattery, desiredFinalBattery, actualArrivalTime])

    return (
        <Modal
            show={show2}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            dialogClassName="my-modal-dialog"
            contentClassName="my-modal-content"
        >
            <Modal.Header  className="modal-header">
                <h1 className="modal-h1">Confirm Vehicle Arrived</h1>
            </Modal.Header>
            <Modal.Body>
                <div className="charger-inputs">

                    {reservation ?
                        <div className="vehicle-info">
                            <h2>Reservation Information</h2>
                            <div className="full-width flex-row-between-center"><h3>Owner:</h3> <h4>{reservation.owner}</h4></div>
                            <div className="full-width flex-row-between-center"><h3>Vehicle Model:</h3> <h4>{reservation.model}</h4></div>
                            <div className="full-width flex-row-between-center"><h3>Vehicle License Plate:</h3> <h4>{reservation.license_plate}</h4></div>
                            <div className="full-width flex-row-between-center"><h3>Charger:</h3> <h4>{reservation.charger.name}</h4></div>
                            <div className="full-width flex-row-between-center"><h3>Reserved Price per KWh:</h3> <h4>{reservation.price_per_kwh} €/KWh</h4></div>
                        </div>
                    : null}

                    <div className="label-input-reservations1">
                        <h5>Current Battery</h5>
                        <input
                            type="number"
                            min="1"
                            max="500"
                            step="1"
                            className={"my-classic-input" + " " + (currentBatteryError ? "error-selected" : "")}
                            placeholder="Input Current Battery"
                            value={currentBattery}
                            onChange={(e) => setCurrentBattery(e.target.value)}
                        />
                    </div>
                    {currentBatteryError ?
                        <p className="error-p">Current Battery should be a number between 1 and 500.</p>
                        : null}

                    <div className="label-input-reservations1">
                        <h5>Actual Arrival Date & Time:</h5>
                        <input
                            type="datetime-local"
                            className={"my-classic-input" + " " + (actualArrivalTimeError ? "error-selected" : "")}
                            value={actualArrivalTime}
                            onChange={(e) => setActualArrivalTime(e.target.value)}
                        />
                    </div>
                    {actualArrivalTimeError ?
                        <p className="error-p">Please select date and time.</p>
                    : null}

                    <div className="label-input-reservations1">
                        <h5>Desired Final Battery</h5>
                        <input
                            type="number"
                            min="1"
                            max="500"
                            step="1"
                            className={"my-classic-input" + " " + (desiredFinalBatteryError ? "error-selected" : "")}
                            placeholder="Input Desired Final Battery"
                            value={desiredFinalBattery}
                            onChange={(e) => setDesiredFinalBattery(e.target.value)}
                        />
                    </div>
                    {desiredFinalBatteryError ?
                        <p className="error-p">Desired Final Battery should be a number between 1 and 500.</p>
                        : null}

                    {reservation && currentBattery && desiredFinalBattery ?
                    <h4 className="comment-h4">Expected energy cost: {reservation.price_per_kwh} * ({desiredFinalBattery} - {currentBattery}) = <span>{(reservation.price_per_kwh * (desiredFinalBattery - currentBattery)).toFixed(2)} €</span></h4>
                    : null}
                </div>
            </Modal.Body>
            <Modal.Footer className="modal-footer">
                <>
                    <button className="cancel-charger" onClick={handleClose}>
                        Cancel
                    </button>
                    <button className="submit-charger" onClick={handleSubmit}>
                        Confirm Arrival
                    </button>
                </>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalVehicleState;
