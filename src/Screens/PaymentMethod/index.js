import React, { useState, useEffect, useContext } from "react"
import { View, Text, Image, TouchableOpacity, TextInput, ToastAndroid, ActivityIndicator, ScrollView } from "react-native"
import CustomHeader from "../../Components/CustomHeader"
import CustomButton from "../../Components/CustomButton"
import Colors from "../../Constant/Color"
import { useStripe, CardField } from '@stripe/stripe-react-native';
import { initStripe } from '@stripe/stripe-react-native';
import cardDetailsContext from "../../Context/CardDetailsContext/context"
import axios from "axios"
import { Base_Uri } from "../../Constant/BaseUri"
import LoginContext from "../../Context/loginContext/context"
import firestore from "@react-native-firebase/firestore"
import auth from "@react-native-firebase/auth"
import CustomCard from "../../Components/customCards"

function PaymentMethod({ navigation, route }) {


    let data = route.params


    const loginCont = useContext(LoginContext)

    const { loginData } = loginCont

    const [cardSelected, setCardSelected] = useState("master")
    const [cardDetail, setCardDetail] = useState("")
    const [cardHolderName, setCardHolderName] = useState("")
    const [loading, setLoading] = useState(false)




    const cardCont = useContext(cardDetailsContext)
    const { cardDetails, setCardDetails } = cardCont


    const [savedCards, setSavedCards] = useState([])
    const [selectedCards, setSelectedCards] = useState("")





    useEffect(() => {
        async function initialize() {
            await initStripe({
                publishableKey:
                    'pk_test_51NV3dXCcj0GzAQ3b6AnfokqtMfMp6tgV8G1CoAy0hwFM4ChQtVvORsdd4VGMQAPOwlt4FFxKpnigH2p2RtL6tIT0009uUfUTiP',
            });
        }
        initialize().catch(console.error);
    }, []);
    const { createToken } = useStripe();




    const getSavedCards = () => {


        let id = auth().currentUser?.uid

        firestore().collection("PassengerCards").doc(id).get().then((doc) => {

            let data = doc?.data()

            if (data && data?.cards) {


                let cards = data.cards


                setSavedCards(cards)



            }



        })


    }



    useEffect(() => {

        getSavedCards()
    }, [])


    console.log(data, "dataaa")


    const handlePayment = async () => {


        if (selectedCards) {


            let dataToSend = {

                amount: data?.amount,
                customerId: selectedCards?.customerId
            }

            setLoading(true)
            axios.post(`${Base_Uri}doPayment`, dataToSend).then((res) => {

                let responseData = res.data

                if (!responseData.status) {

                    ToastAndroid.show(responseData?.message, ToastAndroid.SHORT)
                    setLoading(false)

                    return

                }



                let walletData = {
                    deposit: data.amount,
                    spent: 0,
                    remainingWallet: data.amount,
                    date: new Date()
                }

                let id = auth()?.currentUser?.uid

                firestore().collection("UserWallet").doc(id).set({
                    wallet: firestore.FieldValue.arrayUnion(walletData)
                }, { merge: true }).then((res) => {

                    if (loginData?.token) {
                        var notificationData = JSON.stringify({
                            notification: {
                                body: `Your fare amount has been successfully deducted from your card and add in your wallet`,
                                title: `Hi ${loginData?.fullName} `,
                            },
                            to: loginData.token,
                        });
                        let config = {
                            method: 'post',
                            url: 'https://fcm.googleapis.com/fcm/send',
                            headers: {
                                Authorization:
                                    'key=AAAAzwxYyNA:APA91bEU1Zss73BLEraf4jDgob9rsAfxshC0GBBxbgPo340U5DTWDVbS9MYudIPDjIvZwNH7kNkucQ0EHNQtnBcjf5gbhbn09qU0TpKagm2XvOxmAvyBSYoczFtxW7PpHgffPpdaS9fM',
                                'Content-Type': 'application/json',
                            },
                            data: notificationData,
                        };
                        axios(config)
                            .then(res => {

                                console.log("notification succesfully send")


                                let notification = JSON.parse(notificationData)



                                let notificationToSend = {

                                    title: notification.notification.title,
                                    body: notification.notification.body,
                                    date: new Date()


                                }

                                firestore().collection("Notification").doc(loginData.id).set({
                                    notification: firestore.FieldValue.arrayUnion(notificationToSend)
                                }, { merge: true }).then(() => {

                                    console.log("Notification has been send successfully")

                                })



                            })
                            .catch(error => {
                                console.log(error, "errorsssss")
                            });
                    }


                    setCardDetails(selectedCards)
                    setLoading(false)
                    navigation.navigate(data.type)


                }).catch((error) => {

                    setLoading(false)
                    console.log(error, "eerrrororor")


                })





            }).catch((error) => {
                setLoading(false)
                console.log(error, "error")

            })


            return

        }



        if (!cardHolderName) {
            ToastAndroid.show("Enter Card holder name", ToastAndroid.SHORT)
            return
        }

        if (cardDetail.validNumber == "Invalid" || cardDetail.validNumber == "Incomplete") {

            ToastAndroid.show("Invalid Card Number", ToastAndroid.SHORT)
            return
        }



        if (cardDetail.validExpiryDate == "Invalid" || cardDetail.validExpiryDate == "Incomplete") {

            ToastAndroid.show("Your card has been expired", ToastAndroid.SHORT)
            return
        }


        if (cardDetail.validCVC == "Invalid" || cardDetail.validCVC == "Incomplete") {

            ToastAndroid.show("Invalid CVC", ToastAndroid.SHORT)
            return
        }

        setLoading(true)
        createToken({
            type: 'Card',
            card: cardDetail,
        })
            .then(res => {

                console.log(res, "resss")


                let token = res?.token;


                let tokenToSend = {
                    token: token.id
                }


                axios.post(`${Base_Uri}createCustomer`, tokenToSend).then((res) => {




                    let response = res.data


                    if (!response?.status) {

                        ToastAndroid.show(response?.error?.raw?.message, ToastAndroid.SHORT)
                        setLoading(false)

                        return
                    }


                    console.log(response, "response")

                    let customerId = response.customerId


                    console.log(customerId, "customerId")

                    let dataToSend = {

                        amount: data?.amount,
                        customerId: customerId
                    }

                    axios.post(`${Base_Uri}doPayment`, dataToSend).then((res) => {

                        let responseData = res.data

                        if (!responseData.status) {

                            console.log(responseData, "responseData")

                            ToastAndroid.show(responseData?.message, ToastAndroid.SHORT)
                            setLoading(false)

                            return

                        }



                        let walletData = {
                            deposit: data.amount,
                            spent: 0,
                            remainingWallet: data.amount,
                            date: new Date()
                        }

                        let id = auth()?.currentUser?.uid

                        firestore().collection("UserWallet").doc(id).set({
                            wallet: firestore.FieldValue.arrayUnion(walletData)
                        }, { merge: true }).then((res) => {

                            if (loginData?.token) {
                                var notificationData = JSON.stringify({
                                    notification: {
                                        body: `Your fare amount has been successfully deducted from your card and add in your wallet`,
                                        title: `Hi ${loginData?.fullName} `,
                                    },
                                    to: loginData.token,
                                });
                                let config = {
                                    method: 'post',
                                    url: 'https://fcm.googleapis.com/fcm/send',
                                    headers: {
                                        Authorization:
                                            'key=AAAAzwxYyNA:APA91bEU1Zss73BLEraf4jDgob9rsAfxshC0GBBxbgPo340U5DTWDVbS9MYudIPDjIvZwNH7kNkucQ0EHNQtnBcjf5gbhbn09qU0TpKagm2XvOxmAvyBSYoczFtxW7PpHgffPpdaS9fM',
                                        'Content-Type': 'application/json',
                                    },
                                    data: notificationData,
                                };
                                axios(config)
                                    .then(res => {

                                        console.log("notification succesfully send")


                                        let notification = JSON.parse(notificationData)



                                        let notificationToSend = {

                                            title: notification.notification.title,
                                            body: notification.notification.body,
                                            date: new Date()


                                        }

                                        firestore().collection("Notification").doc(loginData.id).set({
                                            notification: firestore.FieldValue.arrayUnion(notificationToSend)
                                        }, { merge: true }).then(() => {

                                            console.log("Notification has been send successfully")

                                        })



                                    })
                                    .catch(error => {
                                        console.log(error, "errorsssss")
                                    });
                            }


                            let cardData = {
                                cardHolderName: cardHolderName,
                                token: token?.id,
                                customerId: response?.customerId,
                                last4: token?.card?.last4,
                                otherDetails: token
                            }


                            firestore().collection("PassengerCards").doc(id).set({
                                cards: firestore.FieldValue.arrayUnion(cardData)
                            }, { merge: true }).then((res) => {

                                console.log("successfully add card")
                                setCardDetails(cardData)
                                setLoading(false)
                                navigation.navigate(data.type)

                            }).catch((error) => {
                                setLoading(false)
                                console.log(error)
                            })




                        }).catch((error) => {

                            setLoading(false)
                            console.log(error, "eerrrororor")

                        })





                    }).catch((error) => {
                        setLoading(false)
                        console.log(error, "error")

                    })





                }).catch((error) => {

                    console.log(error)
                    setLoading(false)
                })


                return



            }).catch((error) => {

                setLoading(false)
                console.log(error)

            })
    };

    console.log(selectedCards, "selectedCards")

    const getSelectedCard = (card, ind) => {
        setSelectedCards(card)
        setSavedCards(
            savedCards &&
            savedCards.length > 0 &&
            savedCards.map((e, i) => {
                if (ind == i) {
                    return {
                        ...e,
                        default: true,
                    };
                } else {
                    return {
                        ...e,
                        default: false,
                    };
                }
            }),
        );
    };


    return (
        <View style={{ flex: 1, backgroundColor: Colors.white }} >

            <View style={{ marginTop: 10 }} >

                <CustomHeader
                    iconname={"arrow-back-outline"}
                    color={Colors.black}
                    text="Payment Method"
                    onPress={() => navigation.goBack()}
                />

            </View>


            <View style={{ flexDirection: "row", height: 270, marginTop: 20, padding: 10 }} >
                <ScrollView horizontal={true} style={{ marginTop: 20 }}>
                    {savedCards &&
                        savedCards.length > 0 &&
                        savedCards.map((e, i) => {


                            return (
                                <CustomCard
                                    PaymentMethod="Credit Card"
                                    source={e?.otherDetails?.card?.brand == "MasterCard" ? require('../../Images/master1.png') : e?.otherDetails?.card?.brand == "Visa" ? require("../../Images/Visa.png") : ""}
                                    cardHolderName={e.cardHolderName}
                                    cardNumber={`*** **** **** ${e.last4}`}
                                    cardDate={`${e?.otherDetails?.card?.expMonth}/${e?.otherDetails?.card?.expYear}`}
                                    selected={e?.default}
                                    onPress={() => getSelectedCard(e, i)}
                                />
                            );
                        })}
                </ScrollView>
            </View>


            <ScrollView>


                <View style={{ paddingHorizontal: 15 }} >

                    <Text style={{ fontSize: 18, color: Colors.black, fontFamily: "Poppins-SemiBold" }} >Choose Payment Method</Text>

                    <View style={{ flexDirection: "row", marginTop: 10 }} >


                        <TouchableOpacity onPress={() => setCardSelected("master")} >
                            <Image source={require("../../Images/master.png")} style={{ borderWidth: 2, borderColor: cardSelected == "master" ? Colors.buttonColor : "gray", borderRadius: 10 }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setCardSelected("visa")} >
                            <Image source={require("../../Images/Visa.png")} style={{ borderWidth: 2, borderColor: cardSelected == "visa" ? Colors.buttonColor : "gray", borderRadius: 10, marginLeft: 15 }} />
                        </TouchableOpacity>

                    </View>



                    <View style={{ marginTop: 20 }} >

                        <TextInput
                            style={{
                                backgroundColor: Colors.white,
                                borderRadius: 5,
                                borderWidth: 1,
                                borderColor: Colors.gray,
                                marginTop: 10,
                                width: '100%',
                                padding: 15,
                                fontFamily: "Poppins-Medium",
                                color: Colors.black,
                                fontSize: 16,
                                paddingHorizontal: 20,
                            }}
                            placeholder="Name of the card holder"
                            onChangeText={(e) => setCardHolderName(e)}
                            placeholderTextColor={Colors.gray}
                        />

                        {/* <TextInput
                        style={{
                            backgroundColor: Colors.white,
                            borderRadius: 5,
                            borderWidth: 1,
                            borderColor: Colors.gray,
                            marginTop: 20,
                            width: '100%',
                            padding: 15,
                            fontFamily: "Poppins-Medium",
                            color: Colors.black,
                            fontSize: 16,
                            paddingHorizontal: 20,
                        }}
                        placeholder="Card Number"
                        placeholderTextColor={Colors.gray}
                    /> */}


                        <CardField
                            postalCodeEnabled={false}
                            cardStyle={{
                                backgroundColor: '#FFFFFF',
                                textColor: '#000000',
                                borderWidth: 1,
                                borderRadius: 10,
                                placeholderColor: "gray"

                            }}


                            style={{
                                width: '100%',
                                color: "black",
                                borderWidth: 1,
                                height: 60,
                                marginTop: 15,

                                borderColor: Colors.black,
                                padding: 15,
                                fontSize: 16,
                                paddingHorizontal: 20,
                                borderRadius: 10
                            }}
                            onCardChange={(cardDetails) => {
                                setCardDetail(cardDetails)
                            }}
                            onFocus={(focusedField) => {
                                console.log('focusField', focusedField);
                            }}
                        />
                        <View style={{ marginTop: 20, flexDirection: "row", width: "100%", justifyContent: "space-between", alignItems: "center" }} >

                            {/* <TextInput
                            style={{
                                backgroundColor: Colors.white,
                                borderRadius: 5,
                                borderWidth: 1,
                                borderColor: Colors.gray,
                                width: '49%',
                                padding: 15,
                                fontFamily: "Poppins-Medium",
                                color: Colors.black,
                                fontSize: 16,
                                paddingHorizontal: 20,
                            }}
                            placeholder="MM/YY"
                            placeholderTextColor={Colors.gray}
                        />
                        <TextInput
                            style={{
                                backgroundColor: Colors.white,
                                borderRadius: 5,
                                borderWidth: 1,
                                borderColor: Colors.gray,
                                width: '49%',
                                padding: 15,
                                fontFamily: "Poppins-Medium",
                                color: Colors.black,
                                fontSize: 16,
                                paddingHorizontal: 20,
                            }}
                            placeholder="CVC"
                            placeholderTextColor={Colors.gray}
                        /> */}


                        </View>


                        <CustomButton
                            text={loading ? <ActivityIndicator color={Colors.white} size="small" /> : "Next"}
                            onPress={() => handlePayment()}
                            styleContainer={{ alignSelf: "center", marginTop: 30, width: "90%" }}

                        />

                    </View>

                </View>

            </ScrollView>


        </View>
    )
}

export default PaymentMethod