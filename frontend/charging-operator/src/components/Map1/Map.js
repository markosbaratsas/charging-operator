import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow
} from '@react-google-maps/api';
import { useRef, useState } from 'react';
import mapStyles from './styles'

const mapContainerStyle = {
    width: '500px',
    height: '500px'
}
const center = {
    lat: 37.979188,
    lng: 23.783088
}
const options = {
    styles: mapStyles,
    disableDefaultUI: true,
    zoomControl: true
}

const Map = ({stationSelected, setStationSelected, markers}) => {

    const { isLoaded, loadError} = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    });

    if (loadError) return "ErrorLoadingMaps"
    if (!isLoaded) return "Loading Maps"

    return (
        <GoogleMap 
            mapContainerStyle={mapContainerStyle}
            zoom={6}
            center={center}
            options={options}
        >

            {markers.map((marker) => (
                <>
                    <Marker
                        key={marker.id}
                        position={{ lat: parseFloat(marker.latitude), lng: parseFloat(marker.longitude) }}
                        onClick={(e) => {
                            setStationSelected(marker);
                        }}
                        icon={{
                            url: "/icons/marker-icon-green2.png",
                            origin: new window.google.maps.Point(0, 0),
                            anchor: new window.google.maps.Point(15, 15),
                            scaledSize: new window.google.maps.Size(35, 25),
                        }}
                    >
                        {stationSelected === marker ?
                            <InfoWindow
                                onCloseClick={() => {
                                setStationSelected(null);
                                }}
                            >
                                <div>
                                    <h2>
                                        {stationSelected.name}
                                    </h2>
                                    <p>{stationSelected.address}</p>
                                </div>
                            </InfoWindow>
                        : null}
                    </Marker>
                </>
              ))}
        </GoogleMap>
    );
}
 
export default Map;
