import React, { useEffect, useState, useContext } from "react"
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View, FlatList, ToastAndroid, ActivityIndicator, BackHandler } from "react-native"
import Colors from "../../Constant/Color"
import CustomHeader from "../../Components/CustomHeader"
import Icons from 'react-native-vector-icons/Entypo';
import CustomButton from "../../Components/CustomButton";
import Navigation from "../Navigation";
import DropDownPicker from "react-native-dropdown-picker";
import SelectedPetContext from "../../Context/SelectedPetContext/context";
import LoginContext from "../../Context/loginContext/context";
import LocationContext from "../../Context/locationContext/context";
import { getPreciseDistance } from "geolib";
import AntDesign from "react-native-vector-icons/AntDesign"
import { firebase } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import cardDetailsContext from "../../Context/CardDetailsContext/context";
import BookingContext from "../../Context/bookingContext/context";
import ChooseLocationContext from "../../Context/pickupanddropoffContext/context";
import auth from "@react-native-firebase/auth";
import IonIcons from "react-native-vector-icons/Ionicons"
import ScheduleRideContext from "../../Context/ScheduleRideContext/context";
import axios from "axios";
import RadiusContext from "../../Context/RadiusContext/context";


function PetGrooming({ navigation, route }) {



    const loginCont = useContext(LoginContext)
    const locationCont = useContext(LocationContext)

    const { loginData, setLoginData } = loginCont
    const { locationData, setLocationData } = locationCont


    const bookingCont = useContext(BookingContext)

    const { bookingData, setBookingData } = bookingCont

    const selectedPetsCont = useContext(SelectedPetContext)
    const { selectedPets, setSelectedPets } = selectedPetsCont


    const cardCont = useContext(cardDetailsContext)
    const { cardDetails, setCardDetails } = cardCont



    const chooseLocationCont = useContext(ChooseLocationContext)

    const { pickup, setPickup, pickupAddress, setPickupAddress, dropoff, setDropoff, dropoffAddress, setDropoffAddress, returnPickup, setReturnPickup
        , returnPickupAddress, setReturnPickupAddress, returnDropoff, setReturnDropoff, returnDropoffAddress, setReturnDropoffAddress } = chooseLocationCont

    let radiusCont = useContext(RadiusContext)
    const { scheduleRideRadius, setScheduleRideRadius } = radiusCont


    const scheduleRideCont = useContext(ScheduleRideContext)
    const { scheduleData, setScheduleData } = scheduleRideCont



    const [oneWay, setOneWay] = useState(true)
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [customWaitingTime, setCustomWaitingTime] = useState(null)
    const [items, setItems] = useState([
        { label: '30 min', value: 30 },
        { label: '60 min', value: 60 },
        { label: '90 min', value: 90 },
        { label: '120 min', value: 120 },
        { label: 'Custom', value: 'custom' },
    ]);

    let data = route.params

    const [date, setDate] = useState("")
    const [time, setTime] = useState("")

    const [minutes, setMinutes] = useState("")

    const [distance, setDistance] = useState("")
    const [fare, setFare] = useState(null)
    const [comment, setComment] = useState("")
    const [loading, setLoading] = useState(false)
    const [walletAmount, setWalletAmount] = useState(0)
    const [deductedFromWallet, setDeductedFromWallet] = useState(false)
    const [pickupToDropoffDistance, setPickupToDropoffDistance] = useState(null)
    const [dropoffToPickupDistance, setDropoffToPickupDistance] = useState(null)
    const [pickupToDropoffMinutes, setPickupToDropoffMinutes] = useState(null)
    const [dropoffToPickupMinutes, setDropoffToPickupMinutes] = useState(null)
    const [serviceCharge, setServiceCharge] = useState(null)





    const getWalletAmount = () => {


        firestore().collection("UserWallet").doc(loginData.id).get().then((doc) => {

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

    useEffect(() => {

        if (!pickupAddress) {


            let pickCords = {
                lat: locationData?.currentLocation?.latitude,
                lng: locationData?.currentLocation?.longitude
            }

            setPickup(pickCords)
            setPickupAddress(locationData?.currentAddress)

        }

    }, [])


    const getPets = async () => {

        let id = auth().currentUser?.uid

        firestore().collection("Pets").doc(id).get().then((doc) => {
            let userPets = doc?.data()

            console.log(userPets, "userPets")


            if (userPets?.pets) {

                if (userPets?.pets?.length == 1) {

                    setSelectedPets(userPets.pets)

                }

            }


        })

    }


    useEffect(() => {
        getWalletAmount()
        getPets()
    }, [])


    useEffect(() => {

        if (data?.date) {
            setDate(data?.date)
            setTime(data?.time)
        }

        if (data?.type == "pickup") {
            setPickup({
                lat: data.lat,
                lng: data.lng
            })
            setPickupAddress(data.name)

        }


        if (data?.type == "dropoff") {
            setDropoff({
                lat: data.lat,
                lng: data.lng
            })
            setDropoffAddress(data.name)

            setReturnPickup({
                lat: data.lat,
                lng: data.lng
            })
            setReturnPickupAddress(data.name)

        }

        if (data?.type == "returnPick") {
            setReturnPickup({
                lat: data.lat,
                lng: data.lng
            })
            setReturnPickupAddress(data.name)
        }

        if (data?.type == "returnDrop") {
            setReturnDropoff({
                lat: data.lat,
                lng: data.lng
            })
            setReturnDropoffAddress(data.name)
        }





    }, [data])




    const handleCalculateDistanceAndFare = () => {


        const dis = getPreciseDistance(
            {
                latitude: pickup.lat,
                longitude: pickup.lng,
            },
            {
                latitude: dropoff.lat,
                longitude: dropoff.lng,
            },
        );

        mileDistance = (dis / 1609.34)?.toFixed(2);


        let averageMilePetMinutes = 0.40

        setDistance(mileDistance)

        let totalMinutes = Math.ceil(mileDistance / averageMilePetMinutes)

        setMinutes(totalMinutes)


        firestore().collection("fareCharges").doc("qweasdzxcfgrw").get().then((doc) => {

            let data = doc.data()

            let mileCharge = Number(data.mileCharge)
            let serviceCharge = Number(data.serviceCharge)
            let creditCardCharge = Number(data.creditCardCharge)

            let additionalPetCharge;

            if (selectedPets && selectedPets.length > 1) {
                additionalPetCharge = data?.additionalPetCharge
                additionalPetCharge = Number(additionalPetCharge) * (selectedPets.length - 1)
            }


            let fare = mileCharge * Number(mileDistance)

            let baseCharge = data?.BaseCharge



            fare = Number(fare) + Number(baseCharge) + (additionalPetCharge ? additionalPetCharge : 0)



            // fare = Number(fare)


            setFare(fare.toFixed(2))
            setServiceCharge(serviceCharge)

        }).catch((error) => {

            ToastAndroid.show(error.message, ToastAndroid.SHORT)


        })


    }


    const handleCalculateTwoWayDistanceAndFare = () => {


        const pickupToDropoffDis = getPreciseDistance(
            {
                latitude: pickup.lat,
                longitude: pickup.lng,
            },
            {
                latitude: dropoff.lat,
                longitude: dropoff.lng,
            },
        );

        const dropoffToReturnPickupDis = getPreciseDistance(
            {
                latitude: dropoff.lat,
                longitude: dropoff.lng,
            },
            {
                latitude: returnPickup.lat,
                longitude: returnPickup.lng,
            },
        );




        const returnPickupToReturnDropoffDis = getPreciseDistance(
            {
                latitude: returnPickup.lat,
                longitude: returnPickup.lng,
            },
            {
                latitude: returnDropoff.lat,
                longitude: returnDropoff.lng,
            },
        );


        let totalDis = pickupToDropoffDis + dropoffToReturnPickupDis + returnPickupToReturnDropoffDis


        let pickupToDropoffMileDistance = (pickupToDropoffDis / 1609.34)?.toFixed(2);

        setPickupToDropoffDistance(pickupToDropoffMileDistance)





        let dropoffToPickupMileDistance = (returnPickupToReturnDropoffDis / 1609.34)?.toFixed(2);

        setDropoffToPickupDistance(dropoffToPickupMileDistance)


        let mileDistance = (totalDis / 1609.34)?.toFixed(2);

        let averageMilePetMinutes = 0.40



        setDistance(mileDistance)


        let totalMinutes = Math.ceil(mileDistance / averageMilePetMinutes)

        let pickupToDropffMin = Math.ceil(pickupToDropoffMileDistance / averageMilePetMinutes)


        let dropoffToPickupMin = Math.ceil(dropoffToPickupMileDistance / averageMilePetMinutes)


        setMinutes(totalMinutes)
        setDropoffToPickupMinutes(dropoffToPickupMin)
        setPickupToDropoffMinutes(pickupToDropffMin)

        firestore().collection("fareCharges").doc("qweasdzxcfgrw").get().then((doc) => {

            let data = doc.data()

            let mileCharge = Number(data.mileCharge)
            let serviceCharge = Number(data.serviceCharge)
            let creditCardCharge = Number(data.creditCardCharge)
            let waitingCharges = Number(data?.waitingCharges)
            let baseCharge = Number(data?.BaseCharge)


            let additionalPetCharge;
            let totalWaitingCharges = 0

            if (value !== "custom") {
                totalWaitingCharges = waitingCharges * Number(value)
            }

            else if (customWaitingTime) {
                totalWaitingCharges = waitingCharges * Number(customWaitingTime)
            }

            if (selectedPets && selectedPets.length > 1) {
                additionalPetCharge = data?.additionalPetCharge

                additionalPetCharge = Number(additionalPetCharge) * (selectedPets.length - 1)
            }


            let fare = mileCharge * Number(mileDistance)
            fare = fare + Number(baseCharge) + (additionalPetCharge ? additionalPetCharge : 0)


            fare = fare + totalWaitingCharges
            setFare(fare.toFixed(2))
            setServiceCharge(serviceCharge)

        }).catch((error) => {

            ToastAndroid.show(error.message, ToastAndroid.SHORT)


        })



    }

    useEffect(() => {



        if (Object.keys(pickup).length > 0 && Object.keys(dropoff).length > 0 && oneWay) {


            handleCalculateDistanceAndFare()

            return
        }

        if (Object.keys(pickup).length > 0 && Object.keys(dropoff).length > 0 && Object.keys(returnPickup).length > 0 && Object.keys(returnDropoff).length > 0 && !oneWay && (value || customWaitingTime)) {

            handleCalculateTwoWayDistanceAndFare()


        }




    }, [pickup, dropoff, returnPickup, returnDropoff, value, customWaitingTime, oneWay, selectedPets.length])



    const removeSelectedPet = (ind) => {

        setSelectedPets(selectedPets && selectedPets.length > 0 && selectedPets.filter((e, i) => {

            return i !== ind

        }))


    }





    const renderSelectedPets = ({ item }, index) => {



        return <View style={{ justifyContent: "center", alignItems: "center", marginRight: 10 }} >

            <Image source={{ uri: item.image1 }} style={{ width: 120, height: 120, borderRadius: 10 }} />
            <TouchableOpacity style={{ position: "absolute", top: 5, right: 5 }} onPress={() => removeSelectedPet(index)} >
                <AntDesign name="close" color={Colors.buttonColor} size={20} />
            </TouchableOpacity>
            <Text style={{ color: Colors.black, fontFamily: "Poppins-Medium", fontSize: 16 }} >{item.petName}</Text>
            <Text style={{ color: Colors.gray, fontFamily: "Poppins-Medium", fontSize: 12 }} >{item.breed}</Text>
        </View>

    }

    function generateRandomID(length) {
        const characters =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomID = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomID += characters.charAt(randomIndex);
        }

        return randomID;
    }





    const handleFindDriver = async () => {


        if (!oneWay) {

            if (!pickupAddress) {
                ToastAndroid.show("Kindly Enter Pick up Point", ToastAndroid.SHORT)
                return
            }

            if (!dropoffAddress) {
                ToastAndroid.show("kindly enter drop off point", ToastAndroid.SHORT)
                return
            }

            if (!returnPickupAddress) {
                ToastAndroid.show("Kindly enter return pick up point", ToastAndroid.SHORT)
                return
            }

            if (!returnDropoffAddress) {
                ToastAndroid.show("Kindly enter return drop off point", ToastAndroid.SHORT)
                return
            }

            if (!value || (value == "custom" && !customWaitingTime) || customWaitingTime == 0) {

                ToastAndroid.show("Kindly enter waiting Time", ToastAndroid.SHORT)
                return

            }

            if (selectedPets.length == 0) {
                ToastAndroid.show("Kindly select pet", ToastAndroid.SHORT)
                return
            }

            if (!cardDetails && !deductedFromWallet) {
                ToastAndroid.show("Kindly Enter Payment Details", ToastAndroid.SHORT)
                return
            }

            let serviceCharges = (Number(fare) * Number(serviceCharge)) / 100
            let driverFare = Number(fare) - Number(serviceCharges)
            driverFare = Number(driverFare).toFixed(2)


            if (date && time) {




                let bookingId = await generateRandomID(15)



                let dataToSend = {
                    pickupAddress: pickupAddress,
                    bookingId: bookingId,
                    dropoffAddress: dropoffAddress,
                    returnPickupAddress: returnPickupAddress,
                    returnDropoffAddress: returnDropoffAddress,
                    pickupCords: pickup,
                    dropoffCoords: dropoff,
                    returnPickupCords: returnPickup,
                    returnDropoffCords: returnDropoff,
                    scheduleDate: date,
                    scheduleTime: time,
                    selectedPets: selectedPets,
                    comment: comment,
                    driverFare: Number(driverFare).toFixed(2),
                    cardDetails: cardDetails,
                    userData: loginData,
                    fare: Number(fare).toFixed(2),
                    serviceCharge: serviceCharges,
                    distance: distance,
                    pickupToDropDis: pickupToDropoffDistance,
                    dropoffToPickupDis: dropoffToPickupDistance,
                    minutes: minutes,
                    pickupToDropoffMinutes: pickupToDropoffMinutes,
                    dropoffToPickupMinutes: dropoffToPickupMinutes,
                    waitingTime: customWaitingTime ? customWaitingTime : value,
                    bookingType: "twoWay",
                    requestDate: new Date(),
                    type: "PetGrooming",
                    deductedFromWallet: deductedFromWallet,
                    getDriverStatus: "pending",
                    ScheduleRidestatus: "pending"
                }



                let checkRideTime = scheduleData && scheduleData.length > 0 && scheduleData.some((e, i) => {

                    const scheduledDateTime = new Date(
                        date.getFullYear(),
                        date.getMonth(),
                        date.getDate(),
                        time.getHours(),
                        time.getMinutes(),
                        time.getSeconds()
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

                    ToastAndroid.show("You have already schedule ride within this time slot", ToastAndroid.SHORT)
                    return
                }


                setLoading(true)





                const drivers = [];
                const tokens = [];

                const driversSnapshot = await firestore().collection('Drivers').get();
                const scheduleRidesPromises = [];

                driversSnapshot.forEach((doc) => {
                    const data = doc?.data();

                    if (data?.currentLocation?.latitude && data?.currentLocation?.longitude && data?.status == "approved") {
                        const dis = getPreciseDistance(
                            {
                                latitude: pickup.lat,
                                longitude: pickup.lng,
                            },
                            {
                                latitude: data?.currentLocation?.latitude,
                                longitude: data?.currentLocation?.longitude,
                            }
                        );

                        const mileDistance = (dis / 1609.34)?.toFixed(2);

                        if (mileDistance <= scheduleRideRadius) {
                            const driverId = data.id;
                            const driverToken = data.token;

                            scheduleRidesPromises.push(
                                firestore().collection('ScheduleRides').get().then((scheduleSnapshot) => {
                                    let hasConflictingRide = false;

                                    scheduleSnapshot.forEach((scheduleDoc) => {
                                        const scheduleData = scheduleDoc?.data();
                                        const scheduledRides = scheduleData?.scheduleRides;

                                        if (scheduledRides) {
                                            scheduledRides.forEach((ride) => {
                                                const scheduledDateTime = new Date(
                                                    date.getFullYear(),
                                                    date.getMonth(),
                                                    date.getDate(),
                                                    time.getHours(),
                                                    time.getMinutes(),
                                                    time.getSeconds()
                                                );

                                                if (
                                                    ride?.driverData?.id === driverId &&
                                                    ride?.getDriverStatus === 'accepted'
                                                ) {
                                                    const previousDate = ride.scheduleDate.toDate();
                                                    const previousTime = ride.scheduleTime.toDate();
                                                    const previousDateTime = new Date(
                                                        previousDate.getFullYear(),
                                                        previousDate.getMonth(),
                                                        previousDate.getDate(),
                                                        previousTime.getHours(),
                                                        previousTime.getMinutes(),
                                                        previousTime.getSeconds()
                                                    );

                                                    const previousDateGet = previousDateTime.getTime();
                                                    const selectedDateGet = scheduledDateTime.getTime();
                                                    const diff = selectedDateGet - previousDateGet;
                                                    const diffHour = diff / 1000 / 60 / 60;

                                                    if (diffHour < 3 && diffHour > -3) {
                                                        hasConflictingRide = true;
                                                    }
                                                }
                                            });
                                        }
                                    });

                                    if (!hasConflictingRide) {
                                        tokens.push(driverToken);
                                        drivers.push(data);
                                    }
                                })
                            );
                        }
                    }
                });

                await Promise.all(scheduleRidesPromises);





                dataToSend.drivers = drivers



                firestore().collection("ScheduleRides").doc(loginData.id).set(
                    { scheduleRides: firestore.FieldValue.arrayUnion(dataToSend) }, { merge: true }
                ).then(async (res) => {

                    var data = JSON.stringify({
                        notification: {
                            body: "You have got Scheduled Ride request kindly respond back",
                            title: `Scheduled Ride Request`,
                            sound : "default"
                        },
                        android: {
                            priority: "high",
                        },
                        registration_ids: tokens,
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


                            let promises = drivers && drivers.length > 0 && drivers.map((e, i) => {

                                let id = e?.id

                                let dataToSend = {
                                    title: "Scheduled Ride Request",
                                    body: 'You have got Scheduled Ride request kindly respond back',
                                    date: new Date()
                                }

                                firestore().collection("DriverNotification").doc(id).set({
                                    notification: firestore.FieldValue.arrayUnion(dataToSend)
                                }, { merge: true })

                            })

                            await Promise.all(promises)

                            setScheduleData([
                                ...scheduleData,
                                dataToSend
                            ])
                            setLoading(false)
                            ToastAndroid.show("Your ride has been succesfully scheduled", ToastAndroid.LONG)
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


                return;
            }


            let dataToSend = {
                pickupAddress: pickupAddress,
                dropoffAddress: dropoffAddress,
                returnPickupAddress: returnPickupAddress,
                returnDropoffAddress: returnDropoffAddress,
                pickupCords: pickup,
                dropoffCoords: dropoff,
                returnPickupCords: returnPickup,
                returnDropoffCords: returnDropoff,
                selectedPets: selectedPets,
                comment: comment,
                driverFare: Number(driverFare).toFixed(2),
                cardDetails: cardDetails,
                userData: loginData,
                fare: Number(fare).toFixed(2),
                serviceCharge: serviceCharges,
                distance: distance,
                pickupToDropDis: pickupToDropoffDistance,
                dropoffToPickupDis: dropoffToPickupDistance,
                minutes: minutes,
                pickupToDropoffMinutes: pickupToDropoffMinutes,
                dropoffToPickupMinutes: dropoffToPickupMinutes,
                waitingTime: customWaitingTime ? customWaitingTime : value,
                bookingType: "twoWay",
                requestDate: new Date(),
                type: "PetGrooming",
                deductedFromWallet: deductedFromWallet
            }

            setLoading(true)

            firestore().collection("Request").doc(loginData.id).set(dataToSend).then((res) => {
                setLoading(false)
                setBookingData(dataToSend)
                navigation.navigate("Drivers")

            }).catch((error) => {
                setLoading(false)
                ToastAndroid.show(error.message, ToastAndroid, SHORT)
            })


        }





        if (oneWay) {

            if (!pickupAddress) {
                ToastAndroid.show("Kindly Enter Pick up Point", ToastAndroid.SHORT)
                return
            }

            if (!dropoffAddress) {
                ToastAndroid.show("kindly enter drop off point", ToastAndroid.SHORT)
                return
            }

            if (selectedPets.length == 0) {
                ToastAndroid.show("Kindly select pet", ToastAndroid.SHORT)
                return
            }

            if (!cardDetails && !deductedFromWallet) {
                ToastAndroid.show("Kindly Enter Payment Details", ToastAndroid.SHORT)
                return
            }

            let serviceCharges = (Number(fare) * Number(serviceCharge)) / 100
            let driverFare = Number(fare) - Number(serviceCharges).toFixed(2)

            driverFare = Number(driverFare).toFixed(2)

            if (date && time) {


                let bookingId = await generateRandomID(15)


                let dataToSend = {
                    pickupAddress: pickupAddress,
                    bookingId: bookingId,
                    dropoffAddress: dropoffAddress,
                    pickupCords: pickup,
                    dropoffCoords: dropoff,
                    selectedPets: selectedPets,
                    comment: comment,
                    cardDetails: cardDetails,
                    userData: loginData,
                    fare: Number(fare).toFixed(2),
                    serviceCharge: serviceCharges,
                    scheduleDate: date,
                    scheduleTime: time,
                    driverFare: Number(driverFare).toFixed(2),
                    distance: distance,
                    minutes: minutes,
                    bookingType: "oneWay",
                    requestDate: new Date(),
                    type: "PetGrooming",
                    deductedFromWallet: deductedFromWallet,
                    getDriverStatus: "pending",
                    ScheduleRidestatus: "pending"
                }


                let checkRideTime = scheduleData && scheduleData.length > 0 && scheduleData.some((e, i) => {

                    const scheduledDateTime = new Date(
                        date.getFullYear(),
                        date.getMonth(),
                        date.getDate(),
                        time.getHours(),
                        time.getMinutes(),
                        time.getSeconds()
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

                    ToastAndroid.show("You have already schedule ride within this time slot", ToastAndroid.SHORT)
                    return
                }


                setLoading(true)



                const drivers = [];
                const tokens = [];

                const driversSnapshot = await firestore().collection('Drivers').get();
                const scheduleRidesPromises = [];

                driversSnapshot.forEach((doc) => {
                    const data = doc?.data();

                    if (data?.currentLocation?.latitude && data?.currentLocation?.longitude && data?.status == "approved") {
                        const dis = getPreciseDistance(
                            {
                                latitude: pickup.lat,
                                longitude: pickup.lng,
                            },
                            {
                                latitude: data?.currentLocation?.latitude,
                                longitude: data?.currentLocation?.longitude,
                            }
                        );

                        const mileDistance = (dis / 1609.34)?.toFixed(2);

                        if (mileDistance <= scheduleRideRadius) {
                            const driverId = data.id;
                            const driverToken = data.token;

                            scheduleRidesPromises.push(
                                firestore().collection('ScheduleRides').get().then((scheduleSnapshot) => {
                                    let hasConflictingRide = false;

                                    scheduleSnapshot.forEach((scheduleDoc) => {
                                        const scheduleData = scheduleDoc?.data();
                                        const scheduledRides = scheduleData?.scheduleRides;

                                        if (scheduledRides) {
                                            scheduledRides.forEach((ride) => {
                                                const scheduledDateTime = new Date(
                                                    date.getFullYear(),
                                                    date.getMonth(),
                                                    date.getDate(),
                                                    time.getHours(),
                                                    time.getMinutes(),
                                                    time.getSeconds()
                                                );

                                                if (
                                                    ride?.driverData?.id === driverId &&
                                                    ride?.getDriverStatus === 'accepted'
                                                ) {
                                                    const previousDate = ride.scheduleDate.toDate();
                                                    const previousTime = ride.scheduleTime.toDate();
                                                    const previousDateTime = new Date(
                                                        previousDate.getFullYear(),
                                                        previousDate.getMonth(),
                                                        previousDate.getDate(),
                                                        previousTime.getHours(),
                                                        previousTime.getMinutes(),
                                                        previousTime.getSeconds()
                                                    );

                                                    const previousDateGet = previousDateTime.getTime();
                                                    const selectedDateGet = scheduledDateTime.getTime();
                                                    const diff = selectedDateGet - previousDateGet;
                                                    const diffHour = diff / 1000 / 60 / 60;

                                                    if (diffHour < 3 && diffHour > -3) {
                                                        hasConflictingRide = true;
                                                    }
                                                }
                                            });
                                        }
                                    });

                                    if (!hasConflictingRide) {
                                        tokens.push(driverToken);
                                        drivers.push(data);
                                    }
                                })
                            );
                        }
                    }
                });

                await Promise.all(scheduleRidesPromises);


                dataToSend.drivers = drivers

                firestore().collection("ScheduleRides").doc(loginData.id).set(
                    { scheduleRides: firestore.FieldValue.arrayUnion(dataToSend) }, { merge: true }
                ).then(async (res) => {

                    var data = JSON.stringify({
                        notification: {
                            body: "You have got Scheduled Ride request kindly respond back",
                            title: `Scheduled Ride Request`,
                            sound : "default"
                        },
                        android: {
                            priority: "high",
                        },
                        registration_ids: tokens,
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

                            // let notification = JSON.parse(data)

                            // let notificationToSend = {
                            //     title: notification.notification.title,
                            //     body: notification.notification.body,
                            //     date: new Date()
                            // }

                            // firestore().collection("DriverNotification").doc(driver.id).set({
                            //     notification: firestore.FieldValue.arrayUnion(notificationToSend)
                            // }, { merge: true }).then((res) => {



                            let promises = drivers && drivers.length > 0 && drivers.map((e, i) => {

                                let id = e?.id

                                let dataToSend = {
                                    title: "Scheduled Ride Request",
                                    body: 'You have got Scheduled Ride request kindly respond back',
                                    date: new Date()
                                }

                                firestore().collection("DriverNotification").doc(id).set({
                                    notification: firestore.FieldValue.arrayUnion(dataToSend)
                                }, { merge: true })

                            })

                            await Promise.all(promises)

                            setScheduleData([
                                ...scheduleData,
                                dataToSend
                            ])
                            setLoading(false)
                            ToastAndroid.show("Your ride has been succesfully scheduled", ToastAndroid.LONG)
                            navigation.replace("Tab", {
                                screen: "Home"
                            })

                        })
                        // .catch((error) => {

                        //     setLoading(false)
                        //     console.log(error,"error")

                        // })

                        // })
                        .catch(error => {
                            setLoading(false)
                            console.log(error, "error")
                        });

                }).catch((error) => {
                    setLoading(false)
                    console.log(error)
                })
                return;
            }

            let dataToSend = {
                pickupAddress: pickupAddress,
                dropoffAddress: dropoffAddress,
                pickupCords: pickup,
                dropoffCoords: dropoff,
                selectedPets: selectedPets,
                comment: comment,
                cardDetails: cardDetails,
                userData: loginData,
                fare: Number(fare).toFixed(2),
                serviceCharge: serviceCharges,
                driverFare: Number(driverFare).toFixed(2),
                distance: distance,
                minutes: minutes,
                bookingType: "oneWay",
                requestDate: new Date(),
                type: "PetGrooming",
                deductedFromWallet: deductedFromWallet,

            }

            setLoading(true)





            firestore().collection("Request").doc(loginData.id).set(dataToSend).then((res) => {
                setLoading(false)
                setBookingData(dataToSend)
                navigation.navigate("Drivers")

            }).catch((error) => {
                setLoading(false)
                ToastAndroid.show(error.message, ToastAndroid, SHORT)
            })

        }


    }



    const handleNavigateToPayment = () => {


        if (!pickupAddress || !dropoffAddress) {
            ToastAndroid.show("First add pick up and drop off location", ToastAndroid.SHORT)
            return
        }

        let dataToSend = {

            amount: fare,
            type: "PetGrooming"

        }


        navigation.navigate("PaymentMethod", dataToSend)


    }


    useEffect(() => {
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

            <View style={{ marginTop: 5 }} >
                <CustomHeader

                    text={"Pet Grooming"}
                    iconname={"arrow-back-outline"}
                    color={Colors.black}
                    onPress={() => navigation.reset({
                        index: 0,
                        routes: [
                            {
                                name: 'Tab',

                            },
                        ],
                    })}


                />

            </View>
            <ScrollView>


                <View style={{ paddingHorizontal: 15, marginTop: 20 }} >



                    <View style={{ backgroundColor: "#21263D", borderRadius: 10, width: "100%", padding: 10 }} >
                        <View style={{ marginTop: 5 }} >
                            <Text style={{ fontSize: 16, color: Colors.white, fontFamily: "Poppins-Medium" }} >Choose Pick Up Point</Text>
                            <TouchableOpacity onPress={() => navigation.navigate("GooglePlace", { name: 'Pick up Location', route: "PetGrooming" })} style={{ padding: 12, backgroundColor: "white", borderRadius: 5, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }} >

                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }} >

                                    <IonIcons name="location-outline" color={Colors.gray} size={25} />



                                    <Text style={{ color: pickupAddress ? Colors.black : Colors.gray, fontFamily: "Poppins-Medium", fontSize: 12, marginLeft: 10, width: "80%" }} >{pickupAddress ? pickupAddress : "Enter Pick up"}</Text>

                                </View>

                                <View style={{ width: "10%" }} >
                                    <IonIcons name="search" color={Colors.gray} size={25} />
                                </View>



                            </TouchableOpacity>

                        </View>
                        <View style={{ marginTop: 10, marginBottom: 10 }} >
                            <Text style={{ fontSize: 16, color: Colors.white, fontFamily: "Poppins-Medium" }} >Choose Drop off Point</Text>
                            <TouchableOpacity onPress={() => navigation.navigate("GooglePlace", { name: 'Drop off Location', route: "PetGrooming" })} style={{ padding: 12, backgroundColor: "white", borderRadius: 5, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }} >

                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }} >

                                    <IonIcons name="location-outline" color={Colors.gray} size={25} />

                                    <Text style={{ color: dropoffAddress ? Colors.black : Colors.gray, fontFamily: "Poppins-Medium", fontSize: 12, marginLeft: 10, width: "80%" }} >{dropoffAddress ? dropoffAddress : "Enter Destination"}</Text>

                                </View>

                                <View style={{ width: "10%" }} >
                                    <IonIcons name="search" color={Colors.gray} size={25} />
                                </View>



                            </TouchableOpacity>

                        </View>

                    </View>


                    <Text style={{ fontSize: 17, color: Colors.black, fontFamily: "Poppins-SemiBold", marginTop: 10 }} >Select Your Pet</Text>


                    <Text style={{ fontSize: 14, color: Colors.black, fontFamily: "Poppins-SemiBold", marginTop: 10 }} >additional $7 for extra pet</Text>


                    {selectedPets && selectedPets.length > 0 ? <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ flexDirection: "row", width: "100%" }} >


                        {selectedPets.map((e, i) => {

                            return (

                                renderSelectedPets({ item: e }, i)

                            )

                        })}

                        {/* <FlatList
                            data={selectedPets}
                            renderItem={renderSelectedPets}
                            scrollEnabled={true}
                            horizontal={true}
                        /> */}


                        <TouchableOpacity onPress={() => navigation.navigate("PetSelect", "PetGrooming")} style={{ width: 120, height: 120, backgroundColor: "#e6e6e6", borderRadius: 10, justifyContent: "center", alignItems: "center" }} >

                            <IonIcons name="add" color={Colors.gray} size={40} />

                        </TouchableOpacity>



                    </ScrollView> :
                        <View style={{ marginTop: 10, flexDirection: "row", alignItems: "center", flexWrap: "wrap" }} >

                            <TouchableOpacity onPress={() => navigation.navigate("PetSelect", "PetGrooming")} style={{ width: 120, height: 120, backgroundColor: "#e6e6e6", borderRadius: 10, justifyContent: "center", alignItems: "center" }} >

                                <IonIcons name="add" color={Colors.gray} size={40} />

                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate("PetSelect", "PetGrooming")} style={{ width: 120, height: 120, backgroundColor: "#e6e6e6", borderRadius: 10, marginLeft: 20, justifyContent: "center", alignItems: "center" }} >
                                <IonIcons name="add" color={Colors.gray} size={40} />

                            </TouchableOpacity>

                        </View>

                    }




                    <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 20, backgroundColor: "#e6e6e6", borderTopRightRadius: 30, borderBottomRightRadius: 30, borderTopLeftRadius: 30, borderBottomLeftRadius: 30 }} >

                        <TouchableOpacity onPress={() => setOneWay(true)} style={{ padding: 10, borderRadius: oneWay ? 30 : 0, backgroundColor: oneWay ? Colors.buttonColor : "#e6e6e6", width: "50%", borderTopLeftRadius: oneWay ? 30 : 30, borderBottomLeftRadius: oneWay ? 30 : 30 }} >
                            <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Medium", textAlign: "center" }} >One Way</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setOneWay(false)} style={{ padding: 10, borderRadius: !oneWay ? 30 : 0, backgroundColor: !oneWay ? Colors.buttonColor : "#e6e6e6", width: "50%", borderTopRightRadius: oneWay ? 30 : 30, borderBottomRightRadius: oneWay ? 30 : 30 }} >
                            <Text style={{ color: !oneWay ? Colors.white : Colors.gray, fontSize: 18, fontFamily: "Poppins-Medium", textAlign: "center" }} >Round Trip</Text>
                        </TouchableOpacity>
                    </View>

                    {!oneWay && <View style={{ backgroundColor: "#21263D", borderRadius: 10, width: "100%", padding: 10, marginTop: 20, marginBottom: 10 }} >
                        <View style={{ marginTop: 5 }} >
                            <Text style={{ fontSize: 16, color: Colors.white, fontFamily: "Poppins-Medium" }} >Choose Pick Up Point</Text>
                            <TouchableOpacity style={{ padding: 12, backgroundColor: "white", borderRadius: 5, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }} >

                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }} >

                                    <IonIcons name="location-outline" color={Colors.gray} size={25} />

                                    <Text style={{ color: returnPickupAddress ? Colors.black : Colors.gray, fontFamily: "Poppins-Medium", fontSize: 12, marginLeft: 10, width: "80%" }} >{returnPickupAddress ? returnPickupAddress : "Enter Return Pick up"}</Text>

                                </View>

                                <View style={{ width: "10%" }} >
                                    <IonIcons name="search" color={Colors.gray} size={25} />
                                </View>



                            </TouchableOpacity>

                        </View>


                        <View style={{ marginTop: 10, marginBottom: 10 }} >
                            <Text style={{ fontSize: 16, color: Colors.white, fontFamily: "Poppins-Medium" }} >Choose Drop off Point</Text>
                            <TouchableOpacity onPress={() => navigation.navigate("GooglePlace", { name: 'Return Drop off', route: "PetGrooming" })} style={{ padding: 12, backgroundColor: "white", borderRadius: 5, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }} >
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }} >
                                    <IonIcons name="location-outline" color={Colors.gray} size={25} />
                                    <Text style={{ color: returnDropoffAddress ? Colors.black : Colors.gray, fontFamily: "Poppins-Medium", fontSize: 12, marginLeft: 10, width: "80%" }} >{returnDropoffAddress ? returnDropoffAddress : "Enter Return Drop off"}</Text>
                                </View>
                                <View style={{ width: "10%" }} >
                                    <IonIcons name="search" color={Colors.gray} size={25} />
                                </View>


                            </TouchableOpacity>

                        </View>

                    </View>}

                    <TouchableOpacity onPress={() => navigation.navigate("ScheduleRideDate", "grooming")} style={{ flexDirection: "row", justifyContent: "space-between", padding: 15, marginTop: 10, borderRadius: 10, paddingVertical: 15, borderWidth: 1, alignItems: "center" }} >

                        {!date && <Text style={{ fontSize: 16, color: Colors.gray, fontFamily: "Poppins-Medium" }} >Reserve in advance</Text>}

                        <View>
                            {date && <Text style={{ fontSize: 14, color: Colors.gray, fontFamily: "Poppins-Medium", color: Colors.buttonColor }} >{date?.toLocaleDateString()}</Text>}

                            {time && <Text style={{ fontSize: 14, color: Colors.gray, fontFamily: "Poppins-Medium", color: Colors.buttonColor }} >{time?.toLocaleTimeString()}</Text>}
                        </View>

                        <Image source={require("../../Images/calender.png")} />

                    </TouchableOpacity>

                    {!oneWay && <DropDownPicker
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setItems}
                        containerStyle={{ borderWidth: 0, borderRadius: 5, borderWidth: 1, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", zIndex: 100, marginTop: 20 }}
                        style={{ backgroundColor: "#fff", borderRadius: 5, zIndex: 100, borderWidth: 0 }}
                        textStyle={{ fontSize: 16 }}
                        dropDownContainerStyle={{ zIndex: 999 }}
                        placeholder={'Add Waiting Time'}
                        placeholderStyle={{ color: "gray" }}
                    />
                    }

                    {value == "custom" && !oneWay && <TextInput onChangeText={(e) => setCustomWaitingTime(e)} keyboardType="numeric" placeholder="Enter Waiting Time" placeholderTextColor={"gray"} style={{ padding: 5, color: Colors.black, fontFamily: "Poppins-Medium", borderBottomWidth: 1, marginTop: 10 }} />}


                    {!oneWay && <View style={{ borderRadius: 30, backgroundColor: Colors.buttonColor, padding: 10, marginTop: 15 }} >

                        <Text style={{ fontSize: 14, color: Colors.white, fontFamily: "Poppins-Medium", textAlign: "center" }} >Travel time to drop off location-{pickupToDropoffMinutes}min</Text>

                    </View>

                    }


                    <TouchableOpacity style={{ flexDirection: "row", justifyContent: "space-between", padding: 15, borderWidth: 1, marginTop: 15, borderRadius: 10, paddingVertical: 15, backgroundColor: "#21263D" }} >

                        <Text style={{ fontSize: 18, color: Colors.white, fontFamily: "Poppins-Regular" }} >Fare</Text>


                        <Text style={{ fontSize: 18, color: Colors.white, fontFamily: "Poppins-Regular" }} >$ {fare ? fare : 0.00}</Text>

                    </TouchableOpacity>


                    <TextInput

                        multiline={true}
                        style={{ backgroundColor: "#e6e6e6", borderRadius: 5, marginBottom: 10, marginTop: 10, fontFamily: "Poppins-Regular", color: Colors.black, fontSize: 16, paddingHorizontal: 10, textAlignVertical: "top", paddingVertical: 15 }}
                        placeholder='Comment'
                        placeholderTextColor={"gray"}
                        onChangeText={(e) => setComment(e)}
                    />


                    {walletAmount && (walletAmount > Number(fare)) && fare && !cardDetails ? <View style={{ width: "100%", flexDirection: "row", alignItems: "center" }}>

                        <TouchableOpacity onPress={() => setDeductedFromWallet(!deductedFromWallet)} style={{ width: 30, height: 30, borderWidth: 1, borderRadius: 5, borderColor: Colors.black, alignItems: "center", justifyContent: "center" }} >

                            {deductedFromWallet && <AntDesign name={"check"} size={20} color={Colors.black} />}

                        </TouchableOpacity>
                        <Text style={{ fontSize: 14, fontFamily: "Poppins-Medium", color: Colors.black, marginLeft: 10 }} >Deduct from wallet</Text>

                    </View> : ""}

                    {!cardDetails ?
                        <TouchableOpacity onPress={() => handleNavigateToPayment()} style={{ flexDirection: "row", justifyContent: "flex-start", padding: 10, borderWidth: 1, marginTop: 10, borderRadius: 10, paddingVertical: 15, marginBottom: 15, backgroundColor: "#e6e6e6" }} >


                            <Icons name="plus" size={25} color={Colors.black} style={{ position: "relative", left: 20 }} />

                            <Text style={{ fontSize: 16, color: Colors.black, fontFamily: "Poppins-Medium", marginLeft:50, width: "100%" }} >Add a Payment Method</Text>


                        </TouchableOpacity> :

                        <TouchableOpacity onPress={() => handleNavigateToPayment()} style={{ flexDirection: "row", padding: 10, borderWidth: 1, marginTop: 10, borderRadius: 10, paddingVertical: 15, marginBottom: 15, backgroundColor: "#e6e6e6" }} >


                            <Image source={require("../../Images/master1.png")} />

                            <Text style={{ fontSize: 16, color: Colors.gray, fontFamily: "Poppins-Medium", width: "100%", marginLeft: 10 }} >**** **** **** {cardDetails?.otherDetails?.card?.last4}</Text>


                        </TouchableOpacity>

                    }

                </View>

                <CustomButton onPress={() => !loading && handleFindDriver()} styleContainer={{ alignSelf: "center", marginBottom: 20, width: "85%" }} text={loading ? <ActivityIndicator color={Colors.white} size={"small"} /> : date ? "Schedule Ride" : "Find a Driver"} />


            </ScrollView>

        </View>
    )
}


export default PetGrooming