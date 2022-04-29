import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactLoading from 'react-loading';

import { getStations } from '../../api/BackendCalls';
import AuthProvider from '../../context/AuthProvider';
import { upTo } from '../../utils/usefulFunctions';
import useTitle from '../../hooks/useTitle';


const Dashboard = ({title}) => {
    useTitle({title});

    const [stations, setStations] = useState(null);
    const { getAuth } = AuthProvider();

    useEffect(async () => {
        let data = await getStations(getAuth());
        setStations(data);
    }, [])


    return (
        <section className="dashboard flex-column-start-center">
            <h1 className="app-page-title">Charging Stations Dashboard</h1>
            <div className="stations-list flex-row-start-start">
                {!stations
                ? <ReactLoading type="spin" color="#f3f3f3" height={80} width={80} className="loading-center"/>
                : (
                <>
                    {stations.map(station => (
                        <Link className="station-preview" to={`/app/station-${station.id}`} key={station.id}>
                            <h2>{ upTo(station.name, 20) }</h2>
                            <p className="address">{ upTo(station.address, 20) }</p>
                            <p className="availability"><span>{ station.occupied_chargers }/{ station.all_chargers }</span> chargers occupied</p>
                        </Link>
                    ))}
                    <Link className="add-station flex-column-center-center" to="/app/new-station">
                        <h2>+</h2>
                        <p>Create a New Charging Station</p>
                    </Link>
                    <Link className="add-station flex-column-center-center" to="/app/add-station">
                        <h2>+</h2>
                        <p>Add an existing Charging Station</p>
                    </Link>
                </>
                )}
            </div>
        </section>
    );
}
 
export default Dashboard;
