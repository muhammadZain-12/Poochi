import React from "react"
import { View, Text, Image, TouchableOpacity, FlatList, Linking } from "react-native"
import Colors from "../../Constant/Color"
import CustomHeader from "../../Components/CustomHeader"


function ScheduleRide({ navigation, route }) {

    let data = route.params


    const renderScheduleData = ({ item }) => {

        return (

            <TouchableOpacity onPress={() => navigation.navigate("ScheduleRideDetails", item)} style={{ marginBottom: 20 }} >

                <Text style={{ color: Colors.buttonColor, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >
                    {item.scheduleDate} {item.scheduleTime}
                </Text>

                <View style={{ marginTop: 10, padding: 10, backgroundColor: "#e6e6e6", borderRadius: 8 }} >

                    <TouchableOpacity style={{ padding: 5, flexDirection: "row", justifyContent: "space-between", backgroundColor: "#e6e6e6", borderRadius: 10, alignItems: "center" }}  >
                        <View style={{ flexDirection: "row", alignItems: "center" }} >
                            <Image source={item.image} style={{ width: 80, height: 80 }} />

                            <View style={{ marginLeft: 5, justifyContent: "center" }} >
                                <View style={{ flexDirection: "row", alignItems: "center" }} >
                                    <Text style={{ fontFamily: "Poppins-Medium", fontSize: 18, color: Colors.black, height: 20 }} >{item.name}</Text>
                                    <Image source={require("../../Images/star.png")} style={{ marginLeft: 5, marginTop: 5 }} />
                                    <Text style={{ fontFamily: "Poppins-Regular", fontSize: 14, color: Colors.black, height: 20, marginTop: 5, marginLeft: 3 }} >({item.rating})</Text>

                                </View>
                                <Text style={{ fontFamily: "Poppins-Medium", fontSize: 16, color: Colors.gray, height: 20 }} >{item.car}</Text>
                                <Text style={{ fontSize: 12, color: Colors.white, borderRadius: 30, backgroundColor: "#808080", textAlign: "center", marginTop: 5, padding: 0, width: 80, padding: 2 }} >{item.carModel}</Text>

                            </View>

                        </View>

                        <View style={{ alignItems: "flex-end" }} >

                            <Text style={{ fontFamily: "Poppins-SemiBold", color: Colors.black, fontSize: 22 }} >$25</Text>

                            <View style={{ flexDirection: "row" }} >

                                <View style={{ width: 40, height: 40, backgroundColor: Colors.buttonColor, justifyContent: "center", alignItems: "center", borderRadius: 100 }} >


                                    <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.phoneNumber}`)} >
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

                    <View style={{ flexDirection: "row", padding: 5, alignItems: "center" }} >

                        <Image source={require("../../Images/Location3.png")} />

                        <Text style={{ color: "#808080", fontSize: 14, fontFamily: "Poppins-Medium", marginLeft: 10 }} >Current Location: {item.currentLocation}</Text>

                    </View>


                    <View style={{ flexDirection: "row", padding: 5, alignItems: "center" }} >

                        <Image source={require("../../Images/Location3.png")} />

                        <Text style={{ color: "#808080", fontSize: 14, fontFamily: "Poppins-Medium", marginLeft: 10 }} >Drop Off Location: {item.DropoffLocation}</Text>

                    </View>

                </View>



            </TouchableOpacity>
        )


    }


    return (
        <View style={{ flex: 1, backgroundColor: Colors.white }} >

            <View style={{ marginTop: 5 }} >
                <CustomHeader
                    onPress={() => navigation.goBack()}
                    iconname={"arrow-back-outline"}
                    text="Schedule Ride"
                    color={Colors.black}
                />
            </View>

            <View style={{ paddingHorizontal: 20, marginVertical: 20, marginBottom: 20 }} >


                <FlatList

                    data={data}
                    renderItem={renderScheduleData}
                    contentContainerStyle={{
                        marginBottom: 20
                    }}
                    style={{ marginBottom: 20 }}

                />


            </View>

        </View>
    )
}

export default ScheduleRide