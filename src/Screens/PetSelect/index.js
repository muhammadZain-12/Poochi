import React, { useState } from "react"
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native"
import CustomHeader from "../../Components/CustomHeader"
import Colors from "../../Constant/Color"


function PetSelect({ navigation }) {


    const [pets, setPets] = useState([

        {
            image: require("../../Images/pet1.png"),
            name: "Capri",
            breed: "Ragdoll"
        },
        {
            image: require("../../Images/pet2.png"),
            name: "Lucy",
            breed: "Ragdoll"
        },
        {
            image: require("../../Images/pet3.png"),
            name: "Raddy",
            breed: "Ragdoll"
        },
        {
            image: require("../../Images/pet1.png"),
            name: "Tito",
            breed: "Ragdoll"
        },
        {
            image: require("../../Images/pet2.png"),
            name: "Jacki",
            breed: "Ragdoll"
        },
        {
            image: require("../../Images/pet3.png"),
            name: "Argos",
            breed: "Ragdoll"
        },
        {
            image: require("../../Images/pet1.png"),
            name: "Capri",
            breed: "Ragdoll"
        },
        {
            image: require("../../Images/pet2.png"),
            name: "Raddy",
            breed: "Ragdoll"
        },



    ])




    return (

        <View style={{ flex: 1, backgroundColor: Colors.white }} >

            <View style={{ marginTop: 5 }} >
                <CustomHeader
                    onPress={() => navigation.goBack()}
                    iconname={"arrow-back-outline"}
                    text="Pet Select"
                    color={Colors.black}
                />
            </View>

            <ScrollView>

                <View style={{ marginTop: 10, paddingHorizontal: 15, width: "100%", flexWrap: "wrap", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>

                    {pets && pets.length > 0 && pets.map((e, i) => {
                        return (
                            <TouchableOpacity key={i} style={{ width: "48%", marginTop: 20 }} >

                                <Image source={e.image} style={{ width: "100%" }} />

                                <Text style={{ fontSize: 18, textAlign: "center", fontFamily: "Poppins-SemiBold", color: Colors.black }} >{e.name}</Text>
                                <Text style={{ fontSize: 14, textAlign: "center", fontFamily: "Poppins-Regular", color: Colors.gray }} >{e.breed}</Text>

                            </TouchableOpacity>
                        )
                    })}


                </View>
            </ScrollView>


        </View>


    )


}

export default PetSelect