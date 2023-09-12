import React, { useState } from "react"
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native"
import CustomHeader from "../../Components/CustomHeader"
import CustomButton from "../../Components/CustomButton"
import Colors from "../../Constant/Color"



function Drivers({ navigation }) {

    const [drivers, setDrivers] = useState([
        {
            image: require("../../Images/driverProfile.png"),
            name: "Robert",
            car: "Toyota Prius",
            rating: 4.9,
            carModel: "AA 5841 AO",
            currentLocation: "Chicago,US",
            DropoffLocation: "PET Hospital",
            scheduleDate: "09-Sep-2023",
            scheduleTime: "06:30 PM",
            fare: 30,
            phoneNumber: "+921234567890",
            pickupCords: {
                latitude: -10.68860,
                longitude: -106.27245
            },
            dropoffCords: {
                latitude: -10.69860,
                longitude: -106.30245

            },
            last4: "8970",
            cardType: "visa"
        },
        {
            image: require("../../Images/driverProfile.png"),
            name: "Robert",
            car: "Toyota Prius",
            rating: 4.9,
            carModel: "AA 5841 AO",
            currentLocation: "Chicago,US",
            DropoffLocation: "PET Hospital",
            scheduleDate: "09-Sep-2023",
            scheduleTime: "06:30 PM",
            fare: 30,
            phoneNumber: "+921234567890",
            pickupCords: {
                latitude: -10.68860,
                longitude: -106.27245
            },
            dropoffCords: {
                latitude: -10.69860,
                longitude: -106.30245

            },
            last4: "8970",
            cardType: "visa"
        },
        {
            image: require("../../Images/driverProfile.png"),
            name: "Robert",
            car: "Toyota Prius",
            rating: 4.9,
            carModel: "AA 5841 AO",
            currentLocation: "Chicago,US",
            DropoffLocation: "PET Hospital",
            scheduleDate: "09-Sep-2023",
            scheduleTime: "06:30 PM",
            fare: 30,
            phoneNumber: "+921234567890",
            pickupCords: {
                latitude: -10.68860,
                longitude: -106.27245
            },
            dropoffCords: {
                latitude: -10.69860,
                longitude: -106.30245

            },
            last4: "8970",
            cardType: "visa"
        },
        {
            image: require("../../Images/driverProfile.png"),
            name: "Robert",
            car: "Toyota Prius",
            rating: 4.9,
            carModel: "AA 5841 AO",
            currentLocation: "Chicago,US",
            DropoffLocation: "PET Hospital",
            scheduleDate: "09-Sep-2023",
            scheduleTime: "06:30 PM",
            fare: 30,
            phoneNumber: "+921234567890",
            pickupCords: {
                latitude: -10.68860,
                longitude: -106.27245
            },
            dropoffCords: {
                latitude: -10.69860,
                longitude: -106.30245

            },
            last4: "8970",
            cardType: "visa"
        },
        {
            image: require("../../Images/driverProfile.png"),
            name: "Robert",
            car: "Toyota Prius",
            rating: 4.9,
            carModel: "AA 5841 AO",
            currentLocation: "Chicago,US",
            DropoffLocation: "PET Hospital",
            scheduleDate: "09-Sep-2023",
            scheduleTime: "06:30 PM",
            fare: 30,
            phoneNumber: "+921234567890",
            pickupCords: {
                latitude: -10.68860,
                longitude: -106.27245
            },
            dropoffCords: {
                latitude: -10.69860,
                longitude: -106.30245

            },
            last4: "8970",
            cardType: "visa"
        },
        {
            image: require("../../Images/driverProfile.png"),
            name: "Robert",
            car: "Toyota Prius",
            rating: 4.9,
            carModel: "AA 5841 AO",
            currentLocation: "Chicago,US",
            DropoffLocation: "PET Hospital",
            scheduleDate: "09-Sep-2023",
            scheduleTime: "06:30 PM",
            fare: 30,
            phoneNumber: "+921234567890",
            pickupCords: {
                latitude: -10.68860,
                longitude: -106.27245
            },
            dropoffCords: {
                latitude: -10.69860,
                longitude: -106.30245

            },
            last4: "8970",
            cardType: "visa"
        },
        {
            image: require("../../Images/driverProfile.png"),
            name: "Robert",
            car: "Toyota Prius",
            rating: 4.9,
            carModel: "AA 5841 AO",
            currentLocation: "Chicago,US",
            DropoffLocation: "PET Hospital",
            scheduleDate: "09-Sep-2023",
            scheduleTime: "06:30 PM",
            fare: 30,
            phoneNumber: "+921234567890",
            pickupCords: {
                latitude: -10.68860,
                longitude: -106.27245
            },
            dropoffCords: {
                latitude: -10.69860,
                longitude: -106.30245

            },
            last4: "8970",
            cardType: "visa"
        },
        {
            image: require("../../Images/driverProfile.png"),
            name: "Robert",
            car: "Toyota Prius",
            rating: 4.9,
            carModel: "AA 5841 AO",
            currentLocation: "Chicago,US",
            DropoffLocation: "PET Hospital",
            scheduleDate: "09-Sep-2023",
            scheduleTime: "06:30 PM",
            fare: 30,
            phoneNumber: "+921234567890",
            pickupCords: {
                latitude: -10.68860,
                longitude: -106.27245
            },
            dropoffCords: {
                latitude: -10.69860,
                longitude: -106.30245

            },
            last4: "8970",
            cardType: "visa"
        },
    ])



    return <View style={{ flex: 1, backgroundColor: Colors.white }} >

        <View style={{ marginTop: 5 }} >
            <CustomHeader
                onPress={() => navigation.goBack()}
                iconname={"arrow-back-outline"}
                text="Drivers"
                color={Colors.black}
            />
        </View>

        <ScrollView>

            <View style=
                {{ paddingHorizontal: 15 }} >


                {drivers && drivers.length > 0 && drivers.map((e, i) => {
                    return (
                        <TouchableOpacity style={{ padding: 5, flexDirection: "row", justifyContent: "space-between", backgroundColor: "#e6e6e6", marginTop: 20, borderRadius: 10, alignItems: "center", paddingHorizontal: 10 }}  >
                            <View style={{ flexDirection: "row", alignItems: "center" }} >
                                <Image source={e.image} style={{ width: 80, height: 80 }} />

                                <View style={{ marginLeft: 5, justifyContent: "center" }} >
                                    <View style={{ flexDirection: "row", alignItems: "center" }} >
                                        <Text style={{ fontFamily: "Poppins-Medium", fontSize: 18, color: Colors.black, height: 20 }} >{e.name}</Text>
                                        <Image source={require("../../Images/star.png")} style={{ marginLeft: 5, marginTop: 5 }} />
                                        <Text style={{ fontFamily: "Poppins-Regular", fontSize: 14, color: Colors.black, height: 20, marginTop: 5, marginLeft: 3 }} >({e.rating})</Text>

                                    </View>
                                    <Text style={{ fontFamily: "Poppins-Medium", fontSize: 16, color: Colors.gray, height: 20 }} >{e.car}</Text>
                                    <Text style={{ fontSize: 12, color: Colors.white, borderRadius: 30, backgroundColor: "#808080", textAlign: "center", marginTop: 5, padding: 0, width: 80, padding: 2 }} >{e.carModel}</Text>

                                </View>

                            </View>

                            <View style={{ alignItems: "flex-end" }} >

                                <Text style={{ fontFamily: "Poppins-SemiBold", color: Colors.black, fontSize: 22 }} >$25</Text>

                                <TouchableOpacity onPress={() => navigation.navigate("PassengerRideDetail", e)} style={{ padding: 5, backgroundColor: Colors.buttonColor, borderRadius: 30, width: 100 }} >
                                    <Text style={{ fontFamily: "Poppins-Regular", color: Colors.white, fontSize: 14, textAlign: "center" }} >Select</Text>

                                </TouchableOpacity>

                            </View>

                        </TouchableOpacity>
                    )
                })}



            </View>

        </ScrollView>

    </View>
}


export default Drivers