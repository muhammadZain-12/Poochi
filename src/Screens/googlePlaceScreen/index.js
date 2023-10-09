import React, { useState, useContext, useRef } from "react"
import { View, Text, StyleSheet } from "react-native"
import Colors from "../../Constant/Color"
import CustomHeader from "../../Components/CustomHeader"
import { Dimensions } from "react-native"
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_MAP_KEY } from "../../Constant/GoogleMapKey"
import LocationContext from "../../Context/locationContext/context"
import MapView, { Marker, Polyline } from "react-native-maps"
import Geocoder from "react-native-geocoding"
import CustomButton from "../../Components/CustomButton"
import { longitudeKeys } from "geolib"

function GooglePlace({ navigation, route }) {


    const mapRef = useRef(mapRef)
    Geocoder.init(GOOGLE_MAP_KEY);


    const locationCont = useContext(LocationContext)

    const { locationData, setLocationData } = locationCont

    let { currentLocation, currentAddress } = locationData


    const [markerPosition, setMarkerPosition] = useState({
        latitude: currentLocation.latitude, // Initial latitude of the marker
        longitude: currentLocation.longitude, // Initial longitude of the marker
    });

    const [pathCoordinates, setPathCoordinates] = useState([]);

    const [markerAddress, setMarkerAddress] = useState(currentAddress)

    navigator.geolocation = require('react-native-geolocation-service')
    let data = route.params

    const onPressAddress = (dataa, details) => {
        const lat = details.geometry.location.lat;
        const lng = details.geometry.location.lng;

        // console.log(details,"details")

        let address = details.address_components[0].long_name

        setMarkerAddress(address)
        setMarkerPosition({
            latitude: lat,
            longitude: lng
        })




    };


    const getAddressFromCoords = async (latitude, longitude) => {
        try {
            const response = await Geocoder.from(latitude, longitude);
            const address = response.results[0].formatted_address;

            return address
        } catch (error) {
            console.error('Error:', error);
        }
    };


    console.log(markerAddress, "marker")

    const handleSelectLocation = () => {

        let dataToSend = {
            name: markerAddress,
            lat: markerPosition.latitude,
            lng: markerPosition.longitude,
            type: data?.name == ("Pickup Location") ? "pickup" : data?.name == ("Dropoff Location") ? "dropoff" : data?.name == ("Return Pickup") ? "returnPick" : "returnDrop"
        }


        navigation.navigate(data?.route, dataToSend)


    }

    const handleRegionChange = async (region) => {
        // setCurrentRegion(region);

        console.log(region, "regions")



        let address = await getAddressFromCoords(region?.latitude, region?.longitude)

        setPathCoordinates((prevPath) => [...prevPath, { latitude: region.latitude, longitude: region.longitude }]);

        setMarkerPosition({
            latitude: region?.latitude,
            longitude: region?.longitude
        })

        setMarkerAddress(address)

        console.log(address, "address")

        // You can access the latitude and longitude using region.latitude and region.longitude here
    };



    return (

        <View style={{ flex: 1, backgroundColor: Colors.white }} >

            <View style={{ marginTop: 5 }} >
                <CustomHeader
                    text={data.name}
                    iconname={"arrow-back-outline"}
                    color={Colors.black}
                    onPress={() => navigation.goBack()}
                />
            </View>
            <View style={{ flex: 1 }} >

                {/* <View style={{ width: "100%", height: "100%" }} > */}
                <MapView
                    style={StyleSheet.absoluteFill}
                    ref={mapRef}
                    region={{
                        latitude: markerPosition?.latitude ?? currentLocation?.latitude,
                        longitude: markerPosition?.longitude ?? currentLocation?.longitude,
                        latitudeDelta: 0.012,
                        longitudeDelta: 0.001,
                    }}
                    onRegionChangeComplete={handleRegionChange}
                    draggable

                >


                    {/* <Marker
                        draggable

                        onDragEnd={async (e) => {
                            console.log(e._dispatchInstances.memoizedProps, "eee")
                            // Handle marker drag end event and update markerPosition
                            const newMarkerPosition = {
                                latitude: e.nativeEvent.coordinate.latitude,
                                longitude: e.nativeEvent.coordinate.longitude,
                            };
                            let address = await getAddressFromCoords(newMarkerPosition?.latitude, newMarkerPosition?.longitude)
                            setMarkerPosition(newMarkerPosition);
                            setMarkerAddress(address)
                        }}
                        // style={{ width: 90, height: 90, zIndex: 500 }}
                        // onDrag={(e) => console.log(e, "eee")}
                        coordinate={{

                            latitude: markerPosition?.latitude,
                            longitude: markerPosition?.longitude
                        }}

                    >



                    </Marker> */}



                </MapView>

                <View style={{ width: "100%", justifyContent: "center", alignItems: "center", height: "77%" }} >
                    <View style={{ width: 300, alignSelf: "center", justifyContent: "center", alignItems: "center", borderWidth: 1, backgroundColor: "white", borderRadius: 5, padding: 10, }} >
                        <Text style={{ fontSize: 12, fontFamily: "Poppins-Medium", color: Colors.black }} >{markerAddress}</Text>
                    </View>
                    <View style={{ borderRightWidth: 2, height: 50 }} >

                    </View>

                </View>



                <CustomButton onPress={() => handleSelectLocation()} text={`Select ${data?.name}`} linearStyle={{ borderRadius: 0 }} styleContainer={{ position: "absolute", bottom: 0, width: "100%", alignSelf: "center", borderRadius: 0 }} />

                {/* </View> */}

                <GooglePlacesAutocomplete
                    placeholder={data.name}

                    textInputProps={{
                        placeholderTextColor: 'gray', // Replace with the desired color code
                    }}
                    currentLocation={true}
                    currentLocationLabel={"Current Location"}
                    onPress={onPressAddress}
                    fetchDetails={true}
                    query={{
                        key: GOOGLE_MAP_KEY,
                        language: 'en',
                        location: `${currentLocation?.latitude},${currentLocation?.longitude}`,
                        radius: 10000, // You can adjust the radius as needed
                    }}


                    styles={{
                        container: styles.containerStyle, // Update container instead of textInputContainer
                        textInput: styles.textInputStyle,
                        description: { color: 'black' },
                    }}
                />

            </View>



        </View>

    )

}

export default GooglePlace


const styles = StyleSheet.create({
    containerStyle: {
        backgroundColor: 'white',
        position: "absolute",
        zIndex: 1,
        flex: 1,
        width: Dimensions.get('window').width,
    },

    textInputStyle: {
        zIndex: 1,
        padding: 5,
        color: Colors.black,

        fontSize: 14,
        borderColor: 'grey',
        borderBottomWidth: 1.2,
        marginVertical: 5,
        minHeight: 50,
        maxHeight: 70
    },
});