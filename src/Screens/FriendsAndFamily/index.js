import React, { useEffect, useState, useContext } from "react"
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View, FlatList, ToastAndroid, ActivityIndicator } from "react-native"
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


function FriendsAndFamily({ navigation, route }) {

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
    const [pickup, setPickup] = useState({})
    const [pickupAddress, setPickupAddress] = useState("")
    const [dropoff, setDropoff] = useState({})
    const [minutes, setMinutes] = useState("")
    const [dropoffAddress, setDropoffAddress] = useState("")
    const [returnPickup, setReturnPickup] = useState({})
    const [returnPickupAddress, setReturnPickupAddress] = useState("")
    const [returnDropoff, setReturnDropoff] = useState({})
    const [returnDropoffAddress, setReturnDropoffAddress] = useState("")
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
        getWalletAmount()
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

            let fare = mileCharge * Number(mileDistance)

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


        console.log(dropoffToReturnPickupDis, "dissstancesss")


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


            let totalWaitingCharges = 0

            if (!customWaitingTime && value !== "custom") {
                totalWaitingCharges = waitingCharges * Number(value)
            }

            else if (customWaitingTime) {
                totalWaitingCharges = waitingCharges * Number(customWaitingTime)
            }



            let fare = mileCharge * Number(mileDistance)
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




    }, [pickup, dropoff, returnPickup, returnDropoff, value, customWaitingTime])


    console.log(value, "value")

    const removeSelectedPet = (ind) => {

        setSelectedPets(selectedPets && selectedPets.length > 0 && selectedPets.filter((e, i) => {

            return i !== ind

        }))


    }





    const renderSelectedPets = ({ item }, index) => {



        return <View style={{ justifyContent: "center", alignItems: "center", marginRight: 10 }} >

            <Image source={{ uri: item.image1 }} style={{ width: 120, height: 120, borderRadius: 10 }} />
            <TouchableOpacity style={{ position: "absolute", top: 5, right: 5 }} onPress={() => removeSelectedPet(index)} >
                <AntDesign name="close" color={Colors.white} size={20} />
            </TouchableOpacity>
            <Text style={{ color: Colors.black, fontFamily: "Poppins-Medium", fontSize: 16 }} >{item.petName}</Text>
            <Text style={{ color: Colors.gray, fontFamily: "Poppins-Medium", fontSize: 12 }} >{item.breed}</Text>
        </View>

    }


    const handleFindDriver = () => {


        if (!oneWay) {

            if (!pickupAddress) {
                ToastAndroid.show("Kindly Enter Pickup Point", ToastAndroid.SHORT)
                return
            }

            if (!dropoffAddress) {
                ToastAndroid.show("kindly enter dropoff point", ToastAndroid.SHORT)
                return
            }

            if (!returnPickupAddress) {
                ToastAndroid.show("Kindly enter return pickup point", ToastAndroid.SHORT)
                return
            }

            if (!returnDropoffAddress) {
                ToastAndroid.show("Kindly enter return dropoff point", ToastAndroid.SHORT)
                return
            }

            if (!value || (value == "custom" && !customWaitingTime)) {

                ToastAndroid.show("Kindly enter waiting Time", ToastAndroid.SHORT)

            }

            if (selectedPets.length == 0) {
                ToastAndroid.show("Kindly select pet", ToastAndroid.SHORT)
                return
            }

            if (!cardDetails && !deductedFromWallet) {
                ToastAndroid.show("Kindly Enter Payment Details", ToastAndroid.SHORT)
                return
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
                cardDetails: cardDetails,
                userData: loginData,
                fare: fare,
                serviceCharge: serviceCharge,
                distance: distance,
                pickupToDropDis: pickupToDropoffDistance,
                dropoffToPickupDis: dropoffToPickupDistance,
                minutes: minutes,
                pickupToDropoffMinutes: pickupToDropoffMinutes,
                dropoffToPickupMinutes: dropoffToPickupMinutes,
                waitingTime: customWaitingTime ? customWaitingTime : value,
                bookingType: "twoWay",
                requestDate: new Date(),
                type: "FriendsAndFamily",
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
                ToastAndroid.show("Kindly Enter Pickup Point", ToastAndroid.SHORT)
                return
            }

            if (!dropoffAddress) {
                ToastAndroid.show("kindly enter dropoff point", ToastAndroid.SHORT)
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

            let dataToSend = {
                pickupAddress: pickupAddress,
                dropoffAddress: dropoffAddress,
                pickupCords: pickup,
                dropoffCoords: dropoff,
                selectedPets: selectedPets,
                comment: comment,
                cardDetails: cardDetails,
                userData: loginData,
                fare: fare,
                serviceCharge: serviceCharge,
                distance: distance,
                minutes: minutes,
                bookingType: "oneWay",
                requestDate: new Date(),
                type: "FriendsAndFamily",
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


    }


    const handleNavigateToPayment = () => {


        if (!pickupAddress || !dropoffAddress) {
            ToastAndroid.show("First add pickup and dropoff location", ToastAndroid.SHORT)
            return
        }

        let dataToSend = {

            amount: fare,
            type: "FriendsAndFamily"

        }


        navigation.navigate("PaymentMethod", dataToSend)


    }





    return (
        <View style={{ flex: 1, backgroundColor: Colors.white }} >

            <View style={{ marginTop: 5 }} >
                <CustomHeader

                    text={"Friends And Family"}
                    iconname={"arrow-back-outline"}
                    color={Colors.black}
                    onPress={() => navigation.goBack()}


                />

            </View>
            <ScrollView>


                <View style={{ paddingHorizontal: 15, marginTop: 20 }} >



                    <View style={{ backgroundColor: "#21263D", borderRadius: 10, width: "100%", padding: 10 }} >
                        <View style={{ marginTop: 5 }} >
                            <Text style={{ fontSize: 16, color: Colors.white, fontFamily: "Poppins-Medium" }} >Choose Pickup Point</Text>
                            <TouchableOpacity onPress={() => navigation.navigate("GooglePlace", { name: 'Pickup Location', route: "FriendsAndFamily" })} style={{ padding: 12, backgroundColor: "white", borderRadius: 5, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }} >

                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }} >

                                    <Image source={require("../../Images/Location1.png")} style={{ height: 20, width: 17 }} />

                                    <Text style={{ color: pickupAddress ? Colors.black : Colors.gray, fontFamily: "Poppins-Medium", fontSize: 16, marginLeft: 10 }} >{pickupAddress ? pickupAddress : "Enter Pickup"}</Text>

                                </View>

                                <Image source={require("../../Images/search.png")} />


                            </TouchableOpacity>

                        </View>
                        <View style={{ marginTop: 10, marginBottom: 10 }} >
                            <Text style={{ fontSize: 16, color: Colors.white, fontFamily: "Poppins-Medium" }} >Choose Drop off Point</Text>
                            <TouchableOpacity onPress={() => navigation.navigate("GooglePlace", { name: 'Dropoff Location', route: "FriendsAndFamily" })} style={{ padding: 12, backgroundColor: "white", borderRadius: 5, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }} >

                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }} >

                                    <Image source={require("../../Images/Location1.png")} style={{ height: 20, width: 17 }} />

                                    <Text style={{ color: dropoffAddress ? Colors.black : Colors.gray, fontFamily: "Poppins-Medium", fontSize: 16, marginLeft: 10 }} >{dropoffAddress ? dropoffAddress : "Enter Destination"}</Text>

                                </View>

                                <Image source={require("../../Images/search.png")} />


                            </TouchableOpacity>

                        </View>

                    </View>


                    <Text style={{ fontSize: 17, color: Colors.black, fontFamily: "Poppins-SemiBold", marginTop: 10 }} >Pet Select</Text>



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


                        <TouchableOpacity onPress={() => navigation.navigate("PetSelect", "FriendsAndFamily")} style={{ width: 120, height: 120, backgroundColor: "#e6e6e6", borderRadius: 10, justifyContent: "center", alignItems: "center" }} >

                            <Image source={require("../../Images/add.png")} />

                        </TouchableOpacity>



                    </ScrollView> :
                        <View style={{ marginTop: 10, flexDirection: "row", alignItems: "center", flexWrap: "wrap" }} >

                            <TouchableOpacity onPress={() => navigation.navigate("PetSelect", "FriendsAndFamily")} style={{ width: 120, height: 120, backgroundColor: "#e6e6e6", borderRadius: 10, justifyContent: "center", alignItems: "center" }} >

                                <Image source={require("../../Images/add.png")} />

                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate("PetSelect")} style={{ width: 120, height: 120, backgroundColor: "#e6e6e6", borderRadius: 10, marginLeft: 20, justifyContent: "center", alignItems: "center" }} >
                                <Image source={require("../../Images/add.png")} />

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
                            <Text style={{ fontSize: 16, color: Colors.white, fontFamily: "Poppins-Medium" }} >Choose Pickup Point</Text>
                            <TouchableOpacity style={{ padding: 12, backgroundColor: "white", borderRadius: 5, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }} >

                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }} >

                                    <Image source={require("../../Images/Location1.png")} style={{ height: 20, width: 17 }} />

                                    <Text style={{ color: returnPickupAddress ? Colors.black : Colors.gray, fontFamily: "Poppins-Medium", fontSize: 16, marginLeft: 10 }} >{returnPickupAddress ? returnPickupAddress : "Enter Return Pickup"}</Text>

                                </View>

                                <Image source={require("../../Images/search.png")} />


                            </TouchableOpacity>

                        </View>


                        <View style={{ marginTop: 10, marginBottom: 10 }} >
                            <Text style={{ fontSize: 16, color: Colors.white, fontFamily: "Poppins-Medium" }} >Choose Drop off Point</Text>
                            <TouchableOpacity onPress={() => navigation.navigate("GooglePlace", { name: 'Return Dropoff', route: "FriendsAndFamily" })} style={{ padding: 12, backgroundColor: "white", borderRadius: 5, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }} >
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }} >
                                    <Image source={require("../../Images/Location1.png")} style={{ height: 20, width: 17 }} />
                                    <Text style={{ color: pickupAddress ? Colors.black : Colors.gray, fontFamily: "Poppins-Medium", fontSize: 16, marginLeft: 10 }} >{returnDropoffAddress ? returnDropoffAddress : "Enter Return Dropoff"}</Text>
                                </View>
                                <Image source={require("../../Images/search.png")} />

                            </TouchableOpacity>

                        </View>

                    </View>}


                    {!oneWay && <TouchableOpacity style={{ flexDirection: "row", justifyContent: "space-between", padding: 15, borderWidth: 0, marginTop: 10, borderRadius: 10, paddingVertical: 15 }} >

                        <Text style={{ fontSize: 16, color: Colors.gray, fontFamily: "Poppins-Medium" }} >Soon you will also be able to schedule rides</Text>

                        {/* <Image source={require("../../Images/calender.png")} /> */}

                    </TouchableOpacity>}

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

                    {value == "custom" && <TextInput onChangeText={(e) => setCustomWaitingTime(e)} keyboardType="numeric" placeholder="Enter Waiting Time" placeholderTextColor={"gray"} style={{ padding: 5, color: Colors.black, fontFamily: "Poppins-Medium", borderBottomWidth: 1, marginTop: 10 }} />}


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
                        <Text style={{ fontSize: 14, fontFamily: "Poppins-Medium", color: Colors.black, marginLeft: 10 }} >Deducted from wallet</Text>

                    </View> : ""}

                    {!cardDetails ?
                        <TouchableOpacity onPress={() => handleNavigateToPayment()} style={{ flexDirection: "row", justifyContent: "space-between", padding: 10, borderWidth: 1, marginTop: 10, borderRadius: 10, paddingVertical: 15, marginBottom: 15, backgroundColor: "#e6e6e6" }} >


                            <Icons name="plus" size={25} color={Colors.black} style={{ position: "relative", left: 20 }} />

                            <Text style={{ fontSize: 16, color: Colors.black, fontFamily: "Poppins-Medium", textAlign: "center", width: "100%" }} >Add a Payment Method</Text>


                        </TouchableOpacity> :

                        <TouchableOpacity onPress={() => handleNavigateToPayment()} style={{ flexDirection: "row", padding: 10, borderWidth: 1, marginTop: 10, borderRadius: 10, paddingVertical: 15, marginBottom: 15, backgroundColor: "#e6e6e6" }} >


                            <Image source={require("../../Images/master1.png")} />

                            <Text style={{ fontSize: 16, color: Colors.gray, fontFamily: "Poppins-Medium", width: "100%", marginLeft: 10 }} >**** **** **** {cardDetails?.otherDetails?.card?.last4}</Text>


                        </TouchableOpacity>

                    }

                </View>

                <CustomButton onPress={() => !loading && handleFindDriver()} styleContainer={{ alignSelf: "center", marginBottom: 20, width: "85%" }} text={loading ? <ActivityIndicator color={Colors.white} size={"small"} /> : "Find a Driver"} />



            </ScrollView>

        </View>
    )
}


export default FriendsAndFamily