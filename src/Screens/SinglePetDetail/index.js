import React, { useState } from "react"
import { View, Text, TouchableOpacity, Image, ScrollView, ToastAndroid, StatusBar } from "react-native"
import CustomHeader from "../../Components/CustomHeader"
import CustomButton from "../../Components/CustomButton"
import Colors from "../../Constant/Color"
import firestore from "@react-native-firebase/firestore"
import auth from "@react-native-firebase/auth"
import Entypo from "react-native-vector-icons/Entypo"
import IonIcons from "react-native-vector-icons/Ionicons"


function SinglePetDetail({ navigation, route }) {

    const [openEditOption, setOpenEditOption] = useState(false)

    let data = route.params


    const OpenEditAndDelete = () => {

        setOpenEditOption(!openEditOption)

    }

    const handleDeletePet = async () => {

        let id = auth().currentUser?.uid

        firestore().collection("Pets").doc(id).get().then((doc) => {
            let petData = doc.data()

            let pets = petData.pets

            let petsToSend = pets && pets.length > 0 && pets.filter((e, i) => e.petId !== data.petId)


            let sendingData = {
                pets: petsToSend
            }

            firestore().collection("Pets").doc(id).set(sendingData).then((res) => {
                ToastAndroid.show("Pet has been succesfully deleted", ToastAndroid.SHORT)
                navigation.navigate("Pets", petsToSend)
            }).catch((error) => {
                ToastAndroid.show(error?.message, ToastAndroid.SHORT)
            })
        })
    }


    const handleEditPet = () => {

        navigation.navigate("PetDetails", data)

    }

    return <View style={{ flex: 1, backgroundColor: "rgba(246, 255, 245, 1)" }} >

        <View style={{ marginTop: 5 }} >


            <StatusBar
                animated={true}
                backgroundColor="rgba(246, 255, 245, 1)"
                barStyle={'dark-content'}
            />

            <View style={{ margin: 20, marginBottom: 0, padding: 10, paddingVertical: 20, borderWidth: 1, borderColor: "#B2B1B1", borderRadius: 10, backgroundColor: Colors.white, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }} >


                <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 35, height: 35, borderWidth: 2, justifyContent: "center", alignItems: "center", borderRadius: 10, borderColor: "#D9D9D9" }} >
                    <IonIcons

                        name="chevron-back-outline"
                        size={20}
                        color={Colors.black}

                    />
                </TouchableOpacity>

                <View  >
                    <Text style={{ color: Colors.black, fontFamily: "Poppins-Bold", fontSize: 14, lineHeight: 20, textAlign: "center" }} >Pet Details</Text>

                    {/* <Text style={{ color: "#A7A7A7", fontFamily: "Poppins-Medium", fontSize: 12, lineHeight: 15 }} >{loginData?.city}, {loginData?.country?.value} </Text> */}


                </View>


                <View>
                    <TouchableOpacity onPress={() => setOpenEditOption(!openEditOption)} style={{ width: 35, height: 35, justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: "#CCCCCC", borderRadius: 7 }} >

                        <Entypo name="dots-three-vertical" size={20} color={Colors.gray} />

                    </TouchableOpacity>
                    {
                        openEditOption && <View style={{ position: "absolute", right: 0, top: 35, zIndex: 20, backgroundColor: "green", width: 100, }} >
                            <TouchableOpacity onPress={handleEditPet}  >
                                <Text style={{ fontSize: 16, fontFamily: "Poppins-Medium", color: Colors.black, textAlign: "center", borderWidth: 1, borderColor: "white", padding: 5, zIndex: 10 }} >Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleDeletePet} >
                                <Text style={{ fontSize: 16, fontFamily: "Poppins-Medium", color: Colors.black, textAlign: "center", borderWidth: 1, borderColor: "white", padding: 5, zIndex: 10 }} >Delete</Text>
                            </TouchableOpacity>


                        </View>
                    }
                </View>
            </View>



            {/* <CustomHeader
                onPress={() => navigation.goBack()}
                iconname={"arrow-back-outline"}
                text={data.name}
                color={Colors.black}
                rightIcon
                rightIconName={"dots-three-vertical"}
                rightIconFunc={OpenEditAndDelete}
            // image={require("../../Images/dots.png")}
            // imageFunc={OpenEditAndDelete}

            /> */}

        </View>

        <ScrollView>

            <View style={{ paddingHorizontal: 20, marginTop: 10 }} >


                <Image source={{ uri: data.image1 }} style={{ width: "100%", height: 400, marginTop: openEditOption ? 60 : 10, borderRadius: 10 }} />


                <View style={{ marginTop: 20, width: "100%", alignSelf: "center", borderWidth: 1.5, borderColor: Colors.buttonColor, borderRadius: 8, padding: 10, backgroundColor: Colors.white }} >

                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }} >
                        <View>
                            <Text style={{ fontSize: 20, fontFamily: "Poppins-SemiBold", color: Colors.black, lineHeight: 25, textTransform: "uppercase", textAlignVertical: "bottom" }} >{data.petName}</Text>
                            <Text style={{ fontSize: 12, fontFamily: "Poppins-Medium", color: "#808080", textTransform: "uppercase", lineHeight: 15 }} >{data.breed}</Text>
                        </View>
                        <Text style={{ fontSize: 16, fontFamily: "Poppins-SemiBold", color: "#808080", textTransform: "uppercase" }} >{data.typeOfPet}</Text>
                    </View>


                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10, width: "100%" }} >

                        <View style={{ width: "48%", height: 100, backgroundColor: "#FBF3EC", borderRadius: 10, justifyContent: "center", padding: 10 }} >

                            <Text style={{ fontSize: 10, fontFamily: "Poppins-Medium", color: Colors.gray, textTransform: "uppercase", }} >
                                Gender
                            </Text>
                            <Text style={{ fontSize: 14, fontFamily: "Poppins-Medium", color: "#A36D37", textTransform: "uppercase", opacity: 1 }} >
                                {data?.gender}
                            </Text>
                        </View>

                        <View style={{ width: "48%", height: 100, backgroundColor: "rgba(13,153,162,0.3)", borderRadius: 10, justifyContent: "center", padding: 10 }} >

                            <Text style={{ fontSize: 10, fontFamily: "Poppins-Medium", color: Colors.gray, textTransform: "uppercase", }} >
                                {data.size?.size}
                            </Text>
                            <Text style={{ fontSize: 14, fontFamily: "Poppins-Medium", color: Colors.black, textTransform: "uppercase", opacity: 1 }} >
                                {data.size?.weight}
                            </Text>
                        </View>

                        {/* <View style={{ width: "32%", height: 100, backgroundColor: "rgba(150,162,13,0.3)", borderRadius: 10, justifyContent: "center", alignItems: "center" }} >

    <Text style={{ fontSize: 22, fontFamily: "Poppins-Medium", color: Colors.black, textTransform: "uppercase", }} >
        {data.height} in
    </Text>
    <Text style={{ fontSize: 16, fontFamily: "Poppins-Medium", color: Colors.gray, textTransform: "uppercase", opacity: 1 }} >
        Height
    </Text>
</View> */}
                    </View>



                </View>


                <View style={{ padding: 10, borderWidth: 1.5, borderColor: Colors.gray, borderRadius: 8, marginTop: 20, marginBottom: 20, backgroundColor: Colors.white }} >

                    <Text style={{ fontSize: 16, fontFamily: "Poppins-SemiBold", color: Colors.black, marginTop: 10, lineHeight: 20 }} >
                        Details
                    </Text>

                    <Text style={{ fontSize: 12, fontFamily: "Poppins-Medium", color: Colors.gray, lineHeight: 17 }} >
                        {data.additionalDetails ? data.additionalDetails : "No Addtional Details"}
                    </Text>

                    <Text style={{ fontSize: 16, fontFamily: "Poppins-SemiBold", color: Colors.black, marginTop: 10, lineHeight: 20 }} >
                        Nature Of Pet
                    </Text>

                    <Text style={{ fontSize: 12, fontFamily: "Poppins-Medium", color: Colors.gray, textTransform: "uppercase", lineHeight: 17 }} >
                        {data.natureOfPet}
                    </Text>

                    <Text style={{ fontSize: 16, fontFamily: "Poppins-SemiBold", color: Colors.black, marginTop: 10, lineHeight: 20 }} >
                        Injury Or Health Issues
                    </Text>

                    <Text style={{ fontSize: 12, fontFamily: "Poppins-Medium", color: Colors.gray, textTransform: "uppercase", lineHeight: 17 }} >
                        {data.healthIssue ? "yes" : "no"}
                    </Text>

                </View>
            </View>

        </ScrollView>

    </View>
}


export default SinglePetDetail