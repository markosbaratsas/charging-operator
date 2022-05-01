import axios from './axios';

const urls = {
    login: '/login',
    register: '/register',
    logout: '/logout',
    checkAuth: '/validate-token',
    getUserStations: '/stations',
    getStationMarkers: '/stations/markers',
    addStation: '/stations/add-station',
    createStation: '/stations/create-station',
    getStation: '/stations/get-station',
    getPricingGroupsInfo: '/chargers/pricing-groups/information',
    getPricingGroupsPrices: '/chargers/pricing-groups/prices',
    getVehicleStates: '/reservations/vehicle-states',
    getReservations: '/reservations',
    getPricingGroups: '/chargers/pricing-groups',
    createPricingGroup: '/chargers/pricing-group/create',
    updatePricingGroup: '/chargers/pricing-group/update',
    deletePricingGroup: '/chargers/pricing-group/delete',
    createCharger: '/chargers/create',
    updateCharger: '/chargers/update',
    deleteCharger: '/chargers/delete',
}
const unauthorizedHeaders = {
    headers: { 'Content-Type': 'application/json' }
}
const getAuthorizedHeaders = (token) => {
    return {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        }
    };
}

export const getMarkers = async (token) => {
    try {
        const response = await axios.post(urls.getStationMarkers,
            JSON.stringify({}),
            getAuthorizedHeaders(token.accessToken)
        );
        if (response && response.data)
            return response.data;

    } catch (err) {
        console.log(err);
        return null;
    }
}

export const addStation = async (token, station_id) => {
    try {
        await axios.post(urls.addStation,
            JSON.stringify({station_id: station_id}),
            getAuthorizedHeaders(token.accessToken)
        );
        return true;

    } catch (err) {
        return false;
    }
}

export const getGridPrice = () => {
    // TODO: Hit backend
    // temporarily return this object
    return {
        "grid_price": 0.158
    };
}

export const createStation = async (token, station_dict) => {
    try {
        await axios.post(urls.createStation,
            JSON.stringify({station: station_dict}),
            getAuthorizedHeaders(token.accessToken)
        );
        return {ok: true, errors: null};
    } catch (err) {
        console.log("error", err);
        if (!err?.response) {
            return ['No Server Response.', null];
        }
        return {ok: false, errors: err.resonse};
    }
}

export const getStation = async (token, station_id) => {
    try {
        const response = await axios.post(urls.getStation,
            JSON.stringify({station_id: station_id}),
            getAuthorizedHeaders(token.accessToken)
        );
        if (response && response.data)
            return {ok: true, data: response.data};
    } catch (err) {
        console.log("error", err);
        if (!err?.response) {
            return {ok: false, data: null};
        }
        return {ok: false, data: null};
    }
    return {ok: true, data: null};
}

export const getStationChargerGroupsInfo = async (token, station_id) => {
    try {
        const response = await axios.post(urls.getPricingGroupsInfo,
            JSON.stringify({station_id: station_id}),
            getAuthorizedHeaders(token.accessToken)
        );
        if (response && response.data)
            return response.data;
    } catch (err) {}

    return null;
}

export const getStationPrices = async (token, station_id) => {
    try {
        const response = await axios.post(urls.getPricingGroupsPrices,
            JSON.stringify({station_id: station_id}),
            getAuthorizedHeaders(token.accessToken)
        );
        if (response && response.data)
            return response.data;
    } catch (err) {}

    return null;
}

export const getStationVehicles = async (token, station_id) => {
    try {
        const response = await axios.post(urls.getVehicleStates,
            JSON.stringify({station_id: station_id}),
            getAuthorizedHeaders(token.accessToken)
        );
        if (response && response.data)
            return response.data;
    } catch (err) {}

    return null;
}

export const getStationReservations = async (token, station_id) => {
    try {
        // now
        let from_date = new Date();
        let from_str = from_date.toISOString().split("T").join(" ").substring(0, 19)
        // 24 hours later
        let to_date = new Date(new Date().getTime() + 60 * 60 * 24 * 1000);
        let to_str = to_date.toISOString().split("T").join(" ").substring(0, 19)

        const response = await axios.post(urls.getReservations,
            JSON.stringify({
                station_id: station_id,
                from: from_str,
                to: to_str
            }),
            getAuthorizedHeaders(token.accessToken)
        );
        if (response && response.data)
            return response.data;
    } catch (err) {}

    return null;
}

export const getPricingGroups = async (token, station_id) => {
    try {
        const response = await axios.post(urls.getPricingGroups,
            JSON.stringify({station_id: station_id}),
            getAuthorizedHeaders(token.accessToken)
        );
        if (response && response.data)
            return response.data;
    } catch (err) {}

    return null;
}

export const getGridPrices = async () => {
    // TODO: Hit backend
    // temporarily return this dict
    const grid_price = {
        grid_price: 0.189,
        previous_values: [
            {
                date: "19/05/2022 18:00",
                price: 0.179
            },
            {
                date: "19/05/2022 17:45",
                price: 0.172
            },
            {
                date: "19/05/2022 17:30",
                price: 0.177
            }
        ]
    }

    return grid_price;
}

