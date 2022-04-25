import {
    GoogleMap,
    useLoadScript,
    Marker
} from '@react-google-maps/api';
import { useState } from 'react';
import mapStyles from '../Map1/styles'

const mapContainerStyle = {
    width: '490px',
    height: '490px'
}
const initialCenter = {
    lat: 37.979188,
    lng: 23.783088
}
const options = {
    styles: mapStyles,
    disableDefaultUI: true,
    zoomControl: true
}

const Map = ({marker, setMarker, markers, zoom, setZoom, center, setCenter}) => {

    const [map, setMap] = useState(null);

    const placeMarker = (event) => {
        console.log(event)
        console.log(event.latLng.lat())
        setMarker({
            latitude: event.latLng.lat(),
            longitude: event.latLng.lng()
        });
    }

    const { isLoaded, loadError} = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    });

    const handleCenter = () => {
        if (!map) return;

        const newPos = map.getCenter().toJSON();
        setCenter(newPos);
    }

    const handleZoom = () => {
        if (!map) return;

        setZoom(map.zoom);
    }

    if (loadError) return "ErrorLoadingMaps"
    if (!isLoaded) return "Loading Maps"

    return (
        <GoogleMap 
            mapContainerStyle={mapContainerStyle}
            zoom={zoom}
            center={center}
            options={options}
            onClick={placeMarker}
            onDragEnd={handleCenter}    
            onZoomChanged={handleZoom}
            // onCenterChanged={handleCenter}
            onLoad={map => { setMap(map); }}
        >
            
            {marker ? (
                <Marker
                  key={marker.id}
                  position={{ lat: marker.latitude, lng: marker.longitude }}
                  icon={{
                    url: "/icons/marker-icon-green.png",
                    origin: new window.google.maps.Point(0, 0),
                    anchor: new window.google.maps.Point(15, 15),
                    scaledSize: new window.google.maps.Size(30, 30),
                  }}
                />
            ) : null}


            {markers.map((marker) => (
                <Marker
                  key={marker.id}
                  position={{ lat: marker.latitude, lng: marker.longitude }}
                  onClick={(e) => {}}
                  icon={{
                    url: "/icons/marker-icon.png",
                    origin: new window.google.maps.Point(0, 0),
                    anchor: new window.google.maps.Point(15, 15),
                    scaledSize: new window.google.maps.Size(30, 30),
                  }}
                />
              ))}
        </GoogleMap>
    );
}
 
export default Map;
