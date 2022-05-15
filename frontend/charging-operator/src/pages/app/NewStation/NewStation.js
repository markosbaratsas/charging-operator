import { useEffect, useState } from "react";
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";

import useTitle from "../../../hooks/useTitle";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";


const NewStation = ({title}) => {
    useTitle({title});

    const [step, setStep] = useState(1);
    const [marker, setMarker] = useState(null);
    const [zoom, setZoom] = useState(7);
    const [center, setCenter] = useState({
        lat: 37.979188,
        lng: 23.783088
    });
    const [stationName, setStationName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState({name: "", id: null});

    const [chargers, setChargers] = useState([]);
    const [chargerGroups, setChargerGroups] = useState([{id: -1, name: "... Add a new Charger Group"}]);

    // STEP 2 - counts so that we have unique ids in our arrays
    const [chargerCount, setChargerCount] = useState(0);
    const [groupCount, setGroupCount] = useState(0);

    const [percentBar, setPercentBar] = useState(0);

    useEffect(() => {
        if (step == 1) {
            setPercentBar(5);
        }
        if (step == 2) {
            setPercentBar(37);
        }
        if (step == 3) {
            setPercentBar(71);
        }
        if (step == 4) {
            setPercentBar(100);
        }
    }, [step])

    return (
        <div className="new-station-page flex-column-center-center">
            <div className="wrapper flex-column-center-center">
                <h1>Create a New Charging Station (Step <span>{step}/4</span>)</h1>
                <ProgressBar
                    percent={percentBar}
                    filledBackground="linear-gradient(to right, #707070, #202020)"
                >
                    
                    <Step transition="scale">
                    {({ accomplished }) => (
                        <div className={"flex-row-center-center " + ((step === 1) ? "step-selected"
                                                                    : (step > 1) ? "step-done"
                                                                    : "step-not-done" )}>
                            <p>1</p>
                        </div>
                    )}
                    </Step>
                    <Step transition="scale">
                    {({ accomplished }) => (
                        <div className={"flex-row-center-center " + ((step === 2) ? "step-selected"
                                                                    : (step > 2) ? "step-done"
                                                                    : "step-not-done" )}>
                            <p>2</p>
                        </div>
                    )}
                    </Step>
                    <Step transition="scale">
                    {({ accomplished }) => (
                        <div className={"flex-row-center-center " + ((step === 3) ? "step-selected"
                                                                    : (step > 3) ? "step-done"
                                                                    : "step-not-done" )}>
                            <p>3</p>
                        </div>
                    )}
                    </Step>
                    <Step transition="scale">
                    {({ accomplished }) => (
                        <div className={"flex-row-center-center " + ((step === 4) ? "step-selected"
                                                                    : (step > 4) ? "step-done"
                                                                    : "step-not-done" )}>
                            <p>4</p>
                        </div>
                    )}
                    </Step>
                </ProgressBar>
                {step === 1 ? (
                    <Step1
                        stationName={stationName}
                        setStationName={setStationName}
                        address={address}
                        setAddress={setAddress}
                        phone={phone}
                        setPhone={setPhone}
                        marker={marker}
                        setMarker={setMarker}
                        setStep={setStep}
                        zoom={zoom}
                        setZoom={setZoom}
                        center={center}
                        setCenter={setCenter}
                        location={location}
                        setLocation={setLocation}
                    />
                ) : step === 2 ? (
                    <Step2
                        chargers={chargers}
                        setChargers={setChargers}
                        chargerGroups={chargerGroups}
                        setChargerGroups={setChargerGroups}
                        setStep={setStep}
                        chargerCount={chargerCount}
                        setChargerCount={setChargerCount}
                        groupCount={groupCount}
                        setGroupCount={setGroupCount}
                    />
                ) : step === 3 ? (
                    <Step3
                        chargers={chargers}
                        setChargers={setChargers}
                        chargerGroups={chargerGroups}
                        setChargerGroups={setChargerGroups}
                        setStep={setStep}
                        marker={marker}
                        setMarker={setMarker}
                        zoom={zoom}
                        setZoom={setZoom}
                        center={center}
                        setCenter={setCenter}
                        location={location}
                    />
                ) : step === 4 ? (
                    <Step4
                        chargers={chargers}
                        stationName={stationName}
                        address={address}
                        phone={phone}
                        location={location}
                        chargerGroups={chargerGroups}
                        setStep={setStep}
                        marker={marker}
                        zoom={zoom}
                        center={center}
                    />
                ) : null}
            </div>
        </div>
    );
}
 
export default NewStation;
