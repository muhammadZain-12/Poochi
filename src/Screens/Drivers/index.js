import React, { useState, useContext, useEffect, useRef, useCallback } from "react"
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator, Dimensions, ToastAndroid, BackHandler, AppState, StyleSheet, Modal, TouchableWithoutFeedback } from "react-native"
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

function Drivers({ navigation }) {


    const bookingCont = useContext(BookingContext)
    const radiusCont = useContext(RadiusContext)



    const { bookingData, setBookingData } = bookingCont
    const { radius, setRadius } = radiusCont

    const [driverData, setDriverData] = useState([])
    const [selectedDriver, setSelectedDriver] = useState("")
    const [requestInProcess, setRequestInProcess] = useState(false)
    const [rejectDrivers, setRejectDrivers] = useState([])
    const [imageModal, setImageModal] = useState(false)
    const [descriptionModal, setDescriptionModal] = useState(false)
    const [walletAmount, setWalletAmount] = useState(0)
    const [deductedFromWallet, setDeductedFromWallet] = useState(false)






    const focus = useIsFocused()




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
                        (bookingData.type.toLowerCase() == "medicaltrip" && data?.selectedCategory && Array.isArray(data.selectedCategory) && data?.selectedCategory?.length > 0 && data?.selectedCategory?.some((e, i) => e == "driver")) ||
                        (bookingData.type.toLowerCase() == "pethotel" && data?.selectedCategory && Array.isArray(data.selectedCategory) && data?.selectedCategory?.length > 0 && data?.selectedCategory?.some((e, i) => e == "driver")) ||
                        (bookingData.type.toLowerCase() == "friendsandfamily" && data?.selectedCategory && Array.isArray(data.selectedCategory) && data?.selectedCategory?.length > 0 && data?.selectedCategory?.some((e, i) => e == "driver")) ||
                        (bookingData.type.toLowerCase() == "petgrooming" && data?.selectedCategory && Array.isArray(data.selectedCategory) && data?.selectedCategory?.length > 0 && data?.selectedCategory?.some((e, i) => e == "driver")) ||
                        (bookingData.type.toLowerCase() == "petwalk" && data?.selectedCategory && Array.isArray(data.selectedCategory) && data?.selectedCategory?.length > 0 && data?.selectedCategory?.some((e, i) => e == "walker")) ||
                        (bookingData.type.toLowerCase() == "petsitter" && data?.selectedCategory && Array.isArray(data.selectedCategory) && data?.selectedCategory?.length > 0 && data?.selectedCategory?.some((e, i) => e == "sitter"))
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



    useEffect(() => {

        getWalletAmount()

    }, [])


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

        let { selectedCategory } = driver

        let category = selectedCategory && selectedCategory.length > 0 && selectedCategory.filter((e, i) => {

            if (bookingData.type == "PetSitter") {
                return e == "sitter"
            }
            else if (bookingData.type == "PetWalk") {
                return e == "walker"
            } else {
                return e == "driver"
            }

        })



        category = category && category.length > 0 && category[0]


        let myDriver = {
            ...driver,
            selectedCategory: category,
            deductedFromWallet: driver?.deductedFromWallet ? true : false
        }



        let dataToSend;

        if (bookingData?.type == "PetSitter" && bookingData?.selectedOption?.name == "My Location") {

            driver.selectedCategory = "sitter"

            dataToSend = {

                driverData: myDriver,
                fare: driver?.fare,
                driverFare: driver?.driverFare,
                serviceCharge: driver?.serviceCharge,
                deductedFromWallet: driver?.deductedFromWallet ? true : false,
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
                deductedFromWallet: driver?.deductedFromWallet ? true : false,
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





    const [index, setIndex] = useState(0)


    const ShowLocationModal = useCallback((driver, ind) => {
        return (
            <View style={styles.centeredView}>
                <Modal animationType="slide" transparent={true} onRequestClose={() => handleShowImage(ind)} visible={imageModal}>
                    <TouchableWithoutFeedback style={{ flex: 1, borderWidth: 4, width: "100%", height: "100%", zIndex: 100 }} onPress={() => handleShowImage(ind)} >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Image style={{ width: "100%", height: 300, borderRadius: 20 }} resizeMode='cover' source={{ uri: index == 0 ? driver?.sittingimage1 : index == 1 ? driver?.sittingimage2 : driver?.sittingimage3 }} />
                            </View>

                            <View>


                                <CustomButton text={"Next"} styleContainer={{ width: 200 }} onPress={() => index == 2 ? setIndex(0) : setIndex(index + 1)} />

                            </View>

                        </View>




                    </TouchableWithoutFeedback>

                </Modal>
            </View>
        );
    }, [imageModal, index]);



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

                    let fare;
                    let driverFare;
                    let charges;

                    if (e.selectedCategory && Array.isArray(e?.selectedCategory) && e.selectedCategory?.length > 0 && e?.selectedCategory.some((e, i) => e == "sitter" && bookingData?.type == "PetSitter")) {


                        if (bookingData?.timeType.type.toLowerCase() == "hourly") {

                            let hours = bookingData?.duration / 60

                            let hourlyRate;

                            if (bookingData.selectedOption?.name == "My Location") {

                                hourlyRate = e?.hourlyChargeCustomerLocation

                            }
                            else if (bookingData.selectedOption?.name == "Sitter Location") {

                                hourlyRate = e?.hourlyChargeSitterLocation

                            }

                            let totalFare = (hours * hourlyRate) + bookingData?.petCharges
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

                        else if (bookingData?.timeType.type.toLowerCase() == "full day") {



                            let fullDayFare;


                            if (bookingData.selectedOption?.name == "My Location") {

                                fullDayFare = e?.dayChargeCustomerLocation

                            }
                            else if (bookingData.selectedOption?.name == "Sitter Location") {

                                fullDayFare = e?.dayChargeSitterLocation

                            }

                            let totalFare = Number(fullDayFare) + bookingData?.petCharges
                            fare = Number(totalFare).toFixed(2)

                            let serviceCharge = bookingData?.serviceCharge

                            let totalCharges = Number(totalFare) * serviceCharge / 100

                            let TotaldriverFare = totalFare - totalCharges

                            driverFare = Number(TotaldriverFare).toFixed(2)


                            charges = Number(totalCharges)

                        }

                    }
                    console.log(driverFare, "driverD")

                    console.log(fare, "fareeee")

                    if (e?.selectedCategory && Array.isArray(e?.selectedCategory) && e?.selectedCategory?.length > 0 && e?.selectedCategory.some((e, i) => e == "sitter" && bookingData?.type == "PetSitter")) {
                        e.fare = fare
                        e.driverFare = driverFare
                        e.serviceCharge = charges
                    }

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




                                    {bookingData?.category == "driver" && <Text style={{ fontFamily: "Poppins-Medium", fontSize: 16, color: Colors.gray, height: 20 }} >{e.VehicleDetails?.vehicleName}</Text>}
                                    <Text style={{ fontFamily: "Poppins-Medium", fontSize: 12, color: Colors.gray, height: 20, width: 140 }} numberOfLines={2} >{e.petExperience ? `${Number(e.petExperience)} year pet experience` : "No Pet Experience"} </Text>
                                    {bookingData?.category == "driver" && <Text style={{ fontSize: 12, color: Colors.white, borderRadius: 30, backgroundColor: "#808080", textAlign: "center", marginTop: 5, padding: 0, width: 80, padding: 2 }} >{e.VehicleDetails?.vehicleNumPlate}</Text>}


                                    {bookingData.type == "PetSitter" &&

                                        walletAmount && (walletAmount > Number(e?.fare)) && e?.fare ? <View style={{ width: "80%", flexDirection: "row", alignItems: "center", marginBottom: 5 }}>

                                        <TouchableOpacity onPress={() => selectDeductFromWallet(i)} style={{ width: 20, height: 20, borderWidth: 1, borderRadius: 5, borderColor: Colors.black, alignItems: "center", justifyContent: "center" }} >

                                            {e?.deductedFromWallet && <AntDesign name={"check"} size={15} color={Colors.black} />}

                                        </TouchableOpacity>
                                        <Text style={{ fontSize: 10, fontFamily: "Poppins-Medium", color: Colors.black, marginLeft: 10 }} >Deduct from wallet</Text>

                                    </View> : ""
                                    }

                                    {(bookingData.type == "PetSitter" || bookingData.type == "PetWalk") &&
                                        <TouchableOpacity onPress={() => handleShowDescription(i)} style={{ width: 120, borderRadius: 1, borderRadius: 10, justifyContent: "center", padding: 2 }}  >
                                            <Text style={{ fontFamily: "Poppins-Medium", fontSize: 12, color: Colors.main, marginLeft: 3 }} >Show Description</Text>
                                        </TouchableOpacity>
                                    }

                                    {bookingData.type == "PetSitter" &&
                                        <TouchableOpacity onPress={() => handleShowImage(i)} style={{ borderWidth: 1, width: 80, borderRadius: 4, backgroundColor: Colors.buttonColor, justifyContent: "center", padding: 2 }}  >
                                            <Text style={{ fontFamily: "Poppins-Medium", fontSize: 14, color: Colors.white, textAlign: "center" }} >See Pics</Text>
                                        </TouchableOpacity>
                                    }

                                </View>

                            </View>

                            <View style={{ alignItems: "flex-end" }} >
                                <Text style={{ fontFamily: "Poppins-SemiBold", color: Colors.black, fontSize: 22 }} >${e?.selectedCategory && Array.isArray(e?.selectedCategory) && e?.selectedCategory?.length && e?.selectedCategory.some(e => e == "sitter") && bookingData?.type == "PetSitter" ? e?.fare : Number(bookingData.fare).toFixed(2)}</Text>
                                <TouchableOpacity onPress={() => handleSelectDriver(e)} style={{ padding: 5, backgroundColor: Colors.buttonColor, borderRadius: 30, width: 100 }} >
                                    <Text style={{ fontFamily: "Poppins-Regular", color: Colors.white, fontSize: 14, textAlign: "center" }} >Select</Text>
                                </TouchableOpacity>
                            </View>

                            {imageModal && e?.showImage && ShowLocationModal(e, i)}
                            {descriptionModal && e?.showDescription && ShowDescriptionModal(e, i)}


                        </TouchableOpacity>
                    )


                })}



            </View>}

        </ScrollView>

    </View>
}


export default Drivers


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