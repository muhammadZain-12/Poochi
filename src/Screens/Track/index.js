import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Linking } from "react-native"
import Colors from "../../Constant/Color"
import CustomHeader from "../../Components/CustomHeader"
import MapView, { Marker } from "react-native-maps"
import MapViewDirection from "react-native-maps-directions"
import CustomButton from "../../Components/CustomButton"
import { useState } from "react"


function Track({ navigation, route }) {

    let data = route.params


    return (

        <View style={{ flex: 1, backgroundColor: Colors.white }} >


            <View style={{ marginTop: 5 }} >
                <CustomHeader
                    onPress={() => navigation.goBack()}
                    iconname={"arrow-back-outline"}
                    text="Track"
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

                    <View style={{ marginTop: 10, backgroundColor: "#e6e6e6", borderRadius: 10, padding: 10, flexDirection: "row", alignItems: "center", paddingVertical: 15 }} >

                        <Image source={require("../../Images/master1.png")} />

                        <Text style={{ fontFamily: "Poppins-Medium", fontSize: 16, color: Colors.black, marginLeft: 15 }} >**** **** **** {data.last4}</Text>

                    </View>


                    <View style={{ marginTop: 20, backgroundColor: "#A3DA9E", borderRadius: 20, padding: 7, flexDirection: "row", alignItems: "center", marginBottom: 15 }} >


                        <Text style={{ fontFamily: "Poppins-Medium", fontSize: 14, color: Colors.black, textAlign: "center", width: "100%" }} >{"Travel time to drop off location-20 min."}</Text>

                    </View>







                </View>





            </ScrollView>


        </View>

    )
}

export default Track

const styles = StyleSheet.create({

    mapContainer: {
        width: "100%",
        height: 350,
        borderRadius: 10,
        overflow: 'hidden',

    },
})