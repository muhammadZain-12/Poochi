import React, { useContext, useState, useEffect } from "react"
import { Dimensions, Image, ScrollView, Text, TextInput, TouchableOpacity, View, FlatList, ToastAndroid, BackHandler } from "react-native"
import Colors from "../../Constant/Color"
import CustomHeader from "../../Components/CustomHeader"
import Icons from 'react-native-vector-icons/Entypo';
import CustomButton from "../../Components/CustomButton";
import Navigation from "../Navigation";
import { getPreciseDistance, timeConversion } from "geolib";
import LoginContext from "../../Context/loginContext/context";
import LocationContext from "../../Context/locationContext/context";
import BookingContext from "../../Context/bookingContext/context";
import SelectedPetContext from "../../Context/SelectedPetContext/context";
import cardDetailsContext from "../../Context/CardDetailsContext/context";
import AntDesign from "react-native-vector-icons/AntDesign"
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import ChooseLocationContext from "../../Context/pickupanddropoffContext/context";

function PetWalk({ navigation, route }) {


    let data = route.params

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




    const [walletAmount, setWalletAmount] = useState(0)
    const [date, setDate] = useState("")
    const [time, setTime] = useState("")
    const [fare, setFare] = useState(null)
    const [serviceCharge, setServiceCharge] = useState(null)
    const [comment, setComment] = useState("")
    const [loading, setLoading] = useState(false)
    const [deductedFromWallet, setDeductedFromWallet] = useState(false)
    const [selectedOption, setSelectedOption] = useState("")

    const [pickupToDropoffDistance, setPickupToDropoffDistance] = useState(null)
    const [dropoffToPickupDistance, setDropoffToPickupDistance] = useState(null)
    const [pickupToDropoffMinutes, setPickupToDropoffMinutes] = useState(null)
    const [dropoffToPickupMinutes, setDropoffToPickupMinutes] = useState(null)
    const [minutes, setMinutes] = useState(null)
    const [distance, setDistance] = useState(null)

    const [option, setOptions] = useState([
        {
            name: "Around House",
            selected: false,
            source: require("../../Images/around.png")
        },
        {
            name: "Dog Park",
            selected: false,
            source: require("../../Images/park.png")

        },
        {
            name: "Random Walk",
            selected: false,
            source: require("../../Images/random.png")

        },
    ])

    const [duration, setDuration] = useState([
        {
            label: "15 Min",
            value: 15,
            selected: false
        },
        {
            label: "30 Min",
            value: 30,
            selected: false
        },
        {
            label: "45 Min",
            value: 45,
            selected: false
        },
        {
            label: "60 Min",
            value: 60,
            selected: false
        }

    ])


    const [customTime, setCustomTime] = useState(false)
    const [selectedTimeDuration, setSelectedTimeDuration] = useState(null)





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

        }

    }, [data])











    const removeSelectedPet = (ind) => {

        setSelectedPets(selectedPets && selectedPets.length > 0 && selectedPets.filter((e, i) => {

            return i !== ind

        }))


    }





    const renderSelectedPets = ({ item }, index) => {

        console.log(index, "index")

        return <View style={{ justifyContent: "center", alignItems: "center", marginRight: 10 }} >

            <Image source={{ uri: item.image1 }} style={{ width: 120, height: 120, borderRadius: 10 }} />
            <TouchableOpacity style={{ position: "absolute", top: 5, right: 5 }} onPress={() => removeSelectedPet(index)} >
                <AntDesign name="close" color={Colors.white} size={20} />
            </TouchableOpacity>
            <Text style={{ color: Colors.black, fontFamily: "Poppins-Medium", fontSize: 16 }} >{item.petName}</Text>
            <Text style={{ color: Colors.gray, fontFamily: "Poppins-Medium", fontSize: 12 }} >{item.breed}</Text>
        </View>

    }



    console.log(dropoffAddress, "dropoff")


    useEffect(() => {

        if (selectedOption?.name == "Dog Park" && dropoffAddress) {

            setReturnPickup(dropoff)
            setReturnPickupAddress(dropoffAddress)
            setReturnDropoff(pickup)
            setReturnPickupAddress(pickupAddress)

        }


    }, [selectedOption?.name, dropoffAddress])





    const handleCalculateTwoWayDistance = () => {


        const pickupToDropoffDis = getPreciseDistance(
            {
                latitude: pickup?.lat ? pickup?.lat : pickup?.latitude,
                longitude: pickup?.lng ? pickup?.lng : pickup?.longitude,
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
                latitude: dropoff.lat,
                longitude: dropoff.lng,
            },
        );




        const returnPickupToReturnDropoffDis = getPreciseDistance(
            {
                latitude: dropoff.lat,
                longitude: dropoff.lng,
            },
            {
                latitude: pickup.lat,
                longitude: pickup.lng,
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



    }

    useEffect(() => {

        if (pickupAddress && dropoffAddress) {
            handleCalculateTwoWayDistance()
        }


    }, [pickupAddress, dropoffAddress])



    const handleSelectOptions = (e, ind) => {


        setSelectedOption(e)

        if (e?.name !== "Dog Park") {

            setDropoff({})
            setDropoffAddress("")
            setDistance(null)

        }



        setOptions(option && option.length > 0 && option.map((e, i) => {
            if (ind == i) {
                return {
                    ...e,
                    selected: true
                }


            } else {
                return {
                    ...e,
                    selected: false
                }
            }
        }))

    }

    console.log(selectedOption, "selectee")


    const handleSelectDuration = (e, ind) => {

        setSelectedTimeDuration(e.value)
        setCustomTime(false)

        setDuration(duration && duration.length > 0 && duration.map((e, i) => {

            if (ind == i) {
                return {
                    ...e,
                    selected: true
                }
            } else {
                return {
                    ...e,
                    selected: false
                }
            }

        }))



    }


    const calculateFare = () => {



        firestore().collection("fareCharges").doc("qweasdzxcfgrw").get().then((doc) => {

            let data = doc?.data()

            if (data && data?.walkFare) {



                if (Number(selectedTimeDuration) < 31) {


                    let totalFare = selectedTimeDuration * Number(data?.walkFare)


                    let baseCharge = data?.petWalkBaseCharge
                    let mileCharge = Number(data?.petMileCharge)

                    let additionalPetCharge;

                    if (selectedPets && selectedPets.length > 1) {
                        additionalPetCharge = data?.additionalPetCharge

                        additionalPetCharge = Number(additionalPetCharge) * (selectedPets.length - 1)
                    }

                    let totalMileCharges = 0

                    if (distance) {
                        totalMileCharges = Number(distance) * Number(mileCharge)
                    }


                    totalFare = Number(totalFare) + Number(baseCharge) + (additionalPetCharge ? additionalPetCharge : 0) + totalMileCharges



                    setFare(totalFare)
                    setServiceCharge(data?.serviceCharge)
                }
                else {

                    let walkFare = Number(data?.walkfareChargePlus30)

                    console.log(walkFare, "walkFare")

                    let totalFare = selectedTimeDuration * Number(walkFare)

                    let mileCharge = Number(data?.petMileCharge)


                    let additionalPetCharge;

                    if (selectedPets && selectedPets.length > 1) {
                        additionalPetCharge = data?.additionalPetCharge

                        additionalPetCharge = Number(additionalPetCharge) * (selectedPets.length - 1)
                    }

                    let totalMileCharges = 0

                    if (distance) {
                        totalMileCharges = Number(distance) * Number(mileCharge)
                    }


                    let baseCharge = data?.petWalkBaseCharge



                    totalFare = Number(totalFare) + Number(baseCharge) + (additionalPetCharge ? additionalPetCharge : 0) + totalMileCharges



                    setFare(totalFare)
                    setServiceCharge(data?.serviceCharge)

                }

            }


        })


    }



    useEffect(() => {

        calculateFare()

    }, [selectedTimeDuration, selectedPets.length, distance])


    const handleNavigateToPayment = () => {


        if (!fare) {
            ToastAndroid.show("Kindly Choose Walking Duration", ToastAndroid.SHORT)
            return
        }

        let dataToSend = {

            amount: fare,
            type: "PetWalk"

        }


        navigation.navigate("PaymentMethod", dataToSend)


    }

    console.log(loginData, "LOGINdATA")

    const handleFindDriver = () => {




        if (!pickupAddress) {
            ToastAndroid.show("Kindly Enter Pickup Point", ToastAndroid.SHORT)
            return
        }



        if (selectedPets.length == 0) {
            ToastAndroid.show("Kindly select pet", ToastAndroid.SHORT)
            return
        }

        if (!selectedTimeDuration) {
            ToastAndroid.show("Kindly choose time duration", ToastAndroid.SHORT)
            return
        }


        if (!cardDetails && !deductedFromWallet) {
            ToastAndroid.show("Kindly Enter Payment Details", ToastAndroid.SHORT)
            return
        }

        let selectedOptions = option && option.length > 0 && option.filter((e, i) => e.selected)

        if (selectedOptions.length == 0) {
            ToastAndroid.show("Kindly Choose Options", ToastAndroid.SHORT)
            return
        }


        let serviceCharges = (Number(fare) * Number(serviceCharge)) / 100
        let driverFare = Number(fare) - Number(serviceCharges)
        driverFare = Number(driverFare).toFixed(2)


        let dataToSend;
        if (selectedOption?.name !== "Dog Park") {
            dataToSend = {
                pickupAddress: pickupAddress,
                pickupCords: pickup,
                dropoffAddress: dropoffAddress ? dropoffAddress : pickupAddress,
                dropoffCoords: Object.keys(dropoff).length > 0 ? dropoff : pickup,
                selectedPets: selectedPets,
                selectedOption: selectedOptions[0],
                comment: comment,
                cardDetails: cardDetails,
                userData: loginData,
                fare: fare,
                serviceCharge: serviceCharges,
                driverFare: driverFare,
                duration: selectedTimeDuration,
                bookingType: "oneWay",
                requestDate: new Date(),
                type: "PetWalk",
                deductedFromWallet: deductedFromWallet
            }
        } else {

            dataToSend = {
                pickupAddress: pickupAddress,
                pickupCords: pickup,
                dropoffAddress: dropoffAddress ? dropoffAddress : pickupAddress,
                dropoffCoords: Object.keys(dropoff).length > 0 ? dropoff : pickup,
                returnPickupCords: dropoff,
                returnDropoffCords: pickup,
                returnPickupAddress: dropoffAddress,
                returnDropoffAddress: pickupAddress,

                distance: distance,
                pickupToDropDis: pickupToDropoffDistance,
                dropoffToPickupDis: dropoffToPickupDistance,
                minutes: minutes,
                pickupToDropoffMinutes: pickupToDropoffMinutes,
                dropoffToPickupMinutes: dropoffToPickupMinutes,

                selectedPets: selectedPets,
                selectedOption: selectedOptions[0],
                comment: comment,
                cardDetails: cardDetails,
                userData: loginData,
                fare: fare,
                serviceCharge: serviceCharges,
                driverFare: driverFare,
                duration: selectedTimeDuration,
                bookingType: "twoWay",
                requestDate: new Date(),
                type: "PetWalk",
                deductedFromWallet: deductedFromWallet
            }

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


    const handlePressCustomTime = () => {


        setDuration(duration && duration.length > 0 && duration.map((e, i) => {
            return {
                ...e,
                selected: false
            }

        }))


        setCustomTime(!customTime)

    }



    return (
        <View style={{ flex: 1, backgroundColor: Colors.white }} >

            <View style={{ marginTop: 5 }} >
                <CustomHeader

                    text={"Dog Walk"}
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
                            <Text style={{ fontSize: 16, color: Colors.white, fontFamily: "Poppins-Medium" }} >Choose Pickup Point</Text>
                            <TouchableOpacity onPress={() => navigation.navigate("GooglePlace", { name: 'Pickup Location', route: "PetWalk" })} style={{ padding: 12, backgroundColor: "white", borderRadius: 5, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }} >

                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }} >

                                    <Image source={require("../../Images/Location1.png")} style={{ height: 20, width: 17 }} />

                                    <Text style={{ color: pickupAddress ? Colors.black : Colors.gray, fontFamily: "Poppins-Medium", fontSize: 12, marginLeft: 10, width: "80%" }} >{pickupAddress ? pickupAddress : "Enter Pickup"}</Text>

                                </View>

                                <Image source={require("../../Images/search.png")} />


                            </TouchableOpacity>

                        </View>
                        {selectedOption.name == "Dog Park" && <View style={{ marginTop: 10, marginBottom: 10 }} >
                            <Text style={{ fontSize: 16, color: Colors.white, fontFamily: "Poppins-Medium" }} >Choose Drop off Point</Text>
                            <TouchableOpacity onPress={() => navigation.navigate("GooglePlace", { name: 'Dropoff Location', route: "PetWalk" })} style={{ padding: 12, backgroundColor: "white", borderRadius: 5, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }} >

                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }} >

                                    <Image source={require("../../Images/Location1.png")} style={{ height: 20, width: 17 }} />

                                    <Text style={{ color: dropoffAddress ? Colors.black : Colors.gray, fontFamily: "Poppins-Medium", fontSize: 12, marginLeft: 10, width: "80%" }} >{dropoffAddress ? dropoffAddress : "Enter Destination"}</Text>

                                </View>
                                <View style={{ width: "7%" }} >
                                    <Image source={require("../../Images/search.png")} />
                                </View>

                            </TouchableOpacity>

                        </View>}

                    </View>

                    <Text style={{ fontSize: 17, color: Colors.black, fontFamily: "Poppins-SemiBold", marginTop: 10 }} >Select Option</Text>

                    <View style={{ marginTop: 10, flexDirection: "row", alignItems: "center", flexWrap: "wrap", justifyContent: "space-between" }} >
                        {option && option.length > 0 && option.map((e, i) => {
                            return (
                                <View key={i} style={{ width: 110, height: 110 }} >
                                    <TouchableOpacity onPress={() => handleSelectOptions(e, i)} style={{ borderWidth: e.selected ? 2 : 0, borderColor: e.selected ? Colors.buttonColor : "none", width: 100, height: 100, backgroundColor: "#e6e6e6", borderRadius: 10, justifyContent: "center", alignItems: "center", marginLeft: 5 }} >
                                        <Image source={e?.source} style={{ width: 40, height: 40 }} />
                                    </TouchableOpacity>
                                    <Text style={{ fontSize: 12, fontFamily: "Poppins-Medium", textAlign: "center", marginTop: 5, color: Colors.black }} >{e.name}</Text>
                                </View>
                            )
                        })}

                    </View>

                    <Text style={{ fontSize: 17, color: Colors.black, fontFamily: "Poppins-SemiBold", marginTop: 30 }} >Select Your Pet</Text>

                    <Text style={{ fontSize: 14, color: Colors.black, fontFamily: "Poppins-SemiBold", marginTop: 10 }} >additional $7 for extra pet</Text>

                    {selectedPets && selectedPets.length > 0 ? <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ flexDirection: "row", width: "100%" }} >

                        {selectedPets.map((e, i) => {

                            return (

                                renderSelectedPets({ item: e }, i)

                            )

                        })}


                        <TouchableOpacity onPress={() => navigation.navigate("PetSelect", "PetWalk")} style={{ width: 120, height: 120, backgroundColor: "#e6e6e6", borderRadius: 10, justifyContent: "center", alignItems: "center" }} >

                            <Image source={require("../../Images/add.png")} />

                        </TouchableOpacity>



                    </ScrollView> :
                        <View style={{ marginTop: 10, flexDirection: "row", alignItems: "center", flexWrap: "wrap" }} >

                            <TouchableOpacity onPress={() => navigation.navigate("PetSelect", "PetWalk")} style={{ width: 120, height: 120, backgroundColor: "#e6e6e6", borderRadius: 10, justifyContent: "center", alignItems: "center" }} >

                                <Image source={require("../../Images/add.png")} />

                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate("PetSelect")} style={{ width: 120, height: 120, backgroundColor: "#e6e6e6", borderRadius: 10, marginLeft: 20, justifyContent: "center", alignItems: "center" }} >
                                <Image source={require("../../Images/add.png")} />

                            </TouchableOpacity>

                        </View>

                    }


                    <View style={{ width: "100%", justifyContent: "space-between", flexDirection: "row", alignItems: "center" }} >
                        <Text style={{ fontSize: 17, color: Colors.black, fontFamily: "Poppins-SemiBold", marginTop: 30 }} >Walking Duration</Text>

                    </View>

                    <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap" }} >

                        {duration && duration.length > 0 && duration.map((e, i) => {
                            return (
                                <TouchableOpacity key={i} onPress={() => handleSelectDuration(e, i)} style={{ borderRadius: 20, backgroundColor: e.selected ? Colors.buttonColor : "#e6e6e6", marginRight: 5, paddingHorizontal: 5, marginBottom: 10 }} >
                                    <Text style={{ color: e.selected ? Colors.white : "#777", textAlign: "center", padding: 10 }} >{e.label}</Text>
                                </TouchableOpacity>
                            )
                        })}

                        <TouchableOpacity onPress={() => handlePressCustomTime()} style={{ justifyContent: "center", alignItems: "center", width: 70, height: 40, borderRadius: 20, backgroundColor: customTime ? Colors.buttonColor : "#e6e6e6", marginRight: 5, paddingHorizontal: 5 }} >
                            <Icons name="plus" size={25} color={"#777"} />
                        </TouchableOpacity>

                    </View>

                    {customTime && <TextInput value={selectedTimeDuration} onChangeText={(e) => setSelectedTimeDuration(e)} keyboardType="numeric"
                        style={{ width: "100%", borderWidth: 1, borderColor: Colors.gray, color: Colors.black, padding: 10, borderRadius: 5, marginTop: 10, fontFamily: "Poppins-Medium" }}
                        placeholder="Enter Time Duration (in min)"
                        placeholderTextColor={Colors.gray}

                    />}






                    <TouchableOpacity onPress={() => navigation.navigate("ScheduleRideDate", "medical")} style={{ flexDirection: "row", justifyContent: "space-between", padding: 10, marginTop: 10, borderRadius: 10, paddingVertical: 15 }} >

                        <Text style={{ fontSize: 14, color: Colors.gray, fontFamily: "Poppins-Medium" }} >Soon you will also be able to schedule rides</Text>

                        {/* <Image source={require("../../Images/calender.png")} /> */}

                    </TouchableOpacity>





                    <TouchableOpacity style={{ flexDirection: "row", justifyContent: "space-between", padding: 15, borderWidth: 1, marginTop: 15, borderRadius: 10, paddingVertical: 15, backgroundColor: "#21263D" }} >

                        <Text style={{ fontSize: 18, color: Colors.white, fontFamily: "Poppins-Regular" }} >$ Fare</Text>


                        <Text style={{ fontSize: 18, color: Colors.white, fontFamily: "Poppins-Regular" }} >$ {fare ? fare?.toFixed(2) : "0.00"}</Text>

                    </TouchableOpacity>


                    <TextInput

                        multiline={true}
                        style={{ backgroundColor: "#e6e6e6", borderRadius: 5, marginBottom: 10, marginTop: 10, fontFamily: "Poppins-Regular", color: Colors.black, fontSize: 16, paddingHorizontal: 10, textAlignVertical: "top", paddingVertical: 15 }}
                        placeholder='Comment'
                        onChangeText={setComment}
                        placeholderTextColor={"gray"}

                    />

                    {walletAmount && (walletAmount > Number(fare)) && fare && !cardDetails ? <View style={{ width: "100%", flexDirection: "row", alignItems: "center" }}>

                        <TouchableOpacity onPress={() => setDeductedFromWallet(!deductedFromWallet)} style={{ width: 30, height: 30, borderWidth: 1, borderRadius: 5, borderColor: Colors.black, alignItems: "center", justifyContent: "center" }} >

                            {deductedFromWallet && <AntDesign name={"check"} size={20} color={Colors.black} />}

                        </TouchableOpacity>
                        <Text style={{ fontSize: 14, fontFamily: "Poppins-Medium", color: Colors.black, marginLeft: 10 }} >Deducted from wallet</Text>

                    </View> : ""}


                    {!cardDetails ?
                        <TouchableOpacity onPress={() => handleNavigateToPayment()} style={{ flexDirection: "row", justifyContent: "center", padding: 10, borderWidth: 1, marginTop: 10, borderRadius: 10, paddingVertical: 15, marginBottom: 15, backgroundColor: "#e6e6e6" }} >



                            <Text style={{ fontSize: 16, color: Colors.black, fontFamily: "Poppins-Medium", textAlign: "center" }} >Add a Payment Method</Text>


                        </TouchableOpacity> :

                        <TouchableOpacity onPress={() => handleNavigateToPayment()} style={{ flexDirection: "row", padding: 10, borderWidth: 1, marginTop: 10, borderRadius: 10, paddingVertical: 15, marginBottom: 15, backgroundColor: "#e6e6e6" }} >


                            <Image source={require("../../Images/master1.png")} />

                            <Text style={{ fontSize: 16, color: Colors.gray, fontFamily: "Poppins-Medium", width: "100%", marginLeft: 10 }} >**** **** **** {cardDetails?.otherDetails?.card?.last4}</Text>


                        </TouchableOpacity>

                    }




                </View>

                <CustomButton onPress={() => !loading && handleFindDriver()} styleContainer={{ alignSelf: "center", marginBottom: 20, width: "85%" }} text="Find a Driver" />


            </ScrollView>

        </View>
    )
}


export default PetWalk