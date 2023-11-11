import { View, Text, Image, TouchableOpacity, ScrollView, ToastAndroid, Linking, BackHandler } from "react-native"
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
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import FontAwesome from "react-native-vector-icons/FontAwesome5"

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
    const bookingCont = useContext(BookingContext)

    const { loginData, setLoginData } = loginCont
    const { locationData, setLocationData } = locationCont
    const { bookingData, setBookingData } = bookingCont


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


    const handleRouteToTrackScreen = () => {


        // if (!bookingData) {
        //     ToastAndroid.show("No Track Ride", ToastAndroid.SHORT)
        //     return
        // }

        firestore().collection("Request").doc(auth().currentUser?.uid).get().then((doc) => {

            let data = doc.data()

            if (!data || data?.userResponse || (data?.bookingStatus !== "running" && data?.userResponse) || data.bookingStatus == "cancelled") {
                ToastAndroid.show("No rides to track", ToastAndroid.SHORT)
                return
            }

            else {

                setBookingData(data)
                navigation.navigate("PassengerRideDetail")



            }

        })


        // bookingData && bookingData?.bookingStatus == "running" ? 


    }


    React.useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            // Replace 'TabScreenName' with the name of your tab screen
            // This will navigate to the specified tab screen when the back button is pressed


            navigation.reset({
                index: 0,
                routes: [
                    {
                        name: 'Tab',

                    },
                ],
            })
            return true; // Return true to prevent the default back action

        });

        return () => backHandler.remove(); // Cleanup the event listener

    }, []);



    return (

        <View style={{ flex: 1, backgroundColor: Colors.white }} >

            <View style={{ paddingHorizontal: 20, marginTop: 10, flexDirection: "row", width: "75%", justifyContent: "space-between" }} >

                <Icons onPress={() => navigation.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'Tab',

                        },
                    ],
                })} name="arrow-back-outline" color={Colors.black} size={25} />
                <View style={{ marginRight: 10, marginTop: 10 }} >
                    <Image source={{ uri: loginData.profile }} resizeMode="cover" style={{ alignSelf: "center", height: 130, width: 130, borderRadius: 100 }} />
                    <Text style={{ textAlign: "center", fontFamily: "Poppins-SemiBold", color: Colors.black, fontSize: 18, marginTop: 10 }} >{loginData.fullName}</Text>
                </View>

            </View>

            <ScrollView>

                <View style={{ paddingHorizontal: 20, marginTop: 20 }} >
                    <TouchableOpacity onPress={() => navigation.navigate("Pets")} style={{ width: "100%", backgroundColor: "#D9d9D9", padding: 15, borderRadius: 10, flexDirection: "row", alignItems: "center" }} >
                        <View style={{ width: 50, height: 50, justifyContent: "center", alignItems: "center", backgroundColor: Colors.white, borderRadius: 100 }} >
                            <MaterialIcons name="pets" size={25} color={Colors.buttonColor} />
                        </View>
                        <Text style={{ marginLeft: 15, color: "#21263D", fontFamily: "Poppins-Medium", fontSize: 18 }} >Pets</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => handleRouteToTrackScreen()} style={{ paddingHorizontal: 20, marginTop: 20 }} >

                    <View style={{ width: "100%", backgroundColor: "#D9d9D9", padding: 15, borderRadius: 10, flexDirection: "row", alignItems: "center" }} >

                        <View style={{ width: 50, height: 50, justifyContent: "center", alignItems: "center", backgroundColor: Colors.white, borderRadius: 100 }} >

                            <FontAwesome name="route" color={Colors.buttonColor} size={25} />

                        </View>
                        <Text style={{ marginLeft: 15, color: "#21263D", fontFamily: "Poppins-Medium", fontSize: 18 }} >Track Your Pets</Text>

                    </View>


                </TouchableOpacity>


                <TouchableOpacity onPress={() => navigation.navigate("History")} style={{ paddingHorizontal: 20, marginTop: 20 }} >

                    <View style={{ width: "100%", backgroundColor: "#D9d9D9", padding: 15, borderRadius: 10, flexDirection: "row", alignItems: "center" }} >

                        <View style={{ width: 50, height: 50, justifyContent: "center", alignItems: "center", backgroundColor: Colors.white, borderRadius: 100 }} >

                            <MaterialIcons name="history" size={25} color={Colors.buttonColor} />

                        </View>
                        <Text style={{ marginLeft: 15, color: "#21263D", fontFamily: "Poppins-Medium", fontSize: 18 }} >History</Text>

                    </View>


                </TouchableOpacity>


                <TouchableOpacity onPress={() => navigation.navigate("wallet")} style={{ paddingHorizontal: 20, marginTop: 20 }} >

                    <View style={{ width: "100%", backgroundColor: "#D9d9D9", padding: 15, borderRadius: 10, flexDirection: "row", alignItems: "center" }} >

                        <View style={{ width: 50, height: 50, justifyContent: "center", alignItems: "center", backgroundColor: Colors.white, borderRadius: 100 }} >

                            <MaterialIcons name="wallet" size={25} color={Colors.buttonColor} />

                        </View>
                        <Text style={{ marginLeft: 15, color: "#21263D", fontFamily: "Poppins-Medium", fontSize: 18 }} >Wallet</Text>

                    </View>


                </TouchableOpacity>



                <TouchableOpacity onPress={() => navigation.navigate("Support")} style={{ paddingHorizontal: 20, marginTop: 20 }} >

                    <View style={{ width: "100%", backgroundColor: "#D9d9D9", padding: 15, borderRadius: 10, flexDirection: "row", alignItems: "center" }} >

                        <View style={{ width: 50, height: 50, justifyContent: "center", alignItems: "center", backgroundColor: Colors.white, borderRadius: 100 }} >

                            <MaterialIcons name="support-agent" size={30} color={Colors.buttonColor} />

                        </View>
                        <Text style={{ marginLeft: 15, color: "#21263D", fontFamily: "Poppins-Medium", fontSize: 18 }} >Help & Support</Text>

                    </View>


                </TouchableOpacity>


                <TouchableOpacity onPress={() => navigation.navigate("AccountSetting")} style={{ paddingHorizontal: 20, marginTop: 20 }} >

                    <View style={{ width: "100%", backgroundColor: "#D9d9D9", padding: 15, borderRadius: 10, flexDirection: "row", alignItems: "center" }} >

                        <View style={{ width: 50, height: 50, justifyContent: "center", alignItems: "center", backgroundColor: Colors.white, borderRadius: 100 }} >


                            <MaterialIcons name="settings" size={25} color={Colors.buttonColor} />

                        </View>
                        <Text style={{ marginLeft: 15, color: "#21263D", fontFamily: "Poppins-Medium", fontSize: 18 }} >Account Settings</Text>

                    </View>


                </TouchableOpacity>


                <TouchableOpacity onPress={() => navigation.navigate("Claims")} style={{ paddingHorizontal: 20, marginTop: 20 }} >

                    <View style={{ width: "100%", backgroundColor: "#D9d9D9", padding: 15, borderRadius: 10, flexDirection: "row", alignItems: "center" }} >

                        <View style={{ width: 50, height: 50, justifyContent: "center", alignItems: "center", backgroundColor: Colors.white, borderRadius: 100 }} >

                            <MaterialIcons name="history" size={25} color={Colors.buttonColor} />

                        </View>
                        <Text style={{ marginLeft: 15, color: "#21263D", fontFamily: "Poppins-Medium", fontSize: 18 }} >Claims</Text>

                    </View>


                </TouchableOpacity>


                <TouchableOpacity onPress={() => navigation.navigate("PrivacyPolicy")} style={{ paddingHorizontal: 20, marginTop: 20 }} >

                    <View style={{ width: "100%", backgroundColor: "#D9d9D9", padding: 15, borderRadius: 10, flexDirection: "row", alignItems: "center" }} >

                        <View style={{ width: 50, height: 50, justifyContent: "center", alignItems: "center", backgroundColor: Colors.white, borderRadius: 100 }} >

                            <MaterialIcons name="policy" size={25} color={Colors.buttonColor} />

                        </View>
                        <Text style={{ marginLeft: 15, color: "#21263D", fontFamily: "Poppins-Medium", fontSize: 18 }} >Privacy Policy</Text>

                    </View>


                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleLogoutUser()} style={{ paddingHorizontal: 20, marginTop: 20, marginBottom: 20 }} >

                    <View style={{ width: "100%", backgroundColor: "#D9d9D9", padding: 15, borderRadius: 10, flexDirection: "row", alignItems: "center" }} >

                        <View style={{ width: 50, height: 50, justifyContent: "center", alignItems: "center", backgroundColor: Colors.white, borderRadius: 100 }} >

                            <MaterialIcons name="logout" size={25} color={Colors.buttonColor} />

                        </View>
                        <Text style={{ marginLeft: 15, color: "#21263D", fontFamily: "Poppins-Medium", fontSize: 18 }} >Log Out</Text>

                    </View>


                </TouchableOpacity>

            </ScrollView>

        </View>

    )

}

export default Profile