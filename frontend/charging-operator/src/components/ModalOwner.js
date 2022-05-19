import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useAlert } from 'react-alert';

import '../bootstrap.css';
import AuthProvider from '../context/AuthProvider';
import { editOwner } from '../api/BackendCalls';


const OWNER_NAME_REGEX = /^[A-z0-9_\ ]{2,31}$/;
const PHONE_REGEX = /^[0-9]{10}$/;

const ModalOwner = ({ show, setShow, ownerName, setOwnerName, phone, setPhone, initializeInputState}) => {

    const [ownerError, setOwnerError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);

    const { getAuth } = AuthProvider();
    const alert = useAlert();

    const handleClose = () => {
        setShow(false);
        initializeInputState();
    }

    useEffect(() => {
        setOwnerError(false);
        setPhoneError(false);
    }, [ownerName, phone])

    const handleSubmit = async () => {
        let errors = false;
        if (!OWNER_NAME_REGEX.test(ownerName)) {
            setOwnerError(true);
            errors = true;
        }
        if (!PHONE_REGEX.test(phone)) {
            setPhoneError(true);
            errors = true;
        }

        if (errors) return;

        const data = await editOwner(getAuth(), ownerName, phone);
        if (data.ok) {
            alert.success('Your information updated successfully');
            setShow(false);
            initializeInputState();
            setOwnerError(false);
            setPhoneError(false);
        }
        else {
            console.log("Something went wrong while editing information.");
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
                <h1 className="modal-h1">Edit Owner Information</h1>
            </Modal.Header>
            <Modal.Body>
                <div className="label-input-reservations1">
                    <h5>Full Name:</h5>
                    <input
                        type="text"
                        autoComplete="off"
                        className={"my-classic-input" + " " + (ownerError ? "error-selected" : "")}
                        placeholder="Input your Full Name"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                    />
                </div>
                {ownerError ?
                    <p className="error-p">Specify your full name. 2-31 characters and
                    can include letters, numbers, spaces and underscores.</p>
                : null}

                <div className="label-input-reservations1">
                    <h5>Phone:</h5>
                    <input
                        type="tel"
                        autoComplete="off"
                        className={"my-classic-input" + " " + (phoneError ? "error-selected" : "")}
                        placeholder="Input your Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>
                {phoneError ?
                    <p className="error-p">Specify your phone, which should be consisted of exactly 10 digits.</p>
                : null}
            </Modal.Body>
            <Modal.Footer className="modal-footer">
                <>
                    <button className="cancel-charger" onClick={handleClose}>
                        Cancel
                    </button>
                    <button className="submit-charger" onClick={handleSubmit}>
                        Update Information
                    </button>
                </>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalOwner;
