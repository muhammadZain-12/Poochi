import React, { useState } from "react"
import { View, Text, StyleSheet } from "react-native"
import Colors from "../../Constant/Color"
import CustomHeader from "../../Components/CustomHeader"
import { Dimensions } from "react-native"
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_MAP_KEY } from "../../Constant/GoogleMapKey"

function GooglePlace({ navigation, route }) {



    navigator.geolocation = require('react-native-geolocation-service')
    let data = route.params

    const onPressAddress = (dataa, details) => {
        const lat = details.geometry.location.lat;
        const lng = details.geometry.location.lng;



        let dataToSend = {
            name: details.address_components[0].long_name,
            lat: lat,
            lng: lng,
            type: data?.name == ("Pickup Location") ? "pickup" : data?.name == ("Dropoff Location") ? "dropoff" : data?.name == ("Return Pickup") ? "returnPick" : "returnDrop"
        }


        navigation.navigate(data?.route, dataToSend)


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