import { useEffect, useState } from "react";
import { Modal } from 'react-bootstrap';
import '../bootstrap.css';

import Select from "./Select/Select";
import { my_includes } from "../utils/usefulFunctions";
import { addChargerGroup, createCharger, updateCharger } from "../api/BackendCalls";


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


const ModalCharger = ({chargers, chargerGroups, current,
        setCurrent, type, setType, power, setPower, chargerName,
        setChargerName, chargerGroup, setChargerGroup, chargerGroupName,
        setChargerGroupName, chargerId, setChargerId, handleDelete,
        initializeInputState, fetchData, show, setShow}) => {

    // the following state variables are needed for error handling
    const [currentError, setCurrentError] = useState(false);
    const [typeError, setTypeError] = useState(false);
    const [powerError, setPowerError] = useState(false);
    const [chargerNameError, setChargerNameError] = useState(false);
    const [chargerGroupError, setChargerGroupError] = useState(false);
    const [chargerGroupNameError, setChargerGroupNameError] = useState(false);

    
    const handleClose = () => {
        setShow(false);
        initializeInputState();
    }
    // used when updating a charger
    const handleUpdate = async () => {
        if (checkInput(false)) {
            let actualChargerGroup = chargerGroup;
            if (chargerGroup === "... Add a new Charger Group") {
                actualChargerGroup = chargerGroupName;
                if (!my_includes(chargerGroups, chargerGroupName)) {
                    const {ok, errors} = await addChargerGroup(chargerGroupName);

                    if (!ok) {
                        console.log(errors);
                        return
                    }
                }
            }

            const {ok, errors} = await updateCharger(chargerId, {
                current: current,
                connector_type: type,
                power: power,
                charger_name: chargerName,
                charger_group: actualChargerGroup
            });

            if (!ok) {
                console.log(errors);
                return
            }

            fetchData();
            setShow(false);
            initializeInputState();
        }
    }
    const handleCreateCharger = async () => {
        let actualChargerGroup = "";
        if (checkInput()) {
            actualChargerGroup = chargerGroup;
            if (chargerGroup === "... Add a new Charger Group") {
                actualChargerGroup = chargerGroupName;

                if (!my_includes(chargerGroups, chargerGroupName)) {
                    const {ok, errors} = await addChargerGroup(chargerGroupName);

                    if (!ok) {
                        console.log(errors);
                        return
                    }
                }
            }

            const {ok, errors} = await createCharger({
                current: current,
                connector_type: type,
                power: power,
                charger_name: chargerName,
                charger_group: actualChargerGroup
            });

            if (!ok) {
                console.log(errors);
                return
            }

            fetchData();
            setShow(false);
            initializeInputState();
        }
    }

    const checkInput = (new_charger=true) => {
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
        
        if (new_charger)
            for(let i=0; i<chargers.length; i++)
                if (chargers[i].charger_name === chargerName) {
                    errors = true;
                    setChargerNameError(true);
                }

        if (chargerGroup !== "... Add a new Charger Group"
                && !GROUP_NAME_REGEX.test(chargerGroup)) {
            setChargerGroupError(true);
            errors = true;
        }

        if (chargerGroup === "... Add a new Charger Group"
                && !GROUP_NAME_REGEX.test(chargerGroupName)) {
            setChargerGroupNameError(true);
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
    
    useEffect(() => {
        setChargerGroupNameError(false);
    }, [chargerGroupName])

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

                    {current ? (
                        <div className="input-with-help">
                            <Select 
                                initialText="Select Charger Group"
                                options={chargerGroups}
                                label="Charger Group"
                                selected={chargerGroup}
                                setSelected={setChargerGroup}
                                error={chargerGroupError}
                                setError={setChargerGroupError}
                                width="80%"
                                tabIndex={2}
                                reset={[]}
                            />
                            <p><span>Select a pricing group for your charger.</span></p>
                        </div>
                        ) : null}

                    {chargerGroup === "... Add a new Charger Group" ? (
                        <div className="input-with-help">
                            <div className="label-input">
                                <h5>Charger Group Name</h5>
                                <input
                                    type="text"
                                    className={"my-classic-input" + " " + (chargerGroupNameError ? "error-selected" : "")}
                                    placeholder="Input Charger Group Name"
                                    value={chargerGroupName}
                                    onChange={(e) => setChargerGroupName(e.target.value)}
                                />
                            </div>
                            <p><span>Specify a name for your charger.</span></p>
                        </div>
                    ) : null}


                    {(currentError || typeError || powerError || chargerNameError || chargerGroupError || chargerGroupNameError) ?
                        <p className="error-p-input">Please correct the errors highlighted with <br /> red color, and then resubmit the form.</p>
                        : null}
                </div>
            </Modal.Body>
            <Modal.Footer className="modal-footer">
                {chargerId === -1 ? (
                    <>
                        <button className="cancel-charger" onClick={handleClose}>
                            Cancel
                        </button>
                        <button className="submit-charger" onClick={handleCreateCharger}>
                            Add Charger
                        </button>
                    </>
                ) : (
                    <>
                        <button className="cancel-charger" onClick={handleClose}>
                            Cancel
                        </button>
                        <button className="delete-charger" onClick={handleDelete}>
                            Delete Charger
                        </button>
                        <button className="submit-charger" onClick={handleUpdate}>
                            Update Charger
                        </button>
                    </>
                )}
            </Modal.Footer>
        </Modal>
    );
}
 
export default ModalCharger;
