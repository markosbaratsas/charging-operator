import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow
} from '@react-google-maps/api';
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
            zoom={14}
            center={center}
            options={options}
        >

            {markers.map((marker) => (
                <Marker
                  key={`${marker.lat}-${marker.lng}`}
                  position={{ lat: marker.lat, lng: marker.lng }}
                  onClick={() => {
                    setStationSelected(marker);
                  }}
                  icon={{
                    url: "/icons/marker-icon.png",
                    origin: new window.google.maps.Point(0, 0),
                    anchor: new window.google.maps.Point(15, 15),
                    scaledSize: new window.google.maps.Size(30, 30),
                  }}
                />
              ))}

            {stationSelected ? (
                <InfoWindow
                    position={{ lat: stationSelected.lat+0.0015, lng: stationSelected.lng-0.0005 }}
                    onCloseClick={() => {
                    setStationSelected(null);
                    }}
                >
                <div>
                    <h2>
                        {stationSelected.title}
                    </h2>
                    <p>{stationSelected.address}</p>
                </div>
                </InfoWindow>
            ) : null}
        </GoogleMap>
    );
}
 
export default Map;
