import axios from './axios';
import { getTimeString } from '../utils/usefulFunctions';


const urls = {
    login: '/login',
    register: '/register',
    logout: '/logout',
    checkAuth: '/validate-token',
    checkAuthOwner: '/validate-token-owner',
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
    getAvailableChargers: '/reservations/available-chargers',
    createReservation: '/reservations/create',
    updateReservation: '/reservations/update',
    deleteReservation: '/reservations/delete',
    cancelReservation: '/reservations/cancel',
    vehicleArrived: 'reservations/vehicle-state/create',
    reservationEnd: 'reservations/end-reservation',
    getVehicleState: 'reservations/vehicle-state/get',
    getParkingCosts: 'stations/parking-costs',
    setParkingCost: 'stations/parking-cost/set_default',
    getRecentPrice: 'gridprice/get-recent-prices',
    getLocations: 'gridprice/locations',
    statsReservations: 'statistics/reservations',
    getNotHealthyChargers: 'chargers/get-not-healthy',
    answerStationRequest: 'stations/answer-request',
    getStationRequests: 'stations/requests',
    getPersonalStationRequests: 'stations/personal-requests',
    getOwner: 'reservations/owner',
    editOwner: 'reservations/owner/edit',
    getVehicles: 'reservations/vehicles',
    ownerCreateReservation: 'reservations/owner-create-reservation',
    deleteVehicle: 'reservations/vehicles/delete',
    createVehicle: 'reservations/vehicles/create',
    getModels: 'reservations/model/get-models',
    getManufacturers: 'reservations/model/get-manufacturers',
    ownerReservations: 'reservations/owner-reservations',
    contact: 'contact',
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
    }
    return null;
}

