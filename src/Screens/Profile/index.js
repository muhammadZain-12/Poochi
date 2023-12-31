import { View, Text, Image, TouchableOpacity, ScrollView, ToastAndroid } from "react-native"
import React, { useContext, useEffect } from "react"
import Colors from "../../Constant/Color"
import Icons from "react-native-vector-icons/Ionicons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import auth from "@react-native-firebase/auth"
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { StackActions } from "@react-navigation/native"
import LoginContext from "../../Context/loginContext/context"
import LocationContext from "../../Context/locationContext/context"


function Profile({ navigation }) {

    useEffect(() => {
        GoogleSignin.configure({
            webClientId:
                '889265375440-76ihli23dk6ulbuamsujt41t0t3gvdcs.apps.googleusercontent.com',
            androidClientId:
                '889265375440-jbbsvsaa0p98bs1itd620d3qbl4hs6rh.apps.googleusercontent.com',
        });
    }, []);

    const loginCont = useContext(LoginContext)
    const locationCont = useContext(LocationContext)

    const { loginData, setLoginData } = loginCont
    const { locationData, setLocationData } = locationCont

    const handleLogoutUser = async () => {

        AsyncStorage.removeItem("user")


        if (GoogleSignin.isSignedIn()) {


            await GoogleSignin.signOut()
            await auth().signOut()
            ToastAndroid.show("Logout Successfully", ToastAndroid.SHORT)
            setLoginData("")
            setLocationData("")
            navigation.reset({
                index: 0,
                routes: [
                    {
                        name: 'Login',

                    },
                ],
            });
        } else {

            auth().signOut().then((res) => {
                navigation.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'Login',

                        },
                    ],
                });
                setLoginData("")
                setLocationData("")
                ToastAndroid.show("Logout Successfully", ToastAndroid.SHORT)

            }).catch((error) => {

                ToastAndroid.show("Logout Unsuccessfull", ToastAndroid.SHORT)


            })
        }

    }

    return (

        <View style={{ flex: 1, backgroundColor: Colors.white }} >

            <View style={{ paddingHorizontal: 20, marginTop: 10, flexDirection: "row", width: "75%", justifyContent: "space-between" }} >

                <Icons onPress={() => navigation.goBack()} name="arrow-back-outline" color={Colors.black} size={25} />
                <View>
                    <Image source={{ uri: loginData.profile }} resizeMode="contain" style={{ alignSelf: "center", height: 130, width: 130, borderRadius: 10 }} />
                    <Text style={{ textAlign: "center", fontFamily: "Poppins-SemiBold", color: Colors.black, fontSize: 18 }} >{loginData.fullName}</Text>
                </View>

            </View>

            <ScrollView>

                <View style={{ paddingHorizontal: 20, marginTop: 20 }} >

                    <TouchableOpacity onPress={() => navigation.navigate("Pets")} style={{ width: "100%", backgroundColor: "#D9d9D9", padding: 15, borderRadius: 10, flexDirection: "row", alignItems: "center" }} >

                        <View style={{ width: 50, height: 50, justifyContent: "center", alignItems: "center", backgroundColor: Colors.white, borderRadius: 100 }} >

                            <Image source={require("../../Images/setting1.png")} />

                        </View>
                        <Text style={{ marginLeft: 15, color: "#21263D", fontFamily: "Poppins-Medium", fontSize: 18 }} >Pets</Text>

                    </TouchableOpacity>


                </View>


                <TouchableOpacity onPress={() => navigation.navigate("History")} style={{ paddingHorizontal: 20, marginTop: 20 }} >

                    <View style={{ width: "100%", backgroundColor: "#D9d9D9", padding: 15, borderRadius: 10, flexDirection: "row", alignItems: "center" }} >

                        <View style={{ width: 50, height: 50, justifyContent: "center", alignItems: "center", backgroundColor: Colors.white, borderRadius: 100 }} >

                            <Image source={require("../../Images/201.png")} />

                        </View>
                        <Text style={{ marginLeft: 15, color: "#21263D", fontFamily: "Poppins-Medium", fontSize: 18 }} >History</Text>

                    </View>


                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("wallet")} style={{ paddingHorizontal: 20, marginTop: 20 }} >

                    <View style={{ width: "100%", backgroundColor: "#D9d9D9", padding: 15, borderRadius: 10, flexDirection: "row", alignItems: "center" }} >

                        <View style={{ width: 50, height: 50, justifyContent: "center", alignItems: "center", backgroundColor: Colors.white, borderRadius: 100 }} >

                            <Image source={require("../../Images/201.png")} />

                        </View>
                        <Text style={{ marginLeft: 15, color: "#21263D", fontFamily: "Poppins-Medium", fontSize: 18 }} >Wallet</Text>

                    </View>


                </TouchableOpacity>
                <TouchableOpacity style={{ paddingHorizontal: 20, marginTop: 20 }} >

                    <View style={{ width: "100%", backgroundColor: "#D9d9D9", padding: 15, borderRadius: 10, flexDirection: "row", alignItems: "center" }} >

                        <View style={{ width: 50, height: 50, justifyContent: "center", alignItems: "center", backgroundColor: Colors.white, borderRadius: 100 }} >

                            <Image source={require("../../Images/201.png")} />

                        </View>
                        <Text style={{ marginLeft: 15, color: "#21263D", fontFamily: "Poppins-Medium", fontSize: 18 }} >Account Setting</Text>

                    </View>


                </TouchableOpacity>
                <TouchableOpacity style={{ paddingHorizontal: 20, marginTop: 20 }} >

                    <View style={{ width: "100%", backgroundColor: "#D9d9D9", padding: 15, borderRadius: 10, flexDirection: "row", alignItems: "center" }} >

                        <View style={{ width: 50, height: 50, justifyContent: "center", alignItems: "center", backgroundColor: Colors.white, borderRadius: 100 }} >

                            <Image source={require("../../Images/track.png")} />

                        </View>
                        <Text style={{ marginLeft: 15, color: "#21263D", fontFamily: "Poppins-Medium", fontSize: 18 }} >Track Your Ride</Text>

                    </View>


                </TouchableOpacity>
                <TouchableOpacity style={{ paddingHorizontal: 20, marginTop: 20 }} >

                    <View style={{ width: "100%", backgroundColor: "#D9d9D9", padding: 15, borderRadius: 10, flexDirection: "row", alignItems: "center" }} >

                        <View style={{ width: 50, height: 50, justifyContent: "center", alignItems: "center", backgroundColor: Colors.white, borderRadius: 100 }} >

                            <Image source={require("../../Images/setting.png")} />

                        </View>
                        <Text style={{ marginLeft: 15, color: "#21263D", fontFamily: "Poppins-Medium", fontSize: 18 }} >Privacy Policy</Text>

                    </View>


                </TouchableOpacity>
                <TouchableOpacity style={{ paddingHorizontal: 20, marginTop: 20 }} >

                    <View style={{ width: "100%", backgroundColor: "#D9d9D9", padding: 15, borderRadius: 10, flexDirection: "row", alignItems: "center" }} >

                        <View style={{ width: 50, height: 50, justifyContent: "center", alignItems: "center", backgroundColor: Colors.white, borderRadius: 100 }} >

                            <Image source={require("../../Images/i24support.png")} />

                        </View>
                        <Text style={{ marginLeft: 15, color: "#21263D", fontFamily: "Poppins-Medium", fontSize: 18 }} >Help & Support</Text>

                    </View>


                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleLogoutUser()} style={{ paddingHorizontal: 20, marginTop: 20, marginBottom: 20 }} >

                    <View style={{ width: "100%", backgroundColor: "#D9d9D9", padding: 15, borderRadius: 10, flexDirection: "row", alignItems: "center" }} >

                        <View style={{ width: 50, height: 50, justifyContent: "center", alignItems: "center", backgroundColor: Colors.white, borderRadius: 100 }} >

                            <Image source={require("../../Images/i24support.png")} />

                        </View>
                        <Text style={{ marginLeft: 15, color: "#21263D", fontFamily: "Poppins-Medium", fontSize: 18 }} >Log Out</Text>

                    </View>


                </TouchableOpacity>

            </ScrollView>

        </View>

    )

}

export default Profile