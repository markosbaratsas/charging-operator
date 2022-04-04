import { useState } from "react";
import Map from "../../components/Map/Map";

const getMarkers = () => {
    // TODO: Hit backend
    // temporarily return this list
    return [{
        lat: 37.979188,
        lng: 23.783088,
        title: "ECE charger",
        address: "Iroon Politechniou 21"
    },
    {
        lat: 37.976,
        lng: 23.787,
        title: "NTUA General Charger",
        address: "Iroon Politechniou 23"
    }];
}

const AddStation = () => {
    const markers = getMarkers();
    const [stationSelected, setStationSelected] = useState(null);

    const addSelectedStation = () => {
        // TODO: Hit backend
        console.log("Adding Station");
    }

    return (
        <section className="add-station-page flex-column-start-center">
            <h1 className="app-page-title">Add Existing Charging Station</h1>
            <div className="add-station-page-div flex-column-center-center">
                <h2>Select charging station on the map.</h2>
                <div className="map-div">
                    <Map
                        stationSelected={stationSelected}
                        setStationSelected={setStationSelected}
                        markers={markers}
                    />
                </div>
                <p>If your desired charging station does not appear maybe you need to <br /> <a href="/app/new-station">add a new charging station</a>.</p>

                {stationSelected ? (
                    <button onClick={addSelectedStation}>Add station to your stations</button>
                ) : (
                    <button disabled>Select a station</button>
                )}
            </div>
        </section>

    );
}
 
export default AddStation;
