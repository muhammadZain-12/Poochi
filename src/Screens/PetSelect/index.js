import React, { useState, useContext, useEffect } from "react"
import { View, Text, TouchableOpacity, Image, ScrollView, ToastAndroid, BackHandler } from "react-native"
import CustomHeader from "../../Components/CustomHeader"
import Colors from "../../Constant/Color"
import firestore from "@react-native-firebase/firestore"
import auth from "@react-native-firebase/auth"
import SelectedPetContext from "../../Context/SelectedPetContext/context"
import { useIsFocused } from "@react-navigation/native"

function PetSelect({ navigation, route }) {


    let routeData = route.params

    const focus = useIsFocused()

    console.log(routeData, "routeData")

    const selectedPetsCont = useContext(SelectedPetContext)

    let { selectedPets, setSelectedPets } = selectedPetsCont

    const [pets, setPets] = useState([

        // {
        //     image: require("../../Images/pet1.png"),
        //     name: "Capri",
        //     breed: "Ragdoll",
        //     category: "dog",
        //     gender: "male",
        //     height: "20",
        //     weight: "20",
        //     details: "Collection systems for PET products are well established so that recycling of PET can be practiced on a large scale.",
        //     natureOfPet: "angry",
        //     injuryOrHealthIssue: "no"
        // },
        // {
        //     image: require("../../Images/pet2.png"),
        //     name: "Lucy",
        //     breed: "Ragdoll",
        //     category: "dog",
        //     gender: "male",
        //     height: "20",
        //     weight: "20",
        //     details: "Collection systems for PET products are well established so that recycling of PET can be practiced on a large scale.",
        //     natureOfPet: "angry",
        //     injuryOrHealthIssue: "no"
        // },
        // {
        //     image: require("../../Images/pet3.png"),
        //     name: "Raddy",
        //     breed: "Ragdoll",
        //     category: "dog",
        //     gender: "male",
        //     height: "20",
        //     weight: "20",
        //     details: "Collection systems for PET products are well established so that recycling of PET can be practiced on a large scale.",
        //     natureOfPet: "angry",
        //     injuryOrHealthIssue: "no"
        // },
        // {
        //     image: require("../../Images/pet1.png"),
        //     name: "Tito",
        //     breed: "Ragdoll",
        //     category: "dog",
        //     gender: "male",
        //     height: "20",
        //     weight: "20",
        //     details: "Collection systems for PET products are well established so that recycling of PET can be practiced on a large scale.",
        //     natureOfPet: "angry",
        //     injuryOrHealthIssue: "no"
        // },
        // {
        //     image: require("../../Images/pet2.png"),
        //     name: "Jacki",
        //     breed: "Ragdoll",
        //     category: "dog",
        //     gender: "male",
        //     height: "20",
        //     weight: "20",
        //     details: "Collection systems for PET products are well established so that recycling of PET can be practiced on a large scale.",
        //     natureOfPet: "angry",
        //     injuryOrHealthIssue: "no"
        // },
        // {
        //     image: require("../../Images/pet3.png"),
        //     name: "Argos",
        //     breed: "Ragdoll",
        //     category: "dog",
        //     gender: "male",
        //     height: "20",
        //     weight: "20",
        //     details: "Collection systems for PET products are well established so that recycling of PET can be practiced on a large scale.",
        //     natureOfPet: "angry",
        //     injuryOrHealthIssue: "no"
        // },
        // {
        //     image: require("../../Images/pet1.png"),
        //     name: "Capri",
        //     breed: "Ragdoll",
        //     category: "dog",
        //     gender: "male",
        //     height: "20",
        //     weight: "20",
        //     details: "Collection systems for PET products are well established so that recycling of PET can be practiced on a large scale.",
        //     natureOfPet: "angry",
        //     injuryOrHealthIssue: "no"
        // },
        // {
        //     image: require("../../Images/pet2.png"),
        //     name: "Raddy",
        //     breed: "Ragdoll",
        //     category: "dog",
        //     gender: "male",
        //     height: "20",
        //     weight: "20",
        //     details: "Collection systems for PET products are well established so that recycling of PET can be practiced on a large scale.",
        //     natureOfPet: "angry",
        //     injuryOrHealthIssue: "no"
        // },

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

    }, [routeData, focus])


    const handleSelectPet = (selectedPet) => {


        let flag = selectedPets && selectedPets.length > 0 && selectedPets.some((e, i) => e.petId == selectedPet.petId)

        if (flag) {
            ToastAndroid.show("You have already selected this pet", ToastAndroid.SHORT)
            return
        }

        setSelectedPets([...selectedPets, selectedPet])
        navigation.navigate(route.params)

    }

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            // Replace 'TabScreenName' with the name of your tab screen
            // This will navigate to the specified tab screen when the back button is pressed

            navigation.navigate(routeData)

            return true; // Return true to prevent the default back action

        });

        return () => backHandler.remove(); // Cleanup the event listener

    }, []);





    return (

        <View style={{ flex: 1, backgroundColor: Colors.white }} >

            <View style={{ marginTop: 5 }} >
                <CustomHeader
                    onPress={() => navigation.navigate(routeData)}
                    iconname={"arrow-back-outline"}
                    text="Select Pet"
                    color={Colors.black}
                    // image={require("../../Images/plus.png")}
                    // imageFunc={() => navigation.navigate('Tab', {
                    //     screen: 'PetDetails',
                    //     params: {
                    //         screen: "PetSelect",
                    //         name: routeData
                    //     }
                    // })}
                />
            </View>

            <ScrollView>

                <View style={{ marginTop: 10, paddingHorizontal: 15, width: "100%", flexWrap: "wrap", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>

                    {pets && pets.length > 0 && pets.map((e, i) => {
                        return (
                            <TouchableOpacity onPress={() => handleSelectPet(e)} key={i} style={{ width: "48%", marginTop: 20 }} >

                                <Image source={{ uri: e.image1 }} style={{ width: "100%", height: 180, borderRadius: 10 }} resizeMode="cover" />

                                <Text style={{ fontSize: 18, textAlign: "center", fontFamily: "Poppins-SemiBold", color: Colors.black }} >{e.petName}</Text>
                                <Text style={{ fontSize: 14, textAlign: "center", fontFamily: "Poppins-Regular", color: Colors.gray }} >{e.breed}</Text>

                            </TouchableOpacity>
                        )
                    })}

                    <TouchableOpacity onPress={() => navigation.navigate('Tab', {
                        screen: 'PetDetails',
                        params: {
                            screen: "PetSelect",
                            name: routeData
                        }
                    })} style={{ width: "48%", height: 180, backgroundColor: "#e6e6e6", borderRadius: 10, justifyContent: "center", alignItems: "center", marginTop: 20 }} >

                        <Image source={require("../../Images/add.png")} />

                    </TouchableOpacity>




                </View>
            </ScrollView>


        </View>


    )


}

export default PetSelect