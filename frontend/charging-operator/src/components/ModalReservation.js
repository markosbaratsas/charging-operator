import { useEffect, useState } from "react";
import { Modal } from 'react-bootstrap';
import '../bootstrap.css';
import { useAlert } from 'react-alert';

import Select from "./Select/Select";
import { addReservation, getAvailableChargers } from "../api/BackendCalls";

const ModalReservation = ({show, setShow, stationId}) => {

    const alert = useAlert();

    // the following state variables are needed for error handling
    const [arrivalTime, setArrivalTime] = useState("");
    const [departureTime, setDepartureTime] = useState("");
    const [owner, setOwner] = useState("");
    const [charger, setCharger] = useState("");

    const [availableChargers, setAvailableChargers] = useState([]);

    const [error, setError] = useState(false);
    const [chargerError, setChargerError] = useState(false);

    useEffect(async () => {
        console.log(arrivalTime, departureTime)
        if (!arrivalTime || !departureTime) {
            setAvailableChargers([]);
            return;
        }
        console.log("hello")

        try {
            let data = await getAvailableChargers(stationId, arrivalTime, departureTime);
            setAvailableChargers(data);
            console.log("here", data)
        } catch (err) {
            console.error(err.message);
        }


    }, [arrivalTime, departureTime])

    
    const handleClose = () => {
        setShow(false);
        initializeInputState();
    }
    const handleCreateReservation = async () => {
        // TODO: Add more checks in the given input
        try {
            let data = await addReservation({
                owner_name: owner,
                departure_time: departureTime,
                arrival_time: arrivalTime,
                charger: charger,
                station: stationId
            });
        } catch (err) {
            console.error(err.message);
            return;
        }
        console.log("Added new Reservation:", {
            owner_name: owner,
            departure_time: departureTime,
            arrival_time: arrivalTime,
            charger: charger,
            station: stationId
        })
        alert.success('Reservation added successfully');
        setShow(false);
        initializeInputState();
    }

    const initializeInputState = () => {
        setArrivalTime("");
        setDepartureTime("");
        setOwner("");
        setCharger("");
        setAvailableChargers([]);
        setError(false);
        setChargerError(false);
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
                <h1 className="modal-h1">Create Reservation</h1>
            </Modal.Header>
            <Modal.Body>
                <div className="charger-inputs">
                    
                    <div className="label-input-reservations1">
                        <h5>Owner Name</h5>
                        <input
                            type="text"
                            className={"my-classic-input"}
                            placeholder="Input Owner's name"
                            value={owner}
                            onChange={(e) => setOwner(e.target.value)}
                        />
                    </div>

                    <div className="label-input-reservations1">
                        <h5>Expected Arrival Date & Time:</h5>
                        <input
                            type="datetime-local"
                            className={"my-classic-input"}
                            value={arrivalTime}
                            onChange={(e) => setArrivalTime(e.target.value)}
                        />
                    </div>

                    {arrivalTime ? (
                        <div className="label-input-reservations1">
                            <h5>Expected Departure Date & Time:</h5>
                            <input
                                type="datetime-local"
                                className={"my-classic-input"}
                                value={departureTime}
                                onChange={(e) => setDepartureTime(e.target.value)}
                            />
                        </div>
                    ) : null}

                    {arrivalTime && departureTime ? (
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
                    ) : null}

                    



                    {/* errors */}
                    {(error) ?
                        <p className="error-p-input">Please correct the errors highlighted with <br /> red color, and then resubmit the form.</p>
                        : null}
                </div>
            </Modal.Body>
            <Modal.Footer className="modal-footer">
                <>
                    <button className="cancel-charger" onClick={handleClose}>
                        Cancel
                    </button>
                    <button className="submit-charger" onClick={handleCreateReservation}>
                        Add Reservation
                    </button>
                </>
            </Modal.Footer>
        </Modal>
    );
}
 
export default ModalReservation;
