import { Modal } from 'react-bootstrap';
import '../bootstrap.css';
import TableRow from './TableRow';

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
                    <TableRow
                        description={"Reservation ID:"}
                        value={reservation.id}
                    />
                    <TableRow
                        description={"State:"}
                        value={reservation.state}
                    />
                    <TableRow
                        description={"Charger:"}
                        value={reservation.charger.name}
                    />
                    <TableRow
                        description={"Expected Arrival Time:"}
                        value={reservation.expected_arrival}
                    />
                    <TableRow
                        description={"Actual Arrival Time:"}
                        value={reservation.actual_arrival}
                    />
                    <TableRow
                        description={"Expected Departure Time:"}
                        value={reservation.expected_departure}
                    />
                    <TableRow
                        description={"Actual Departure Time:"}
                        value={reservation.actual_departure}
                    />

                    <h2>Vehicle Information</h2>
                    <TableRow
                        description={"Vehicle Model:"}
                        value={reservation.model}
                    />
                    <TableRow
                        description={"Vehicle Lisence Plate:"}
                        value={reservation.license_plate}
                    />
                    <TableRow
                        description={"Vehicle Owner:"}
                        value={reservation.owner}
                    />

                    <h2>Cost Information</h2>
                    <TableRow
                        description={"Total Power Transmitted:"}
                        value={parseFloat(reservation.total_power_transmitted).toFixed(1) + " KW"}
                    />
                    <TableRow
                        description={"Price per KW:"}
                        value={parseFloat(reservation.price_per_kwh).toFixed(2) + " €/KW"}
                    />
                    <TableRow
                        description={"Total Energy Cost:"}
                        value={parseFloat(reservation.energy_cost).toFixed(2) + " €"}
                        help={`Total Energy Cost is calculated by multiplying the
                        amount of the total power transmitted and the price per KW.`}
                    />
                    <TableRow
                        description={"Parking Cost:"}
                        value={parseFloat(reservation.parking_cost).toFixed(2) + " €"}
                    />
                    <TableRow
                        description={"Parking Cost Extra:"}
                        value={parseFloat(reservation.parking_cost_extra).toFixed(2) + " €"}
                        help={`Parking Cost Extra is an extra cost, that arises when the vehicle arrived 
                        at and/or left from the station on a different hour than the reserved hour.`}
                    />
                    <TableRow
                        description={"Total Cost:"}
                        value={parseFloat(reservation.total_cost).toFixed(2) + " €"}
                        help={`Total Cost is calculated by adding all of the above costs.`}
                    />
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
