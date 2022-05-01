import {
    GoogleMap,
    useLoadScript,
    Marker
} from '@react-google-maps/api';
import mapStyles from '../Map1/styles'

const mapContainerStyle = {
    width: '350px',
    height: '350px'
}
const options = {
    styles: mapStyles,
    disableDefaultUI: true,
    zoomControl: true
}

const Map = ({marker, markers, center, zoom}) => {

    const { isLoaded, loadError} = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    });

    if (loadError) return "ErrorLoadingMaps";
    if (!isLoaded) return "Loading Maps";

    return (
        <GoogleMap 
            mapContainerStyle={mapContainerStyle}
            zoom={zoom}
            center={center}
            options={options}
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
                  onClick={() => {}}
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
