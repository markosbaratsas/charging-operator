export const getMarkers = () => {
    // TODO: Hit backend
    // temporarily return this list
    return [{
        lat: 37.979188,
        lng: 23.783088,
        title: "ECE charger",
        address: "Iroon Politechniou 21",
        id: 1
    },
    {
        lat: 37.98,
        lng: 23.782,
        title: "Other Charger 1",
        address: "Iroon Politechniou 123",
        id: 2
    },
    {
        lat: 37.97,
        lng: 23.79,
        title: "12345678901234567890123456789012345",
        address: "Iroon Politechniou 456",
        id: 3
    },
    {
        lat: 37.976,
        lng: 23.787,
        title: "NTUA General Charger",
        address: "Iroon Politechniou 23",
        id: 4
    },
    {
        lat: 37.97,
        lng: 23.77,
        title: "Other Charger 1",
        address: "Iroon Politechniou 78",
        id: 5
    },
    {
        lat: 37.976,
        lng: 23.76,
        title: "Other Charger 2",
        address: "Iroon Politechniou 90",
        id: 6
    },
    {
        lat: 37.95,
        lng: 23.72,
        title: "Other Charger 2",
        address: "Iroon Politechniou 90",
        id: 7
    },
    {
        lat: 37.95,
        lng: 23.73,
        title: "Other Charger 2",
        address: "Iroon Politechniou 90",
        id: 8
    },
    {
        lat: 37.96,
        lng: 23.72,
        title: "Other Charger 2",
        address: "Iroon Politechniou 90",
        id: 9
    }];
}

export const getGridPrice = () => {
    // TODO: Hit backend
    // temporarily return this object
    return {
        "grid_price": 0.158
    };
}

export const createStation = () => {
    // TODO: Hit backend
    // temporarily return station added successfully
    return {ok: true, errors: null};
}
