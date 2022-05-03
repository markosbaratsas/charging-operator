import { Modal } from 'react-bootstrap';
import '../bootstrap.css';

const ModalReservationView = ({ show, setShow, reservation, initializeInputState}) => {

    const handleClose = () => {
        setShow(false);
        initializeInputState();
    }

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
                <h1 className="modal-h1">View Reservation</h1>
            </Modal.Header>
            <Modal.Body>
                {reservation !== null ?
                <div className="full-width flex-column-center-center reservation-view">
                    <h2>General Information</h2>
                    <div className="full-width flex-row-between-center">
                        <div className="flex-column-start-start reservation-view-titles">
                            <h3>Reservation ID:</h3>
                            <h3>State:</h3>
                            <h3>Charger:</h3>
                            <h3>Arrival Time:</h3>
                            <h3>Departure Time:</h3>
                        </div>
                        <div className="flex-column-start-start reservation-view-numbers">
                            <h4>{reservation.id}</h4>
                            <h4>{reservation.state}</h4>
                            <h4>{reservation.charger.name}</h4>
                            <h4>{reservation.actual_arrival}</h4>
                            <h4>{reservation.actual_departure}</h4>
                        </div>
                    </div>

                    <h2>Vehicle Information</h2>
                    <div className="full-width flex-row-between-center">
                        <div className="flex-column-start-start reservation-view-titles">
                            <h3>Vehicle Model:</h3>
                            <h3>Vehicle Lisence Plate:</h3>
                            <h3>Vehicle Owner:</h3>
                        </div>
                        <div className="flex-column-start-start reservation-view-numbers">
                            <h4>{reservation.model}</h4>
                            <h4>{reservation.license_plate}</h4>
                            <h4>{reservation.owner}</h4>
                        </div>
                    </div>

                    <h2>Cost Information</h2>
                    <div className="full-width flex-row-between-center">
                        <div className="flex-column-start-start reservation-view-titles">
                            <h3>Total Power Transmitted:</h3>
                            <h3>Price per KW:</h3>
                            <h3>Total Energy Cost:</h3>
                        </div>
                        <div className="flex-column-start-start reservation-view-numbers">
                            <h4>{parseFloat(reservation.total_power_transmitted).toFixed(1)} KW</h4>
                            <h4>{parseFloat(reservation.price_per_kwh).toFixed(2)} €/KW</h4>
                            <h4>{parseFloat(reservation.energy_cost).toFixed(2)} €</h4>
                        </div>
                    </div>
                    <p>Total Energy Cost is calculated by multiplying the
                        amount of the total power transmitted and the price per KW.</p>

                    <div className="full-width flex-row-between-center">
                        <div className="flex-column-start-start reservation-view-titles">
                                <h3>Total Parking Cost:</h3>
                                <h3>Total Cost:</h3>
                            </div>
                        <div className="flex-column-start-start reservation-view-numbers">
                            <h4>{parseFloat(reservation.parking_cost).toFixed(2)}€</h4>
                            <h4>{parseFloat(reservation.total_cost).toFixed(2)} €</h4>
                        </div>
                    </div>

                </div>
                : null}
            </Modal.Body>
            <Modal.Footer className="modal-footer">
                <>
                    <button className="cancel-charger" onClick={handleClose}>
                        Close
                    </button>
                </>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalReservationView;
