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
import Page404 from './pages/Page404';
import Logout from './pages/Logout';
import Layout1 from './components/Layout1';
import Layout2 from './components/Layout2';
import Layout3 from './components/Layout3';
import RequireAuth from './components/RequireAuth';
import { useEffect } from 'react';


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
                    <Route path="/logout" element={<Logout title="Successfully logged out"/>} />

                    {/* <Route path="/pricing-methods" element={<Logout title="Charging Operator - Pricing methods"/>} /> */}
                </Route>
                    {/* <Route path="register" element={<Register />} />
                    <Route path="linkpage" element={<LinkPage />} />
                    <Route path="unauthorized" element={<Unauthorized />} /> */}

                {/* we want to protect these routes */}
                <Route element={<RequireAuth />}>
                    <Route element={<Layout2 />}>
                        <Route path="/app/dashboard" element={<Dashboard title="Charging stations Dashboard"/>} />
                    </Route>
                    <Route element={<Layout3 />}>
                        <Route path="/app/add-station" element={<AddStation title="Add an Existing Station" />} />
                        <Route path="/app/new-station" element={<NewStation title="Create a new Charging Station" />} />
                    </Route>
                    <Route path="/app/station-:id" element={<Overview title="Charging Operator - Station Overview" />} />
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
