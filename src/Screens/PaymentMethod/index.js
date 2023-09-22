import React, { useState, useEffect, useContext } from "react"
import { View, Text, Image, TouchableOpacity, TextInput, ToastAndroid, ActivityIndicator } from "react-native"
import CustomHeader from "../../Components/CustomHeader"
import CustomButton from "../../Components/CustomButton"
import Colors from "../../Constant/Color"
import { useStripe, CardField } from '@stripe/stripe-react-native';
import { initStripe } from '@stripe/stripe-react-native';
import cardDetailsContext from "../../Context/CardDetailsContext/context"


function PaymentMethod({ navigation, route }) {


    let data = route.params

    const [cardSelected, setCardSelected] = useState("master")
    const [cardDetail, setCardDetail] = useState("")
    const [cardHolderName, setCardHolderName] = useState("")
    const [loading, setLoading] = useState(false)


    const cardCont = useContext(cardDetailsContext)
    const { cardDetails, setCardDetails } = cardCont

    useEffect(() => {
        async function initialize() {
            await initStripe({
                publishableKey:
                    'pk_test_51Ns5qjEIzbD1XxPEyV0X99pxj7tfmuq409BG0so0rlEOBy8YwGsVUhBrAt3vBiukTHt9lGwI3qBmoKA1XL3hNsrt007AxKXaFm',
            });
        }
        initialize().catch(console.error);
    }, []);


    const { createToken } = useStripe();




    const handlePayment = async () => {



        console.log(cardDetail, "cardDetails")

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
                setLoading(false)
                let token = res?.token;


                let cardData = {
                    cardHolderName: cardHolderName,
                    token: token.id,
                    last4: token?.card?.last4,
                    otherDetails: token
                }

                setCardDetails(cardData)

                navigation.navigate(route.params)



            }).catch((error) => {

                setLoading(false)
                console.log(error)

            })
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


            <View style={{ paddingHorizontal: 15, marginTop: 10 }} >

                <Text style={{ fontSize: 18, color: Colors.black, fontFamily: "Poppins-SemiBold" }} >Choose Payment Method</Text>

                <View style={{ flexDirection: "row", marginTop: 10 }} >


                    <TouchableOpacity onPress={() => setCardSelected("master")} >
                        <Image source={require("../../Images/master.png")} style={{ borderWidth: 2, borderColor: cardSelected == "master" ? Colors.buttonColor : "gray", borderRadius: 10 }} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setCardSelected("visa")} >
                        <Image source={require("../../Images/Visa.png")} style={{ borderWidth: 2, borderColor: cardSelected == "visa" ? Colors.buttonColor : "gray", borderRadius: 10, marginLeft: 15 }} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setCardSelected("paypal")} >
                        <Image source={require("../../Images/paypal.png")} style={{ borderWidth: 2, borderColor: cardSelected == "paypal" ? Colors.buttonColor : "gray", borderRadius: 10, marginLeft: 15 }} />
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


        </View>
    )
}

export default PaymentMethod