import React, { useState } from "react"
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native"
import CustomHeader from "../../Components/CustomHeader"
import Colors from "../../Constant/Color"
import firestore from "@react-native-firebase/firestore"
import auth from "@react-native-firebase/auth"

function Pets({ navigation, route }) {


    let routeData = route.params

    const [pets, setPets] = useState([

        // {

    ])


    const getUserPets = async () => {

        let id = auth().currentUser?.uid

        firestore().collection("Pets").doc(id).get().then((doc) => {

            let userPets = doc?.data()

            if (userPets?.pets) {

                setPets(userPets.pets)


            }
            else {
                setPets([])
            }

        })



    }

    React.useEffect(() => {

        getUserPets()

    }, [routeData])




    return (

        <View style={{ flex: 1, backgroundColor: Colors.white }} >

            <View style={{ marginTop: 10 }} >
                <CustomHeader
                    onPress={() => navigation.goBack()}
                    iconname={"arrow-back-outline"}
                    text="Pets"
                    color={Colors.black}
                    // image={require("../../Images/plus.png")}
                    // imageFunc={() => navigation.navigate('Tab', {
                    //     screen: 'PetDetails',
                    // })}
                />
            </View>

            <ScrollView>

                <View style={{ marginTop: 10, paddingHorizontal: 15, width: "100%", flexWrap: "wrap", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>

                    {pets && pets.length > 0 && pets.map((e, i) => {
                        return (
                            <TouchableOpacity onPress={() => navigation.navigate("SinglePetDetails", e)} key={i} style={{ width: "48%", marginTop: 20 }} >

                                <Image source={{ uri: e.image1 }} style={{ width: "100%", height: 180, borderRadius: 10 }} resizeMode="cover" />

                                <Text style={{ fontSize: 18, textAlign: "center", fontFamily: "Poppins-SemiBold", color: Colors.black }} >{e.petName}</Text>
                                <Text style={{ fontSize: 14, textAlign: "center", fontFamily: "Poppins-Regular", color: Colors.gray }} >{e.breed}</Text>

                            </TouchableOpacity>
                        )
                    })}

                    <TouchableOpacity onPress={() => navigation.navigate("Tab", {
                        screen: "PetDetails",
                        params: {
                            screen: "Pets"
                        }
                    })} style={{ width: "48%", height: 180, backgroundColor: "#e6e6e6", borderRadius: 10, justifyContent: "center", alignItems: "center",marginTop:20}} >

                        <Image source={require("../../Images/add.png")} />

                    </TouchableOpacity>



                </View>
            </ScrollView>


        </View>


    )


}

export default Pets