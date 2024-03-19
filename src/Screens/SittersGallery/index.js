import React, { useState, useContext, useEffect, useRef, useCallback } from "react"
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator, Dimensions, ToastAndroid, BackHandler, AppState, StyleSheet, Modal, TouchableWithoutFeedback, StatusBar, FlatList } from "react-native"
import CustomHeader from "../../Components/CustomHeader"
import CustomButton from "../../Components/CustomButton"
import Colors from "../../Constant/Color"
import BookingContext from "../../Context/bookingContext/context"
import firestore from "@react-native-firebase/firestore"
import { getPreciseDistance } from "geolib"
import { useIsFocused } from "@react-navigation/native"
import axios from "axios"
import RadiusContext from "../../Context/RadiusContext/context"
import LoginContext from "../../Context/loginContext/context"
import auth from "@react-native-firebase/auth"
import AntDesign from "react-native-vector-icons/AntDesign"
import IonIcons from "react-native-vector-icons/Ionicons"
import Video from 'react-native-video';
import FavouriteSitterContext from "../../Context/FavouriteContext/context"
import ScheduleRideContext from "../../Context/ScheduleRideContext/context"




const Slide = React.memo(({ item, index, handlePauseVideo, pause, currentIndex }) => {

    const videoRef = useRef(null);

    const { width, height } = Dimensions.get('window');

    return (
        <TouchableOpacity onPress={() => item.type == "video" && handlePauseVideo(index)} style={{
            width: width - 60,
            marginTop: 10,
            borderRadius: 10,
            height: 350,
            marginBottom: 10,
            marginRight: 8,
            marginLeft: item.id == 1 ? 3 : 0
        }}>
            {item.type === "image" ? (
                <Image
                    source={{ uri: item.sitting }}
                    style={{ height: 350, borderRadius: 10, width: width - 60 }}
                    resizeMode="cover"
                />
            ) :
                item?.sitting && item?.type == "video" && currentIndex == index ? <TouchableOpacity onPress={() => handlePauseVideo(index)} style={{ width: 300, height: 350, borderRadius: 10, marginTop: 10, alignContent: "center", justifyContent: "center", alignItems: "center" }}>
                    <Video
                        source={{ uri: item?.sitting }}
                        ref={videoRef}
                        onError={this.videoError}
                        onLoadStart={(e) => console.log(e, "eee")}
                        onLoadEnd={(e) => console.log(e, "eeeee")}
                        onBuffer={this.onBuffer}
                        repeat={false}
                        paused={pause.length > 0 ? pause.some((j, ind) => (j?.index == index && j.pause) ? true : false) : false
                        }
                        style={[styles.backgroundVideo]}
                    />

                </TouchableOpacity> : (currentIndex !== index) &&
                <TouchableOpacity onPress={() => handlePauseVideo(index)} style={{ width: "100%", backgroundColor: "black", borderRadius: 10, height: 350, justifyContent: "center", alignItems: "center" }} >
                    <AntDesign name="play" size={50} color={"white"} />
                </TouchableOpacity>
            }

        </TouchableOpacity>
    );
});



