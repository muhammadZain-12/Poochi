import React, { useState } from "react"
import { View, Text, TouchableOpacity, TextInput, ScrollView } from "react-native"
import Colors from "../../Constant/Color"
import CustomButton from "../../Components/CustomButton"
import CustomHeader from "../../Components/CustomHeader"
import Icons from "react-native-vector-icons/Feather"

function RideCancel({ navigation }) {

    const [waiting, setWating] = useState(false)
    const [contactDriver, setContactDriver] = useState(false)
    const [deniedDestination, setDeniedDestination] = useState(false)
    const [deniedPickup, setDeniedPickup] = useState(false)
    const [wrongAddress, setWrongAddress] = useState(false)
    const [priceNotReasonable, setPriceNotReasonable] = useState(false)
    const [other, setOther] = useState("")

    return (
        <View style={{ flex: 1, backgroundColor: Colors.white }} >

            <View style={{ marginTop: 5 }} >
                <CustomHeader
                    onPress={() => navigation.goBack()}
                    iconname={"arrow-back-outline"}
                    text="Cancel Ride"
                    color={Colors.black}
                />
            </View>

            <ScrollView>

                <View style={{ paddingHorizontal: 20, marginTop: 20 }} >

                    <Text style={{ fontSize: 14, fontFamily: "Poppins-Medium", color: "#808080" }} >Please select the reason of cancellation.</Text>


                    <View style={{ padding: 10, borderWidth: 1, borderColor: waiting ? Colors.buttonColor : Colors.gray, borderRadius: 10, marginTop: 10, paddingVertical: 20, flexDirection: "row" }} >

                        <TouchableOpacity onPress={() => setWating(!waiting)} style={{ width: 25, height: 25, borderRadius: 5, borderWidth: 1, borderColor: Colors.gray, backgroundColor: waiting ? Colors.buttonColor : Colors.white, justifyContent: "center", alignItems: "center" }} >

                            {waiting && <Icons name="check" size={20} color={Colors.white} />}

                        </TouchableOpacity>

                        <Text style={{ marginLeft: 10, fontFamily: "Poppins-Medium", fontSize: 16, color: "#808080" }} >Waiting for long time</Text>

                    </View>
                    <View style={{ padding: 10, borderWidth: 1, borderColor: contactDriver ? Colors.buttonColor : Colors.gray, borderRadius: 10, marginTop: 10, paddingVertical: 20, flexDirection: "row" }} >

                        <TouchableOpacity onPress={() => setContactDriver(!contactDriver)} style={{ width: 25, height: 25, borderRadius: 5, borderWidth: 1, borderColor: Colors.gray, justifyContent: "center", alignItems: "center", backgroundColor: contactDriver ? Colors.buttonColor : Colors.white }} >
                            {contactDriver && <Icons name="check" size={20} color={Colors.white} />}

                        </TouchableOpacity>

                        <Text style={{ marginLeft: 10, fontFamily: "Poppins-Medium", fontSize: 16, color: "#808080" }} >Unable to contact driver</Text>

                    </View>
                    <View style={{ padding: 10, borderWidth: 1, borderColor: deniedDestination ? Colors.buttonColor : Colors.gray, borderRadius: 10, marginTop: 10, paddingVertical: 20, flexDirection: "row" }} >

                        <TouchableOpacity onPress={() => setDeniedDestination(!deniedDestination)} style={{ width: 25, height: 25, borderRadius: 5, borderWidth: 1, borderColor: Colors.gray, backgroundColor: deniedDestination ? Colors.buttonColor : Colors.white, alignItems: "center", justifyContent: "center" }} >
                            {deniedDestination && <Icons name="check" size={20} color={Colors.white} />}

                        </TouchableOpacity >

                        <Text style={{ marginLeft: 10, fontFamily: "Poppins-Medium", fontSize: 16, color: "#808080" }} >Driver denied to go to destination</Text>

                    </View>
                    <View style={{ padding: 10, borderWidth: 1, borderColor: deniedPickup ? Colors.buttonColor : Colors.gray, borderRadius: 10, marginTop: 10, paddingVertical: 20, flexDirection: "row" }} >

                        <TouchableOpacity onPress={() => setDeniedPickup(!deniedPickup)} style={{ width: 25, height: 25, borderRadius: 5, borderWidth: 1, borderColor: Colors.gray, backgroundColor: deniedPickup ? Colors.buttonColor : Colors.white, alignItems: "center", justifyContent: "center" }} >
                            {deniedPickup && <Icons name="check" size={20} color={Colors.white} />}

                        </TouchableOpacity >

                        <Text style={{ marginLeft: 10, fontFamily: "Poppins-Medium", fontSize: 16, color: "#808080" }} >Driver denied to come to pickup</Text>

                    </View>
                    <View style={{ padding: 10, borderWidth: 1, borderColor: wrongAddress ? Colors.buttonColor : Colors.gray, borderRadius: 10, marginTop: 10, paddingVertical: 20, flexDirection: "row" }} >

                        <TouchableOpacity onPress={() => setWrongAddress(!wrongAddress)} style={{ width: 25, height: 25, borderRadius: 5, borderWidth: 1, borderColor: Colors.gray, backgroundColor: wrongAddress ? Colors.buttonColor : Colors.white, alignItems: "center", justifyContent: "center" }} >
                            {wrongAddress && <Icons name="check" size={20} color={Colors.white} />}

                        </TouchableOpacity >

                        <Text style={{ marginLeft: 10, fontFamily: "Poppins-Medium", fontSize: 16, color: "#808080" }} >Wrong address shown</Text>

                    </View>
                    <View style={{ padding: 10, borderWidth: 1, borderColor: priceNotReasonable ? Colors.buttonColor : Colors.gray, borderRadius: 10, marginTop: 10, paddingVertical: 20, flexDirection: "row" }} >

                        <TouchableOpacity onPress={() => setPriceNotReasonable(!priceNotReasonable)} style={{ width: 25, height: 25, borderRadius: 5, borderWidth: 1, borderColor: Colors.gray, backgroundColor: priceNotReasonable ? Colors.buttonColor : Colors.white, alignItems: "center", justifyContent: "center" }} >
                            {priceNotReasonable && <Icons name="check" size={20} color={Colors.white} />}

                        </TouchableOpacity >

                        <Text style={{ marginLeft: 10, fontFamily: "Poppins-Medium", fontSize: 16, color: "#808080" }} >The price is not reasonable</Text>

                    </View>


                    <TextInput multiline={true} numberOfLines={6} style={{ fontSize: 16, color: "#808080", fontFamily: "Poppins-Medium", borderWidth: 1, borderColor: Colors.gray, marginTop: 10, borderRadius: 10, padding: 10 }}
                        placeholder="Other"
                        placeholderTextColor={Colors.gray}
                        textAlignVertical="top"
                    />

                    <CustomButton styleContainer={{ width: "100%", marginVertical: 20, marginBottom: 30 }} text={"Submit"} />

                </View>

            </ScrollView>

        </View>
    )
}

export default RideCancel