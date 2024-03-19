import React, { useContext, useState } from "react"
import { View, Text, TouchableOpacity, TextInput, ScrollView, ToastAndroid, ActivityIndicator } from "react-native"
import Colors from "../../Constant/Color"
import CustomButton from "../../Components/CustomButton"
import CustomHeader from "../../Components/CustomHeader"
import Icons from "react-native-vector-icons/Feather"
import firestore from "@react-native-firebase/firestore"
import auth from "@react-native-firebase/auth"
import BookingContext from "../../Context/bookingContext/context"
import SelectedPetContext from "../../Context/SelectedPetContext/context"
import cardDetailsContext from "../../Context/CardDetailsContext/context"
import axios from "axios"
import Drivers from "../Drivers"
import CancelChargesContext from "../../Context/cancelRideChargesContext/context"


function ScheduleCancelRide({ navigation, route }) {

    let items = route.params

    const [waiting, setWating] = useState(false)
    const [contactDriver, setContactDriver] = useState(false)
    const [deniedDestination, setDeniedDestination] = useState(false)
    const [deniedPickup, setDeniedPickup] = useState(false)
    const [wrongAddress, setWrongAddress] = useState(false)
    const [priceNotReasonable, setPriceNotReasonable] = useState(false)
    const [other, setOther] = useState("")
    const [loading, setLoading] = useState(false)


    const bookingCont = useContext(BookingContext)
    const selectedPetCont = useContext(SelectedPetContext)
    const cardCont = useContext(cardDetailsContext)
    let cancelChargesCont = useContext(CancelChargesContext)


    const { bookingData, setBookingData } = bookingCont
    const { selectedPets, setSelectedPets } = selectedPetCont
    const { cardDetails, setCardDetails } = cardCont
    let { cancelCharges, setCancelCharges, scheduleCancelCharges, setScheduleCancelCharges } = cancelChargesCont




    const handleCancelRide = () => {


        let cancelReason = {}

        if (waiting) {
            cancelReason.waiting = true
        }
        if (contactDriver) {
            cancelReason.contactDriver = true
        }
        if (deniedDestination) {
            cancelReason.deniedDestination = true
        }
        if (deniedPickup) {
            cancelReason.deniedPickup = true
        }
        if (wrongAddress) {
            cancelReason.wrongAddress = true
        }

        if (priceNotReasonable) {
            cancelReason.priceNotReasonable = true
        }
        if (other) {
            cancelReason.other = true
        }


        setLoading(true)


        let id = auth().currentUser?.uid


        const scheduledDateTime = new Date(
            items?.scheduleDate?.toDate()?.getFullYear(),
            items?.scheduleDate?.toDate()?.getMonth(),
            items?.scheduleDate?.toDate()?.getDate(),
            items?.scheduleTime?.toDate()?.getHours(),
            items?.scheduleTime?.toDate()?.getMinutes(),
            items?.scheduleTime?.toDate()?.getSeconds()
        );

        const nowDateTime = new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate(),
            new Date().getHours(),
            new Date().getMinutes(),
            new Date().getSeconds()
        );

        let scheduleGetTime = scheduledDateTime.getTime()
        let nowGetTime = nowDateTime.getTime()

        let diff = scheduleGetTime - nowGetTime
        let hours = diff / 1000 / 60 / 60






        if (!items?.driverData) {

            firestore().collection("ScheduleRides").doc(items?.userData?.id).get().then((doc) => {

                let scheduleData = doc?.data()

                let scheduleRides = scheduleData?.scheduleRides

                let otherData = scheduleRides && scheduleRides.length > 0 && scheduleRides.filter((e, i) => e.bookingId !== items?.bookingId)

                items.ScheduleRidestatus = "cancelled"
                items.drivers = ""

                let allData = [...otherData, items]

                firestore().collection("ScheduleRides").doc(items?.userData?.id).set({
                    scheduleRides: allData
                }).then((res) => {

                    navigation.navigate("ScheduleRide")
                    ToastAndroid.show("Your scheduled booking has been succesfully cancelled", ToastAndroid.LONG)
                    setLoading(false)
                }).catch((error) => {
                    setLoading(false)
                    ToastAndroid.show(error?.message, ToastAndroid.LONG)


                })


            })

            return

        }

        if (items?.driverData) {


            firestore().collection("ScheduleRides").doc(items?.userData?.id).get().then((doc) => {

                let scheduleData = doc?.data()

                let scheduleRides = scheduleData?.scheduleRides

                let otherData = scheduleRides && scheduleRides.length > 0 && scheduleRides.filter((e, i) => e.bookingId !== items?.bookingId)

                let driverData = { ...items?.driverData }

                items.ScheduleRidestatus = "cancelled"
                items.drivers = ""
                items.driverData = ""

                let allData = [...otherData, items]


                firestore().collection("ScheduleRides").doc(items?.userData?.id).set({
                    scheduleRides: allData
                }).then((res) => {

                    if (Number(hours) < 3) {

                        let dataToSend = {

                            date: new Date(),
                            deposit: 0,
                            cancellationCharges: (Number(items?.fare) * Number(scheduleCancelCharges)) / 100,
                            spent: 0,
                            remainingWallet: -(Number(items?.fare) * Number(scheduleCancelCharges)) / 100

                        }

                        firestore().collection("UserWallet").doc(items?.userData?.id).set({
                            wallet: firestore.FieldValue.arrayUnion(dataToSend)
                        }, { merge: true }).then((res) => {

                            var data = JSON.stringify({
                                notification: {
                                    body: 'Scheduled Booking has been cancelled by customer',
                                    title: `Hi ${driverData?.fullName}`,
                                    sound: "default"
                                },
                                to: driverData?.token,
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


                                    items.cancelCharges = dataToSend.cancellationCharges

                                    firestore().collection("ScheduledCancelRides").doc(auth().currentUser.uid).set({
                                        cancelRides: firestore.FieldValue.arrayUnion(items)
                                    }, { merge: true }).then(() => {

                                        let notificationToSend = {
                                            body: "Scheduled Booking has been cancelled by customer",
                                            title: `Hi ${driverData?.fullName}`,
                                            date: new Date()
                                        }

                                        firestore().collection("DriverNotification").doc(driverData.id).set({
                                            notification: firestore.FieldValue.arrayUnion(notificationToSend)
                                        }, { merge: true }).then((res) => {
                                            navigation.navigate("ScheduleRide")
                                            ToastAndroid.show("Your scheduled booking has been succesfully cancelled", ToastAndroid.LONG)
                                            setLoading(false)
                                        }).catch((error) => {
                                            setLoading(false)
                                        })
                                    }).catch((error) => {
                                        setLoading(false)
                                    })

                                })
                                .catch(error => {
                                    // setRequestInProcess(false)
                                    console.log(error, "error")
                                });





                        })


                        return
                    }



                    var data = JSON.stringify({
                        notification: {
                            body: 'Scheduled Booking has been cancelled by customer',
                            title: `Hi ${driverData?.fullName}`,
                            sound: "default"
                        },
                        to: driverData?.token,
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

                            let notificationToSend = {
                                body: "Scheduled Booking has been cancelled by customer",
                                title: `Hi ${driverData?.fullName}`,
                                date: new Date()
                            }

                            firestore().collection("DriverNotification").doc(driverData.id).set({
                                notification: firestore.FieldValue.arrayUnion(notificationToSend)
                            }, { merge: true }).then((res) => {
                                navigation.navigate("ScheduleRide")
                                ToastAndroid.show("Your scheduled booking has been succesfully cancelled", ToastAndroid.LONG)
                                setLoading(false)
                            }).catch((error) => {
                                setLoading(false)
                            })


                        })
                        .catch(error => {
                            // setRequestInProcess(false)
                            console.log(error, "error")
                        });


                }).catch((error) => {
                    setLoading(false)
                    ToastAndroid.show(error?.message, ToastAndroid.LONG)
                })


            })

        }

    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors.white }} >

            <View style={{ marginTop: 5 }} >
                <CustomHeader
                    onPress={() => navigation.goBack()}
                    iconname={"arrow-back-outline"}
                    text="Cancel Booking"
                    color={Colors.black}
                />
            </View>

            <ScrollView>

                <View style={{ paddingHorizontal: 20, marginTop: 20 }} >

                    <Text style={{ fontSize: 14, fontFamily: "Poppins-Medium", color: "#808080" }} >Please select the reason of cancellation</Text>


                    <View style={{ padding: 10, borderWidth: 1, borderColor: waiting ? Colors.buttonColor : Colors.gray, borderRadius: 10, marginTop: 10, paddingVertical: 20, flexDirection: "row" }} >

                        <TouchableOpacity onPress={() => setWating(!waiting)} style={{ width: 25, height: 25, borderRadius: 5, borderWidth: 1, borderColor: Colors.gray, backgroundColor: waiting ? Colors.buttonColor : Colors.white, justifyContent: "center", alignItems: "center" }} >

                            {waiting && <Icons name="check" size={20} color={Colors.white} />}

                        </TouchableOpacity>

                        <Text style={{ marginLeft: 10, fontFamily: "Poppins-Medium", fontSize: 16, color: "#808080" }} >Waiting for long time</Text>

                    </View>
                    <View style={{ padding: 10, borderWidth: 1, borderColor: contactDriver ? Colors.buttonColor : Colors.gray, borderRadius: 10, marginTop: 10, paddingVertical: 20, flexDirection: "row" }} >

                        <TouchableOpacity onPress={() => setContactDriver(!contactDriver)} style={{ width: 25, height: 25, borderRadius: 5, borderWidth: 1, borderColor: Colors.gray, justifyContent: "center", alignItems: "center", backgroundColor: contactDriver ? Colors.buttonColor : Colors.white }} >
                            {contactDriver && <Icons name="check" size={20} color={Colors.white} />}

                        </TouchableOpacity>
                        <Text style={{ marginLeft: 10, fontFamily: "Poppins-Medium", fontSize: 16, color: "#808080" }} >Unable to contact driver</Text>
                    </View>

                    <View style={{ padding: 10, borderWidth: 1, borderColor: wrongAddress ? Colors.buttonColor : Colors.gray, borderRadius: 10, marginTop: 10, paddingVertical: 20, flexDirection: "row" }} >

                        <TouchableOpacity onPress={() => setWrongAddress(!wrongAddress)} style={{ width: 25, height: 25, borderRadius: 5, borderWidth: 1, borderColor: Colors.gray, backgroundColor: wrongAddress ? Colors.buttonColor : Colors.white, alignItems: "center", justifyContent: "center" }} >
                            {wrongAddress && <Icons name="check" size={20} color={Colors.white} />}

                        </TouchableOpacity >

                        <Text style={{ marginLeft: 10, fontFamily: "Poppins-Medium", fontSize: 16, color: "#808080" }} >I've changed my mind</Text>

                    </View>
                    <View style={{ padding: 10, borderWidth: 1, borderColor: priceNotReasonable ? Colors.buttonColor : Colors.gray, borderRadius: 10, marginTop: 10, paddingVertical: 20, flexDirection: "row" }} >

                        <TouchableOpacity onPress={() => setPriceNotReasonable(!priceNotReasonable)} style={{ width: 25, height: 25, borderRadius: 5, borderWidth: 1, borderColor: Colors.gray, backgroundColor: priceNotReasonable ? Colors.buttonColor : Colors.white, alignItems: "center", justifyContent: "center" }} >
                            {priceNotReasonable && <Icons name="check" size={20} color={Colors.white} />}

                        </TouchableOpacity >

                        <Text style={{ marginLeft: 10, fontFamily: "Poppins-Medium", fontSize: 16, color: "#808080" }} >The price is not reasonable</Text>

                    </View>


                    <TextInput multiline={true} numberOfLines={6} style={{ fontSize: 16, color: "#808080", fontFamily: "Poppins-Medium", borderWidth: 1, borderColor: Colors.gray, marginTop: 10, borderRadius: 10, padding: 10 }}
                        placeholder="Other"
                        placeholderTextColor={Colors.gray}
                        textAlignVertical="top"
                    />

                    <CustomButton onPress={() => handleCancelRide()} styleContainer={{ width: "100%", marginVertical: 20, marginBottom: 30 }} text={loading ? <ActivityIndicator color={Colors.white} size={"small"} /> : "Submit"} />

                </View>

            </ScrollView>

        </View>
    )
}

export default ScheduleCancelRide