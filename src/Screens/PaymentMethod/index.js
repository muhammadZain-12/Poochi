import React, { useState, useEffect } from "react"
import { View, Text, Image, TouchableOpacity, TextInput } from "react-native"
import CustomHeader from "../../Components/CustomHeader"
import CustomButton from "../../Components/CustomButton"
import Colors from "../../Constant/Color"
import { ThemeProvider } from "@react-navigation/native"

function PaymentMethod({ navigation }) {

    const [cardSelected, setCardSelected] = useState("master")

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
                            fontFamily:"Poppins-Medium",
                            color: Colors.black,
                            fontSize: 16,
                            paddingHorizontal: 20,
                        }}
                        placeholder="Name of the card holder"
                        placeholderTextColor={Colors.gray}
                    />

                    <TextInput
                        style={{
                            backgroundColor: Colors.white,
                            borderRadius: 5,
                            borderWidth: 1,
                            borderColor: Colors.gray,
                            marginTop: 20,
                            width: '100%',
                            padding: 15,
                            fontFamily:"Poppins-Medium",
                            color: Colors.black,
                            fontSize: 16,
                            paddingHorizontal: 20,
                        }}
                        placeholder="Card Number"
                        placeholderTextColor={Colors.gray}
                    />

                    <View style={{marginTop:20,flexDirection:"row",width:"100%",justifyContent:"space-between",alignItems:"center"}} >

                    <TextInput
                        style={{
                            backgroundColor: Colors.white,
                            borderRadius: 5,
                            borderWidth: 1,
                            borderColor: Colors.gray,
                            width: '49%',
                            padding: 15,
                            fontFamily:"Poppins-Medium",
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
                            fontFamily:"Poppins-Medium",
                            color: Colors.black,
                            fontSize: 16,
                            paddingHorizontal: 20,
                        }}
                        placeholder="CVC"
                        placeholderTextColor={Colors.gray}
                    />


                    </View>


                            <CustomButton
                            text={"Next"}
                            styleContainer={{alignSelf:"center",marginTop:30}}
                            
                            />

                </View>

            </View>


        </View>
    )
}

export default PaymentMethod