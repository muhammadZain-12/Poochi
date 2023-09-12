import React, { useState } from "react"
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native"
import CustomHeader from "../../Components/CustomHeader"
import CustomButton from "../../Components/CustomButton"
import Colors from "../../Constant/Color"



function SinglePetDetail({ navigation, route }) {

    const [openEditOption, setOpenEditOption] = useState(false)

    let data = route.params


    console.log(data, "data")


    const OpenEditAndDelete = () => {

        setOpenEditOption(!openEditOption)

    }

    return <View style={{ flex: 1, backgroundColor: Colors.white }} >

        <View style={{ marginTop: 5 }} >
            <CustomHeader
                onPress={() => navigation.goBack()}
                iconname={"arrow-back-outline"}
                text={data.name}
                color={Colors.black}
                image={require("../../Images/dots.png")}
                imageFunc={OpenEditAndDelete}

            />
            {
                openEditOption && <View style={{ position: "absolute", right: 20, top: 30, zIndex: 20, backgroundColor: "green", width: 100 }} >

                    <Text style={{ fontSize: 16, fontFamily: "Poppins-Medium", color: Colors.black, textAlign: "center", borderWidth: 1, borderColor: "white", padding: 5, zIndex: 10 }} >Edit</Text>
                    <Text style={{ fontSize: 16, fontFamily: "Poppins-Medium", color: Colors.black, textAlign: "center", borderWidth: 1, borderColor: "white", padding: 5, zIndex: 10 }} >Delete</Text>


                </View>
            }
        </View>

        <ScrollView>

            <View style={{ paddingHorizontal: 20, marginTop: 10 }} >


                <Image source={data.image} style={{ width: "100%", height: 300, marginTop: 10 }} />


                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }} >

                    <View>
                        <Text style={{ fontSize: 20, fontFamily: "Poppins-SemiBold", color: Colors.black, textTransform: "uppercase", textAlignVertical: "bottom" }} >{data.name}</Text>
                        <Text style={{ fontSize: 12, fontFamily: "Poppins-Medium", color: Colors.gray, textTransform: "uppercase" }} >{data.breed}</Text>
                    </View>

                    <Text style={{ fontSize: 14, fontFamily: "Poppins-Medium", color: Colors.gray, textTransform: "uppercase" }} >{data.category}</Text>
                </View>


                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }} >

                    <View style={{ width: "32%", height: 100, backgroundColor: "rgba(25,162,13,0.3)", borderRadius: 10, justifyContent: "center", alignItems: "center" }} >

                        <Text style={{ fontSize: 22, fontFamily: "Poppins-Medium", color: Colors.black, textTransform: "uppercase", }} >
                            {data.gender}
                        </Text>
                        <Text style={{ fontSize: 16, fontFamily: "Poppins-Medium", color: Colors.gray, textTransform: "uppercase", opacity: 1 }} >
                            Sex
                        </Text>
                    </View>

                    <View style={{ width: "32%", height: 100, backgroundColor: "rgba(13,153,162,0.3)", borderRadius: 10, justifyContent: "center", alignItems: "center" }} >

                        <Text style={{ fontSize: 22, fontFamily: "Poppins-Medium", color: Colors.black, textTransform: "uppercase", }} >
                            {data.weight} Kg
                        </Text>
                        <Text style={{ fontSize: 16, fontFamily: "Poppins-Medium", color: Colors.gray, textTransform: "uppercase", opacity: 1 }} >
                            Weight
                        </Text>
                    </View>

                    <View style={{ width: "32%", height: 100, backgroundColor: "rgba(150,162,13,0.3)", borderRadius: 10, justifyContent: "center", alignItems: "center" }} >

                        <Text style={{ fontSize: 22, fontFamily: "Poppins-Medium", color: Colors.black, textTransform: "uppercase", }} >
                            {data.height} in
                        </Text>
                        <Text style={{ fontSize: 16, fontFamily: "Poppins-Medium", color: Colors.gray, textTransform: "uppercase", opacity: 1 }} >
                            Height
                        </Text>
                    </View>
                </View>


                <Text style={{ fontSize: 22, fontFamily: "Poppins-SemiBold", color: Colors.black, marginTop: 10, height: 30 }} >
                    Details
                </Text>

                <Text style={{ fontSize: 16, fontFamily: "Poppins-Medium", color: Colors.gray }} >
                    {data.details}
                </Text>

                <Text style={{ fontSize: 22, fontFamily: "Poppins-SemiBold", color: Colors.black, marginTop: 10, height: 25 }} >
                    Nature Of Pet
                </Text>

                <Text style={{ fontSize: 16, fontFamily: "Poppins-Medium", color: Colors.gray, textTransform: "uppercase" }} >
                    {data.natureOfPet}
                </Text>

                <Text style={{ fontSize: 22, fontFamily: "Poppins-SemiBold", color: Colors.black, marginTop: 10, height: 30 }} >
                    Injury or health issue
                </Text>

                <Text style={{ fontSize: 16, fontFamily: "Poppins-Medium", color: Colors.gray, textTransform: "uppercase", marginBottom: 20 }} >
                    {data.injuryOrHealthIssue}
                </Text>


            </View>

        </ScrollView>

    </View>
}


export default SinglePetDetail