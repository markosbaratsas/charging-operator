import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactLoading from 'react-loading';
import { useAlert } from 'react-alert';

import Navbar4 from '../../components/Navbar4';
import { getParkingCosts, getStation, setParkingCosts } from '../../api/BackendCalls';
import useTitle from "../../hooks/useTitle";
import AuthProvider from '../../context/AuthProvider';
import { getTimeString } from '../../utils/usefulFunctions';

const Parking = ({title, station, setStation}) => {
    useTitle({title});

    const { id } = useParams();
    const { getAuth } = AuthProvider();
    const navigate = useNavigate();
    const alert = useAlert();

    const [currentParkingCost, setCurrentParkingCost] = useState(null);

    const [parkingCost, setParkingCost] = useState("");
    const [parkingCostError, setParkingCostError] = useState(false);

    const fetchData = async () => {
        try {
            let {ok, data} = await getStation(getAuth(), id);
            if (!ok) {
                navigate("/app/not-authorized", { replace: true });
            }
            // check if data changed
            if (JSON.stringify(data) !== JSON.stringify(station)) setStation(data);

            data = await getParkingCosts(getAuth(), id,
                                        getTimeString(new Date()),
                                        getTimeString(new Date()));
            // check if data changed
            if (data.ok && JSON.stringify(data.data[0].value) !== JSON.stringify(currentParkingCost))
                setCurrentParkingCost(data.data[0].value);

        } catch (err) {
            console.error(err.message);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(() => {
            fetchData();
        }, 5000);
        return () => clearInterval(interval);
    }, [station])

    const handleSubmit = async () => {
        if (!parkingCost || parkingCost < 0 || parkingCost > 1000) {
            setParkingCostError(true);
            return;
        }

        const req = await setParkingCosts(getAuth(), station.id, parkingCost);
        if (req.ok) {
            alert.success('Parking Cost Set Successfully');
            setCurrentParkingCost(parkingCost);
            setParkingCost("");
        }
        else {
            console.log("Something went wrong while setting parking cost.");
        }
    }

    useEffect(() => {
        setParkingCostError(false);
    }, [parkingCost])

    return (
        <>
        <Navbar4 stationName={station.name} stationId={id} active={"Parking"}/>
        <div className="content">
            <div className="flex-column-center-center">
            <section className="wrapper">
                <div className="flex-column-center-center parking">
                    <h1>Station Parking</h1>
                    { currentParkingCost !== null ? (
                        <div className="station-prices-current-price">
                            <h2>Current Parking Cost: <span>{currentParkingCost} €/hour</span></h2>
                        </div>
                    ) : <ReactLoading type="spin" color="#202020" height={80} width={80} /> }

                    <h3>Input New Parking Cost</h3>
                    <input
                        type="number"
                        min="0"
                        max="1000"
                        step="0.1"
                        className={"my-classic-input" + " " + (parkingCostError ? "error-selected" : "")}
                        placeholder="Set Cost Per Hour"
                        value={parkingCost}
                        onChange={(e) => setParkingCost(e.target.value)}
                    />
                    {parkingCostError ? <p className="error-p">Parking Cost should be a number between 0 and 1000.</p> : null}

                    <button className="button-parking-cost" onClick={handleSubmit}>
                        Set Parking Cost
                    </button>
                </div>
            </section>
            </div>
        </div>
    </>
    );
}

export default Parking;
