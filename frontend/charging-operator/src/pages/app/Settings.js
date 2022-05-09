import { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import ReactLoading from 'react-loading';

import useTitle from "../../hooks/useTitle";
import AuthProvider from "../../context/AuthProvider";
import { answerStationRequest,
    getStationsPersonalRequests,
    getStationsRequests } from "../../api/BackendCalls";


const Settings = ({title}) => {
    useTitle({title});

    const alert = useAlert();
    const { getAuth } = AuthProvider();

    const [personalRequests, setPersonalRequests] = useState(null);
    const [stationRequests, setStationRequests] = useState(null);

    const fetchData = async () => {
        let data = await getStationsRequests(getAuth());
        if (JSON.stringify(data) !== JSON.stringify(stationRequests)) {
            setStationRequests(data);
        }

        data = await getStationsPersonalRequests(getAuth());
        if (JSON.stringify(data) !== JSON.stringify(personalRequests)) {
            setPersonalRequests(data);
        }
    }

    useEffect(() => {
        fetchData();
        const interval = setInterval(() => {
            fetchData();
        }, 5000);
        return () => clearInterval(interval);
    }, [stationRequests, personalRequests])

    const acceptRequest = async (id) => {
        const req = await answerStationRequest(getAuth(), id, "Approve");
        if (req) {
            alert.success('Successfully accepted the request!');
            setStationRequests(null);
        }
        else {
            console.log("Something went wrong while accepting the request")
        }
    }

    const rejectRequest = async (id) => {
        const req = await answerStationRequest(getAuth(), id, "Reject");
        if (req) {
            alert.success('Successfully rejected the request!');
            setStationRequests(null);
        }
        else {
            console.log("Something went wrong in rejection of request")
        }
    }

    return (
        <div className="flex-column-center-center">
        <section className="wrapper">
            <section className="flex-column-start-center wrapper statistics">
                <h1>Settings</h1>
                <p className="statistics-info">
                    In this page you can view station join requests created by you towards other stations,
                    or by other operators towards your stations.
                </p>

                <div className="flex-column-start-start station-chargers-div1">
                    <div className="full-width flex-row-start-start">
                        <h2>Requests created by you</h2>
                    </div>
                    <ul className="flex-column-start-center station-chargers-ul1">
                        {!personalRequests ? <ReactLoading type="spin" color="#202020" height={30} width={30}/>
                    : (null) }
                        {personalRequests && personalRequests.map(req => {
                            return (
                                <li key={req.id} className="flex-row-between-center">
                                    <div>
                                        <p>You ({req.user}) want to become an operator at {req.station.name}</p>
                                    </div>
                                    <div className="station-chargers-buttons">
                                        <button
                                            className="black-button-transparent"
                                        >
                                            Pending...
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                        {personalRequests && personalRequests.length === 0 ?
                            <h3 className="no-requests">There are no pending requests created by you.</h3>
                        : null}
                    </ul>
                </div>


                <div className="flex-column-start-start station-chargers-div1">
                    <div className="full-width flex-row-start-start">
                        <h2>Requests by other operators towards your stations</h2>
                    </div>
                    <ul className="flex-column-start-center station-chargers-ul1">
                        {stationRequests && stationRequests.map(req => {
                            return (
                                <li key={req.id} className="flex-row-between-center">
                                    <div>
                                        <p>{req.user} wants to become an operator at {req.station.name}</p>
                                    </div>
                                    <div className="station-chargers-buttons">
                                        <button
                                            className="green-button-transparent"
                                            onClick={() => acceptRequest(req.id)}
                                        >
                                            Accept Request
                                        </button>
                                        <button
                                            onClick={() => rejectRequest(req.id)}
                                            className="station-chargers-buttons-delete"
                                        >
                                            Reject Request
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                        {stationRequests && stationRequests.length === 0 ?
                            <h3 className="no-requests">There are no requests created by 
                            other operators for your stations.</h3>
                        : null}
                    </ul>
                </div>
                
            </section>
        </section>
        </div>
    );
}
 
export default Settings;
