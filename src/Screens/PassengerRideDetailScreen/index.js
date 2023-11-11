import React, { useState, useEffect, useContext, useRef, useCallback } from "react"
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Linking, TextInput, ActivityIndicator, BackHandler, TouchableWithoutFeedback, ToastAndroid, Modal } from "react-native"
import Colors from "../../Constant/Color"
import CustomHeader from "../../Components/CustomHeader"
import MapView, { Marker } from "react-native-maps"
import MapViewDirections from "react-native-maps-directions"
import CustomButton from "../../Components/CustomButton"
import Icons from "react-native-vector-icons/Entypo"
import BookingContext from "../../Context/bookingContext/context"
import { GOOGLE_MAP_KEY } from "../../Constant/GoogleMapKey"
import firestore from "@react-native-firebase/firestore"
import auth from "@react-native-firebase/auth"
import cardDetailsContext from "../../Context/CardDetailsContext/context"
import SelectedPetContext from "../../Context/SelectedPetContext/context"
import { getPreciseDistance } from "geolib"
import { useIsFocused } from "@react-navigation/native"
import ChooseLocationContext from "../../Context/pickupanddropoffContext/context"
import IonIcons from "react-native-vector-icons/Ionicons"
import FontAwesome from "react-native-vector-icons/FontAwesome5"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"



// import {MapViewDirections} from "react-native-maps-directions"



