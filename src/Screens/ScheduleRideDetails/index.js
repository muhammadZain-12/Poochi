import React, { useState } from "react"
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, TextInput, BackHandler } from "react-native"
import Colors from "../../Constant/Color"
import CustomHeader from "../../Components/CustomHeader"
import MapView, { Marker } from "react-native-maps"
import MapViewDirection from "react-native-maps-directions"
import CustomButton from "../../Components/CustomButton"
import Icons from "react-native-vector-icons/Entypo"

function ScheduleRideDetails({ navigation, route }) {

    let data = route.params

    const [arrived, setArrived] = useState(true)
    const [startRide, setStartRide] = useState(true)
    const [endRide, setEndRide] = useState(true)


    const [stars, setStars] = useState([
        {
            star: 1,
            selected: false
        },
        {
            star: 2,
            selected: false
        },
        {
            star: 3,
            selected: false
        },
        {
            star: 4,
            selected: false
        },
        {
            star: 5,
            selected: false
        },
    ])

    const [rating, setRating] = useState(null)

    const selectRating = (rating) => {

        setRating(rating)

    }





    return (

        <View style={{ flex: 1, backgroundColor: Colors.white }} >


            <View style={{ marginTop: 5 }} >
                <CustomHeader
                    onPress={() => navigation.goBack()}
                    iconname={"arrow-back-outline"}
                    text="Schedule Ride Detail"
                    color={Colors.black}
                />
            </View>

            <ScrollView>

                <View style={{ paddingHorizontal: 20, marginTop: 20, flex: 1 }} >


                    <Text style={{ color: Colors.buttonColor, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >
                        {data.scheduleDate} {data.scheduleTime}
                    </Text>

                    <View style={styles.mapContainer}>
                        <MapView
                            style={StyleSheet.absoluteFill}
                            region={{
                                latitude: 37.78825,
                                longitude: -122.4324,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            }}>
                        </MapView>
                    </View>

                    {
                        endRide && <View style={{ marginTop: 10, justifyContent: "space-between", flexDirection: "row", alignItems: "center" }} >


                            <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 16, color: Colors.black }} >Driver Package Deliver Picture</Text>
                            <Image source={require("../../Images/package.png")} />

                        </View>
                    }


                    <TouchableOpacity style={{ padding: 5, flexDirection: "row", justifyContent: "space-between", backgroundColor: "#e6e6e6", borderRadius: 10, alignItems: "center", marginTop: 20 }}  >
                        <View style={{ flexDirection: "row", alignItems: "center" }} >
                            <Image source={data.image} style={{ width: 80, height: 80 }} />

                            <View style={{ marginLeft: 5, justifyContent: "center" }} >
                                <View style={{ flexDirection: "row", alignItems: "center" }} >
                                    <Text style={{ fontFamily: "Poppins-Medium", fontSize: 18, color: Colors.black, height: 20 }} >{data.name}</Text>
                                    <Image source={require("../../Images/star.png")} style={{ marginLeft: 5, marginTop: 5 }} />
                                    <Text style={{ fontFamily: "Poppins-Regular", fontSize: 14, color: Colors.black, height: 20, marginTop: 5, marginLeft: 3 }} >({data.rating})</Text>

                                </View>
                                <Text style={{ fontFamily: "Poppins-Medium", fontSize: 16, color: Colors.gray, height: 20 }} >{data.car}</Text>
                                <Text style={{ fontSize: 12, color: Colors.white, borderRadius: 30, backgroundColor: "#808080", textAlign: "center", marginTop: 5, padding: 0, width: 80, padding: 2 }} >{data.carModel}</Text>

                            </View>

                        </View>

                        <View style={{ alignItems: "flex-end" }} >

                            <Text style={{ fontFamily: "Poppins-SemiBold", color: Colors.black, fontSize: 22 }} >$25</Text>

                            <View style={{ flexDirection: "row" }} >

                                <View style={{ width: 40, height: 40, backgroundColor: Colors.buttonColor, justifyContent: "center", alignItems: "center", borderRadius: 100 }} >


                                    <TouchableOpacity onPress={() => Linking.openURL(`tel:${data.phoneNumber}`)} >
                                        <Image source={require("../../Images/phone.png")} />
                                    </TouchableOpacity>
                                </View>


                                <View style={{ width: 40, height: 40, backgroundColor: Colors.gray, justifyContent: "center", alignItems: "center", borderRadius: 100, marginLeft: 5 }} >
                                    <TouchableOpacity>
                                        <Image source={require("../../Images/message.png")} />
                                    </TouchableOpacity>
                                </View>

                            </View>


                        </View>


                    </TouchableOpacity>


                    <View style={{ marginTop: 10, backgroundColor: "#e6e6e6", borderRadius: 10, padding: 10 }} >

                        <View style={{ flexDirection: "row", padding: 5, alignItems: "center" }} >

                            <Image source={require("../../Images/Location3.png")} />

                            <Text style={{ color: "#808080", fontSize: 14, fontFamily: "Poppins-Medium", marginLeft: 10 }} >Current Location: {data.currentLocation}</Text>

                        </View>


                        <View style={{ flexDirection: "row", padding: 5, datas: "center" }} >

                            <Image source={require("../../Images/Location3.png")} />

                            <Text style={{ color: "#808080", fontSize: 14, fontFamily: "Poppins-Medium", marginLeft: 10 }} >Drop Off Location: {data.DropoffLocation}</Text>

                        </View>

                    </View>

                    <View style={{ marginTop: 10, backgroundColor: "#e6e6e6", borderRadius: 10, padding: 10, flexDirection: "row", alignItems: "center", paddingVertical: 15, marginBottom: 10 }} >

                        <Image source={require("../../Images/master1.png")} />

                        <Text style={{ fontFamily: "Poppins-Medium", fontSize: 16, color: Colors.black, marginLeft: 15 }} >**** **** **** {data.last4}</Text>

                    </View>


                    {arrived && <View style={{ marginTop: 20, backgroundColor: "#A3DA9E", borderRadius: 20, padding: 7, flexDirection: "row", alignItems: "center", marginBottom: 15 }} >


                        <Text style={{ fontFamily: "Poppins-Medium", fontSize: 14, color: Colors.black, textAlign: "center", width: "100%" }} >{endRide ? "Arrive Safely" : startRide ? "Travel time to drop off location-20 min." : arrived ? "Your Driver Arrived" : "Arriving in 15 mins"}</Text>

                    </View>}

                    {endRide && <View style={{ marginTop: 10 }} >

                        <Text style={{ textAlign: "center", fontSize: 16, fontFamily: "Poppins-Medium", color: Colors.black }} >Reveiws</Text>

                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }} >
                            {stars && stars.length > 0 && stars.map((e, i) => {




                                return (
                                    <Icons onPress={() => selectRating(e.star)} name="star" color={(e.star <= rating) ? "#FC9D02" : "#d9d9d9"} size={50} />
                                )

                            })}

                        </View>
                    </View>}

                    {endRide && <TextInput placeholder="Comment" placeholderTextColor={Colors.gray} numberOfLines={5} multiline={true} textAlignVertical="top" style={{ backgroundColor: "#e6e6e6", borderRadius: 10, marginBottom: 10, padding: 10, fontSize: 16, fontFamily: "Poppins-Medium", color: Colors.black }} />}

                    {endRide && <CustomButton onPress={() => navigation.navigate("Tab")} text={"Submit Review"} styleContainer={{ width: "100%", marginBottom: 10 }} />}

                    {endRide && <CustomButton onPress={() => navigation.navigate("Tab")} text={"Back To Home"} styleContainer={{ width: "100%", marginBottom: 20 }} linearColor={"#e6e6e6"} btnTextStyle={{ color: "#808080" }} />}

                    {!arrived && <CustomButton text={"Ride Cancel"} onPress={() => navigation.navigate("RideCancel")} styleContainer={{ marginBottom: 20, width: "100%" }} linearColor="#e6e6e6" btnTextStyle={{ color: Colors.black }} />}





                </View>





            </ScrollView>


        </View>

    )
}

export default ScheduleRideDetails

const styles = StyleSheet.create({

    mapContainer: {
        width: "100%",
        height: 350,
        borderRadius: 10,
        overflow: 'hidden',

    },
})