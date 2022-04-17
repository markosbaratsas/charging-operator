import Map from "../../../components/Map4/Map";
import { getMarkers, createStation } from "../../../api/BackendCalls";
import { useLocation, useNavigate } from "react-router-dom";
import { useAlert } from 'react-alert';

const Step4 = ({chargers, chargerGroups, setStep, zoom, center, marker, stationName}) => {
    const stationsMarkers = getMarkers();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/app/dashboard";
    const alert = useAlert();

    const moveToStep1 = () => {
        setStep(1);
    }
    const moveToStep2 = () => {
        setStep(2);
    }
    const moveToStep3 = () => {
        setStep(3);
    }
    const submitStation = () => {
        let {ok, errors} = createStation(stationName, marker, chargers, chargerGroups);
        if (ok) {
            alert.success('Station created successfully!');
            navigate(from, { replace: true });
        }
    }

    return (
        <div className="full-width flex-column-center-center">
            <div className="step2">
                <h3>Check new station's details before submitting.</h3>
                <div className="station-final-overview">

                    <div className="step-4-check">
                        <h2>Station's Location/Information</h2>
                        <div className="step-4-check-inside">
                            <div className="map-div">
                                <Map
                                    marker={marker}
                                    markers={stationsMarkers}
                                    center={center}
                                    zoom={zoom}
                                />
                            </div>

                            <div className="step-4-station-info">
                                <h3>Station Name: <br /> <span>{stationName}</span></h3>
                            </div>
                        </div>
                        <button onClick={moveToStep1}>
                            Modify
                        </button>
                    </div>

                    
                    <div className="step-4-check">
                        <h2>Station's Chargers Information</h2>
                        <div className="step-4-check-inside">
                            {chargers.map(charger => {
                                return (
                                    <div
                                        key={charger.id}
                                        className="charger-overview flex-column-start-start"
                                    >
                                        <h4>{ charger.charger_name.length < 22 ?
                                                    charger.charger_name
                                                : `${charger.charger_name.substring(0,22)} ...` }</h4>
                                        

                                        <p><span>{charger.power}kW | {charger.current}</span></p>
                                        <p>Group: <span>{ charger.charger_group.length < 18 ? 
                                                            charger.charger_group
                                                        : `${charger.charger_group.substring(0,18)} ...` }</span></p>
                                        
                                    </div>
                                )
                            })}
                        </div>
                        <button onClick={moveToStep2}>
                            Modify
                        </button>
                    </div>

                    <div className="step-4-check">
                        <h2>Charging Groups Pricing Methods</h2>
                        <div className="step-4-check-inside2">
                            {chargerGroups.filter(group => group.name !==  "... Add a new Charger Group").map(group => {
                            return (
                                <div
                                    key={group.id}
                                    className="group-station-check"
                                >
                                    <div className="group-info">
                                        <h2>{ group.name.length < 22 ? group.name
                                                : `${group.name.substring(0,22)} ...` }</h2>

                                        <p>Chargers in this group:&#160;
                                            {chargers.filter((charger) => charger.charger_group ===  group.name).map((charger, index) => {
                                                return (
                                                    <span key={charger.id} className="inline-div">
                                                        {/* not the best way to write this... but... :) */}
                                                        {charger.charger_name + (((chargers.filter((charger) => charger.charger_group ===  group.name).length) !== index+1) ? "," : "" )}&#160;
                                                    </span>
                                                )
                                            })}
                                        </p>

                                        <div className="pricing-method-info">
                                            <h4>Pricing Method: <span>{group.pricing_method.name}</span></h4>
                                            <ul>
                                                {group.pricing_method.variables.filter(elem => (
                                                        elem.name !== "competitors_coordinates"
                                                        && elem.name !== "grid_price"
                                                    )).map(elem => {
                                                    return (
                                                        <li key={elem.id}>
                                                            <p>{elem.name}: <span>{elem.value}</span></p>
                                                        </li>
                                                    );
                                                })}
                                                {group.pricing_method.variables.filter(elem => elem.name === "competitors_coordinates").map(elem => {
                                                    return (
                                                        <li key={elem.id}>
                                                            <p>Number of competitors selected: <span>{elem.value.length}</span></p>
                                                        </li>
                                                    );
                                                })}
                                                {group.pricing_method.variables.filter(elem => elem.name === "grid_price").map(elem => {
                                                    return (
                                                        <li key={elem.id}>
                                                            <p>Grid Price: <span>{elem.value ? "Yes" : "No"}</span></p>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        </div>
                        <button onClick={moveToStep3}>
                            Modify
                        </button>
                    </div>
                </div>
            
                <div className="steps-buttons">
                    
                    <button 
                        className="back-step flex-row-center-center"
                        onClick={moveToStep3}
                    >
                        <img src="/icons/left-arrow.png" alt="" />
                    </button>
                    
                    <button 
                        className="end-step flex-row-center-center"
                        onClick={submitStation}
                    >
                        Submit Station
                    </button>

                </div>
            </div>
        </div>

    );
}
 
export default Step4;