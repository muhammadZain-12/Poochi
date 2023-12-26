import React, { useState, useContext, useEffect, useRef } from "react"
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator, Dimensions, ToastAndroid, BackHandler, AppState } from "react-native"
import CustomHeader from "../../Components/CustomHeader"
import CustomButton from "../../Components/CustomButton"
import Colors from "../../Constant/Color"
import BookingContext from "../../Context/bookingContext/context"
import firestore from "@react-native-firebase/firestore"
import { getPreciseDistance } from "geolib"
import { useIsFocused } from "@react-navigation/native"
import axios from "axios"
import RadiusContext from "../../Context/RadiusContext/context"


function Drivers({ navigation }) {


    const bookingCont = useContext(BookingContext)
    const radiusCont = useContext(RadiusContext)

    const { bookingData, setBookingData } = bookingCont
    const { radius, setRadius } = radiusCont

    const [driverData, setDriverData] = useState([])
    const [selectedDriver, setSelectedDriver] = useState("")
    const [requestInProcess, setRequestInProcess] = useState(false)
    const [rejectDrivers, setRejectDrivers] = useState([])






    const focus = useIsFocused()








    const getDriver = () => {



        let unsubscribe = firestore().collection("Drivers").where("driverStatus", "==", "online").onSnapshot((querySnapshot) => {

            let drivers = []


            if (bookingData?.requestStatus !== "accept") {


                querySnapshot.forEach((doc) => {

                    let data = doc.data()

                    if (!data.inlined) {

                        if (data?.currentLocation?.latitude && data?.currentLocation?.longitude) {

                            const dis = getPreciseDistance(
                                {
                                    latitude: bookingData?.pickupCords?.lat,
                                    longitude: bookingData?.pickupCords?.lng,
                                },
                                {
                                    latitude: data?.currentLocation?.latitude,
                                    longitude: data?.currentLocation?.longitude,
                                },
                            );

                            let flag = rejectDrivers && rejectDrivers.length > 0 && rejectDrivers.some((e, i) => e.id == data.id)


                            mileDistance = (dis / 1609.34)?.toFixed(2);

                            if (mileDistance <= Number(radius) && !flag) {
                                drivers.push(data)
                            }

                        }
                    }
                })

            }

            setDriverData(drivers)
        })


        return () => {
            unsubscribe()
        }


    }


    React.useEffect(() => {
        getDriver()
    }, [rejectDrivers.length, radius])


    function generateRandomId(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomId = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomId += characters.charAt(randomIndex);
        }

        return randomId;
    }


    const checkDriverResponse = () => {


        const unsubscribe = firestore().collection("Request").doc(bookingData?.userData?.id).onSnapshot((querySnapshot) => {



            let data = querySnapshot.data()

            if (data?.insufficientBalance) {

                ToastAndroid.show(data?.insufficientBalanceMessage, ToastAndroid.SHORT)
                navigation.goBack()

            }


            if (data?.requestStatus == "accept" && focus && requestInProcess) {


                // ToastAndroid.show("Your request has been succesfuly accepted", ToastAndroid.SHORT)
                setRequestInProcess(false)
                // setBookingData({
                //     ...bookingData,
                //     requestStatus: "accept"
                // })
                navigation.navigate("PassengerRideDetail")

                // firestore().collection("Request").doc(bookingData?.userData?.id).update({
                //     bookingStartDate: new Date(),
                //     rideStatus: "running"
                // }).then(() => {
                //     // setBookingData({
                //     //     ...bookingData,
                //     //     bookingId: bookingId,
                //     //     bookingDate: new Date()
                //     // })
                //     setRequestInProcess(false)
                //     navigation.replace("PassengerRideDetail")
                // })

                return

            }

            if (data?.requestStatus == "rejected" && focus) {

                ToastAndroid.show("Driver has rejected your request", ToastAndroid.SHORT)
                setRejectDrivers([...rejectDrivers, data?.driverData])
                setRequestInProcess(false)

            }




        })


        return () => {
            unsubscribe()
        }

    }



    React.useEffect(() => {


        if (focus) {
            checkDriverResponse()
        }

    }, [focus, selectedDriver])



    React.useEffect(() => {
        let timeoutId = null;

        if (driverData.length === 0 && focus) {
            // Set a timeout to navigate after 5 seconds if driverData is still empty
            timeoutId = setTimeout(() => {
                if (driverData.length === 0) {
                    ToastAndroid.show("Drivers are not available right now. Please try again later.", ToastAndroid.SHORT);
                    navigation.navigate(bookingData.type);
                }
            }, 45000);
        }

        // Clear the timeout if driverData becomes available before 5 seconds
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [driverData, navigation, bookingData.type, focus]);



    React.useEffect(() => {
        let timeoutId = null;

        if (requestInProcess) {
            // Set a timeout to navigate after 5 seconds if driverData is still empty
            timeoutId = setTimeout(() => {
                if (requestInProcess) {
                    ToastAndroid.show("This driver is not available right now.", ToastAndroid.SHORT);

                    firestore().collection("Request").doc(bookingData?.userData?.id).update({
                        requestStatus: ""
                    }).then((res) => {
                        setRequestInProcess(false)
                        setRejectDrivers([...rejectDrivers, selectedDriver])
                    }).catch((error) => {

                        ToastAndroid.show(error.message, ToastAndroid.SHORT)
                        setRequestInProcess(false)

                    })
                }
            }, 60000);
        }
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [requestInProcess, selectedDriver]);




    const handleSelectDriver = (driver) => {



        firestore().collection("Request").doc(bookingData?.userData?.id).update({
            driverData: driver,
            requestStatus: "pending"
        }).then(() => {

            let { token } = driver

            if (token) {
                var data = JSON.stringify({
                    notification: {
                        body: `You have request from ${bookingData?.userData?.fullName} kindly respond back`,
                        title: `Hi ${driver.fullName} `,
                        sound: "default"
                    },
                    to: token,
                });
                let config = {
                    method: 'post',
                    url: 'https://fcm.googleapis.com/fcm/send',
                    headers: {
                        Authorization:
                            'key=AAAAzwxYyNA:APA91bEU1Zss73BLEraf4jDgob9rsAfxshC0GBBxbgPo340U5DTWDVbS9MYudIPDjIvZwNH7kNkucQ0EHNQtnBcjf5gbhbn09qU0TpKagm2XvOxmAvyBSYoczFtxW7PpHgffPpdaS9fM',
                        'Content-Type': 'application/json',
                    },
                    data: data,
                };
                axios(config)
                    .then(res => {

                        let notification = JSON.parse(data)

                        let notificationToSend = {
                            title: notification.notification.title,
                            body: notification.notification.body,
                            date: new Date()
                        }

                        firestore().collection("DriverNotification").doc(driver.id).set({
                            notification: firestore.FieldValue.arrayUnion(notificationToSend)
                        }, { merge: true }).then((res) => {
                            setRequestInProcess(true)
                            setSelectedDriver(driver)
                            setBookingData({
                                ...bookingData,
                                driverData: driver
                            })
                        }).catch((error) => {

                            setRequestInProcess(false)

                        })

                    })
                    .catch(error => {
                        setRequestInProcess(false)
                        console.log(error, "error")
                    });
            }

        }).catch((error) => {

            ToastAndroid.show(error.message, ToastAndroid.SHORT)

        })
    }

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            // Replace 'TabScreenName' with the name of your tab screen
            // This will navigate to the specified tab screen when the back button is pressed

            navigation.goBack()

            return true; // Return true to prevent the default back action

        });

        return () => backHandler.remove(); // Cleanup the event listener

    }, []);





    return <View style={{ flex: 1, backgroundColor: Colors.white }} >

        <View style={{ marginTop: 5 }} >
            <CustomHeader
                onPress={() => navigation.goBack()}
                iconname={"arrow-back-outline"}
                text="Drivers"
                color={Colors.black}
            />
        </View>

        <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false} style={{ flex: 1 }} >

            {requestInProcess ? <View style={{ flex: 1, justifyContent: "center", alignItems: "center", height: Dimensions.get("window").height - 100 }} >

                <ActivityIndicator color={Colors.buttonColor} size="large" />
                <Text style={{ color: Colors.black, fontFamily: "Poppins-Bold", fontSize: 22 }} >Processing Request</Text>

            </View> : driverData && driverData.length == 0 ? <View style={{ flex: 1, justifyContent: "center", alignItems: "center", height: Dimensions.get("window").height - 100 }} >

                <ActivityIndicator color={Colors.buttonColor} size="large" />
                <Text style={{ color: Colors.black, fontFamily: "Poppins-Bold", fontSize: 22 }} >Finding Drivers</Text>

            </View> : <View style=
                {{ paddingHorizontal: 15 }} >


                {driverData && driverData.length > 0 && driverData.map((e, i) => {
                    return (
                        <TouchableOpacity key={i} style={{ padding: 10, flexDirection: "row", justifyContent: "space-between", backgroundColor: "#e6e6e6", marginTop: 20, borderRadius: 10, alignItems: "center", paddingHorizontal: 10 }}  >
                            <View style={{ flexDirection: "row", alignItems: "center" }} >
                                <Image source={{ uri: e.profile }} style={{ width: 60, height: 60, borderRadius: 50 }} />

                                <View style={{ marginLeft: 5, justifyContent: "center" }} >
                                    <View style={{ flexDirection: "row", alignItems: "center" }} >
                                        <Text style={{ fontFamily: "Poppins-Medium", fontSize: 16, color: Colors.black, height: 25 }} >{e.fullName.length > 9 ? `${e.fullName.slice(0, 8)}...` : e.fullName}</Text>
                                        <Image source={require("../../Images/star.png")} style={{ marginLeft: 5, marginTop: 5 }} />
                                        <Text style={{ fontFamily: "Poppins-Regular", fontSize: 14, color: Colors.black, height: 20, marginTop: 5, marginLeft: 3 }} >({e.rating})</Text>
                                    </View>
                                    <Text style={{ fontFamily: "Poppins-Medium", fontSize: 16, color: Colors.gray, height: 20 }} >{e.VehicleDetails?.vehicleName}</Text>
                                    <Text style={{ fontFamily: "Poppins-Medium", fontSize: 12, color: Colors.gray, height: 20, width: 140 }} numberOfLines={2} >{e.petExperience ? `${Number(e.petExperience)} year pet experience` : "No Pet Experience"} </Text>
                                    <Text style={{ fontSize: 12, color: Colors.white, borderRadius: 30, backgroundColor: "#808080", textAlign: "center", marginTop: 5, padding: 0, width: 80, padding: 2 }} >{e.VehicleDetails?.vehicleNumPlate}</Text>
                                </View>

                            </View>

                            <View style={{ alignItems: "flex-end" }} >
                                <Text style={{ fontFamily: "Poppins-SemiBold", color: Colors.black, fontSize: 22 }} >${Number(bookingData.fare).toFixed(2)}</Text>
                                <TouchableOpacity onPress={() => handleSelectDriver(e)} style={{ padding: 5, backgroundColor: Colors.buttonColor, borderRadius: 30, width: 100 }} >
                                    <Text style={{ fontFamily: "Poppins-Regular", color: Colors.white, fontSize: 14, textAlign: "center" }} >Select</Text>
                                </TouchableOpacity>
                            </View>

                        </TouchableOpacity>
                    )
                })}



            </View>}

        </ScrollView>

    </View>
}


export default Drivers