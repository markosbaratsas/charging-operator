import { useEffect, useState } from 'react';
import { useAlert } from 'react-alert';
import { Modal } from 'react-bootstrap';

import AuthProvider from '../context/AuthProvider';
import { createVehicle, getManufacturers, getModels } from '../api/BackendCalls';
import Select from "./Select3/Select";
import '../bootstrap.css';


const NAME_REGEX = /^[A-z0-9_\ ]{2,31}$/;
const LICENSE_PLATE = /^[A-z0-9\ ]{2,31}$/;

const ModalVehicle = ({ show, setShow, name, setName, licensePlate, setLicensePlate,
    initializeInputState}) => {

    const { getAuth } = AuthProvider();
    const alert = useAlert();

    const [nameError, setNameError] = useState(false);
    const [licensePlateError, setLicensePlateError] = useState(false);
    const [modelError, setModelError] = useState(false);

    const [model, setModel] = useState(null);
    const [manufacturer, setManufacturer] = useState(null);
    const [models, setModels] = useState(null);
    const [manufacturers, setManufacturers] = useState(null);

    useEffect(async () => {
        let data = await getManufacturers(getAuth());
        setManufacturers(data);
    }, [])

    useEffect(async () => {
        if (!manufacturer) return;
        let data = await getModels(getAuth(), manufacturer.name);
        setModels(data);
        setModel(null);
    }, [manufacturer])

    useEffect(() => {
        setNameError(false);
        setLicensePlateError(false);
        setModelError(false);
    }, [name, licensePlate, model])

    const handleClose = () => {
        setShow(false);
        initializeInputState();
    }

    const handleSubmit = async () => {
        let errors = false;
        if (!NAME_REGEX.test(name)) {
            setNameError(true);
            errors = true;
        }
        if (!LICENSE_PLATE.test(licensePlate)) {
            setLicensePlateError(true);
            errors = true;
        }
        if (!model) {
            setModelError(true);
            errors = true;
        }

        if (errors) return;

        let data = await createVehicle(getAuth(), name, model.id, licensePlate);
        if (data.ok) {
            alert.success('New vehicle added successfully');
            setShow(false);
            initializeInputState();
            setLicensePlateError(false);
            setNameError(false);
        }
        else {
            console.log("Something went wrong while creating vehicle.");
        }
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
                <h1 className="modal-h1">Add a new Vehicle</h1>
            </Modal.Header>
            <Modal.Body>

                <div className="label-input-reservations1">
                    <h5>Name your vehicle:</h5>
                    <input
                        type="text"
                        className={"my-classic-input" + " " + (nameError ? "error-selected" : "")}
                        placeholder="Input Vehicle's name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                {nameError ?
                    <p className="error-p">Specify a Vehicle Name. 2-31 characters and
                    can include letters, numbers, spaces and underscores.</p>
                : null}

                {manufacturers ?
                    <div className="label-input-reservations1">
                        <h5>Vehicle manufacturer:</h5>
                        <Select
                            initialText="Select"
                            options={manufacturers}
                            selected={manufacturer}
                            setSelected={setManufacturer}
                            width="100%"
                            tabIndex={0}
                            reset={[]}
                        />
                    </div>
                : null}

                {manufacturer && models ?
                    <div className="label-input-reservations1">
                        <h5>Vehicle Model:</h5>
                        <Select
                            initialText="Select"
                            options={models}
                            selected={model}
                            setSelected={setModel}
                            width="100%"
                            tabIndex={0}
                            reset={[manufacturer]}
                        />
                    </div>
                : null}
                {modelError ?
                    <p className="error-p">Please specify the vehicle's model.</p>
                : null}

                {manufacturer && model ?
                    <>
                        <div className="label-input-reservations1">
                            <h5>License Plate</h5>
                            <input
                                type="text"
                                className={"my-classic-input" + " " + (licensePlateError ? "error-selected" : "")}
                                placeholder="Input Vehicle's License Plate"
                                value={licensePlate}
                                onChange={(e) => setLicensePlate(e.target.value)}
                            />
                        </div>
                        {licensePlateError ?
                            <p className="error-p">Specify the Vehicle's license plate. 2-31 characters and
                            can include letters, numbers and spaces.</p>
                        : null}
                    </>
                : null}
            </Modal.Body>
            <Modal.Footer className="modal-footer">
                <>
                    <button className="cancel-charger" onClick={handleClose}>
                        Cancel
                    </button>
                    <button className="submit-charger" onClick={handleSubmit}>
                        Add Vehicle
                    </button>
                </>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalVehicle;
