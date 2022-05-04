import {
    Route,
    Routes,
  } from 'react-router-dom';
import { transitions, positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "./components/AlertTemplate";

import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/app/Dashboard';
import AddStation from './pages/app/AddStation';
import NewStation from './pages/app/NewStation/NewStation';
import Overview from './pages/app/Overview';
import Prices from './pages/app/Prices';
import Chargers from './pages/app/Chargers';
import Reservations from './pages/app/Reservations';
import Page404 from './pages/Page404';
import Logout from './pages/Logout';
import Layout1 from './components/Layout1';
import Layout2 from './components/Layout2';
import Layout3 from './components/Layout3';
import RequireAuth from './components/RequireAuth';
import VehicleState from './pages/app/VehicleState';
import AppNotAuthorized from './pages/app/AppNotAuthorized';
import Parking from './pages/app/Parking';


const options = {
    // you can also just use 'bottom center'
    position: positions.TOP_CENTER,
    timeout: 5000,
    offset: '30px',
    // you can also just use 'scale'
    transition: transitions.SCALE
}

function App() {

    return (
        <AlertProvider template={AlertTemplate} {...options}>
            <Routes>
                {/* public routes */}
                <Route path="/" element={<Layout1 />}>
                    <Route path="/" element={<Home title="Charging Operator - Home" />} />
                    <Route path="/about" element={<About title="Charging Operator- About" />} />
                    <Route path="/contact" element={<Contact title="Charging Operator - Contact" />} />
                    <Route path="/login" element={<Login title="Charging Operator - Login" />} />
                    <Route path="/register" element={<Register title="Charging Operator - Register" />} />
                    <Route path="/logout" element={<Logout title="Charging Operator - Successfully logged out"/>} />

                    {/* <Route path="/pricing-methods" element={<Logout title="Charging Operator - Pricing methods"/>} /> */}
                </Route>
                    {/* <Route path="register" element={<Register />} />
                    <Route path="linkpage" element={<LinkPage />} />
                    <Route path="unauthorized" element={<Unauthorized />} /> */}

                {/* we want to protect these routes */}
                <Route element={<RequireAuth />}>
                    <Route element={<Layout2 />}>
                        <Route path="/app/dashboard" element={<Dashboard title="Dashboard - Charging Operator"/>} />
                    </Route>
                    <Route element={<Layout3 />}>
                        <Route path="/app/add-station" element={<AddStation title="Add an Existing Station - Charging Operator" />} />
                        <Route path="/app/new-station" element={<NewStation title="Create a new Charging Station - Charging Operator" />} />
                    </Route>
                    <Route path="/app/station-:id" element={<Overview title="Station Overview - Charging Operator" />} />
                    <Route path="/app/station-:id/prices" element={<Prices title="Station Prices - Charging Operator" />} />
                    <Route path="/app/station-:id/chargers" element={<Chargers title="Station Chargers - Charging Operator" />} />
                    <Route path="/app/station-:id/reservations" element={<Reservations title="Station Reservations - Charging Operator" />} />
                    <Route path="/app/station-:id/parking" element={<Parking title="Station Parking - Charging Operator" />} />
                    <Route path="/app/station-:id/vehicle-state/:vehicleStateId" element={<VehicleState title="Vehicle State - Charging Operator" />} />


                    <Route element={<Layout2 />}>
                        <Route path="/app/not-authorized" element={<AppNotAuthorized title="Not Authorized - Charging Operator" />} />
                    </Route>
                </Route>

                    {/* <Route element={<RequireAuth />}>
                        <Route path="editor" element={<Editor />} />
                    </Route> */}

                {/* catch all */}
                <Route path="*" element={<Page404 />} />
            </Routes>
        </AlertProvider>
    );
}

export default App;
