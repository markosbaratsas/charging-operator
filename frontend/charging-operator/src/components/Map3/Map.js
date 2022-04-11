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

const Map = ({marker, markers, zoom, center, competitors, setCompetitors}) => {

    const [map, setMap] = useState(null);
    const [myMarkers, setMyMarkers] = useState(markers.filter(marker => !competitors.includes(marker)));
    console.log(myMarkers);

    const { isLoaded, loadError} = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    });

    const addMarkerToCompetitors = (lat, lng) => {
        let i = myMarkers.findIndex(marker => (marker.lat === lat && marker.lng === lng));
        let this_marker = myMarkers[i];
        let newMyMarkers = myMarkers.slice();
        newMyMarkers.splice(i, 1);
        setCompetitors([...competitors, this_marker]);
        setMyMarkers(newMyMarkers);
    }

    const addMarkerToMyMarkers = (lat, lng) => {
        let i = competitors.findIndex(marker => (marker.lat === lat && marker.lng === lng));
        let this_marker = competitors[i];
        let newCompetitors = competitors.slice();
        newCompetitors.splice(i, 1);
        setMyMarkers([...myMarkers, this_marker]);
        setCompetitors(newCompetitors);
    }

    if (loadError) return "ErrorLoadingMaps"
    if (!isLoaded) return "Loading Maps"

    return (
        <GoogleMap 
            mapContainerStyle={mapContainerStyle}
            zoom={zoom}
            center={center}
            options={options}
            onLoad={map => { setMap(map); }}
        >
            
            {marker ? (
                <Marker
                  key={`${marker.lat}-${marker.lng}`}
                  position={{ lat: marker.lat, lng: marker.lng }}
                  icon={{
                    url: "/icons/marker-icon-green.png",
                    origin: new window.google.maps.Point(0, 0),
                    anchor: new window.google.maps.Point(15, 15),
                    scaledSize: new window.google.maps.Size(30, 30),
                  }}
                />
            ) : null}


            {myMarkers.map((marker) => (
                <Marker
                  key={`${marker.lat}-${marker.lng}`}
                  position={{ lat: marker.lat, lng: marker.lng }}
                  onClick={() => addMarkerToCompetitors(marker.lat, marker.lng)}
                  icon={{
                    url: "/icons/marker-icon.png",
                    origin: new window.google.maps.Point(0, 0),
                    anchor: new window.google.maps.Point(15, 15),
                    scaledSize: new window.google.maps.Size(30, 30),
                  }}
                />
              ))}


              {competitors.map((marker) => (
                  <Marker
                    key={`${marker.lat}-${marker.lng}`}
                    position={{ lat: marker.lat, lng: marker.lng }}
                    onClick={() => addMarkerToMyMarkers(marker.lat, marker.lng)}
                    icon={{
                      url: "/icons/marker-icon-red.png",
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