function PassengerRideDetail({ navigation, route }) {



    const BookingCont = useContext(BookingContext)
    const cardCont = useContext(cardDetailsContext)
    const PetCont = useContext(SelectedPetContext)
    const chooseLocationCont = useContext(ChooseLocationContext)
    const { pickup, setPickup, pickupAddress, setPickupAddress, dropoff, setDropoff, dropoffAddress, setDropoffAddress, returnPickup, setReturnPickup
        , returnPickupAddress, setReturnPickupAddress, returnDropoff, setReturnDropoff, returnDropoffAddress, setReturnDropoffAddress } = chooseLocationCont


    const { bookingData, setBookingData } = BookingCont
    const { cardDetails, setCardDetails } = cardCont
    const { selectedPets, setSelectedPets } = PetCont


    const mapRef = useRef()

    const [arrived, setArrived] = useState(false)
    const [startRide, setStartRide] = useState(false)
    const [endRide, setEndRide] = useState(false)
    const [rideStartToDropoff, setRideStartToDropoff] = useState(false)
    const [reachDropoff, setReachDropoff] = useState(false)
    const [petImage, setPetImage] = useState("")
    const [driverLocation, setDriverLocation] = useState({
        latitude: "",
        longitude: ""
    })
    const [arrivalDis, setArrivalDis] = useState("")
    const [arriveDropoffMin, setArriveDropoffMin] = useState("")
    const [comment, setComment] = useState("")
    const [finalLoader, setFinalLoader] = useState(false)
    const [imageModal, setImageModal] = useState(false)

    const [rating, setRating] = useState(null)

    const [stars, setStars] = useState([
        {
            star: 1,
            selected: false
        },
        {
            star: 2,
            selected: false
        },
        {
            star: 3,
            selected: false
        },
        {
            star: 4,
            selected: false
        },
        {
            star: 5,
            selected: false
        },
    ])

    const focus = useIsFocused()

    const selectRating = (rating) => {
        setRating(rating)
    }



    const ShowLocationModal = useCallback(() => {
        return (
            <View style={styles.centeredView}>
                <Modal animationType="slide" transparent={true} onRequestClose={() => setImageModal(false)} visible={imageModal}>
                    <TouchableWithoutFeedback style={{ flex: 1, borderWidth: 4, width: "100%", height: "100%", zIndex: 100 }} onPress={() => setImageModal(false)} >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Image style={{ width: "100%", height: 300, borderRadius: 20 }} resizeMode='cover' source={{ uri: petImage }} />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </View>
        );
    }, [imageModal]);




    const getDriverRideStatus = () => {


        let id = auth().currentUser.uid

        const unsubscribe = firestore().collection("Request").doc(bookingData?.userData?.id).onSnapshot(querySnapshot => {

            let data = querySnapshot.data()

            if (focus) {


                if (data?.rideCancelByDriver && data?.bookingStatus == "cancelled" && data?.requestStatus == "cancelled") {


                    firestore().collection("Request").doc(id).update({
                        rideCancelByDriver: false,
                        requestStatus: ""
                    }).then(() => {

                        navigation.replace("Drivers")
                        ToastAndroid.show("Ride has been cancelled by driver", ToastAndroid.SHORT)
                    }).catch((error) => {

                        console.log(error)

                    })



                }



                if (data?.petImage) {



                    setPetImage(data?.petImage)

                }

                if (data.bookingStatus == "running" || (data?.bookingStatus == "complete" && !data?.userResponse) && focus) {

                    setBookingData({
                        ...bookingData,
                        bookingStatus: data?.bookingStatus
                    })


                    if (data?.driverLocation) {

                        if (data?.rideStatus == "pickup" && bookingData?.pickupCords?.lat && focus) {

                            const dis = getPreciseDistance(
                                {
                                    latitude: bookingData.pickupCords.lat,
                                    longitude: bookingData.pickupCords.lng,
                                },
                                {
                                    latitude: data?.driverLocation.latitude ? data.driverLocation.latitude : data?.driverData?.currentLocation?.latitude,
                                    longitude: data?.driverLocation.longitude ? data.driverLocation.longitude : data?.driverData?.currentLocation?.longitude,
                                },
                            );


                            let mileDistance = (dis / 1609.34)?.toFixed(2);

                            let arrivalMinutes = Math.ceil(mileDistance / 0.40)

                            setArrivalDis(arrivalMinutes)

                        }

                        if (data?.rideStatus == "dropoff" && data?.dropoffCoords && focus) {

                            const dis = getPreciseDistance(
                                {
                                    latitude: data?.driverLocation?.latitude,
                                    longitude: data?.driverLocation?.longitude,
                                },
                                {
                                    latitude: data?.dropoffCoords?.lat,
                                    longitude: data?.dropoffCoords?.lng,
                                },
                            );


                            let mileDistance = (dis / 1609.34)?.toFixed(2);

                            let arrivalMinutes = Math.ceil(mileDistance / 0.40)

                            setArriveDropoffMin(arrivalMinutes)



                        }

                        setDriverLocation(data?.driverLocation)
                    }





                    if (data.arrived && focus) {
                        setArrived(true)
                        setBookingData({
                            ...bookingData,
                            arrived: true
                        })
                    }

                    if (data?.rideStartToDropoff && focus) {

                        setRideStartToDropoff(true)
                        setBookingData({
                            ...bookingData,
                            rideStartToDropoff: true
                        })

                    }

                    if (data?.reachDropoff && focus) {

                        setReachDropoff(true)
                        setBookingData({
                            ...bookingData,
                            reactDropoff: true
                        })

                    }

                    if (data.startRide && focus) {
                        setBookingData({
                            ...bookingData,
                            startRide: true
                        })
                        setStartRide(true)
                    }
                    if (data.endRide && focus) {
                        setEndRide(true)
                        setBookingData({
                            ...bookingData,
                            endRide: true
                        })
                    }



                }

            }

        })

        return () => {

            unsubscribe()
        }

    }

    useEffect(() => {

        if (focus) {

            getDriverRideStatus()

        }

    }, [focus])


    const showDirection = useCallback(() => {

        return (
            reachDropoff ? <MapViewDirections
                origin={{
                    latitude: bookingData?.dropoffCoords?.lat,
                    longitude: bookingData?.dropoffCoords?.lng,
                }}
                destination={{
                    latitude: bookingData?.returnDropoffCords?.lat,
                    longitude: bookingData?.returnDropoffCords?.lng,
                }}
                apikey={GOOGLE_MAP_KEY}
                strokeColor={Colors.buttonColor}
                strokeWidth={3}
                optimizeWayPoints={true}
                onReady={result => {
                    //   getMinutesAndDistance(result);
                    mapRef.current.fitToCoordinates(result.coordinates, {
                        edgePadding: {
                            right: 30,
                            bottom: 100,
                            left: 30,
                            top: 100,
                        },
                    });
                }}
            /> : arrived ? <MapViewDirections
                origin={{
                    latitude: bookingData?.driverData?.currentLocation?.latitude,
                    longitude: bookingData?.driverData?.currentLocation?.longitude,
                }}
                destination={{
                    latitude: bookingData?.dropoffCoords?.lat,
                    longitude: bookingData?.dropoffCoords?.lng,
                }}
                apikey={GOOGLE_MAP_KEY}
                strokeColor={Colors.buttonColor}
                strokeWidth={3}
                optimizeWayPoints={true}
                onReady={result => {
                    //   getMinutesAndDistance(result);
                    mapRef.current.fitToCoordinates(result.coordinates, {
                        edgePadding: {
                            right: 30,
                            bottom: 100,
                            left: 30,
                            top: 100,
                        },
                    });
                }}
            /> :
                <MapViewDirections
                    origin={{
                        latitude: bookingData?.pickupCords?.lat,
                        longitude: bookingData?.pickupCords?.lng,
                    }}
                    destination={{
                        latitude: bookingData?.driverData?.currentLocation?.latitude,
                        longitude: bookingData?.driverData?.currentLocation?.longitude,
                    }}
                    apikey={GOOGLE_MAP_KEY}
                    strokeColor={Colors.buttonColor}
                    strokeWidth={3}
                    optimizeWayPoints={true}
                    onReady={result => {
                        //   getMinutesAndDistance(result);...
                        mapRef.current.fitToCoordinates(result.coordinates, {
                            edgePadding: {
                                right: 30,
                                bottom: 100,
                                left: 30,
                                top: 100,
                            },
                        });
                    }}
                />
        )

    }, [arrived, reachDropoff])


    const handleBackToHome = () => {

        let id = auth().currentUser.uid

        firestore().collection("Request").doc(id).update({
            userResponse: true
        }).then((res) => {

            setBookingData("")
            setCardDetails("")
            setSelectedPets("")
            setPickup({})
            setDropoff({})
            setReturnPickup({})
            setReturnDropoff({})
            setReturnPickupAddress("")
            setReturnDropoffAddress("")
            setPickupAddress("")
            setDropoffAddress("")

            navigation.replace("Tab")

        }).catch((error) => {

            (error, "error")

        })

    }

    const handleSubmitReview = () => {


        if (!rating) {
            ToastAndroid.show("Kindly give rating", ToastAndroid.SHORT)
            return
        }

        // if (!comment) {
        //     ToastAndroid.show("Kindly Enter Comment", ToastAndroid.SHORT)
        //     return
        // }

        let id = auth()?.currentUser?.uid

        setFinalLoader(true)

        firestore().collection("Booking").doc(id).get().then((doc) => {

            let data = doc?.data()

            if (!data?.booking) {


                bookingData.UserRating = rating;
                bookingData.userComment = comment;

                firestore().collection("Booking").doc(id).set({
                    Bookings: [bookingData]
                }).then((res) => {


                    firestore().collection("Request").doc(id).update({
                        userResponse: true
                    }).then(() => {

                        setFinalLoader(false)
                        setBookingData("")
                        setCardDetails("")
                        setSelectedPets("")
                        setDropoff({})
                        setReturnPickup({})
                        setReturnDropoff({})
                        setReturnPickupAddress("")
                        setReturnDropoffAddress("")
                        setDropoffAddress("")
                        setRating(0)
                        setComment("")
                        ToastAndroid.show("Successfully Submitted Review", ToastAndroid.SHORT)
                        navigation.replace("Tab")
                    }).catch((error) => {
                        setFinalLoader(false)

                        console.log(error, "error")

                    })
                })


            }


            if (data && data?.Bookings) {

                let bookings = data?.Bookings


                let otherBookings = bookings && bookings.length > 0 && bookings.filter((e, i) => e.bookingId !== bookingData?.bookingId)
                let currentBooking = bookings && bookings.length > 0 && bookings.filter((e, i) => e.bookingId == bookingData?.bookingId)





                let myCurrentBooking = currentBooking[0]


                myCurrentBooking.UserRating = rating,
                    myCurrentBooking.userComment = comment


                let allBookings = [...otherBookings, myCurrentBooking]



                firestore().collection("Booking").doc(id).set({
                    Bookings: allBookings
                }).then((res) => {


                    firestore().collection("Request").doc(id).update({
                        userResponse: true
                    }).then(() => {

                        setFinalLoader(false)
                        setBookingData("")
                        setCardDetails("")
                        setSelectedPets("")

                        setDropoff({})
                        setReturnPickup({})
                        setReturnDropoff({})
                        setReturnPickupAddress("")
                        setReturnDropoffAddress("")

                        setDropoffAddress("")
                        setRating(0)
                        setComment("")
                        ToastAndroid.show("Successfully Submitted Review", ToastAndroid.SHORT)
                        navigation.replace("Tab")
                    }).catch((error) => {
                        setFinalLoader(false)

                        console.log(error, "error")

                    })





                }).catch((error) => {

                    console.log(error)
                    setFinalLoader(false)

                })




            }


        })






    }


    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            // Replace 'TabScreenName' with the name of your tab screen
            // This will navigate to the specified tab screen when the back button is pressed
            navigation.navigate('Tab');
            return true; // Return true to prevent the default back action
        });

        return () => backHandler.remove(); // Cleanup the event listener

    }, []);


    console.log(bookingData, "typee")

    return (

        <View style={{ flex: 1, backgroundColor: Colors.white }} >


            <View style={{ marginTop: 5 }} >
                <CustomHeader
                    onPress={() => navigation.replace("Tab")}
                    iconname={"arrow-back-outline"}
                    text={endRide ? "Arrived" : startRide ? "Track" : "Driver"}
                    color={Colors.black}
                />
            </View>

            <ScrollView>
                <View style={{ paddingHorizontal: 20, marginTop: 20, flex: 1 }} >


                    {bookingData.bookingType == "Scheduled" && <Text style={{ color: Colors.buttonColor, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >
                        {bookingData?.scheduleDate} {bookingData?.scheduleTime}
                    </Text>}

                    <View style={styles.mapContainer}>
                        {bookingData && bookingData?.pickupCords && Object.keys(bookingData?.pickupCords).length > 0 && <MapView
                            style={StyleSheet.absoluteFill}
                            ref={mapRef}
                            region={{
                                latitude: bookingData?.pickupCords?.lat,
                                longitude: bookingData?.pickupCords?.lng,
                                latitudeDelta: 0.4,
                                longitudeDelta: 0.6,
                            }}>
                            <Marker

                                coordinate={{

                                    latitude: reachDropoff ? bookingData?.returnDropoffCords?.lat : arrived ? bookingData?.dropoffCoords?.lat : bookingData?.pickupCords?.lat,
                                    longitude: reachDropoff ? bookingData?.returnDropoffCords?.lng : arrived ? bookingData?.dropoffCoords?.lng : bookingData?.pickupCords?.lng,

                                }}
                                title={bookingData?.pickupAddress}
                            >
                            </Marker>

                            <Marker

                                coordinate={{
                                    latitude: driverLocation?.latitude ? driverLocation?.latitude : bookingData?.driverData?.currentLocation?.latitude,
                                    longitude: driverLocation?.longitude ? driverLocation?.longitude : bookingData?.driverData?.currentLocation?.longitude,
                                }}
                                title={"Drivers Location"}
                            >
                                <Image source={require("../../Images/car.png")} style={{

                                    transform: [
                                        {
                                            rotate: driverLocation.heading
                                                ? `${driverLocation?.heading}deg`
                                                : '180deg',
                                        },
                                    ],

                                }} />
                            </Marker>



                            {bookingData?.pickupCords?.lat && bookingData?.driverData?.currentLocation?.latitude && showDirection()}


                        </MapView>}
                    </View>


                    {
                        endRide && <View style={{ marginTop: 10, justifyContent: "space-between", flexDirection: "row", alignItems: "center" }} >


                            <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 16, color: Colors.black }} >Confirmation photo of your pet</Text>
                            {petImage ? <TouchableOpacity onPress={() => setImageModal(true)} >
                                <Image source={{ uri: petImage }} style={{ width: 50, height: 50, borderRadius: 10 }} />
                            </TouchableOpacity> : <ActivityIndicator color={Colors.black} size={"small"} />}

                        </View>
                    }


                    <TouchableOpacity style={{ padding: 5, flexDirection: "row", justifyContent: "space-between", backgroundColor: "#e6e6e6", borderRadius: 10, alignItems: "center", marginTop: 20 }}  >
                        <View style={{ flexDirection: "row", alignItems: "center" }} >
                            <Image source={{ uri: bookingData?.driverData?.profile }} style={{ width: 60, height: 60, borderRadius: 10 }} />

                            <View style={{ marginLeft: 5, justifyContent: "center" }} >
                                <View style={{ flexDirection: "row", alignItems: "center" }} >
                                    <Text style={{ fontFamily: "Poppins-Medium", fontSize: 16, color: Colors.black,width:100 }} >{bookingData?.driverData?.fullName.length>9 ? `${bookingData?.driverData?.fullName.slice(0,8)}...` : bookingData?.driverData?.fullName}</Text>
                                    <Image source={require("../../Images/star.png")} style={{ marginLeft: 5, marginTop: 5 }} />
                                    <Text style={{ fontFamily: "Poppins-Regular", fontSize: 14, color: Colors.black, marginTop: 5, marginLeft: 3 }} >({bookingData?.driverData?.rating})</Text>

                                </View>
                                <Text style={{ fontFamily: "Poppins-Medium", fontSize: 16, color: Colors.gray}} >{bookingData?.driverData?.VehicleDetails?.vehicleName}</Text>
                                <Text style={{ fontSize: 12, color: Colors.white, borderRadius: 30, backgroundColor: "#808080", textAlign: "center", marginTop: 5, padding: 0, width: 80, padding: 2 }} >{bookingData?.driverData?.VehicleDetails?.vehicleModelNum}</Text>

                            </View>

                        </View>

                        <View style={{ alignItems: "flex-end" }} >

                            <Text style={{ fontFamily: "Poppins-SemiBold", color: Colors.black, fontSize: 22, marginRight: 5 }} >${Number(bookingData.fare).toFixed(2)}</Text>

                            <View style={{ flexDirection: "row" }} >

                                <View style={{ width: 40, height: 40, backgroundColor: Colors.buttonColor, justifyContent: "center", alignItems: "center", borderRadius: 100 }} >


                                    <TouchableOpacity onPress={() => Linking.openURL(`tel:${bookingData?.driverData?.mobileNumber}`)} >
                                        <MaterialIcons name="phone" size={25} color={Colors.white} />
                                    </TouchableOpacity>
                                </View>


                                <View style={{ width: 40, height: 40, backgroundColor: Colors.gray, justifyContent: "center", alignItems: "center", borderRadius: 100, marginLeft: 5 }} >
                                    <TouchableOpacity onPress={() => navigation.replace("ChatSingle", { data: bookingData, screenName: "PassengerRideDetail", nested: false })} >
                                        <MaterialIcons name="chat" size={25} color={Colors.white} />
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>

                    </TouchableOpacity>


                    <View style={{ marginTop: 10, backgroundColor: "#e6e6e6", borderRadius: 10, padding: 10 }} >

                        <View style={{ flexDirection: "row", padding: 5, alignItems: "center", borderBottomWidth: 2, borderBottomColor: Colors.buttonColor }} >

                            <IonIcons name={"location"} size={20} color={Colors.buttonColor} />

                            <Text style={{ color: arrived ? "#808080" : Colors.buttonColor, fontSize: 14, fontFamily: "Poppins-Medium", marginLeft: 10 }} >Current Location: {bookingData?.pickupAddress}</Text>

                        </View>




                        <View style={{ flexDirection: "row", padding: 5, datas: "center", alignItems: "center" }} >

                            <IonIcons name={"location"} size={20} color={Colors.buttonColor} />

                            <Text style={{ color: (!reachDropoff && arrived) ? Colors.buttonColor : "#808080", fontSize: 14, fontFamily: "Poppins-Medium", marginLeft: 10 }} >Drop Off Location: {bookingData.dropoffAddress}</Text>

                        </View>


                        {bookingData?.bookingType == "twoWay" ? <View>
                            <View style={{ flexDirection: "row", padding: 5, datas: "center", alignItems: "center", borderBottomWidth: bookingData?.type == "twoWay" ? 2 : 0, borderBottomColor: Colors.buttonColor }} >

                                <IonIcons name={"location"} size={20} color={Colors.buttonColor} />

                                <Text style={{ color: (reachDropoff && !startRide) ? Colors.buttonColor : "#808080", fontSize: 14, fontFamily: "Poppins-Medium", marginLeft: 10 }} >Return Pick up: {bookingData?.returnPickupAddress}</Text>

                            </View>

                            <View style={{ flexDirection: "row", padding: 5, alignItems: "center", borderBottomWidth: 2, borderBottomColor: Colors.buttonColor }} >

                                <IonIcons name={"location"} size={20} color={Colors.buttonColor} />

                                <Text style={{ color: !startRide ? "#808080" : Colors.buttonColor, fontSize: 14, fontFamily: "Poppins-Medium", marginLeft: 10 }} >Return Drop off: {bookingData?.returnDropoffAddress}</Text>

                            </View>
                        </View>
                            : ""}



                    </View>

                    {!bookingData.deductedFromWallet && <View style={{ marginTop: 10, backgroundColor: "#e6e6e6", borderRadius: 10, padding: 10, flexDirection: "row", alignItems: "center", paddingVertical: 15 }} >
                        <Image source={require("../../Images/master1.png")} />
                        <Text style={{ fontFamily: "Poppins-Medium", fontSize: 16, color: Colors.black, marginLeft: 15 }} >**** **** **** {bookingData?.cardDetails?.last4}</Text>
                    </View>}

                    <View style={{ marginTop: 20, backgroundColor: "#A3DA9E", borderRadius: 20, padding: 7, flexDirection: "row", alignItems: "center", marginBottom: 15 }} >


                        <Text style={{ fontFamily: "Poppins-Medium", fontSize: 14, color: Colors.black, textAlign: "center", width: "100%" }} >{endRide ? "Arrived Safely" : startRide && bookingData?.type !== "PetWalk" ? `Travel time to drop off location-${bookingData && bookingData?.bookingType == "twoWay" ? bookingData?.dropoffToPickupMinutes : arriveDropoffMin} min.` : startRide && bookingData?.type == "PetWalk" ? `Your pet walk duration is ${bookingData?.duration} min ` : reachDropoff && bookingData?.type == "PetWalk" ? `Your pet walk duration is ${bookingData?.duration} min ` : reachDropoff ? `You have reached at drop off waiting time is ${bookingData?.waitingTime} min` : rideStartToDropoff ? `Traval time to drop off location ${bookingData?.pickupToDropoffMinutes}min ` : arrived ? "Your Driver Arrived" : `Arriving in ${arrivalDis} mins`}</Text>

                    </View>

                    {endRide && <View style={{ marginTop: 10 }} >

                        <Text style={{ textAlign: "center", fontSize: 16, fontFamily: "Poppins-Medium", color: Colors.black }} >Review</Text>

                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }} >
                            {stars && stars.length > 0 && stars.map((e, i) => {

                                return (
                                    <View key={i} >
                                        <Icons onPress={() => selectRating(e.star)} name="star" color={(e.star <= rating) ? "#FC9D02" : "#d9d9d9"} size={50} />
                                    </View>
                                )
                            })}
                        </View>
                    </View>}
                    {endRide && <TextInput onChangeText={(e) => setComment(e)} value={comment} placeholder="Comment" placeholderTextColor={Colors.gray} numberOfLines={5} multiline={true} textAlignVertical="top" style={{ backgroundColor: "#e6e6e6", borderRadius: 10, marginBottom: 10, padding: 10, fontSize: 16, fontFamily: "Poppins-Medium", color: Colors.black }} />}

                    {endRide && <CustomButton onPress={() => handleSubmitReview()} text={finalLoader ? <ActivityIndicator color={Colors.white} size={"small"} /> : "Submit Review"} styleContainer={{ width: "100%", marginBottom: 10 }} />}

                    {endRide && <CustomButton onPress={() => handleBackToHome()} text={"Back To Home"} styleContainer={{ width: "100%", marginBottom: 20 }} linearColor={"#e6e6e6"} btnTextStyle={{ color: "#808080" }} />}

                    {!arrived && <CustomButton text={"Cancel Ride"} onPress={() => navigation.navigate("RideCancel")} styleContainer={{ marginBottom: 20, width: "100%" }} linearColor="#e6e6e6" btnTextStyle={{ color: Colors.black }} />}


                    {imageModal && ShowLocationModal()}
                </View>




            </ScrollView>


        </View>

    )
}

export default PassengerRideDetail

const styles = StyleSheet.create({

    mapContainer: {
        width: "100%",
        height: 350,
        borderRadius: 10,
        overflow: 'hidden',

    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        width: '80%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },

})