import { View, Image, TouchableOpacity, Text, FlatList } from "react-native"
import Colors from "../../Constant/Color"
import Icons from "react-native-vector-icons/Ionicons"
import { useState } from "react"


function Chat() {


    const [drivers, setDrivers] = useState([
        {
            image: require("../../Images/driverProfile.png"),
            name: "James Smith",
            about: "Good Evening",
            lastMsgTime: "3m",
            pendingMsg: "20",
            id: 1
        },

        {
            image: require("../../Images/driverProfile.png"),
            name: "James Smith",
            about: "Good Evening",
            lastMsgTime: "3m",
            pendingMsg: "20",
            id: 2
        },
        {
            image: require("../../Images/driverProfile.png"),
            name: "James Smith",
            about: "Good Evening",
            lastMsgTime: "3m",
            pendingMsg: "20",
            id: 3
        },
        {
            image: require("../../Images/driverProfile.png"),
            name: "James Smith",
            about: "Good Evening",
            lastMsgTime: "3m",
            pendingMsg: "20",
            id: 4
        },
        {
            image: require("../../Images/driverProfile.png"),
            name: "James Smith",
            about: "Good Evening",
            lastMsgTime: "3m",
            pendingMsg: "0",
            id: 5
        },
        {
            image: require("../../Images/driverProfile.png"),
            name: "James Smith",
            about: "Good Evening",
            lastMsgTime: "3m",
            pendingMsg: "0",
            id: 5
        },
        {
            image: require("../../Images/driverProfile.png"),
            name: "James Smith",
            about: "Good Evening",
            lastMsgTime: "3m",
            pendingMsg: "0",
            id: 5
        },
        {
            image: require("../../Images/driverProfile.png"),
            name: "James Smith",
            about: "Good Evening",
            lastMsgTime: "3m",
            pendingMsg: "0",
            id: 5
        },
        {
            image: require("../../Images/driverProfile.png"),
            name: "James Smith",
            about: "Good Evening",
            lastMsgTime: "3m",
            pendingMsg: "0",
            id: 5
        },
        {
            image: require("../../Images/driverProfile.png"),
            name: "James Smith",
            about: "Good Evening",
            lastMsgTime: "3m",
            pendingMsg: "0",
            id: 5
        },
    ])


    const renderDrivers = ({ item }) => {



        return <TouchableOpacity style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }} >


            <View style={{ flexDirection: "row" }} >
                <Image source={item.image} style={{ width: 50, height: 50 }} />

                <View style={{ marginLeft: 10 }} >

                    <Text style={{ fontSize: 14, fontFamily: "Poppins-SemiBold", color: Colors.black, height: 20 }} >{item.name}</Text>
                    <Text style={{ fontSize: 14, fontFamily: "Poppins-Medium", color: Colors.gray }} >{item.about}</Text>

                </View>



            </View>

            <View>

                <Text style={{ fontSize: 13, fontFamily: "Poppins-SemiBold", color: Colors.black, height: 20 }} >{item.lastMsgTime} ago </Text>

                {item.pendingMsg && <View style={{ width: 24, height: 24, backgroundColor: Colors.buttonColor, borderRadius: 100, alignSelf: "flex-end", marginTop: 5, justifyContent: "center", alignItems: "center" }}>

                    <Text style={{ fontSize: 12, fontFamily: "Poppins-Medium", color: Colors.white }} >
                        {item.pendingMsg}
                    </Text>


                </View>}
            </View>

        </TouchableOpacity>



    }


    return (
        <View style={{ flex: 1, backgroundColor: Colors.white }} >

            <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 20, alignItems: "center" }} >

                <Image source={require("../../Images/profile.png")} />

                <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }} >

                    <Image source={require("../../Images/location.png")} />

                    <Text style={{ fontSize: 18, fontWeight: "bold", color: Colors.black, fontSize: 16, marginLeft: 5 }} >Chicago, US</Text>

                    <Icons size={20} color="gray" name="chevron-down" />

                </TouchableOpacity>

                <View style={{ flexDirection: "row" }} >

                    <TouchableOpacity>

                        <Image source={require("../../Images/notification.png")} />


                    </TouchableOpacity>


                    <TouchableOpacity style={{ marginLeft: 5 }} >
                        <Image source={require("../../Images/tracking.png")} />

                    </TouchableOpacity>
                </View>





            </View>


            <View style={{ paddingHorizontal: 20, marginTop: 10 }} >

                <Text style={{ fontFamily: "Poppins-SemiBold", color: Colors.black, fontSize: 22 }} >Chats</Text>


                <View style={{ marginTop: 0, marginBottom: 20 }} >


                    <FlatList

                        data={drivers}
                        renderItem={renderDrivers}


                    />


                </View>


            </View>




        </View>
    )
}

export default Chat