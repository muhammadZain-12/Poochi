


import { View, Text, Image, TouchableOpacity, ScrollView, ToastAndroid, Linking } from "react-native"
import React, { useContext, useEffect } from "react"
import Colors from "../../Constant/Color"
import Icons from "react-native-vector-icons/Ionicons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import auth from "@react-native-firebase/auth"
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LinkingContext, StackActions } from "@react-navigation/native"
import LoginContext from "../../Context/loginContext/context"
import LocationContext from "../../Context/locationContext/context"
import firestore from "@react-native-firebase/firestore"
import BookingContext from "../../Context/bookingContext/context"
import CustomHeader from "../../Components/CustomHeader"


function AccountSetting({ navigation }) {




    const loginCont = useContext(LoginContext)
    const locationCont = useContext(LocationContext)
    const bookingCont = useContext(BookingContext)

    const { loginData, setLoginData } = loginCont
    const { locationData, setLocationData } = locationCont
    const { bookingData, setBookingData } = bookingCont





    return (

        <View style={{ flex: 1, backgroundColor: Colors.white }} >



            <View style={{ marginTop: 10 }} >
                <CustomHeader
                    onPress={() => navigation.goBack()}
                    iconname={"arrow-back-outline"}
                    text="Account Setting"
                    color={Colors.black}
                // image={require("../../Images/plus.png")}
                // imageFunc={() => navigation.navigate('Tab', {
                //     screen: 'PetDetails',
                // })}
                />
            </View>

            <ScrollView>

                <View style={{ paddingHorizontal: 20, marginTop: 20 }} >

                    <TouchableOpacity onPress={() => navigation.navigate("UpdatePassword")} style={{ width: "100%", backgroundColor: "#D9d9D9", padding: 15, borderRadius: 10, flexDirection: "row", alignItems: "center" }} >

                        <View style={{ width: 50, height: 50, justifyContent: "center", alignItems: "center", backgroundColor: Colors.white, borderRadius: 100 }} >

                            <Image source={require("../../Images/setting1.png")} />

                        </View>
                        <Text style={{ marginLeft: 15, color: "#21263D", fontFamily: "Poppins-Medium", fontSize: 18 }} >Update Password</Text>

                    </TouchableOpacity>


                </View>


                <TouchableOpacity onPress={() => navigation.navigate("EditProfile")} style={{ paddingHorizontal: 20, marginTop: 20 }} >

                    <View style={{ width: "100%", backgroundColor: "#D9d9D9", padding: 15, borderRadius: 10, flexDirection: "row", alignItems: "center" }} >

                        <View style={{ width: 50, height: 50, justifyContent: "center", alignItems: "center", backgroundColor: Colors.white, borderRadius: 100 }} >

                            <Image source={require("../../Images/201.png")} />

                        </View>
                        <Text style={{ marginLeft: 15, color: "#21263D", fontFamily: "Poppins-Medium", fontSize: 18 }} >Edit Profile</Text>

                    </View>


                </TouchableOpacity>



            </ScrollView>

        </View>

    )

}

export default AccountSetting