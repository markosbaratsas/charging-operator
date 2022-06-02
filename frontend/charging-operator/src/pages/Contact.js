import { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';

import { contactForm } from '../api/BackendCalls';
import useTitle from '../hooks/useTitle';
import useWindowDimensions from '../hooks/useWindowDimensions';


const FULLNAME_REGEX = /^[0-9_\ A-Za-zΑ-Ωα-ωίϊΐόάέύϋΰήώ]{2,40}$/;
const EMAIL_REGEX = /\S+@\S+\.\S+/;
const MESSAGE_REGEX = /^[0-9_\ A-Za-zΑ-Ωα-ωίϊΐόάέύϋΰήώ]{2,400}$/;

const Contact = ({title}) => {
    useTitle({title});
    const { width } = useWindowDimensions();

    const [fullname, setFullname] = useState("");
    const [fullnameError, setFullnameError] = useState(false);
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [message, setMessage] = useState("");
    const [messageError, setMessageError] = useState(false);

    const [clicked, setClicked] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async () => {
        setClicked(true);
        let errors = false;
        if (!FULLNAME_REGEX.test(fullname)) {
            errors = true;
            setFullnameError(true);
        }
        if (!EMAIL_REGEX.test(email)) {
            errors = true;
            setEmailError(true);
        }
        if (!MESSAGE_REGEX.test(message)) {
            errors = true;
            setMessageError(true);
        }

        if (errors) {
            setClicked(false);
            return;
        }

        const data = await contactForm(fullname, email, message);
        console.log(data)
        if (data.ok) {
            setSuccess(true);
        }
    }

    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])

    useEffect(() => {
        setFullnameError(false);
        setEmailError(false);
        setMessageError(false);
    }, [fullname, email, message])

    if (width >= 1000) {
    return (
        <main className="flex-column-center-center">
            <div className="contact-page">
                <div className="flex-column-center-center contact-words">
                    <h1>Charging Operator</h1>
                    <p> Contact us using the form below. </p>

                    <hr className="big-hr"/>

                    <div className="flex-column-center-center contact-f">

                        <div className="flex-row-center-center">
                            <input
                                type="text"
                                className={"my-classic-input contact-input1" + " " + (fullnameError ? "error-selected" : "")}
                                placeholder="Full Name"
                                value={fullname}
                                onChange={(e) => setFullname(e.target.value)}
                            />
                            <input
                                type="email"
                                className={"my-classic-input contact-input1" + " " + (emailError ? "error-selected" : "")}
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <textarea
                            className={"my-classic-input contact-input2" + " " + (messageError ? "error-selected" : "")}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows="4"
                            cols="50"
                            placeholder="Message"
                        />
                        <br />

                        {(fullnameError || emailError || messageError) ?
                            <p className="error-p-input">
                                Please provide a fullname shorter than 40 chars, a valid email, a message with <br />
                                no more than 400 characters and resubmit.
                            </p>
                        : null}

                        {!clicked ?
                            <button className="submit-charger" onClick={handleSubmit}>
                                Send!
                            </button>
                        : !success ? <ReactLoading type="spin" color="#202020" height={50} width={50}/>
                        : <p className="green-p">Successfully sent. Thank you for contacting us!</p>}
                    </div>
                </div>
                <div className="contact-image"></div>
            </div>
        </main>
    );
    }
    else {
        return (
            <main className="flex-column-center-center">
                <div className="contact-page-phone">
                    <div className="contact-image-phone"></div>
                    <div className="flex-column-center-center contact-words-phone">
                        <h1>Charging Operator</h1>
                        <p>Contact us using the form below. </p>

                        <hr className="big-hr"/>

                        <div className="flex-column-center-center contact-f-phone">

                            <div className="flex-row-center-center">
                                <input
                                    type="text"
                                    className={"my-classic-input contact-input1-phone" + " " + (fullnameError ? "error-selected" : "")}
                                    placeholder="Full Name"
                                    value={fullname}
                                    onChange={(e) => setFullname(e.target.value)}
                                />
                                <input
                                    type="email"
                                    className={"my-classic-input contact-input1-phone" + " " + (emailError ? "error-selected" : "")}
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <textarea
                                className={"my-classic-input contact-input2-phone" + " " + (messageError ? "error-selected" : "")}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows="4"
                                cols="50"
                                placeholder="Message"
                            />
                            <br />

                            {(fullnameError || emailError || messageError) ?
                                <p className="error-p-input">
                                    Please provide a fullname shorter than 40 chars, a valid email, a message with <br />
                                    no more than 400 characters and resubmit.
                                </p>
                            : null}

                            {!clicked ?
                                <button className="submit-charger" onClick={handleSubmit}>
                                    Send!
                                </button>
                            : !success ? <ReactLoading type="spin" color="#202020" height={50} width={50}/>
                            : <p className="green-p">Successfully sent. Thank you for contacting us!</p>}
                        </div>
                    </div>
                </div>
            </main>
        );
    }

}
 
export default Contact;
