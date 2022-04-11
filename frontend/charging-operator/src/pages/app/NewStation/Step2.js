import { useEffect, useState } from "react";
import { Modal } from 'react-bootstrap';
import '../../../bootstrap.css'

import Select from "../../../components/Select/Select";
import { my_includes } from "../../../utils/usefulFunctions";


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

const Step2 = ({chargers, setChargers, chargerGroups, setChargerGroups,
            setStep, chargerCount, setChargerCount, groupCount, setGroupCount}) => {
    const [show, setShow] = useState(false);
    const [showEditCharger, setShowEditCharger] = useState(false);

    
    const [errorNextStep, setErrorNextStep] = useState(false);

    // the following state variables are needed for the forms
    const [current, setCurrent] = useState("");
    const [currentError, setCurrentError] = useState(false);

    const [type, setType] = useState("");
    const [typeError, setTypeError] = useState(false);

    const [power, setPower] = useState("");
    const [powerError, setPowerError] = useState(false);

    const [chargerName, setChargerName] = useState("");
    const [chargerNameError, setChargerNameError] = useState(false);

    const [chargerGroup, setChargerGroup] = useState("");
    const [chargerGroupError, setChargerGroupError] = useState(false);

    const [chargerGroupName, setChargerGroupName] = useState("");
    const [chargerGroupNameError, setChargerGroupNameError] = useState(false);

    // used when updating a charger
    const [chargerId, setChargerId] = useState(-1);


    const handleClose = () => {
        setShow(false);
        initializeInputState();
    }
    const handleAdd = () => {
        setShowEditCharger(false);
        setShow(true);
    }
    const handleUpdate = () => {
        if (checkInput(false)) {
            let actualChargerGroup = chargerGroup;
            if (chargerGroup === "... Add a new Charger Group") {
                actualChargerGroup = chargerGroupName;
                if (!my_includes(chargerGroups, chargerGroupName)) {
                    setChargerGroups([...chargerGroups, {
                        name: actualChargerGroup,
                        id: groupCount
                    }]);
                    setGroupCount(groupCount+1);
                }
            }

            // set the new state of the chargers
            let new_chargers = chargers.slice()

            for (let i=0; i<new_chargers.length; i++) {
                if (new_chargers[i].id === chargerId) {
                    new_chargers[i] = {
                        current: current,
                        connector_type: type,
                        power: power,
                        charger_name: chargerName,
                        charger_group: actualChargerGroup,
                        id: chargerCount
                    }
                    setChargerCount(chargerCount+1);
                    break;
                }
            }

            setChargers(new_chargers);

            setShow(false);
            initializeInputState();
        }
    }
    const handleDelete = () => {
        // delete charger from chargers state
        let new_chargers = chargers.slice();
        for (let i=0; i<new_chargers.length; i++)
            if (new_chargers[i].id === chargerId) {
                new_chargers.splice(i, 1);
                break;
            }
        
        setChargers(new_chargers);

        initializeInputState();
        setShow(false);
    }
    const handleCreateCharger = () => {
        let actualChargerGroup = "";
        if (checkInput()) {
            actualChargerGroup = chargerGroup;
            if (chargerGroup === "... Add a new Charger Group") {
                actualChargerGroup = chargerGroupName;

                if (!my_includes(chargerGroups, chargerGroupName))
                    setChargerGroups([...chargerGroups, {
                        name: chargerGroupName,
                        id: groupCount
                    }]);
                    setGroupCount(groupCount+1);
            }

            setChargers([...chargers, {
                current: current,
                connector_type: type,
                power: power,
                charger_name: chargerName,
                charger_group: actualChargerGroup,
                id: chargerCount
            }]);
            setChargerCount(chargerCount+1);

            setShow(false);
            initializeInputState();
        }
    }

    const initializeInputState = () => {
        setCurrent("");
        setType("");
        setPower("");
        setChargerName("");
        setChargerGroup("");
        setChargerGroupName("");
        setChargerId(-1);
    }

    const moveToStep1 = () => {
        setStep(1);
    }

    const moveToStep3 = () => {
        if (chargers.length > 0) {
            setStep(3);
        }
        setErrorNextStep(true);
    }

    const handleEditCharger = (charger) => {
        setShowEditCharger(true);
        
        setCurrent(charger.current);
        setType(charger.connector_type);
        setPower(charger.power);
        setChargerName(charger.charger_name);
        setChargerGroup(charger.charger_group);
        setChargerId(charger.id);

        setShow(true);
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

    useEffect(() => {
        setErrorNextStep(false);
        // delete charger groups that they no charger belongs to them
        let chargerGroupsSet = new Set();
        for (let i=0; i<chargers.length; i++) {
            chargerGroupsSet.add(chargers[i].charger_group);
        }

        let deleteArray = [];
        let newChargerGroups = chargerGroups.splice(0);
        for (let i=0; i<newChargerGroups.length; i++)
            if (!chargerGroupsSet.has(newChargerGroups[i].name)
                    && newChargerGroups[i].name !== "... Add a new Charger Group") deleteArray.push(i);

        for (let i=0; i<deleteArray.length; i++) {
            newChargerGroups.splice(deleteArray[i], 1);
        }

        setChargerGroups(newChargerGroups);
    }, [chargers])

    return (
        <div className="full-width flex-column-center-center">
            <div className="step2">
                <h3>Add station's chargers</h3>
                <div className="chargers-list">
                    {chargers.map(charger => {
                        return (
                            <button
                                key={charger.id}
                                className="charger flex-column-start-start"
                                onClick={() => handleEditCharger(charger)}
                            >
                                <h4>{ charger.charger_name.length < 22 ?
                                            charger.charger_name
                                        : `${charger.charger_name.substring(0,22)} ...` }</h4>
                                

                                <p><span>{charger.power}kW | {charger.current}</span></p>
                                <p>Group: <span>{ charger.charger_group.length < 18 ? 
                                                    charger.charger_group
                                                : `${charger.charger_group.substring(0,18)} ...` }</span></p>
                                
                            </button>
                        )
                    })}

                    <button
                        className="charger flex-column-center-center"
                        onClick={handleAdd}
                    >
                        <h2>+</h2>
                        <h5>Add a charger</h5>
                    </button>

                    <Modal
                        show={show}
                        onHide={handleClose}
                        backdrop="static"
                        keyboard={false}
                        dialogClassName="my-modal-dialog"
                        contentClassName="my-modal-content"
                    >
                        {showEditCharger ? (
                            <>

                                <Modal.Header  className="modal-header">
                                    <h1 className="modal-h1">Edit Charger</h1>
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
                                    <button className="cancel-charger" onClick={handleClose}>
                                        Cancel
                                    </button>
                                    <button className="delete-charger" onClick={handleDelete}>
                                        Delete Charger
                                    </button>
                                    <button className="submit-charger" onClick={handleUpdate}>
                                        Update Charger
                                    </button>
                                </Modal.Footer>
                            </>
                            ) : (
                                <>
                                    <Modal.Header className="modal-header">
                                        <h1 className="modal-h1">Add a charger</h1>
                                        <button onClick={handleClose} />
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
                                                    <p><span>Specify a name for your charger.</span></p>
                                                </div>
                                            ) : null}

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
                                        <button className="cancel-charger" onClick={handleClose}>
                                            Cancel
                                        </button>
                                        <button className="submit-charger" onClick={handleCreateCharger}>
                                            Add Charger
                                        </button>
                                    </Modal.Footer>
                                </>
                            )}
                    </Modal>
                </div>
                {errorNextStep ?
                    <div className="error-next-step">
                        <p className="error-p">You need to add at least 1 charger.</p>
                    </div>
                 : null}

                <div className="steps-buttons">
                
                <button 
                    className="back-step flex-row-center-center"
                    onClick={moveToStep1}
                >
                    <img src="/icons/left-arrow.png" alt="" />
                </button>
                
                <button 
                    className="next-step flex-row-center-center"
                    onClick={moveToStep3}
                >
                    Add Group pricing methods
                    <img src="/icons/right-arrow.png" alt="" />
                </button>

                </div>
            </div>
        </div>
    );
}
 
export default Step2;
