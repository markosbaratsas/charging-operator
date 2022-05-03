import { useEffect, useState } from "react";
import { Modal } from 'react-bootstrap';
import '../bootstrap.css';
import { useAlert } from 'react-alert';

import AuthProvider from "../context/AuthProvider";
import { reservationEnd } from "../api/BackendCalls";


const ModalReservationEnd = ({ show, setShow, stationId, reservation, actualDepartureTime,
    setActualDepartureTime, totalPowerTransmitted, setTotalPowerTransmitted,
    searchReservations, initializeInputState}) => {

    const alert = useAlert();
    const { getAuth } = AuthProvider();

    const [actualDepartureTimeError, setActualDepartureTimeError] = useState(false);
    const [totalPowerTransmittedError, setTotalPowerTransmittedError] = useState(false);

    const handleClose = () => {
        setShow(false);
        initializeInputState();
    }
    const handleSubmit = async () => {
        let errors = false;
        if (totalPowerTransmitted === "" || totalPowerTransmitted*1.0 > 500 || totalPowerTransmitted*1.0 < 1) {
            setTotalPowerTransmittedError(true);
            errors = true;
        }
        if (!actualDepartureTime) {
            setActualDepartureTimeError(true);
            errors = true;
        }

        if (errors) return;

        const req = await reservationEnd(getAuth(), stationId, 
                        reservation.id, totalPowerTransmitted,
                        actualDepartureTime);
        if (req.ok) {
            alert.success('Reservation ended successfully');
            setShow(false);
            initializeInputState();
            searchReservations();
        }
        else {
            console.log("Something went wrong while trying to end reservation.");
        }
    }

    useEffect(() => {
        setActualDepartureTimeError(false);
        setTotalPowerTransmittedError(false);
    }, [actualDepartureTime, totalPowerTransmitted])

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
                <h1 className="modal-h1">End Reservation</h1>
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
                            <div className="full-width flex-row-between-center"><h3>Energy Cost:</h3> <h4>{reservation.energy_cost} €/KW</h4></div>
                        </div>
                    : null}

                    <div className="label-input-reservations1">
                        <h5>Total Power Transmitted (kW)</h5>
                        <input
                            type="number"
                            min="1"
                            max="500"
                            step="1"
                            className={"my-classic-input" + " " + (totalPowerTransmittedError ? "error-selected" : "")}
                            placeholder="Input Total Power Transmitted"
                            value={totalPowerTransmitted}
                            onChange={(e) => setTotalPowerTransmitted(e.target.value)}
                        />
                    </div>
                    {totalPowerTransmittedError ?
                        <p className="error-p">Total power transmitted should be a number between 1 and 500.
                        It is the difference between the initial battery of the vehicle before the charging begins
                        and the battery after the charging session ends.</p>
                        : null}

                    <div className="label-input-reservations1">
                        <h5>Actual Departure Date & Time:</h5>
                        <input
                            type="datetime-local"
                            className={"my-classic-input" + " " + (actualDepartureTimeError ? "error-selected" : "")}
                            value={actualDepartureTime}
                            onChange={(e) => setActualDepartureTime(e.target.value)}
                        />
                    </div>
                    {actualDepartureTimeError ?
                        <p className="error-p">Please select date and time.</p>
                    : null}
                </div>
            </Modal.Body>
            <Modal.Footer className="modal-footer">
                <>
                    <button className="cancel-charger" onClick={handleClose}>
                        Cancel
                    </button>
                    <button className="submit-charger" onClick={handleSubmit}>
                        End Reservation
                    </button>
                </>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalReservationEnd;