export const createPricingGroup = async (token, station_id, group) => {
    try {
        await axios.post(urls.createPricingGroup,
            JSON.stringify({
                station_id: station_id,
                group: group
            }),
            getAuthorizedHeaders(token.accessToken)
        );
        return {ok: true};
    } catch (err) {}

    return {ok: false};
}

export const updatePricingGroup = async (token, station_id, group) => {
    try {
        await axios.post(urls.updatePricingGroup,
            JSON.stringify({
                station_id: station_id,
                group: group
            }),
            getAuthorizedHeaders(token.accessToken)
        );
        return {ok: true};
    } catch (err) {}

    return {ok: false};
}

export const deletePricingGroup = async (token, station_id, group) => {
    try {
        await axios.post(urls.deletePricingGroup,
            JSON.stringify({
                station_id: station_id,
                group: group
            }),
            getAuthorizedHeaders(token.accessToken)
        );
        return {ok: true};
    } catch (err) {}

    return {ok: false};
}

export const createCharger = async (token, station_id, charger) => {
    try {
        await axios.post(urls.createCharger,
            JSON.stringify({
                station_id: station_id,
                charger: charger
            }),
            getAuthorizedHeaders(token.accessToken)
        );
        return {ok: true};
    } catch (err) {}

    return {ok: false};
}

export const updateCharger = async (token, station_id, charger) => {
    try {
        await axios.post(urls.updateCharger,
            JSON.stringify({
                station_id: station_id,
                charger: charger
            }),
            getAuthorizedHeaders(token.accessToken)
        );
        return {ok: true};
    } catch (err) {}

    return {ok: false};
}

export const deleteCharger = async (token, station_id, charger) => {
    try {
        await axios.post(urls.deleteCharger,
            JSON.stringify({
                station_id: station_id,
                charger: charger
            }),
            getAuthorizedHeaders(token.accessToken)
        );
        return {ok: true};
    } catch (err) {}

    return {ok: false};
}

export const getAvailableChargers = async (stationId, arrivalTime, departureTime) => {
    // TODO: Hit backend
    // temporarily return this list
    return [
        {
            name: "Charger 1",
            group: "22kW Chargers",
            expected_price: 9.88,
            id: 1
        }
    ];
}

export const addReservation = async (reservation_dict) => {
    // TODO: Hit backend
    // temporarily return this dict
    return {ok: true, errors: null};
}

export const getReservations = async (startingArrival, endingArrival,
                                    startingDeparture, endingDeparture) => {
    // TODO: Hit backend
    // temporarily return this list
    return [
        {
            owner: "Markos Kostogiannis",
            expected_arrival: "19/07/2022 12:00",
            expected_departure: "19/07/2022 12:40",
            charger: "Charger 1",
            state: "Completed",
            id: 1
        }
    ];
}

export const getVehicleState = async (vehicleStateId) => {
    // TODO: Hit backend
    // temporarily return this list
    return {
        model: "Tesla Model 3",
        license_plate: "INN 1234",
        charging_in: "5 kWh Charger 1",
        arrival: "04/05/2022 17:30",
        expected_departure: "04/05/2022 17:55",
        current_battery: 27,
        desired_final_battery: 80
    };
}

export const loginUser = async (user, pwd) => {

    try {
        const response = await axios.post(urls.login,
            JSON.stringify({ username: user, password: pwd }),
            unauthorizedHeaders
        );
        if (response && response.data && response.data.token)
            return [null, response.data.token];

    } catch (err) {
        console.log(err);
        if (!err?.response) {
            return ['No Server Response.', null];
        } else if ('username' in err.response.data
                || 'password' in err.response.data) {
            return ['Missing Username or Password.', null];
        } else if ('non_field_errors' in err.response.data) {
            return ['Username and password do not match.', null];
        }
    }

    return ['Something went wrong. Please try again.', null];
}

export const registerUser = async (user, pwd, pwd2) => {

    try {
        const response = await axios.post(urls.register,
            JSON.stringify({ username: user, password: pwd, password2: pwd2 }),
            unauthorizedHeaders
        );
        if (response && response.data && response.data.token)
            return [null, response.data];

    } catch (err) {
        console.log(err);
        if (!err?.response) {
            return ['No Server Response.', false];
        } else if (err.response?.status === 403) {
            return ['Username already in use.', false];
        }
    }
    return ['Registration failed. Please try again.', false];
}

export const logoutUser = async (token) => {

    try {
        const response = await axios.post(urls.logout,
            JSON.stringify({}),
            getAuthorizedHeaders(token.accessToken)
        );
        return [null, true];

    } catch (err) {
        if (!err?.response) {
            return ['No Server Response.', false];
        }
    }
    return ['Something went wrong.', false];
}

export const checkAuthentication = async (token) => {

    try {
        const response = await axios.post(urls.checkAuth,
            JSON.stringify({}),
            getAuthorizedHeaders(token.accessToken)
        );
        return true;

    } catch (err) {
        console.log(err)
        return false;
    }
}

export const getStations = async (token) => {
    try {
        const response = await axios.post(urls.getUserStations,
            JSON.stringify({}),
            getAuthorizedHeaders(token.accessToken)
        );
        if (response && response.data)
            return response.data;

    } catch (err) {
        console.log(err)
        return null;
    }
}