function SittersGallery({ navigation }) {

    const { width, height } = Dimensions.get('window');


    const bookingCont = useContext(BookingContext)
    const radiusCont = useContext(RadiusContext)
    const favouritesCont = useContext(FavouriteSitterContext)

    const loginCont = useContext(LoginContext)
    const { loginData, setLoginData } = loginCont


    const scheduleRideCont = useContext(ScheduleRideContext)
    const { scheduleData, setScheduleData } = scheduleRideCont



    const { favouriteSitters } = favouritesCont



    let [payment, setPayment] = useState([

        {
            id: 1,
            type: "Card"
        },
        {
            id: 2,
            type: "Wallet"
        }

    ])

    const { bookingData, setBookingData } = bookingCont
    const { radius, setRadius } = radiusCont

    const [driverData, setDriverData] = useState([])
    const [openPaymentCategoryModal, setOpenPaymentCategoryModal] = useState(false)
    const [selectedDriver, setSelectedDriver] = useState("")
    const [requestInProcess, setRequestInProcess] = useState(false)
    const [rejectDrivers, setRejectDrivers] = useState([])
    const [imageModal, setImageModal] = useState(false)
    const [descriptionModal, setDescriptionModal] = useState(false)
    const [walletAmount, setWalletAmount] = useState(0)
    const [deductedFromWallet, setDeductedFromWallet] = useState(false)
    const [loading, setLoading] = useState(false)

    const [showFavourites, setShowFavourites] = useState(false)

    const [pause, setPause] = useState([{
        index: 0,
        pause: false
    }


    ])
    const focus = useIsFocused()

    const ref = useRef(null);
    const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);
    const [currentIndex, setCurrentIndex] = useState(0)

    const updateCurrentSlideIndex = e => {

        const contentOffsetX = e.nativeEvent.contentOffset.x;
        const currentIndex = Math.floor(contentOffsetX / (width - 57));
        setCurrentSlideIndex(currentIndex);

    };


    const goToNext = () => {
        const nextSlideIndex = currentSlideIndex + 1;
        const offset = nextSlideIndex * width;
        ref?.current?.scrollToOffset({ offset });
        setCurrentSlideIndex(nextSlideIndex);
    };


    const getWalletAmount = () => {

        let id = auth().currentUser?.uid

        firestore().collection("UserWallet").doc(id).get().then((doc) => {

            let walletData = doc.data()

            if (walletData?.wallet) {

                let { wallet } = walletData



                let amount = wallet.length > 0 && wallet.reduce((a, b) => {

                    return Number(a.remainingWallet ?? a) + Number(b.remainingWallet ?? b)
                })
                setWalletAmount(Number(amount)?.toFixed(2))
            }
        })
    }

    const getDriver = () => {


        let unsubscribe = firestore().collection("Drivers").where("driverStatus", "==", "online").onSnapshot((querySnapshot) => {

            let drivers = []

            if (bookingData?.requestStatus !== "accept") {

                querySnapshot.forEach((doc) => {

                    let data = doc.data()

                    if (!data.inlined &&
                        ((bookingData.type.toLowerCase() == "medicaltrip") && data?.selectedCategory && Array.isArray(data.selectedCategory) && data?.selectedCategory?.length > 0 && data?.selectedCategory?.some((e, i) => e == "driver")) ||
                        ((bookingData.type.toLowerCase() == "pethotel") && data?.selectedCategory && Array.isArray(data.selectedCategory) && data?.selectedCategory?.length > 0 && data?.selectedCategory?.some((e, i) => e == "driver")) ||
                        ((bookingData.type.toLowerCase() == "friendsandfamily") && data?.selectedCategory && Array.isArray(data.selectedCategory) && data?.selectedCategory?.length > 0 && data?.selectedCategory?.some((e, i) => e == "driver")) ||
                        ((bookingData.type.toLowerCase() == "petgrooming") && data?.selectedCategory && Array.isArray(data.selectedCategory) && data?.selectedCategory?.length > 0 && data?.selectedCategory?.some((e, i) => e == "driver")) ||
                        ((bookingData.type.toLowerCase() == "petwalk") && data?.selectedCategory && Array.isArray(data.selectedCategory) && data?.selectedCategory?.length > 0 && data?.selectedCategory?.some((e, i) => e == "walker")) ||
                        ((bookingData.type.toLowerCase() == "petsitter") && data?.selectedCategory && Array.isArray(data.selectedCategory) && data?.selectedCategory?.length > 0 && data?.selectedCategory?.some((e, i) => e == "sitter"))
                    ) {

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



                console.log("hello hello world")

                // ToastAndroid.show("Your request has been succesfuly accepted", ToastAndroid.SHORT)
                setRequestInProcess(false)
                // setBookingData({
                //     ...bookingData,
                //     requestStatus: "accept"
                // })
                navigation.navigate('Tab', {
                    screen: 'PassengerRideDetail'
                });

                // ToastAndroid.show("Request has been successfully accepted", ToastAndroid.SHORT)

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

                ToastAndroid.show("Your Pet Sitter is busy, let's find you another Pet Sitter", ToastAndroid.SHORT)
                setRejectDrivers([...rejectDrivers, data?.driverData])
                setRequestInProcess(false)

            }




        })


        return () => {
            unsubscribe()
        }

    }



    useEffect(() => {

        getWalletAmount()

    }, [])


    React.useEffect(() => {


        if (focus) {
            checkDriverResponse()
        }

    }, [focus, selectedDriver, requestInProcess])



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



    console.log(bookingData, "bookingData")


    const handleSelectDriver = async (driver) => {


        console.log(driver.token, "driver")

        console.log(driver.id, "iddd")


        setOpenPaymentCategoryModal(false)

        setLoading(true)

        let { selectedCategory } = driver


        let selectedPayment = payment?.filter((e, i) => e?.selected)

        selectedPayment = selectedPayment?.[0]


        let myDriver = {
            ...driver,
            selectedCategory: "sitter",
            deductedFromWallet: (selectedPayment && selectedPayment?.id == 2) ? true : false
        }


        let dataToSend;
        if (bookingData?.type == "PetSitter" && bookingData?.scheduleDate) {

            let allData;


            if (bookingData?.selectedOption?.name == "My Location") {
                allData = {
                    ...bookingData,
                    driverData: myDriver,
                    drivers: [myDriver],
                    fare: driver?.fare,
                    driverFare: driver?.driverFare,
                    serviceCharge: driver?.serviceCharge,
                    deductedFromWallet: false,
                    requestStatus: "pending"
                }
            }
            else {

                allData = {
                    ...bookingData,
                    driverData: myDriver,
                    fare: driver?.fare,
                    drivers: [myDriver],
                    sittingLocation: driver?.sittingLocation,
                    pickupCords: {
                        lat: driver?.sittingLocation?.latitude,
                        lng: driver?.sittingLocation?.longitude,
                    },
                    pickupAddress: driver?.sittingLocation?.address,
                    driverFare: driver?.driverFare,
                    serviceCharge: driver?.serviceCharge,
                    deductedFromWallet: false,
                    requestStatus: "pending"
                }

            }



            let checkRideTime = scheduleData && scheduleData.length > 0 && scheduleData.some((e, i) => {

                const scheduledDateTime = new Date(
                    bookingData?.scheduleDate.getFullYear(),
                    bookingData?.scheduleDate.getMonth(),
                    bookingData?.scheduleDate.getDate(),
                    bookingData?.scheduleTime.getHours(),
                    bookingData?.scheduleTime.getMinutes(),
                    bookingData?.scheduleTime.getSeconds()
                );



                let previousDate = e?.scheduleDate?.toDate()
                let previousTime = e?.scheduleTime?.toDate()

                const previousDateTime = new Date(
                    previousDate.getFullYear(),
                    previousDate.getMonth(),
                    previousDate.getDate(),
                    previousTime.getHours(),
                    previousTime.getMinutes(),
                    previousTime.getSeconds()
                );


                let previousDateGet = previousDateTime?.getTime()
                let selectedDateGet = scheduledDateTime?.getTime()

                let diff = selectedDateGet - previousDateGet

                let diffHour = diff / 1000 / 60 / 60


                return diffHour < 3 && diffHour > -3 && e?.ScheduleRidestatus == "pending"


            })


            if (checkRideTime) {

                ToastAndroid.show("You have already schedule booking within this time slot", ToastAndroid.SHORT)
                setLoading(false)
                return
            }


            firestore().collection("ScheduleRides").doc(loginData?.id).set(
                { scheduleRides: firestore.FieldValue.arrayUnion(allData) }, { merge: true }
            ).then(async (res) => {

                var data = JSON.stringify({
                    notification: {
                        body: "You have got Scheduled Booking request kindly respond back",
                        title: `Scheduled Booking Request`,
                        sound: "default"
                    },
                    android: {
                        priority: "high",
                    },
                    to: driver?.token,
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
                    .then(async (res) => {


                        let dataToSend = {
                            title: "Scheduled Booking Request",
                            body: 'You have got Scheduled Booking request kindly respond back',
                            date: new Date()
                        }


                        firestore().collection("DriverNotification").doc(driver?.id).set({
                            notification: firestore.FieldValue.arrayUnion(dataToSend)
                        }, { merge: true })


                        setScheduleData([
                            ...scheduleData,
                            allData
                        ])
                        setLoading(false)
                        ToastAndroid.show("Your booking has been succesfully scheduled", ToastAndroid.LONG)
                        navigation.replace("Tab", {
                            screen: "Home"
                        })
                    })
                    .catch(error => {
                        setLoading(false)
                        console.log(error, "error")
                    });

            }).catch((error) => {
                setLoading(false)
                console.log(error)
            })
            return








            return

        }



        if (bookingData?.type == "PetSitter" && bookingData?.selectedOption?.name == "My Location") {

            driver.selectedCategory = "sitter"

            dataToSend = {

                driverData: myDriver,
                fare: driver?.fare,
                driverFare: driver?.driverFare,
                serviceCharge: driver?.serviceCharge,
                deductedFromWallet: payment && payment?.length > 0 && payment?.some((e, i) => (e?.id == 2 && e?.selected)) ? true : false,
                requestStatus: "pending"
            }

        }

        else {

            dataToSend = {

                driverData: myDriver,
                fare: driver?.fare,
                sittingLocation: driver?.sittingLocation,
                pickupCords: {
                    lat: driver?.sittingLocation?.latitude,
                    lng: driver?.sittingLocation?.longitude,
                },
                pickupAddress: driver?.sittingLocation?.address,
                driverFare: driver?.driverFare,
                serviceCharge: driver?.serviceCharge,
                deductedFromWallet: payment && payment?.length > 0 && payment?.some((e, i) => (e?.id == 2 && e?.selected)) ? true : false,
                requestStatus: "pending"

            }

        }

        if (bookingData?.type == "PetSitter") {
            firestore().collection("Request").doc(bookingData?.userData?.id).update(dataToSend).then(() => {

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
                                    driverData: myDriver,
                                    fare: driver?.fare,
                                    driverFare: driver?.driverFare,
                                    serviceCharge: driver?.serviceCharge,
                                    deductedFromWallet: driver?.deductedFromWallet,
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

        else {


            firestore().collection("Request").doc(bookingData?.userData?.id).update({
                driverData: myDriver,
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
                                setSelectedDriver(myDriver)

                                if (bookingData.type == "PetSitter") {
                                    setBookingData({
                                        ...bookingData,
                                        driverData: myDriver,
                                        fare: driver?.fare,
                                        driverFare: driver?.driverFare,
                                        serviceCharge: driver?.serviceCharge,
                                        deductedFromWallet: driver?.deductedFromWallet,
                                    })
                                } else {

                                    setBookingData({
                                        ...bookingData,
                                        driverData: myDriver,
                                    })

                                }
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


        setLoading(false)

    }



    const handleOpenPaymentCategoryModal = (driver) => {

        setSelectedDriver(driver)
        setOpenPaymentCategoryModal(true)

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







    const handleSelectPaymentMethod = (method) => {

        setPayment(payment.map((e, i) => {

            if (e?.id == method.id) {
                return {
                    ...e,
                    selected: e?.selected ? false : true
                }
            } else {
                return {
                    ...e,
                    selected: false
                }
            }

        })
        )

    }


    const ShowLocationModal = useCallback(() => {






        return (
            <View style={styles.centeredView}>
                <Modal animationType="slide" transparent={true} onRequestClose={() => setOpenPaymentCategoryModal(false)} visible={openPaymentCategoryModal}>
                    <TouchableWithoutFeedback style={{ flex: 1, borderWidth: 4, width: "100%", height: "100%", zIndex: 100 }} onPress={() => setOpenPaymentCategoryModal(false)} >
                        <View style={styles.centeredView}>
                            <View style={[styles.modalView, { padding: 10 }]}>


                                <Text style={{ color: Colors.black, fontFamily: "Poppins-SemiBold", fontSize: 16, padding: 10, }} >
                                    Kindly Select Payment Method
                                </Text>
                                <View style={{ alignSelf: "flex-start", padding: 10 }} >
                                    {payment && payment?.length > 0 && payment?.map((e, i) => {
                                        return (

                                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", marginTop: 10 }} >

                                                <TouchableOpacity onPress={() => handleSelectPaymentMethod(e)} style={{ width: 30, height: 30, borderRadius: 5, borderWidth: 1, borderColor: Colors.gray, backgroundColor: e?.selected ? Colors.buttonColor : Colors.white }} >



                                                </TouchableOpacity>


                                                <Text style={{ color: Colors.black, fontFamily: "Poppins-Medium", fontSize: 16, padding: 10, }} >
                                                    {e?.type}
                                                </Text>


                                            </View>

                                        )
                                    })}

                                </View>

                                <CustomButton onPress={() => handleSelectDriver(selectedDriver)} text="Find Sitter" styleContainer={{ width: "90%", marginTop: 10 }} linearStyle={{ borderRadius: 5 }} />

                            </View>

                            <View>



                            </View>

                        </View>




                    </TouchableWithoutFeedback>

                </Modal>
            </View>
        );
    }, [openPaymentCategoryModal, walletAmount, payment]);



    const ShowDescriptionModal = useCallback((driver, ind) => {
        return (
            <View style={styles.centeredView}>
                <Modal animationType="slide" transparent={true} onRequestClose={() => handleShowDescription(ind)} visible={descriptionModal}>
                    <TouchableWithoutFeedback style={{ flex: 1, borderWidth: 4, width: "100%", height: "100%", zIndex: 100 }} onPress={() => handleShowDescription(ind)} >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>


                                <Text style={{ color: Colors.black, fontFamily: "Poppins-Medium", fontSize: 16, padding: 10, }} >
                                    {driver?.description ?? "No Description"}
                                </Text>

                            </View>

                            <View>



                            </View>

                        </View>




                    </TouchableWithoutFeedback>

                </Modal>
            </View>
        );
    }, [descriptionModal]);



    const handlePauseVideo = (index) => {



        setCurrentIndex(index)

        if (pause && pause.length > 0) {
            let isAvailable = pause.some((e, i) => index === e?.index);
            if (isAvailable) {
                setPause(pause.map((e, i) => {
                    if (index === e?.index) {
                        return {
                            ...e,
                            pause: !e?.pause
                        };
                    } else {
                        return {
                            ...e,
                            pause: true
                        }
                    }
                }));
            } else {
                let data = {
                    index: index,
                    pause: false
                };
                setPause([...pause, data]);
            }
        } else {
            let data = {
                index: index,
                pause: true
            };
            setPause([data]);
        }
    };




    const selectDeductFromWallet = (ind) => {

        setDriverData(driverData && driverData.length > 0 && driverData.map((e, i) => {
            if (ind == i) {
                return {
                    ...e,
                    deductedFromWallet: !e.deductedFromWallet
                }
            } else {
                return e
            }
        }))


    }


    const handleShowDescription = (ind) => {

        setDriverData(driverData && driverData.length > 0 && driverData.map((e, i) => {
            if (ind == i) {
                return {
                    ...e,
                    showDescription: !e.showDescription
                }
            } else {
                return {
                    ...e,
                    showDescription: false
                }
            }
        }))


        setDescriptionModal(!descriptionModal)

    }


    const handleShowImage = (ind) => {

        setDriverData(driverData && driverData.length > 0 && driverData.map((e, i) => {
            if (ind == i) {
                return {
                    ...e,
                    showImage: !e.showImage
                }
            } else {
                return {
                    ...e,
                    showImage: false
                }
            }
        }))

        setImageModal(!imageModal)
    }




    const handleShowFullDescription = (ind) => {

        setDriverData(driverData && driverData?.length > 0 && driverData?.map((e, i) => {
            if (ind == i) {
                return {
                    ...e,
                    seeMore: e?.seeMore ? false : true
                }
            } else {
                return e
            }
        }))



    }




    console.log((true && !bookingData?.scheduleDate), "timeType")

    // console.log(walletAmount,"wallet")
    // console.log(bookingData?.fare,"fdare")

    return loading ? <View style={{ justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }} >

        <ActivityIndicator color={Colors.buttonColor} size={"large"} loading={loading} />

    </View> : <View style={{ flex: 1, backgroundColor: Colors.white }} >

        {/* <View style={{ marginTop: 5 }} >
            <CustomHeader
                onPress={() => navigation.goBack()}
                iconname={"arrow-back-outline"}
                text="Drivers"
                color={Colors.black}
            />
        </View> */}

        <StatusBar
            animated={true}
            backgroundColor="rgba(246, 255, 245, 1)"
            barStyle={'dark-content'}
        />

        <View style={{ margin: 20, marginBottom: 0, padding: 10, paddingVertical: 20, borderWidth: 1, borderColor: "#B2B1B1", borderRadius: 10, backgroundColor: Colors.white, flexDirection: "row", alignItems: "center", justifyContent: "center" }} >


            <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 35, height: 35, borderWidth: 2, justifyContent: "center", alignItems: "center", borderRadius: 10, borderColor: "#D9D9D9", position: "absolute", left: 10, top: 13 }} >
                <IonIcons
                    name="chevron-back-outline"
                    size={20}
                    color={Colors.black}
                />
            </TouchableOpacity>

            <View>
                <Text style={{ color: Colors.black, fontFamily: "Poppins-Bold", fontSize: 14, lineHeight: 20, textAlign: "center" }} >Select Sitter</Text>
            </View>

        </View>




        {(!requestInProcess && driverData && driverData?.length > 0) && <View style={{ marginTop: 10, flexDirection: "row", alignItems: "center", paddingHorizontal: 20 }} >
            <TouchableOpacity onPress={() => setShowFavourites(!showFavourites)} style={{ width: 25, height: 25, borderRadius: 5, borderWidth: 1, borderColor: Colors.gray, marginRight: 10, justifyContent: "center", alignItems: "center", backgroundColor: showFavourites ? Colors.buttonColor : Colors.white }} >
                {/* {e?.selected && <AntDesign name="check" size={15} color={Colors.black} />} */}
            </TouchableOpacity>
            <Text style={[styles.categoryText, { fontSize: 18, fontFamily: "Poppins-Regular", color: Colors.black }]} >Show Favorite Sitters</Text>
        </View>}



        <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false} style={{ flex: 1 }} >

            {requestInProcess ? <View style={{ flex: 1, justifyContent: "center", alignItems: "center", height: Dimensions.get("window").height - 100 }} >

                <ActivityIndicator color={Colors.buttonColor} size="large" />
                <Text style={{ color: Colors.black, fontFamily: "Poppins-Bold", fontSize: 22 }} >Processing Request</Text>

            </View> : driverData && driverData.length == 0 ? <View style={{ flex: 1, justifyContent: "center", alignItems: "center", height: Dimensions.get("window").height - 100 }} >

                <ActivityIndicator color={Colors.buttonColor} size="large" />
                <Text style={{ color: Colors.black, fontFamily: "Poppins-Bold", fontSize: 22 }} >Finding Sitters</Text>

            </View> : <View style=
                {{ paddingHorizontal: 15 }} >


                {showFavourites && favouriteSitters && favouriteSitters?.length > 0 && (favouriteSitters?.some((e, i) => driverData?.some((j) => j.id == e?.id))) ? driverData?.map((e, i) => {


                    if (favouriteSitters?.some((j, i) => j?.id == e?.id)) {


                        let fare;
                        let driverFare;
                        let charges;

                        if (e.selectedCategory && Array.isArray(e?.selectedCategory) && e.selectedCategory?.length > 0 && e?.selectedCategory.some((e, i) => e == "sitter" && bookingData?.type == "PetSitter")) {




                            if (bookingData?.timeType.type.toLowerCase() == "by hour") {

                                let hours = bookingData?.duration / 60


                                let hourlyRate;

                                if (bookingData.selectedOption?.name == "My Location") {

                                    if (hours > 1) {

                                        // let rate = e?.hourlyChargeCustomerLocation
                                        // let discount = e?.hourlyDiscountCustomerLocation

                                        // let discAmount = (Number(rate) * Number(discount)) / 100

                                        hourlyRate = e?.hourlyDiscountCustomerLocation

                                    }
                                    else {
                                        hourlyRate = e?.hourlyChargeCustomerLocation
                                    }
                                }
                                else if (bookingData.selectedOption?.name == "Sitter Location") {

                                    if (hours > 1) {

                                        // let rate = e?.hourlyChargeSitterLocation
                                        // let discount = e?.hourlyDiscountSitterLocation

                                        // let discAmount = (Number(rate) * Number(discount)) / 100

                                        hourlyRate = e?.hourlyDiscountSitterLocation

                                    } else {

                                        hourlyRate = e?.hourlyChargeSitterLocation
                                    }
                                }

                                let totalFare = (hours * hourlyRate) + bookingData?.petCharges

                                console.log(totalFare, "totalFate")

                                if (bookingData?.selectedPets?.length > 0) {

                                    totalFare = totalFare * bookingData?.selectedPets?.length

                                }

                                fare = Number(totalFare).toFixed(2)

                                let serviceCharge = bookingData?.serviceCharge

                                let totalCharges = Number(totalFare) * serviceCharge / 100

                                let TotaldriverFare = totalFare - totalCharges

                                driverFare = Number(TotaldriverFare).toFixed(2)


                                charges = Number(totalCharges)


                            }
                            else if (bookingData?.timeType.type.toLowerCase() == "half day") {



                                let halfDayFare;


                                if (bookingData.selectedOption?.name == "My Location") {

                                    halfDayFare = e?.halfDayChargeCustomerLocation

                                }
                                else if (bookingData.selectedOption?.name == "Sitter Location") {

                                    halfDayFare = e?.halfDayChargeSitterLocation

                                }


                                let totalFare = Number(halfDayFare) + bookingData?.petCharges

                                fare = Number(totalFare).toFixed(2)

                                let serviceCharge = bookingData?.serviceCharge

                                let totalCharges = Number(totalFare) * Number(serviceCharge) / 100

                                let TotaldriverFare = Number(totalFare) - Number(totalCharges)

                                driverFare = Number(TotaldriverFare).toFixed(2)


                                charges = Number(totalCharges)



                            }

                            else if (bookingData?.timeType.type.toLowerCase() == "by day") {




                                let totalDays = bookingData?.totalDays


                                let fullDayFare;


                                if (bookingData.selectedOption?.name == "My Location") {

                                    if (totalDays > 1) {

                                        let totalCharges = Number(e?.dayChargeCustomerLocation) * totalDays
                                        let discount = e?.dayDiscountCustomerLocation


                                        let disAmount = (Number(totalCharges) * Number(discount)) / 100

                                        fullDayFare = totalCharges - disAmount

                                    }
                                    else {
                                        fullDayFare = e?.dayChargeCustomerLocation * totalDays
                                    }

                                }


                                else if (bookingData.selectedOption?.name == "Sitter Location") {


                                    if (totalDays > 1) {

                                        let totalCharges = Number(e?.dayChargeSitterLocation) * totalDays
                                        let discount = e?.dayDiscountSitterLocation

                                        let disAmount = (Number(totalCharges) * Number(discount)) / 100

                                        fullDayFare = totalCharges - disAmount

                                    }
                                    else {
                                        fullDayFare = e?.dayChargeSitterLocation * totalDays
                                    }
                                }


                                let totalFare = Number(fullDayFare) + bookingData?.petCharges

                                if (bookingData?.selectedPets?.length > 0) {

                                    totalFare = totalFare * bookingData?.selectedPets?.length

                                }
                                fare = Number(totalFare).toFixed(2)

                                let serviceCharge = bookingData?.serviceCharge

                                let totalCharges = Number(totalFare) * serviceCharge / 100

                                let TotaldriverFare = totalFare - totalCharges

                                driverFare = Number(TotaldriverFare).toFixed(2)


                                charges = Number(totalCharges)

                            }

                            else if (bookingData?.timeType.type.toLowerCase() == "by week") {




                                let totalWeeks = bookingData?.totalWeeks

                                let weeklyFare;


                                if (bookingData.selectedOption?.name == "My Location") {

                                    if (totalWeeks > 1) {

                                        let totalCharges = Number(e?.weeklyChargeCustomerLocation) * totalWeeks
                                        let discount = e?.weeklyDiscountCustomerLocation


                                        let disAmount = (Number(totalCharges) * Number(discount)) / 100

                                        weeklyFare = totalCharges - disAmount

                                    }
                                    else {
                                        weeklyFare = e?.weeklyChargeCustomerLocation * totalWeeks
                                    }

                                }

                                if (bookingData.selectedOption?.name == "Sitter Location") {

                                    if (totalWeeks > 1) {

                                        let totalCharges = Number(e?.weeklyChargeSitterLocation) * totalWeeks
                                        let discount = e?.weeklyDiscountSitterLocation


                                        let disAmount = (Number(totalCharges) * Number(discount)) / 100

                                        weeklyFare = totalCharges - disAmount

                                    }
                                    else {
                                        weeklyFare = e?.weeklyChargeSitterLocation * totalWeeks
                                    }

                                }


                                let totalFare = Number(weeklyFare) + bookingData?.petCharges


                                if (bookingData?.selectedPets?.length > 0) {

                                    totalFare = totalFare * bookingData?.selectedPets?.length

                                }

                                fare = Number(totalFare).toFixed(2)

                                let serviceCharge = bookingData?.serviceCharge

                                let totalCharges = Number(totalFare) * serviceCharge / 100

                                let TotaldriverFare = totalFare - totalCharges

                                driverFare = Number(TotaldriverFare).toFixed(2)


                                charges = Number(totalCharges)

                            }

                        }


                        if (e?.selectedCategory && Array.isArray(e?.selectedCategory) && e?.selectedCategory?.length > 0 && e?.selectedCategory.some((e, i) => e == "sitter" && bookingData?.type == "PetSitter")) {
                            e.fare = fare
                            e.driverFare = driverFare
                            e.serviceCharge = charges
                        }

                        let sittingImages;
                        if (e?.sittingVideo) {
                            sittingImages = [

                                {
                                    sitting: e?.sittingVideo,
                                    id: 1,
                                    type: "video"
                                },
                                {
                                    sitting: e?.sittingimage1,
                                    id: 2,
                                    type: "image"
                                },
                                {
                                    sitting: e?.sittingimage2,
                                    id: 3,
                                    type: "image"
                                },
                                {
                                    sitting: e?.sittingimage3,
                                    id: 4,
                                    type: "image"
                                },
                            ]
                        } else {
                            sittingImages = [


                                {
                                    sitting: e?.sittingimage1,
                                    id: 1,
                                    type: "image"
                                },
                                {
                                    sitting: e?.sittingimage2,
                                    id: 2,
                                    type: "image"
                                },
                                {
                                    sitting: e?.sittingimage3,
                                    id: 3,
                                    type: "image"
                                },
                            ]
                        }

                        return (

                            <View key={i} style={{ padding: 10, marginTop: 20, borderRadius: 8, borderWidth: 1.5, borderColor: Colors.buttonColor }} >

                                <View style={{ flexDirection: "row", alignItems: "center" }} >

                                    <Image source={{ uri: e.profile }} style={{ width: 60, height: 60, borderRadius: 50 }} />

                                    <View style={{ marginLeft: 6 }} >
                                        <Text style={{ fontFamily: "Poppins-Medium", fontSize: 16, color: Colors.black, lineHeight: 20 }} >{e.fullName.length > 9 ? `${e.fullName.slice(0, 8)}...` : e.fullName}</Text>
                                        <Text style={{ fontFamily: "Poppins-Regular", fontSize: 12, color: Colors.gray, lineHeight: 17, }} >{e.city}, {e?.country?.value}</Text>
                                    </View>




                                </View>


                                <View style={{ flex: 1 }} >
                                    <FlatList
                                        ref={ref}
                                        onMomentumScrollEnd={(e) => updateCurrentSlideIndex(e)}
                                        data={sittingImages}
                                        // contentContainerStyle={{ height: 350 }}
                                        showsHorizontalScrollIndicator={false}
                                        horizontal
                                        keyExtractor={(index) => index.id}
                                        pagingEnabled
                                        renderItem={({ item }) => <Slide key={i} currentIndex={currentIndex} item={item} index={i} handlePauseVideo={handlePauseVideo} pause={pause} />}
                                    />
                                    <View style={{ flexDirection: "row", justifyContent: "center", position: "relative", top: -30 }} >
                                        {sittingImages.map((_, index) => (
                                            <View
                                                key={index}
                                                style={[
                                                    styles.indicator,
                                                    {
                                                        backgroundColor:
                                                            currentSlideIndex == index
                                                                ? Colors.green
                                                                : Colors.gray,
                                                        width: 8,
                                                        height: 8,

                                                        borderRadius: 10,
                                                    },
                                                ]}
                                            />
                                        ))}
                                    </View>

                                </View>


                                <View>
                                    <Text style={{ fontFamily: "Poppins-Medium", justifyContent: "center", alignItems: "center", fontSize: 12, color: 'black', padding: 10 }}>
                                        {e?.seeMore ? e?.description : (e?.description?.length > 80 ? `${e?.description.slice(0, 80)}...` : e?.description)}
                                    </Text>
                                    {e?.description?.length > 80 && (
                                        <TouchableOpacity onPress={() => handleShowFullDescription(i)} style={{ padding: 10, paddingTop: 0 }} >
                                            <Text style={{ fontSize: 12, fontFamily: "Poppins-Medium", color: 'gray' }}>{e?.seeMore ? "Collapse" : "See more"}</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>

                                <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 10 }} >

                                    <View>

                                        <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 14, color: Colors.black }} >Sitting Charges</Text>


                                        <Text style={{ fontFamily: "Poppins-Bold", fontSize: 18, color: Colors.black }} >${e?.fare}</Text>


                                    </View>


                                    <TouchableOpacity onPress={() => !loading && ((Number(walletAmount) > Number(e?.fare)) && bookingData?.scheduleDate) ? handleOpenPaymentCategoryModal(e) : handleSelectDriver(e)} style={{ width: 130, backgroundColor: Colors.buttonColor, borderRadius: 8, justifyContent: "center", alignItems: "center" }} >
                                        <Text style={{ fontSize: 14, color: Colors.white, fontFamily: "Poopins-Medium" }} >Book Now</Text>
                                    </TouchableOpacity>

                                </View>


                            </View>
                        )

                    }


                }) : driverData && driverData.length > 0 && driverData.map((e, i) => {

                    let fare;
                    let driverFare;
                    let charges;

                    if (e.selectedCategory && Array.isArray(e?.selectedCategory) && e.selectedCategory?.length > 0 && e?.selectedCategory.some((e, i) => e == "sitter" && bookingData?.type == "PetSitter")) {


                        if (bookingData?.timeType.type.toLowerCase() == "by hour") {

                            let hours = bookingData?.duration / 60

                            let hourlyRate;

                            if (bookingData.selectedOption?.name == "My Location") {

                                if (hours > 1) {

                                    let rate = e?.hourlyChargeCustomerLocation
                                    let discount = e?.hourlyDiscountCustomerLocation

                                    let discAmount = (Number(rate) * Number(discount)) / 100

                                    // hourlyRate = rate - discAmount

                                    hourlyRate = e?.hourlyDiscountCustomerLocation
                                }
                                else {
                                    hourlyRate = e?.hourlyChargeCustomerLocation
                                }
                            }
                            else if (bookingData.selectedOption?.name == "Sitter Location") {

                                if (hours > 1) {

                                    // let rate = e?.hourlyChargeSitterLocation
                                    // let discount = e?.hourlyDiscountSitterLocation

                                    // let discAmount = (Number(rate) * Number(discount)) / 100

                                    // hourlyRate = rate - discAmount
                                    hourlyRate = e?.hourlyDiscountSitterLocation

                                } else {

                                    hourlyRate = e?.hourlyChargeSitterLocation
                                }
                            }

                            let totalFare = (hours * hourlyRate) + bookingData?.petCharges
                            if (bookingData?.selectedPets?.length > 0) {

                                totalFare = totalFare * bookingData?.selectedPets?.length

                            }
                            fare = Number(totalFare).toFixed(2)

                            let serviceCharge = bookingData?.serviceCharge

                            let totalCharges = Number(totalFare) * serviceCharge / 100

                            let TotaldriverFare = totalFare - totalCharges

                            driverFare = Number(TotaldriverFare).toFixed(2)


                            charges = Number(totalCharges)


                        }
                        else if (bookingData?.timeType.type.toLowerCase() == "half day") {



                            let halfDayFare;


                            if (bookingData.selectedOption?.name == "My Location") {

                                halfDayFare = e?.halfDayChargeCustomerLocation

                            }
                            else if (bookingData.selectedOption?.name == "Sitter Location") {

                                halfDayFare = e?.halfDayChargeSitterLocation

                            }


                            let totalFare = Number(halfDayFare) + bookingData?.petCharges

                            fare = Number(totalFare).toFixed(2)

                            let serviceCharge = bookingData?.serviceCharge

                            let totalCharges = Number(totalFare) * Number(serviceCharge) / 100

                            let TotaldriverFare = Number(totalFare) - Number(totalCharges)

                            driverFare = Number(TotaldriverFare).toFixed(2)


                            charges = Number(totalCharges)



                        }

                        else if (bookingData?.timeType.type.toLowerCase() == "by day") {




                            let totalDays = bookingData?.totalDays


                            let fullDayFare;


                            if (bookingData.selectedOption?.name == "My Location") {

                                if (totalDays > 1) {

                                    // let totalCharges = Number(e?.dayChargeCustomerLocation) * totalDays
                                    // let discount = e?.dayDiscountCustomerLocation


                                    // let disAmount = (Number(totalCharges) * Number(discount)) / 100

                                    // fullDayFare = totalCharges - disAmount

                                    fullDayFare = e?.dayDiscountCustomerLocation * totalDays

                                }
                                else {
                                    fullDayFare = e?.dayChargeCustomerLocation * totalDays
                                }

                            }


                            else if (bookingData.selectedOption?.name == "Sitter Location") {


                                if (totalDays > 1) {

                                    // let totalCharges = Number(e?.dayChargeSitterLocation) * totalDays
                                    // let discount = e?.dayDiscountSitterLocation

                                    // let disAmount = (Number(totalCharges) * Number(discount)) / 100

                                    // fullDayFare = totalCharges - disAmount

                                    fullDayFare = e?.dayDiscountSitterLocation * totalDays

                                }
                                else {
                                    fullDayFare = e?.dayChargeSitterLocation * totalDays
                                }
                            }


                            let totalFare = Number(fullDayFare) + bookingData?.petCharges
                            if (bookingData?.selectedPets?.length > 0) {

                                totalFare = totalFare * bookingData?.selectedPets?.length

                            }
                            fare = Number(totalFare).toFixed(2)

                            let serviceCharge = bookingData?.serviceCharge

                            let totalCharges = Number(totalFare) * serviceCharge / 100

                            let TotaldriverFare = totalFare - totalCharges

                            driverFare = Number(TotaldriverFare).toFixed(2)


                            charges = Number(totalCharges)

                        }

                        else if (bookingData?.timeType.type.toLowerCase() == "by week") {




                            let totalWeeks = bookingData?.totalWeeks

                            let weeklyFare;


                            if (bookingData.selectedOption?.name == "My Location") {

                                if (totalWeeks > 1) {

                                    // let totalCharges = Number(e?.weeklyChargeCustomerLocation) * totalWeeks
                                    // let discount = e?.weeklyDiscountCustomerLocation


                                    // let disAmount = (Number(totalCharges) * Number(discount)) / 100

                                    // weeklyFare = totalCharges - disAmount

                                    weeklyFare = e?.weeklyDiscountCustomerLocation * totalWeeks

                                }
                                else {
                                    weeklyFare = e?.weeklyChargeCustomerLocation * totalWeeks
                                }

                            }

                            if (bookingData.selectedOption?.name == "Sitter Location") {

                                if (totalWeeks > 1) {

                                    // let totalCharges = Number(e?.weeklyChargeSitterLocation) * totalWeeks
                                    // let discount = e?.weeklyDiscountSitterLocation


                                    // let disAmount = (Number(totalCharges) * Number(discount)) / 100

                                    // weeklyFare = totalCharges - disAmount

                                    weeklyFare = e?.weeklyDiscountSitterLocation * totalWeeks

                                }
                                else {
                                    weeklyFare = e?.weeklyChargeSitterLocation * totalWeeks
                                }

                            }


                            let totalFare = Number(weeklyFare) + bookingData?.petCharges
                            if (bookingData?.selectedPets?.length > 0) {

                                totalFare = totalFare * bookingData?.selectedPets?.length

                            }
                            fare = Number(totalFare).toFixed(2)

                            let serviceCharge = bookingData?.serviceCharge

                            let totalCharges = Number(totalFare) * serviceCharge / 100

                            let TotaldriverFare = totalFare - totalCharges

                            driverFare = Number(TotaldriverFare).toFixed(2)


                            charges = Number(totalCharges)

                        }

                    }


                    if (e?.selectedCategory && Array.isArray(e?.selectedCategory) && e?.selectedCategory?.length > 0 && e?.selectedCategory.some((e, i) => e == "sitter" && bookingData?.type == "PetSitter")) {
                        e.fare = fare
                        e.driverFare = driverFare
                        e.serviceCharge = charges
                    }

                    let sittingImages;
                    if (e?.sittingVideo) {
                        sittingImages = [

                            {
                                sitting: e?.sittingVideo,
                                id: 1,
                                type: "video"
                            },
                            {
                                sitting: e?.sittingimage1,
                                id: 2,
                                type: "image"
                            },
                            {
                                sitting: e?.sittingimage2,
                                id: 3,
                                type: "image"
                            },
                            {
                                sitting: e?.sittingimage3,
                                id: 4,
                                type: "image"
                            },
                        ]
                    } else {
                        sittingImages = [


                            {
                                sitting: e?.sittingimage1,
                                id: 1,
                                type: "image"
                            },
                            {
                                sitting: e?.sittingimage2,
                                id: 2,
                                type: "image"
                            },
                            {
                                sitting: e?.sittingimage3,
                                id: 3,
                                type: "image"
                            },
                        ]
                    }

                    return (

                        <View key={i} style={{ padding: 10, marginTop: 20, borderRadius: 8, borderWidth: 1.5, borderColor: Colors.buttonColor }} >

                            <View style={{ flexDirection: "row", alignItems: "center" }} >

                                <Image source={{ uri: e.profile }} style={{ width: 60, height: 60, borderRadius: 50 }} />

                                <View style={{ marginLeft: 6 }} >
                                    <Text style={{ fontFamily: "Poppins-Medium", fontSize: 16, color: Colors.black, lineHeight: 20 }} >{e.fullName.length > 9 ? `${e.fullName.slice(0, 8)}...` : e.fullName}</Text>
                                    {/* <Image source={require("../../Images/star.png")} style={{ marginLeft: 5, marginTop: 5 }} /> */}
                                    <Text style={{ fontFamily: "Poppins-Regular", fontSize: 12, color: Colors.gray, lineHeight: 17, }} >{e.city}, {e?.country?.value}</Text>
                                </View>




                            </View>


                            {/* <ScrollView horizontal={true} style={{ flex: 1, marginTop: 10 }}> */}
                            <View style={{ flex: 1 }} >
                                <FlatList
                                    ref={ref}
                                    onMomentumScrollEnd={(e) => updateCurrentSlideIndex(e)}
                                    data={sittingImages}
                                    // contentContainerStyle={{ height: 350 }}
                                    showsHorizontalScrollIndicator={false}
                                    horizontal
                                    keyExtractor={(index) => index.id}
                                    pagingEnabled
                                    renderItem={({ item }) => <Slide key={i} currentIndex={currentIndex} item={item} index={i} handlePauseVideo={handlePauseVideo} pause={pause} />}
                                />
                                <View style={{ flexDirection: "row", justifyContent: "center", position: "relative", top: -30 }} >
                                    {sittingImages.map((_, index) => (
                                        <View
                                            key={index}
                                            style={[
                                                styles.indicator,
                                                {
                                                    backgroundColor:
                                                        currentSlideIndex == index
                                                            ? Colors.green
                                                            : Colors.gray,
                                                    width: 8,
                                                    height: 8,

                                                    borderRadius: 10,
                                                },
                                            ]}
                                        />
                                    ))}
                                </View>

                            </View>
                            {/* </ScrollView> */}


                            <View>
                                <Text style={{ fontFamily: "Poppins-Medium", justifyContent: "center", alignItems: "center", fontSize: 12, color: 'black', padding: 10 }}>
                                    {e?.seeMore ? e?.description : (e?.description?.length > 80 ? `${e?.description.slice(0, 80)}...` : e?.description)}
                                </Text>
                                {e?.description?.length > 80 && (
                                    <TouchableOpacity onPress={() => handleShowFullDescription(i)} style={{ padding: 10, paddingTop: 0 }} >
                                        <Text style={{ fontSize: 12, fontFamily: "Poppins-Medium", color: 'gray' }}>{e?.seeMore ? "Collapse" : "See more"}</Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 10 }} >

                                <View>

                                    <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 14, color: Colors.black }} >Sitting Charges</Text>


                                    <Text style={{ fontFamily: "Poppins-Bold", fontSize: 18, color: Colors.black }} >${e?.fare}</Text>


                                </View>


                                <TouchableOpacity onPress={() => !loading && (((Number(walletAmount) > Number(e?.fare)) && !bookingData?.scheduleDate) ? handleOpenPaymentCategoryModal(e) : handleSelectDriver(e))} style={{ width: 130, backgroundColor: Colors.buttonColor, borderRadius: 8, justifyContent: "center", alignItems: "center" }} >
                                    <Text style={{ fontSize: 14, color: Colors.white, fontFamily: "Poopins-Medium" }} >Book Now</Text>
                                </TouchableOpacity>

                            </View>


                        </View>


                        // <TouchableOpacity key={i} style={{ padding: 10, flexDirection: "row", justifyContent: "space-between", backgroundColor: "#e6e6e6", marginTop: 20, borderRadius: 10, alignItems: "center", paddingHorizontal: 10 }}  >
                        //     <View style={{ flexDirection: "row", alignItems: "center" }} >
                        //         <Image source={{ uri: e.profile }} style={{ width: 60, height: 60, borderRadius: 50 }} />

                        //         <View style={{ marginLeft: 5, justifyContent: "center" }} >
                        //             <View style={{ flexDirection: "row", alignItems: "center" }} >
                        //                 <Text style={{ fontFamily: "Poppins-Medium", fontSize: 16, color: Colors.black, height: 25 }} >{e.fullName.length > 9 ? `${e.fullName.slice(0, 8)}...` : e.fullName}</Text>
                        //                 <Image source={require("../../Images/star.png")} style={{ marginLeft: 5, marginTop: 5 }} />
                        //                 <Text style={{ fontFamily: "Poppins-Regular", fontSize: 14, color: Colors.black, height: 20, marginTop: 5, marginLeft: 3 }} >({e.rating})</Text>
                        //             </View>




                        //             {bookingData?.category == "driver" && <Text style={{ fontFamily: "Poppins-Medium", fontSize: 16, color: Colors.gray, height: 20 }} >{e.VehicleDetails?.vehicleName}</Text>}
                        //             <Text style={{ fontFamily: "Poppins-Medium", fontSize: 12, color: Colors.gray, height: 20, width: 140 }} numberOfLines={2} >{e.petExperience ? `${Number(e.petExperience)} year pet experience` : "No Pet Experience"} </Text>
                        //             {bookingData?.category == "driver" && <Text style={{ fontSize: 12, color: Colors.white, borderRadius: 30, backgroundColor: "#808080", textAlign: "center", marginTop: 5, padding: 0, width: 80, padding: 2 }} >{e.VehicleDetails?.vehicleNumPlate}</Text>}


                        //             {bookingData.type == "PetSitter" &&

                        //                 walletAmount && (walletAmount > Number(e?.fare)) && e?.fare ? <View style={{ width: "80%", flexDirection: "row", alignItems: "center", marginBottom: 5 }}>

                        //                 <TouchableOpacity onPress={() => selectDeductFromWallet(i)} style={{ width: 20, height: 20, borderWidth: 1, borderRadius: 5, borderColor: Colors.black, alignItems: "center", justifyContent: "center" }} >

                        //                     {e?.deductedFromWallet && <AntDesign name={"check"} size={15} color={Colors.black} />}

                        //                 </TouchableOpacity>
                        //                 <Text style={{ fontSize: 10, fontFamily: "Poppins-Medium", color: Colors.black, marginLeft: 10 }} >Deduct from wallet</Text>

                        //             </View> : ""
                        //             }

                        //             {(bookingData.type == "PetSitter" || bookingData.type == "PetWalk") &&
                        //                 <TouchableOpacity onPress={() => handleShowDescription(i)} style={{ width: 120, borderRadius: 1, borderRadius: 10, justifyContent: "center", padding: 2 }}  >
                        //                     <Text style={{ fontFamily: "Poppins-Medium", fontSize: 12, color: Colors.main, marginLeft: 3 }} >Show Description</Text>
                        //                 </TouchableOpacity>
                        //             }

                        //             {bookingData.type == "PetSitter" &&
                        //                 <TouchableOpacity onPress={() => handleShowImage(i)} style={{ borderWidth: 1, width: 80, borderRadius: 4, backgroundColor: Colors.buttonColor, justifyContent: "center", padding: 2 }}  >
                        //                     <Text style={{ fontFamily: "Poppins-Medium", fontSize: 14, color: Colors.white, textAlign: "center" }} >See Pics</Text>
                        //                 </TouchableOpacity>
                        //             }

                        //         </View>

                        //     </View>

                        //     <View style={{ alignItems: "flex-end" }} >
                        //         <Text style={{ fontFamily: "Poppins-SemiBold", color: Colors.black, fontSize: 22 }} >${e?.selectedCategory && Array.isArray(e?.selectedCategory) && e?.selectedCategory?.length && e?.selectedCategory.some(e => e == "sitter") && bookingData?.type == "PetSitter" ? e?.fare : Number(bookingData.fare).toFixed(2)}</Text>
                        //         <TouchableOpacity onPress={() => !loading && handleSelectDriver(e)} style={{ padding: 5, backgroundColor: Colors.buttonColor, borderRadius: 30, width: 100 }} >
                        //             <Text style={{ fontFamily: "Poppins-Regular", color: Colors.white, fontSize: 14, textAlign: "center" }} >Select</Text>
                        //         </TouchableOpacity>
                        //     </View>


                        //     {descriptionModal && e?.showDescription && ShowDescriptionModal(e, i)}


                        // </TouchableOpacity>
                    )


                })}



            </View>}

            {openPaymentCategoryModal && ShowLocationModal()}

        </ScrollView>

    </View>
}


export default SittersGallery


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
    indicator: {
        height: 2.5,
        width: 10,
        backgroundColor: Colors.gray,
        marginHorizontal: 3,
        borderRadius: 2,
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
    backgroundVideo: {
        position: 'absolute',
        left: 0,
        borderRadius: 10,
        // width: Dimensions.get('window').width,
        bottom: 0,
        right: 0,
        top: 0
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