import { useState, useEffect } from "react";

import Map from "../../../components/Map2/Map";
import { getMarkers } from "../../../api/BackendCalls";
import AuthProvider from "../../../context/AuthProvider";


const STATION_NAME_REGEX = /^[A-z][A-z0-9_\ ]{2,31}$/;

const Step1 = ({stationName, setStationName, marker, setMarker, setStep, zoom, setZoom, center, setCenter}) => {

    const { getAuth } = AuthProvider();
    const [stationsMarkers, setStationsMarkers] = useState([]);

    // step1
    const [validMarker, setValidMarker] = useState(false);
    const [validName, setValidName] = useState(false);

    useEffect(() => {
        setValidName(true);
    }, [stationName])

    useEffect(() => {
        setValidMarker(true);
    }, [marker])

    useEffect(async () => {
        const mark = await getMarkers(getAuth());
        setStationsMarkers(mark);
    }, [])

    const moveToStep2 = () => {
        let all_valid = true;

        if (!STATION_NAME_REGEX.test(stationName)) {
            setValidName(false);
            all_valid = false;
        }
        if (!marker) {
            setValidMarker(false);
            all_valid = false;
        }

        if (all_valid) setStep(2);
    }

    return (
        <div className="full-width flex-column-center-center">
            <div className="new-station-step-1">
                <div className="step-1-map-column">
                    <h2>Input Charging Station location on map</h2>
                    <h3>Place your pin by clicking on the map</h3>
                    <div className="map-div">
                        <Map
                            marker={marker}
                            setMarker={setMarker}
                            markers={stationsMarkers}
                            zoom={zoom}
                            setZoom={setZoom}
                            center={center}
                            setCenter={setCenter}
                        />
                    </div>
                    {!validMarker ?
                    <p className="error-p">Please select the station location on the map.</p>
                    : null}
                    <p>You can zoom in and zoom out, so that you easily find your station.</p>
                    <p>Your station's location will be displayed with a red pin. Other stations are displayed with black pins.</p>
                </div>
                <div className="step1-column flex-column-start-start">
                    <h2>Input desired Charging Station Name</h2>
                    <input
                        className={"my-classic-input " + (!validName ? "error-selected" : null)}
                        type="text"
                        placeholder="Charging Station Name"
                        onChange={(e) => setStationName(e.target.value)}
                        autoComplete="off"
                        value={stationName}
                    />
                    {!validName ?
                    <p className="error-p">Please follow the given instructions when providing the station name.</p>
                    : null}
                    <p>2-31 characters, starts with letter and can contain letters, digits, underscores and spaces.</p>
                    {/* <h2>Input Operators Names</h2>
                    <AutoCompleteOperator
                        suggestions={operatorNames}
                        operator={operator}
                        setOperator={setOperator}
                    />
                    <p>Click the (+) button to add more operators.</p> */}
                    <h4>You will be this station's operator. Other operators can be added after the station is created.</h4>
                </div>
            </div>
            <button 
                className="next-step flex-row-center-center"
                onClick={moveToStep2}
            >
                Add Station Chargers
                <img src="/icons/right-arrow.png" alt="" />
            </button>
        </div>
    );
}
 
export default Step1;
