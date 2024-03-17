import React, { useState, useEffect, useContext, useRef, useCallback } from "react"
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Linking, TextInput, ActivityIndicator, BackHandler, TouchableWithoutFeedback, KeyboardAvoidingView, ToastAndroid, Modal } from "react-native"
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
import axios from "axios"
import Geocoder from 'react-native-geocoding';
import Geolocation, { watchPosition } from 'react-native-geolocation-service';
import AsyncStorage from "@react-native-async-storage/async-storage"
import FavouriteSitterContext from "../../Context/FavouriteContext/context"


// import {MapViewDirections} from "react-native-maps-directions"



function PassengerRideDetail({ navigation, route }) {



    const BookingCont = useContext(BookingContext)
    const cardCont = useContext(cardDetailsContext)
    const PetCont = useContext(SelectedPetContext)
    const chooseLocationCont = useContext(ChooseLocationContext)
    const { pickup, setPickup, pickupAddress, setPickupAddress, dropoff, setDropoff, dropoffAddress, setDropoffAddress, returnPickup, setReturnPickup
        , returnPickupAddress, setReturnPickupAddress, returnDropoff, setReturnDropoff, returnDropoffAddress, setReturnDropoffAddress } = chooseLocationCont


    const favouritesCont = useContext(FavouriteSitterContext)
    const { favouriteSitters, setFavouriteSitters } = favouritesCont



    const { bookingData, setBookingData } = BookingCont
    const { cardDetails, setCardDetails } = cardCont
    const { selectedPets, setSelectedPets } = PetCont
    const [addInFavourites, setAddInFavourites] = useState(false)

    const [isRideRunning, setIsRideRunning] = useState(false)
    const [loading, setLoading] = useState(false)
    const [favouriteLoading, setFavouriteLoading] = useState(false)


    var options = {
        // year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    var timeOption = {
        hour: 'numeric',
        minute: 'numeric',
        // hour12: true // Optionally set to false if you want 24-hour format
    };

    const mapRef = useRef()

    const [arrived, setArrived] = useState(false)
    const [confirmArrival, setConfirmArrival] = useState(false)
    const [startRide, setStartRide] = useState(false)
    const [endRide, setEndRide] = useState(false)
    const [remainingTime, setRemainingTime] = useState(0)
    const [rideStartToDropoff, setRideStartToDropoff] = useState(false)
    const [reachDropoff, setReachDropoff] = useState(false)
    const [goToPickup, setGoToPickup] = useState(false)
    const [petImage, setPetImage] = useState("")
    const [collectPet, setCollectPet] = useState(false)
    const [startSittingTime, setStartSittingTime] = useState("")
    const [endSittingTime, setEndSittingTime] = useState("")
    const [driverLocation, setDriverLocation] = useState({
        latitude: "",
        longitude: ""
    })
    const [arrivalDis, setArrivalDis] = useState("")
    const [arrivalMileDis, setArrivalMileDis] = useState("")
    const [arriveDropoffMin, setArriveDropoffMin] = useState("")
    const [comment, setComment] = useState("")
    const [finalLoader, setFinalLoader] = useState(false)
    const [imageModal, setImageModal] = useState(false)
    const [arrivedSitterAddress, setArrivedSitterAddress] = useState(false)
    const [currentLocation, setCurrentLocation] = useState({
        latitude: null,
        longitude: null
    })


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



    useEffect(() => {

        handleRouteToTrackScreen()
        getFavouriteSitters()

    }, [focus])




    const getAddressFromCoords = async (latitude, longitude) => {
        try {
            const response = await Geocoder.from(latitude, longitude);
            const address = response.results[0].formatted_address;

            return address;
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const sendUserLocationInFirebase = () => {
        Geolocation.getCurrentPosition(async position => {
            const { latitude, longitude, heading } = position.coords;

            let coords = {
                latitude: latitude,
                longitude: longitude,
                heading: heading,
            };

            let address = await getAddressFromCoords(latitude, longitude);

            // setLocationData({
            //   ...locationData,
            //   currentLocation: coords,
            //   currentAddress: address,
            // });

            setCurrentLocation({
                ...currentLocation,
                latitude: coords.latitude,
                longitude: coords.longitude,
                heading: coords.heading,
                address: address,
            });

            let userData = { ...bookingData.userData };

            (userData.currentLocation = coords),
                (userData.currentAddress = address);

            firestore()
                .collection('Request')
                .doc(bookingData?.userData?.id)
                .update({
                    // driverData: driverData,
                    userLocation: coords,
                    userAddress: address,
                })
                .then(res => {
                    // setBookingData({
                    //   ...bookingData,
                    //   driverData: driverData,
                    // });

                    console.log('location send to firebase');
                })
                .catch(error => {
                    console.log(error, 'eorr');
                });
        });
    };


    useEffect(() => {

        let interval;

        if (bookingData && bookingData?.type == "PetSitter" && bookingData?.selectedOption?.name == "Sitter Location") {

            interval = setInterval(() => {

                sendUserLocationInFirebase()
            }, 10000);
        }

        return () => clearInterval(interval)

    }, [currentLocation?.latitude, currentLocation?.longitude, focus])


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


            if (!bookingData?.bookingId) {
                setBookingData({
                    ...bookingData,
                    bookingId: data?.bookingId
                })
            }


            if (focus) {


                if (data?.rideCancelByDriver && data?.bookingStatus == "cancelled" && data?.requestStatus == "cancelled") {


                    firestore().collection("Request").doc(id).update({
                        rideCancelByDriver: false,
                        requestStatus: ""
                    }).then(() => {

                        navigation.replace("Drivers")
                        ToastAndroid.show("Booking has been cancelled by driver", ToastAndroid.SHORT)
                    }).catch((error) => {

                        console.log(error)

                    })



                }



                if (data?.petImage) {



                    setPetImage(data?.petImage)

                }

                if (data?.bookingStatus == "running" || (data?.bookingStatus == "complete" && !data?.userResponse) && focus) {

                    setBookingData({
                        ...bookingData,
                        bookingStatus: data?.bookingStatus,
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

                            setArrivalMileDis(mileDistance)

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

                    if (data.goToPickup && focus) {
                        setGoToPickup(true)
                        setBookingData({
                            ...bookingData,
                            goToPickup: true
                        })
                    }

                    if (data?.startRideTime && focus && bookingData?.type == "PetSitter") {

                        setStartSittingTime(data?.startRideTime.toDate())

                        const endRideTime = new Date((data?.startRideTime?.toDate()?.getTime()) + (bookingData.duration * 60000)) // Convert duration to milliseconds

                        setEndSittingTime(endRideTime)

                    }

                    if (data?.collectPet && focus) {
                        setCollectPet(true)
                        setBookingData({
                            ...bookingData,
                            collectPet: true
                        })
                    }

                    if (data?.arrivedSitterAddress && focus) {
                        setArrivedSitterAddress(true)
                        setBookingData({
                            ...bookingData,
                            arrivedSitterAddress: true
                        })
                    }

                    if (data.confirmArrival && focus) {
                        setConfirmArrival(true)
                        setBookingData({
                            ...bookingData,
                            confirmArrival: true
                        })
                    }


                    if (data && data?.remainingTime) {
                        setRemainingTime(data?.remainingTime)
                        setBookingData({
                            ...bookingData,
                            remainingTime: data?.remainingTime
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

        if (focus && isRideRunning) {


            getDriverRideStatus()

        }

    }, [focus, isRideRunning])


    const showDirection = useCallback(() => {

        return (
            reachDropoff && bookingData?.returnDropoffCords?.lat && bookingData?.returnDropoffCords?.lng ? <MapViewDirections
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
            /> : (arrived && bookingData?.type !== "PetSitter") && bookingData?.driverData?.currentLocation?.latitude
                && bookingData?.driverData?.currentLocation?.longitude ? <MapViewDirections
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


    const showUserDirection = useCallback(() => {

        return (

            <MapViewDirections
                origin={{
                    latitude: currentLocation?.latitude,
                    longitude: currentLocation?.longitude,
                }}
                destination={{
                    latitude: bookingData?.pickupCords.lat,
                    longitude: bookingData?.pickupCords.lng,
                }}
                apikey={GOOGLE_MAP_KEY}
                strokeColor={Colors.buttonColor}
                strokeWidth={3}
                resetOnChange={false}
                optimizeWayPoints={true}
                onReady={result => {
                    //   getMinutesAndDistance(result)
                    // mapRef.current.fitToCoordinates(result.coordinates, {
                    //     edgePadding: {
                    //         right: 30,
                    //         bottom: 100,
                    //         left: 30,
                    //         top: 100,
                    //     },
                    // });
                }}
            />
        )

    }, [currentLocation?.latitude, currentLocation?.longitude])


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
                        // navigation.replace("Tab")

                        navigation.reset({
                            index: 0,
                            routes: [
                                {
                                    name: 'Tab',

                                },
                            ],
                        });

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


    console.log(bookingData?.type,"typeeee")

    const handleArriveSitter = () => {

        firestore()
            .collection('Request')
            .doc(bookingData?.userData?.id)
            .update({
                confirmArrival: true,
            })
            .then(() => {
                if (bookingData?.userData?.token) {
                    var data = JSON.stringify({
                        notification: {
                            body: `Customer has confirm your arrival now you can start pet sitting`,
                            title: `Hi ${bookingData?.driverData?.fullName} `,
                            sound: "default"
                        },
                        to: bookingData?.driverData?.token,
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
                            let notification = JSON.parse(data);

                            let notificationToSend = {
                                title: notification?.notification?.title,
                                body: notification.notification.body,
                                date: new Date(),
                            };

                            firestore()
                                .collection('DriverNotification')
                                .doc(bookingData?.driverData?.id)
                                .set(
                                    {
                                        notification:
                                            firestore.FieldValue.arrayUnion(notificationToSend),
                                    },
                                    { merge: true },
                                )
                                .then(async (res) => {

                                    let arriveTime = new Date()
                                    arriveTime = JSON.stringify(arriveTime)
                                    await AsyncStorage.setItem("arriveTime", arriveTime)

                                    setBookingData({
                                        ...bookingData,
                                        confirmArrival: 'true',
                                    });

                                    setConfirmArrival(true);

                                    console.log('notification send successfully');
                                })
                                .catch(error => {
                                    console.log(error, 'error');
                                });
                        })
                        .catch(error => {
                            console.log(error, 'error');
                        });
                }
            });
    }

    const handleArriveSitterAddress = () => {


        firestore()
            .collection('Request')
            .doc(bookingData.userData.id)
            .update({
                arrivedSitterAddress: true,
            })
            .then(() => {
                if (bookingData?.driverData?.token) {
                    var data = JSON.stringify({
                        notification: {
                            body: `Your Customer has arrived at your location`,
                            title: `Hi ${bookingData?.driverData?.fullName} `,
                            sound: "default"
                        },
                        to: bookingData?.driverData?.token,
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
                            let notification = JSON.parse(data);

                            let notificationToSend = {
                                title: notification?.notification?.title,
                                body: notification.notification.body,
                                date: new Date(),
                            };

                            firestore()
                                .collection('DriverNotification')
                                .doc(bookingData?.driverData?.id)
                                .set(
                                    {
                                        notification:
                                            firestore.FieldValue.arrayUnion(notificationToSend),
                                    },
                                    { merge: true },
                                )
                                .then(async (res) => {

                                    let arriveTime = new Date()
                                    arriveTime = JSON.stringify(arriveTime)
                                    await AsyncStorage.setItem("arriveTime", arriveTime)

                                    console.log(arrivedSitterAddress, "arrived")

                                    setArrivedSitterAddress(true)

                                    setBookingData({
                                        ...bookingData,
                                        arrivedSitterAddress: 'true',
                                    });

                                    ToastAndroid.show("Successfully confirm your arrival", ToastAndroid.SHORT)

                                    //   setArrive(true);
                                    //   setShowDetails(false);
                                    //   setMoreDetail(false)
                                    //   console.log('notification send successfully');
                                })
                                .catch(error => {
                                    console.log(error, 'error');
                                });
                        })
                        .catch(error => {
                            console.log(error, 'error');
                        });
                }
            });


    }


    const handleRouteToTrackScreen = () => {


        setLoading(true)

        firestore().collection("Request").doc(auth().currentUser?.uid).get().then((doc) => {



            let data = doc.data()

            console.log(data, "dataaa")

            if (!data || data?.userResponse || (data?.bookingStatus !== "running" && data?.userResponse) || data.bookingStatus == "cancelled" || data?.requestStatus !== "accept") {

                setIsRideRunning(false)
                setLoading(false)
                // ToastAndroid.show("No rides to track", ToastAndroid.SHORT)
                return
            }

            else {


                console.log(data, "dataaa")

                // setBookingData(data)
                setLoading(false)
                setIsRideRunning(true)
                // navigation.navigate("PassengerRideDetail")

            }
        })


    }

    const getFavouriteSitters = () => {


        firestore().collection("Favourites").doc(auth().currentUser?.uid).get().then(doc => {

            let data = doc?.data()


            let favourites = data?.Favourites


            setFavouriteSitters(favourites && favourites?.length > 0 ? favourites : [])

        })



    }


    const handleAddInFavourites = () => {

        setFavouriteLoading(true)

        firestore().collection("Favourites").doc(auth().currentUser?.uid).set(
            {
                Favourites:
                    firestore.FieldValue.arrayUnion(bookingData?.driverData),
            },
            { merge: true },
        ).then((res) => {


            setFavouriteSitters([...favouriteSitters, bookingData?.driverData])

            setAddInFavourites(true)
            setFavouriteLoading(false)
            ToastAndroid.show("Successfully add in favourites", ToastAndroid.SHORT)
            return
        }).catch((error) => {

            setFavouriteLoading(false)
            ToastAndroid.show(error.message, ToastAndroid.SHORT)

        })


    }

    // console.log((favouriteSitters && favouriteSitters?.length>0 && favouriteSitters?.some((e,i)=>e?.id == bookingData?.driverData?.id)))

console.log(bookingData?.type,"typeee")
    return (

        loading ? <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >

            <ActivityIndicator color={Colors.buttonColor} size="large" />

        </View> : !isRideRunning ? <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >

            <Text style={{ fontFamily: "Poppins-Bold", fontSize: 24, color: Colors.black }} >No Bookings To Track</Text>

        </View> : <View style={{ flex: 1, backgroundColor: Colors.white }} >

            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" >
                <View style={{ marginTop: 5 }} >
                    <CustomHeader
                        onPress={() => navigation.replace("Tab")}
                        iconname={"arrow-back-outline"}
                        text={"Track Booking"}
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
                                    latitudeDelta: 0.6,
                                    longitudeDelta: 0.9,
                                }}>
                                {(bookingData && (bookingData?.type !== "PetSitter" || (bookingData?.type == "PetSitter" && bookingData?.selectedOption?.name == "My Location"))) && <Marker

                                    coordinate={{

                                        latitude: reachDropoff ? bookingData?.returnDropoffCords?.lat : (arrived && bookingData?.type !== "PetSitter") ? bookingData?.dropoffCoords?.lat : bookingData?.pickupCords?.lat,
                                        longitude: reachDropoff ? bookingData?.returnDropoffCords?.lng : (arrived && bookingData?.type !== "PetSitter") ? bookingData?.dropoffCoords?.lng : bookingData?.pickupCords?.lng,

                                    }}
                                    title={bookingData?.pickupAddress}
                                >
                                </Marker>}

                                {(bookingData && (bookingData?.type !== "PetSitter" || (bookingData?.type == "PetSitter" && bookingData?.selectedOption?.name == "My Location"))) && <Marker

                                    coordinate={{
                                        latitude: driverLocation?.latitude ? driverLocation?.latitude : bookingData?.driverData?.currentLocation?.latitude,
                                        longitude: driverLocation?.longitude ? driverLocation?.longitude : bookingData?.driverData?.currentLocation?.longitude,
                                    }}
                                    title={"Drivers Location"}
                                >
                                    <Image source={bookingData.type == "PetSitter" ? require("../../Images/avatar.png") :  require("../../Images/car.png")  } style={{
                                        width: 40,
                                        height: 40,
                                        transform: [
                                            {
                                                rotate: driverLocation.heading
                                                    ? `${driverLocation?.heading}deg`
                                                    : '360deg',
                                            },
                                        ],

                                    }} />
                                </Marker>}

                                {(bookingData && (bookingData?.type == "PetSitter" && bookingData?.selectedOption?.name == "Sitter Location")) && <Marker

                                    coordinate={{
                                        latitude: bookingData?.pickupCords?.lat,
                                        longitude: bookingData?.pickupCords?.lng,
                                    }}
                                    title={"Sitting Location"}
                                >

                                </Marker>}

                                {(bookingData && (bookingData?.type == "PetSitter" && bookingData?.selectedOption?.name == "Sitter Location")) && currentLocation?.latitude && <Marker

                                    coordinate={{
                                        latitude: currentLocation?.latitude,
                                        longitude: currentLocation?.longitude,
                                    }}
                                    title={"Current Location"}
                                >

                                    <Image source={bookingData.type == "PetSitter" ?  require("../../Images/avatar.png") : require("../../Images/car.png") } style={{
                                        width: 40,
                                        height: 40,
                                        transform: [
                                            {
                                                rotate: currentLocation.heading
                                                    ? `${currentLocation?.heading}deg`
                                                    : '180deg',
                                            },
                                        ],

                                    }} />

                                </Marker>}





                                {bookingData?.pickupCords?.lat && bookingData?.driverData?.currentLocation?.latitude && ((bookingData?.type == "PetSitter" && !arrived && bookingData.selectedOption?.name == "My Location") || bookingData?.type !== "PetSitter") && showDirection()}

                                {bookingData && bookingData?.type == "PetSitter" && bookingData?.selectedOption?.name == "Sitter Location" && currentLocation?.latitude && currentLocation?.longitude && bookingData?.pickupCords?.lat && bookingData?.pickupCords?.lng && showUserDirection()}


                            </MapView>}
                        </View>


                        {
                            (endRide && bookingData?.type !== "PetSitter") && <View style={{ marginTop: 10, justifyContent: "space-between", flexDirection: "row", alignItems: "center" }} >


                                <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 16, color: Colors.black }} >Confirmation photo of your pet</Text>
                                {petImage ? <TouchableOpacity onPress={() => setImageModal(true)} >
                                    <Image source={{ uri: petImage }} style={{ width: 50, height: 50, borderRadius: 10 }} />
                                </TouchableOpacity> : <ActivityIndicator color={Colors.black} size={"small"} />}

                            </View>
                        }


                        <TouchableOpacity style={{ padding: 5, flexDirection: "row", justifyContent: "space-between", backgroundColor: "#e6e6e6", borderRadius: 10, alignItems: "center", marginTop: 20 }}  >
                            <View style={{ flexDirection: "row", alignItems: bookingData?.type == "driver" ? "center" : "flex-start" }} >
                                <Image source={{ uri: bookingData?.driverData?.profile }} style={{ width: 60, height: 60, borderRadius: 10 }} />

                                <View style={{ marginLeft: 5, justifyContent: "center" }} >
                                    <View style={{ flexDirection: "row", alignItems: "center" }} >
                                        <Text style={{ fontFamily: "Poppins-Medium", fontSize: 16, color: Colors.black, width: 100 }} >{bookingData?.driverData?.fullName.length > 9 ? `${bookingData?.driverData?.fullName.slice(0, 8)}...` : bookingData?.driverData?.fullName}</Text>
                                        <Image source={require("../../Images/star.png")} style={{ marginLeft: 5, marginTop: 5 }} />
                                        <Text style={{ fontFamily: "Poppins-Regular", fontSize: 14, color: Colors.black, marginTop: 5, marginLeft: 3 }} >({bookingData?.driverData?.rating})</Text>


                                    </View>


                                    {bookingData?.type !== "driver" && <Text style={{ fontFamily: "Poppins-Bold", fontSize: 10, color: Colors.gray, }} >Pet Experience: {bookingData?.driverData?.petExperience} years</Text>}
                                    {bookingData?.type == "driver" && <Text style={{ fontFamily: "Poppins-Medium", fontSize: 16, color: Colors.gray }} >{bookingData?.driverData?.VehicleDetails?.vehicleName}</Text>}
                                    {bookingData?.type == "driver" && <Text style={{ fontSize: 12, color: Colors.white, borderRadius: 30, backgroundColor: "#808080", textAlign: "center", marginTop: 5, padding: 0, width: 80, padding: 2 }} >{bookingData?.driverData?.VehicleDetails?.vehicleNumPlate}</Text>}


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


                        <View style={{ marginTop: 10, backgroundColor: "#e6e6e6", borderRadius: 10, padding: 10, marginBottom: 5, }} >

                            <View style={{ flexDirection: "row", padding: 5, alignItems: "center", borderBottomWidth: 2, borderBottomColor: Colors.buttonColor }} >

                                <IonIcons name={"location"} size={20} color={Colors.buttonColor} />

                                <Text style={{ color: arrived ? "#808080" : Colors.buttonColor, fontSize: 14, fontFamily: "Poppins-Medium", marginLeft: 10 }} >{bookingData && bookingData?.type !== "PetSitter" ? "Current Location" : bookingData?.selectedOption?.name == "My Location" ? "Customer's Location" : "Sitter's Location"}: {bookingData?.pickupAddress}</Text>

                            </View>


                            {bookingData && bookingData?.type !== "PetSitter" && <View style={{ flexDirection: "row", padding: 5, datas: "center", alignItems: "center" }} >

                                <IonIcons name={"location"} size={20} color={Colors.buttonColor} />

                                <Text style={{ color: (!reachDropoff && arrived) ? Colors.buttonColor : "#808080", fontSize: 14, fontFamily: "Poppins-Medium", marginLeft: 10 }} >Drop Off Location: {bookingData.dropoffAddress}</Text>

                            </View>}


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

                        {bookingData && bookingData?.type == "PetSitter" && bookingData.selectedOption?.name == "My Location" && <View style={{ marginTop: 20, backgroundColor: "#A3DA9E", borderRadius: 20, padding: 7, flexDirection: "row", alignItems: "center", marginBottom: 15 }} >

                            <Text style={{ fontFamily: "Poppins-Medium", fontSize: 14, color: Colors.black, textAlign: "center", width: "100%" }} >{endRide ? "Pet Sitting has been ended by sitter" : startRide ? `pet sitting has been started remaining pet sitting time is ${remainingTime ? (Number(remainingTime) / 60 / 24) > 1 ? Math.ceil(Number(remainingTime) / 60 / 24) : (Number(remainingTime) / 60) > 1 ? Math.ceil(Number(remainingTime) / 60) : remainingTime : (Number(bookingData?.duration) / 60 / 24) > 1 ? Number(bookingData?.duration) / 60 / 24 : Number(bookingData?.duration) / 60 > 1 ? Math.ceil(Number(bookingData?.duration) / 60) : bookingData?.duration} ${remainingTime ? (Number(remainingTime) / 60 / 24) > 1 ? "Days" : Number(remainingTime) / 60 > 1 ? "hour" : "min" : Number(bookingData?.duration) / 60 > 1 ? "hour" : "min"}` : confirmArrival ? "Wait for pet sitter to start sitting" : arrived ? "Sitter has confirmed that he has been arrived kindly confirm from your side" : goToPickup ? `Pet sitter is ${Number(arrivalMileDis)} miles away from your location` : "Pet Sitter is about to come to your location"}</Text>

                        </View>}


                        {startSittingTime && (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    paddingHorizontal: 10,
                                    alignContent: 'center',
                                    paddingVertical: 15,
                                }}>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        color: Colors.gray,
                                        fontFamily: 'Poppins-Medium',
                                    }}>
                                    Sitting Start Time:
                                </Text>

                                <Text
                                    style={{
                                        fontSize: 16,
                                        color: Colors.black,
                                        fontFamily: 'Poppins-Medium',
                                    }}>
                                    {new Intl.DateTimeFormat('en-US', options).format(startSittingTime)} {new Intl.DateTimeFormat('en-US', timeOption).format(startSittingTime)}
                                </Text>
                            </View>
                        )}


                        {endSittingTime && (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    paddingHorizontal: 10,
                                    alignContent: 'center',
                                    paddingVertical: 15,
                                }}>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        color: Colors.gray,
                                        fontFamily: 'Poppins-Medium',
                                    }}>
                                    Sitting End Time:
                                </Text>

                                <Text
                                    style={{
                                        fontSize: 16,
                                        color: Colors.black,
                                        fontFamily: 'Poppins-Medium',
                                    }}>
                                    {new Intl.DateTimeFormat('en-US', options).format(endSittingTime)} {new Intl.DateTimeFormat('en-US', timeOption).format(endSittingTime)}
                                </Text>
                            </View>
                        )}

                        {bookingData && bookingData?.type == "PetSitter" && bookingData.selectedOption?.name == "Sitter Location" && <View style={{ marginTop: 20, backgroundColor: "#A3DA9E", borderRadius: 20, padding: 7, flexDirection: "row", alignItems: "center", marginBottom: 15 }} >

                            <Text style={{ fontFamily: "Poppins-Medium", fontSize: 14, color: Colors.black, textAlign: "center", width: "100%" }} >{endRide ? "Pet Sitting has been ended by sitter" : startRide ? `pet sitting has been started remaining pet sitting time is ${remainingTime ? (Number(remainingTime) / 60 / 24) > 1 ? Math.ceil(Number(remainingTime) / 60 / 24) : (Number(remainingTime) / 60) > 1 ? Math.ceil(Number(remainingTime) / 60) : remainingTime : (Number(bookingData?.duration) / 60 / 24) > 1 ? Number(bookingData?.duration) / 60 / 24 : Number(bookingData?.duration) / 60 > 1 ? Math.ceil(Number(bookingData?.duration) / 60) : bookingData?.duration} ${remainingTime ? (Number(remainingTime) / 60 / 24) > 1 ? "Days" : Number(remainingTime) / 60 > 1 ? "hour" : "min" : (Number(bookingData?.duration) / 60 / 24) > 1 ? "Days" : Number(bookingData?.duration) / 60 > 1 ? "hour" : "min"}` : collectPet ? "Wait for pet sitter for start sitting" : arrivedSitterAddress ? "Wait for pet sitter to confirm collecting pet" : "Arriving to sitter's location"}</Text>

                        </View>}


                        {bookingData && bookingData?.type !== "PetSitter" && <View style={{ marginTop: 20, backgroundColor: "#A3DA9E", borderRadius: 20, padding: 7, flexDirection: "row", alignItems: "center", marginBottom: 15 }} >


                            <Text style={{ fontFamily: "Poppins-Medium", fontSize: 14, color: Colors.black, textAlign: "center", width: "100%" }} >{endRide ? "Arrived Safely" : startRide && bookingData?.type !== "PetWalk" ? `Travel time to drop off location-${bookingData && bookingData?.bookingType == "twoWay" ? bookingData?.dropoffToPickupMinutes : arriveDropoffMin} min.` : startRide && bookingData?.type == "PetWalk" ? `Your pet walk duration is ${bookingData?.duration} min ` : reachDropoff && bookingData?.type == "PetWalk" ? `Your pet walk duration is ${bookingData?.duration} min ` : reachDropoff ? `You have reached at drop off waiting time is ${bookingData?.waitingTime} min` : rideStartToDropoff ? `Traval time to drop off location ${bookingData?.pickupToDropoffMinutes}min ` : arrived ? "Your Driver Arrived" : `Arriving in ${arrivalDis} mins`}</Text>

                        </View>}


                        {(endRide && bookingData?.type == "PetSitter") && (addInFavourites ? <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 15, textAlign: "center", width: "100%", color: Colors.black }} >Succesfully Add In Favourites</Text> : (favouriteSitters && favouriteSitters?.length > 0 && favouriteSitters?.some((e, i) => e?.id == bookingData?.driverData?.id)) ? "" : <CustomButton onPress={() => handleAddInFavourites()} text={favouriteLoading ? <ActivityIndicator color={Colors.white} size={"small"} /> : "Add In Favourites"} linearStyle={{ borderRadius: 5 }} styleContainer={{ width: "100%", marginBottom: 10 }} />)}


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


                        {bookingData && bookingData.type == "PetSitter" && bookingData.selectedOption?.name == "My Location" && !confirmArrival && !endRide && <CustomButton text={"Pet Sitter Arrived"} onPress={() => handleArriveSitter()} styleContainer={{ marginBottom: 20, width: "100%", marginTop: 10 }} />}

                        {bookingData && bookingData.type == "PetSitter" && bookingData.selectedOption?.name == "Sitter Location" && !arrivedSitterAddress && !endRide && <CustomButton text={"Arrived Sitter Address"} onPress={() => handleArriveSitterAddress()} styleContainer={{ marginBottom: 20, width: "100%", marginTop: 10 }} />}


                        {((!arrived || bookingData?.type == "PetSitter") && !endRide) && <CustomButton text={"Cancel Ride"} onPress={() => navigation.navigate("RideCancel")} styleContainer={{ marginBottom: 20, width: "100%" }} linearColor="#e6e6e6" btnTextStyle={{ color: Colors.black }} />}


                        {imageModal && ShowLocationModal()}

                    </View>




                </ScrollView>
            </KeyboardAvoidingView>
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