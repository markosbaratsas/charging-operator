import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAlert } from 'react-alert';

import Map from "../../components/Map1/Map";
import useTitle from "../../hooks/useTitle";
import { addStation, getMarkers } from "../../api/BackendCalls";
import AuthProvider from "../../context/AuthProvider";


const AddStation = ({title}) => {
    useTitle({title});

    const { getAuth } = AuthProvider();
    const alert = useAlert();
    const navigate = useNavigate();

    const [markers, setMarkers] = useState([]);
    const [error, setError] = useState(false);
    const [stationSelected, setStationSelected] = useState(null);

    const addSelectedStation = async () => {
        if (!stationSelected) return;

        const ok = await addStation(getAuth(), stationSelected.id);

        if (ok) {
            alert.success('Station added successfully');
            navigate("/app/dashboard", { replace: true });
            return;
        }
        setError(true);
    }

    useEffect(async () => {
        const mark = await getMarkers(getAuth());
        setMarkers(mark);
    }, [])

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
                <p>If your desired charging station does not appear on the map,
                    maybe you need to <br /> <Link to="/app/new-station">add a new charging station</Link>.</p>
                {error ?
                    <p className="error-p">
                        Something is wrong please reload and try again.
                    </p>
                : null}

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