export const getLocations = async (token) => {
    try {
        const response = await axios.post(urls.getLocations,
            JSON.stringify({}),
            getAuthorizedHeaders(token.accessToken)
        );
        if (response && response.data)
            return response.data;
    } catch (err) {
        console.log(err);
    }
    return null;
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

export const getGridPrice = async (token, station_id) => {
    try {
        const response = await axios.post(urls.getRecentPrice,
            JSON.stringify({
                station_id: station_id,
                amount: 1
            }),
            getAuthorizedHeaders(token.accessToken)
        );
        if (response && response.data)
            return response.data[0];
    } catch (err) {
        console.log(err, err?.response?.data);
    }

    return null;
}

export const getGridPriceLocation = async (token, location_id) => {
    try {
        const response = await axios.post(urls.getRecentPrice,
            JSON.stringify({
                location_id: location_id,
                amount: 1
            }),
            getAuthorizedHeaders(token.accessToken)
        );
        if (response && response.data)
            return response.data[0];
    } catch (err) {
        console.log(err, err?.response?.data);
    }

    return null;
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

export const getParkingCosts = async (token, station_id, from_datetime, to_datetime) => {
    try {
        const response = await axios.post(urls.getParkingCosts,
            JSON.stringify({
                station_id: station_id,
                from_datetime: from_datetime,
                to_datetime: to_datetime
            }),
            getAuthorizedHeaders(token.accessToken)
        );
        if (response && response.data)
            return {ok: true, data: response.data};
    } catch (err) {}

    return {ok: false};
}

export const setParkingCosts = async (token, station_id, parking_cost_value) => {
    try {
        await axios.post(urls.setParkingCost,
            JSON.stringify({
                station_id: station_id,
                parking_cost_value: parking_cost_value
            }),
            getAuthorizedHeaders(token.accessToken)
        );
        return {ok: true};
    } catch (err) {}

    return {ok: false};
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
        let from_date = new Date(new Date().getTime() - 60 * 60 * 1 * 1000);
        let from_str = getTimeString(from_date);
        // 24 hours later
        let to_date = new Date(new Date().getTime() + 60 * 60 * 24 * 1000);
        let to_str = getTimeString(to_date);

        const response = await axios.post(urls.getReservations,
            JSON.stringify({
                station_id: station_id,
                states: ["Reserved"],
                from_arrival: from_str,
                to_arrival: to_str
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

export const getGridPrices = async (token, station_id, amount) => {
    try {
        const response = await axios.post(urls.getRecentPrice,
            JSON.stringify({
                station_id: station_id,
                amount: amount
            }),
            getAuthorizedHeaders(token.accessToken)
        );
        if (response && response.data)
            return response.data;
    } catch (err) {}

    return null;
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

export const getAvailableChargers = async (token, station_id, arrivalTime, departureTime) => {
    try {
        const response = await axios.post(urls.getAvailableChargers,
            JSON.stringify({
                station_id: station_id,
                arrival_time: arrivalTime,
                departure_time: departureTime,
            }),
            getAuthorizedHeaders(token.accessToken)
        );
        if (response && response.data)
            return {ok: true, data: response.data};

    } catch (err) {}

    return {ok: false};
}

export const createReservation = async (token, reservation) => {
    try {
        await axios.post(urls.createReservation,
            JSON.stringify({
                reservation: reservation
            }),
            getAuthorizedHeaders(token.accessToken)
        );
        return {ok: true};
    } catch (err) {
        console.log(err?.response?.data)
    }

    return {ok: false};
}

export const updateReservation = async (token, reservation) => {
    try {
        await axios.post(urls.updateReservation,
            JSON.stringify({
                reservation: reservation
            }),
            getAuthorizedHeaders(token.accessToken)
        );
        return {ok: true};
    } catch (err) {
        console.log(err?.response?.data)
    }

    return {ok: false};
}

export const deleteReservation = async (token, station_id, reservation_id) => {
    try {
        await axios.post(urls.deleteReservation,
            JSON.stringify({
                station_id: station_id,
                reservation_id: reservation_id
            }),
            getAuthorizedHeaders(token.accessToken)
        );
        return {ok: true};
    } catch (err) {
        console.log(err?.response?.data)
    }

    return {ok: false};
}

export const cancelReservation = async (token, station_id, reservation_id) => {
    try {
        await axios.post(urls.cancelReservation,
            JSON.stringify({
                station_id: station_id,
                reservation_id: reservation_id
            }),
            getAuthorizedHeaders(token.accessToken)
        );
        return {ok: true};
    } catch (err) {
        console.log(err?.response?.data)
    }

    return {ok: false};
}

export const vehicleArrived = async (token, station_id, reservation_id, actual_arrival,
                            current_battery, desired_final_battery) => {
    try {
        await axios.post(urls.vehicleArrived,
            JSON.stringify({
                station_id: station_id,
                reservation_id: reservation_id,
                desired_final_battery: desired_final_battery,
                current_battery: current_battery,
                actual_arrival: actual_arrival
            }),
            getAuthorizedHeaders(token.accessToken)
        );
        return {ok: true};
    } catch (err) {
        console.log(err?.response?.data)
    }
    return {ok: false};
}

export const reservationEnd = async (token, station_id, reservation_id,
                            total_energy_transmitted, actual_departure,
                            parking_cost_extra) => {
    try {
        await axios.post(urls.reservationEnd,
            JSON.stringify({
                station_id: station_id,
                reservation_id: reservation_id,
                total_energy_transmitted: total_energy_transmitted,
                actual_departure: actual_departure,
                parking_cost_extra: parking_cost_extra
            }),
            getAuthorizedHeaders(token.accessToken)
        );
        return {ok: true};
    } catch (err) {
        console.log(err?.response?.data)
    }
    return {ok: false};
}

export const getReservations = async (token, station_id, startingArrival, endingArrival,
                                    startingDeparture, endingDeparture, states) => {
    try {
        let obj = {
            station_id: station_id,
            states: states
        };
        if (startingArrival !== null) obj["from_arrival"] = startingArrival;
        if (endingArrival !== null) obj["to_arrival"] = endingArrival;
        if (startingDeparture !== null) obj["from_departure"] = startingDeparture;
        if (endingDeparture !== null) obj["to_departure"] = endingDeparture;

        const response = await axios.post(urls.getReservations,
            JSON.stringify(obj),
            getAuthorizedHeaders(token.accessToken)
        );
        if (response && response.data)
            return {ok: true, data: response.data};
    } catch (err) {}

    return {ok: false};
}

export const getVehicleState = async (token, station_id, vehicle_state_id) => {
    try {
        const response = await axios.post(urls.getVehicleState,
            JSON.stringify({
                station_id: station_id,
                vehicle_state_id: vehicle_state_id
            }),
            getAuthorizedHeaders(token.accessToken)
        );
        if (response && response.data)
            return {ok: true, data: response.data};

    } catch (err) {}

    return {ok: false};
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

export const registerUserOwner = async (user, pwd, pwd2, name, phone) => {

    try {
        const response = await axios.post(urls.register,
            JSON.stringify({ owner:"Yes", username: user, password: pwd, password2: pwd2, name: name, phone: phone }),
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

export const checkAuthenticationOwner = async (token) => {

    try {
        const response = await axios.post(urls.checkAuthOwner,
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
    }
    return null;
}

export const getStationsRequests = async (token) => {
    try {
        const response = await axios.post(urls.getStationRequests,
            JSON.stringify({}),
            getAuthorizedHeaders(token.accessToken)
        );
        if (response && response.data)
            return response.data;
    } catch (err) {
        console.log(err)
    }
    return null;
}

export const getStationsPersonalRequests = async (token) => {
    try {
        const response = await axios.post(urls.getPersonalStationRequests,
            JSON.stringify({}),
            getAuthorizedHeaders(token.accessToken)
        );
        if (response && response.data)
            return response.data;
    } catch (err) {
        console.log(err)
    }
    return null;
}

export const answerStationRequest = async (token, station_request_id, state) => {
    try {
        await axios.post(urls.answerStationRequest,
            JSON.stringify({
                station_request_id: station_request_id,
                state: state
            }),
            getAuthorizedHeaders(token.accessToken)
        );
        return true;
    } catch (err) {
        console.log(err?.response?.data)
    }
    return false;
}

export const statsReservations = async (token) => {
    // 7 days ago
    const from_date = getTimeString(new Date(new Date().getTime() - 7 * 60 * 60 * 24 * 1000));
    // 3 days after
    const to_date = getTimeString(new Date(new Date().getTime()));
    try {
        const response = await axios.post(urls.statsReservations,
            JSON.stringify({
                from_date: from_date,
                to_date: to_date
            }),
            getAuthorizedHeaders(token.accessToken)
        );
        if (response && response.data) {
            return response.data;
        }
    } catch (err) {
        console.log(err?.response?.data)
    }
    return null;
}

export const getNotHealthyChargers = async (token, station_id) => {
    try {
        const response = await axios.post(urls.getNotHealthyChargers,
            JSON.stringify({station_id, station_id}),
            getAuthorizedHeaders(token.accessToken)
        );
        if (response && response.data) {
            return response.data;
        }
    } catch (err) {
        console.log(err?.response?.data)
    }
    return null;
}

export const getOwner = async (token) => {
    try {
        const response = await axios.post(urls.getOwner,
            JSON.stringify({}),
            getAuthorizedHeaders(token.accessToken)
        );
        if (response && response.data)
            return response.data;
    } catch (err) {}

    return null;
}

export const getVehicles = async (token) => {
    try {
        const response = await axios.post(urls.getVehicles,
            JSON.stringify({}),
            getAuthorizedHeaders(token.accessToken)
        );
        if (response && response.data)
            return response.data;
    } catch (err) {}

    return null;
}

export const editOwner = async (token, name, phone) => {
    try {
        const response = await axios.post(urls.editOwner,
            JSON.stringify({ name, phone }),
            getAuthorizedHeaders(token.accessToken)
        );
        if (response && response.data)
            return {ok: true, data: response.data};
    } catch (err) {}

    return {ok: false};
}

export const getManufacturers = async (token) => {
    try {
        const response = await axios.post(urls.getManufacturers,
            JSON.stringify({}),
            getAuthorizedHeaders(token.accessToken)
        );
        if (response && response.data)
            return response.data;
    } catch (err) {}

    return null;
}

export const getModels = async (token, manufacturer) => {
    try {
        const response = await axios.post(urls.getModels,
            JSON.stringify({ manufacturer }),
            getAuthorizedHeaders(token.accessToken)
        );
        if (response && response.data)
            return response.data;
    } catch (err) {}

    return null;
}

export const createVehicle = async (token, name, model_id, license_plate) => {
    try {
        const response = await axios.post(urls.createVehicle,
            JSON.stringify({ name, model_id, license_plate }),
            getAuthorizedHeaders(token.accessToken)
        );
        if (response && response.data)
            return {ok: true, data: response.data};
    } catch (err) {}

    return {ok: false};
}

export const deleteVehicle = async (token, vehicle_id) => {
    try {
        const response = await axios.post(urls.deleteVehicle,
            JSON.stringify({ vehicle_id }),
            getAuthorizedHeaders(token.accessToken)
        );
        return {ok: true};
    } catch (err) {}

    return {ok: false};
}

export const ownerCreateReservation = async (token, reservation) => {
    try {
        await axios.post(urls.ownerCreateReservation,
            JSON.stringify({reservation}),
            getAuthorizedHeaders(token.accessToken)
        );
        return {ok: true};
    } catch (err) {
        console.log(err?.response?.data);
    }

    return {ok: false};
}

export const ownerReservations = async (token) => {
    try {
        const response = await axios.post(urls.ownerReservations,
            JSON.stringify({}),
            getAuthorizedHeaders(token.accessToken)
        );
        if (response && response.data)
            return response.data;
    } catch (err) {
        console.log(err?.response?.data);
    }

    return null;
}

export const contactForm = async (fullname, email, message) => {
    try {
        await axios.post(urls.contact,
            JSON.stringify({fullname, email, message}),
            unauthorizedHeaders
        );
        return {ok: true}
    } catch (err) {
    }
    return {ok: false};
}
