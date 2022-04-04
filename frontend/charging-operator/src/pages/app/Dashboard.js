import { Link } from 'react-router-dom';

const stations = [
    {
        title: "Charging Station 1",
        address: "Katechaki 89, Athens",
        price: 0.393,
        taken_parking: 9,
        total_parking: 12,
        id: 1
    },
    {
        title: "Charging Station 2",
        address: "Trikoupi 12, Ioannina",
        price: 0.443,
        taken_parking: 7,
        total_parking: 10,
        id: 2
    }
]

const Dashboard = () => {
    return (
        <section className="dashboard flex-column-start-center">
            <h1 className="app-page-title">Charging Stations Dashboard</h1>
            <div className="stations-list flex-row-start-start">
                {stations.map(station => (
                <Link className="station-preview" to={`/app/station-${station.id}`} key={station.id}>
                    <h2>{ station.title.length < 20 ? station.title: `${station.title.substring(0,20)} ...` }</h2>
                    <p className="address">{ station.address.length < 27 ? station.address: `${station.address.substring(0,27)} ...` }</p>
                    <p className="price"><span>{ station.price } €/kWh</span></p>
                    <p className="availability"><span>{ station.taken_parking }/{ station.total_parking }</span> places taken</p>
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
            </div>
        </section>
    );
}
 
export default Dashboard;
