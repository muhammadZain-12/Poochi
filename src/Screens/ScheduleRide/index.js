import React, { useContext } from "react"
import { View, Text, Image, TouchableOpacity, FlatList, Linking } from "react-native"
import Colors from "../../Constant/Color"
import CustomHeader from "../../Components/CustomHeader"
import ScheduleRideContext from "../../Context/ScheduleRideContext/context"
import CustomButton from "../../Components/CustomButton"
import IonIcons from "react-native-vector-icons/Ionicons"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import axios from "axios"



function ScheduleRide({ navigation, route }) {


    const scheduleRideCont = useContext(ScheduleRideContext)
    const { scheduleData, setScheduleData } = scheduleRideCont



    const renderScheduleData = ({ item }) => {


        return (

            <TouchableOpacity style={{ marginBottom: 20 }} >

                <Text style={{ color: Colors.buttonColor, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >
                    {item?.scheduleDate?.toDate().toLocaleDateString()} {item?.scheduleTime?.toDate()?.toLocaleTimeString()}
                </Text>

                <View style={{ marginTop: 10, padding: 10, backgroundColor: "#e6e6e6", borderRadius: 8 }} >

                    <TouchableOpacity style={{ padding: 5, flexDirection: "row", justifyContent: "space-between", backgroundColor: "#e6e6e6", borderRadius: 10, alignItems: "center" }}  >
                        {item?.driverData && <View style={{ flexDirection: "row", alignItems: "center" }} >
                            <Image source={{ uri: item.driverData?.profile }} style={{ width: 60, height: 60, borderRadius: 100 }} />

                            <View style={{ marginLeft: 5, justifyContent: "center" }} >
                                <View style={{ flexDirection: "row", alignItems: "center" }} >
                                    <Text style={{ fontFamily: "Poppins-Medium", fontSize: 18, color: Colors.black, height: 20 }} >{item?.driverData?.fullName}</Text>
                                    <Image source={require("../../Images/star.png")} style={{ marginLeft: 5, marginTop: 5 }} />
                                    <Text style={{ fontFamily: "Poppins-Regular", fontSize: 14, color: Colors.black, height: 20, marginTop: 5, marginLeft: 3 }} >({item?.driverData?.rating})</Text>

                                </View>
                                <Text style={{ fontFamily: "Poppins-Medium", fontSize: 16, color: Colors.gray, height: 20 }} >{item.driverData?.VehicleDetails?.vehicleName}</Text>
                                <Text style={{ fontSize: 12, color: Colors.white, borderRadius: 30, backgroundColor: "#808080", textAlign: "center", marginTop: 5, padding: 0, width: 80, padding: 2 }} >{item?.driverData?.VehicleDetails?.vehicleModelNum}</Text>

                            </View>

                        </View>}

                        {!item.driverData && <Text style={{ fontFamily: "Poppins-SemiBold", color: Colors.buttonColor, fontSize: 14 }} >We are finding driver for you</Text>}

                        <View style={{ alignItems: "flex-end" }} >

                            <Text style={{ fontFamily: "Poppins-SemiBold", color: Colors.black, fontSize: 22 }} >${Number(item?.fare).toFixed(2)}</Text>

                            {item?.driverData && <View style={{ flexDirection: "row" }} >

                                <View style={{ width: 40, height: 40, backgroundColor: Colors.buttonColor, justifyContent: "center", alignItems: "center", borderRadius: 100 }} >


                                    <TouchableOpacity onPress={() => Linking.openURL(`tel:${item?.phoneNumber}`)} >
                                        <MaterialIcons name="phone" size={25} color={Colors.white} />
                                    </TouchableOpacity>
                                </View>


                                <View style={{ width: 40, height: 40, backgroundColor: Colors.gray, justifyContent: "center", alignItems: "center", borderRadius: 100, marginLeft: 5 }} >
                                    <TouchableOpacity onPress={() => navigation.navigate("ChatSingle", { data: item, screenName: "ScheduleRide", nested: false })}  >
                                        <MaterialIcons name="chat" size={25} color={Colors.white} />
                                    </TouchableOpacity>
                                </View>

                            </View>}


                        </View>


                    </TouchableOpacity>

                    <View style={{ flexDirection: "row", padding: 5, alignItems: "center", width: "100%" }} >


                        <IonIcons name="location" color={Colors.buttonColor} size={30} />
                        <Text style={{ color: "#808080", fontSize: 14, fontFamily: "Poppins-Medium", marginLeft: 10, width: "85%" }} >Current Location: {item?.pickupAddress}</Text>

                    </View>

                    <View style={{ flexDirection: "row", padding: 5, alignItems: "center" }} >

                        <IonIcons name="location" color={Colors.buttonColor} size={30} />

                        <Text style={{ color: "#808080", fontSize: 14, fontFamily: "Poppins-Medium", marginLeft: 10, width: "85%" }} >Drop Off Location: {item.dropoffAddress}</Text>

                    </View>


                    {item?.bookingType == "twoWay" && <View style={{ flexDirection: "row", padding: 5, alignItems: "center", width: "100%" }} >


                        <IonIcons name="location" color={Colors.buttonColor} size={30} />
                        <Text style={{ color: "#808080", fontSize: 14, fontFamily: "Poppins-Medium", marginLeft: 10, width: "85%" }} >Return Pickup Location: {item?.returnPickupAddress}</Text>

                    </View>}

                    {item?.bookingType == "twoWay" && <View style={{ flexDirection: "row", padding: 5, alignItems: "center", width: "100%" }} >


                        <IonIcons name="location" color={Colors.buttonColor} size={30} />
                        <Text style={{ color: "#808080", fontSize: 14, fontFamily: "Poppins-Medium", marginLeft: 10, width: "85%" }} >Return Dropoff Location: {item?.returnDropoffAddress}</Text>

                    </View>}


                    {!item?.driverTakeRide && <CustomButton onPress={() => navigation.navigate("ScheduleCancelRide", item)} text={"Cancel Ride"} styleContainer={{ alignSelf: "center", width: "90%" }} />
                    }
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
                    text="Schedule A Ride"
                    color={Colors.black}
                />
            </View>

            <View style={{ paddingHorizontal: 20, marginVertical: 20, marginBottom: 20 }} >


                <FlatList

                    data={scheduleData}
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