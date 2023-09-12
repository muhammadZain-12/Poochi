import React, { useState } from "react"
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native"
import Colors from "../../Constant/Color"
import CustomHeader from "../../Components/CustomHeader"
import Icons from 'react-native-vector-icons/Entypo';
import CustomButton from "../../Components/CustomButton";
import Navigation from "../Navigation";

function FriendsAndFamily({ navigation }) {

    const [oneWay, setOneWay] = useState(false)

    return (
        <View style={{ flex: 1, backgroundColor: Colors.white }} >

            <View style={{ marginTop: 5 }} >
                <CustomHeader

                    text={"Friends And Family"}
                    iconname={"arrow-back-outline"}
                    color={Colors.black}
                    onPress={() => navigation.goBack()}


                />

            </View>
            <ScrollView>


                <View style={{ paddingHorizontal: 15, marginTop: 20 }} >



                    <View style={{ backgroundColor: "#21263D", borderRadius: 10, width: "100%", padding: 10 }} >


                        <View style={{ marginTop: 5 }} >
                            <Text style={{ fontSize: 16, color: Colors.white, fontFamily: "Poppins-Medium" }} >Choose Pickup Point</Text>
                            <TouchableOpacity style={{ padding: 12, backgroundColor: "white", borderRadius: 5, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }} >

                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }} >

                                    <Image source={require("../../Images/Location1.png")} style={{ height: 20, width: 17 }} />

                                    <Text style={{ color: Colors.black, fontFamily: "Poppins-Medium", fontSize: 16, marginLeft: 10 }} >Chicago,US</Text>

                                </View>

                                <Image source={require("../../Images/search.png")} />


                            </TouchableOpacity>

                        </View>
                        <View style={{ marginTop: 10, marginBottom: 10 }} >
                            <Text style={{ fontSize: 16, color: Colors.white, fontFamily: "Poppins-Medium" }} >Choose Drop off Point</Text>
                            <TouchableOpacity style={{ padding: 12, backgroundColor: "white", borderRadius: 5, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }} >

                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }} >

                                    <Image source={require("../../Images/Location1.png")} style={{ height: 20, width: 17 }} />

                                    <Text style={{ color: Colors.gray, fontFamily: "Poppins-Medium", fontSize: 16, marginLeft: 10 }} >Enter Destination</Text>

                                </View>

                                <Image source={require("../../Images/search.png")} />


                            </TouchableOpacity>

                        </View>







                    </View>


                    <Text style={{ fontSize: 17, color: Colors.black, fontFamily: "Poppins-SemiBold", marginTop: 10 }} >Pet Select</Text>

                    <View style={{ marginTop: 10, flexDirection: "row", alignItems: "center", flexWrap: "wrap" }} >

                        <TouchableOpacity onPress={() => navigation.navigate("PetSelect")} style={{ width: 120, height: 120, backgroundColor: "#e6e6e6", borderRadius: 10, justifyContent: "center", alignItems: "center" }} >

                            <Image source={require("../../Images/add.png")} />

                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("PetSelect")} style={{ width: 120, height: 120, backgroundColor: "#e6e6e6", borderRadius: 10, marginLeft: 20, justifyContent: "center", alignItems: "center" }} >
                            <Image source={require("../../Images/add.png")} />

                        </TouchableOpacity>



                    </View>


                    <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 20, backgroundColor: "#e6e6e6", borderTopRightRadius: 30, borderBottomRightRadius: 30, borderTopLeftRadius: 30, borderBottomLeftRadius: 30 }} >

                        <TouchableOpacity onPress={() => setOneWay(true)} style={{ padding: 10, borderRadius: oneWay ? 30 : 0, backgroundColor: oneWay ? Colors.buttonColor : "#e6e6e6", width: "50%", borderTopLeftRadius: oneWay ? 30 : 30, borderBottomLeftRadius: oneWay ? 30 : 30 }} >
                            <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Medium", textAlign: "center" }} >One Way</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setOneWay(false)} style={{ padding: 10, borderRadius: !oneWay ? 30 : 0, backgroundColor: !oneWay ? Colors.buttonColor : "#e6e6e6", width: "50%", borderTopRightRadius: oneWay ? 30 : 30, borderBottomRightRadius: oneWay ? 30 : 30 }} >
                            <Text style={{ color: !oneWay ? Colors.white : Colors.gray, fontSize: 18, fontFamily: "Poppins-Medium", textAlign: "center" }} >Round Trip</Text>
                        </TouchableOpacity>
                    </View>


                    {!oneWay && <TouchableOpacity style={{ flexDirection: "row", justifyContent: "space-between", padding: 15, borderWidth: 1, marginTop: 10, borderRadius: 10, paddingVertical: 15 }} >

                        <Text style={{ fontSize: 16, color: Colors.gray, fontFamily: "Poppins-Medium" }} >Schedule Ride</Text>

                        <Image source={require("../../Images/calender.png")} />

                    </TouchableOpacity>}


                    {!oneWay && <View style={{ borderRadius: 30, backgroundColor: Colors.buttonColor, padding: 10, marginTop: 15 }} >

                        <Text style={{ fontSize: 14, color: Colors.white, fontFamily: "Poppins-Medium", textAlign: "center" }} >Travel time to drop off location-20min</Text>

                    </View>

                    }


                    <TouchableOpacity style={{ flexDirection: "row", justifyContent: "space-between", padding: 15, borderWidth: 1, marginTop: 15, borderRadius: 10, paddingVertical: 15, backgroundColor: "#21263D" }} >

                        <Text style={{ fontSize: 18, color: Colors.white, fontFamily: "Poppins-Regular" }} >$ Fare</Text>


                        <Text style={{ fontSize: 18, color: Colors.white, fontFamily: "Poppins-Regular" }} >$ 23.00</Text>

                    </TouchableOpacity>


                    <TextInput

                        multiline={true}
                        style={{ backgroundColor: "#e6e6e6", borderRadius: 5, marginBottom: 10, marginTop: 10, fontFamily: "Poppins-Regular", color: Colors.black, fontSize: 16, paddingHorizontal: 10, textAlignVertical: "top", paddingVertical: 15 }}
                        placeholder='Comment'
                        placeholderTextColor={"gray"}

                    />

                    <TouchableOpacity onPress={() => navigation.navigate("PaymentMethod")} style={{ flexDirection: "row", justifyContent: "space-between", padding: 10, borderWidth: 1, marginTop: 10, borderRadius: 10, paddingVertical: 15, marginBottom: 15, backgroundColor: "#e6e6e6" }} >


                        <Icons name="plus" size={25} color={Colors.black} style={{ position: "relative", left: 20 }} />

                        <Text style={{ fontSize: 16, color: Colors.black, fontFamily: "Poppins-Medium", textAlign: "center", width: "100%" }} >Add a Payment Method</Text>


                    </TouchableOpacity>




                </View>

                <CustomButton onPress={() => navigation.navigate("Drivers")} styleContainer={{ alignSelf: "center", marginBottom: 20, width: "85%" }} text="Find a Driver" />


            </ScrollView>

        </View>
    )
}


export default FriendsAndFamily