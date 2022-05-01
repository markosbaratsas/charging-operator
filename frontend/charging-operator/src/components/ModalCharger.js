import { useEffect, useState } from "react";
import { Modal } from 'react-bootstrap';
import '../bootstrap.css';
import { useAlert } from "react-alert";

import Select from "./Select/Select";
import { my_includes } from "../utils/usefulFunctions";
import { createCharger, updateCharger } from "../api/BackendCalls";
import AuthProvider from "../context/AuthProvider";


const CHARGER_NAME_REGEX = /^[A-z0-9_\ ]{2,32}$/;
const GROUP_NAME_REGEX = /^[A-z0-9_\ ]{2,32}$/;

const charger_info = {
    AC: {
        type: [
            {
                name: "Type 1",
                id: 1
            },
            {
                name: "Type 2",
                id: 2
            },
            {
                name: "3-pin plug",
                id: 3
            }
        ],
        power: {
            min_power: 0.2,
            maxPower: 1000
        }
    },
    DC: {
        type: [
            {
                name:"CHAdeMO",
                id: 1
            },
            {
                name:"Combined Charging System (CCS)",
                id: 2
            },
            {
                name:"Type 2",
                id: 3
            }
    ],
        power: {
            min_power: 0.2,
            maxPower: 1000
        }
    }
}


const ModalCharger = ({station, current, setCurrent, type, setType, power, setPower,
        chargerName, setChargerName, chargerGroupId, handleDelete, chargerId,
        initializeInputState, show, setShow, initializeFetchedData}) => {

    const alert = useAlert();
    const { getAuth } = AuthProvider();

    // the following state variables are needed for error handling
    const [currentError, setCurrentError] = useState(false);
    const [typeError, setTypeError] = useState(false);
    const [powerError, setPowerError] = useState(false);
    const [chargerNameError, setChargerNameError] = useState(false);


    const handleClose = () => {
        setShow(false);
        initializeInputState();
    }
    // used when updating a charger
    const handleSubmit = async () => {
        if (!checkInput()) return;

        if (chargerId === -1) {

            const data = await createCharger(getAuth(), station.id, {
                current: current,
                connector_type: type,
                power: power,
                charger_name: chargerName,
                charger_id: null,
                charger_group: chargerGroupId
            });

            if (data.ok) {
                alert.success('Charger created successfully!');
                setShow(false);
                initializeInputState();
                initializeFetchedData();
            } else {
                console.log("Something went wrong while creating Charger");
            }
        } else {
            const data = await updateCharger(getAuth(), station.id, {
                current: current,
                connector_type: type,
                power: power,
                charger_name: chargerName,
                charger_id: chargerId,
                charger_group: chargerGroupId
            });

            if (data.ok) {
                alert.success('Charger updated successfully!');
                setShow(false);
                initializeInputState();
                initializeFetchedData();
            } else {
                console.log("Something went wrong while updating Charger");
            }
        }
    }

    const checkInput = () => {
        let errors = false;
        if (!Object.keys(charger_info).includes(current)) {
            setCurrentError(true);
            errors = true;
        }

        if (!my_includes(charger_info[current]["type"], type)) {
            setTypeError(true);
            errors = true;
        }

        if (0.2 > power*1.0 || power*1.0 > 1000.0) {
            setPowerError(true);
            errors = true;
        }

        if (!CHARGER_NAME_REGEX.test(chargerName)) {
            setChargerNameError(true);
            errors = true;
        }

        if (!errors) return true;
        return false;
    }

    useEffect(() => {
        setPowerError(false);
    }, [power])
    
    useEffect(() => {
        setChargerNameError(false);
    }, [chargerName])

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
                {chargerId === -1 ? (
                    <h1 className="modal-h1">Add Charger</h1>
                ) : (
                    <h1 className="modal-h1">Edit Charger</h1>
                )}
            </Modal.Header>
            <Modal.Body>
                <div className="charger-inputs">
                    <Select 
                        initialText="Type of current"
                        options={[{name: "DC", id: 1}, {name: "AC", id: 2}]}
                        label="Current"
                        selected={current}
                        setSelected={setCurrent}
                        width="80%"
                        error={currentError}
                        setError={setCurrentError}
                        tabIndex={0}
                        reset={[]}
                    />
                    {current ? (
                        <Select 
                            initialText="Connector Type"
                            options={charger_info[current]["type"]}
                            label="Connector Type"
                            selected={type}
                            setSelected={setType}
                            error={typeError}
                            setError={setTypeError}
                            width="80%"
                            tabIndex={1}
                            reset={[current]}
                        />

                    ) : null}

                    {current ? (
                        <div className="label-input">
                            <h5>Power</h5>
                            <input
                                type="number"
                                min="0.2"
                                max="1000"
                                step="0.1"
                                className={"my-classic-input" + " " + (powerError ? "error-selected" : "")}
                                placeholder="Input power"
                                value={power}
                                onChange={(e) => setPower(e.target.value)}
                            />
                        </div>
                    ) : null}

                    {current ? (
                        <div className="input-with-help">
                            <div className="label-input">
                                <h5>Charger's Name</h5>
                                <input
                                    type="text"
                                    className={"my-classic-input" + " " + (chargerNameError ? "error-selected" : "")}
                                    placeholder="Input Charger's name"
                                    value={chargerName}
                                    onChange={(e) => setChargerName(e.target.value)}
                                />
                            </div>
                            <p><span>Specify a name for your charger. 2-32 characters and can include letters, numbers and underscores.</span></p>
                        </div>
                    ) : null}

                    {chargerNameError ?
                        <p className="error-p">Each charger's name should be unique.</p>
                        : null}

                    {(currentError || typeError || powerError || chargerNameError) ?
                        <p className="error-p-input">Please correct the errors highlighted with <br /> red color, and then resubmit the form.</p>
                        : null}
                </div>
            </Modal.Body>
            <Modal.Footer className="modal-footer">
                <button className="cancel-charger" onClick={handleClose}>
                    Cancel
                </button>
                {chargerId === -1 ? ( 
                    <button className="submit-charger" onClick={handleSubmit}>
                        Create Charger
                    </button>
                 ) : (
                    <>
                        <button className="delete-charger" onClick={() => handleDelete(chargerId, chargerGroupId)}>
                            Delete Charger
                        </button>
                        <button className="submit-charger" onClick={handleSubmit}>
                            Update Charger
                        </button>
                    </>
                )}
            </Modal.Footer>
        </Modal>
    );
}
 
export default ModalCharger;
