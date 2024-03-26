import React, { useCallback, useContext, useState } from "react"
import { View, Text, Image, TouchableOpacity, FlatList, Linking, Modal, TouchableWithoutFeedback, StyleSheet } from "react-native"
import Colors from "../../Constant/Color"
import CustomHeader from "../../Components/CustomHeader"
import ScheduleRideContext from "../../Context/ScheduleRideContext/context"
import CustomButton from "../../Components/CustomButton"
import IonIcons from "react-native-vector-icons/Ionicons"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import axios from "axios"
import { ScreenStackHeaderSubview } from "react-native-screens"



function ScheduleRide({ navigation, route }) {


    const scheduleRideCont = useContext(ScheduleRideContext)
    const { scheduleData, setScheduleData } = scheduleRideCont

    const [descriptionModal, setDescriptionModal] = useState(false)



    const handleShowDescription = (item) => {


        let { driverData } = item

        driverData = {
            ...driverData,
            showDescription: driverData?.showDescription ? false : true
        }


        item.driverData = driverData

        let otherData = scheduleData && scheduleData.length > 0 && scheduleData?.filter((e, i) => e.bookingId !== item.bookingId)

        let allData = [...otherData, item]

        setScheduleData(allData)

        setDescriptionModal(!descriptionModal)


    }


    const ShowDescriptionModal = useCallback((item) => {


        return (
            <View style={styles.centeredView}>
                <Modal animationType="slide" transparent={true} onRequestClose={() => handleShowDescription(item)} visible={descriptionModal}>
                    <TouchableWithoutFeedback style={{ flex: 1, borderWidth: 4, width: "100%", height: "100%", zIndex: 100 }} onPress={() => handleShowDescription(item)} >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>


                                <Text style={{ color: Colors.black, fontFamily: "Poppins-Medium", fontSize: 16, padding: 10, }} >
                                    {item?.driverData?.description ?? "No Description"}
                                </Text>

                            </View>

                            <View>



                            </View>

                        </View>


                    </TouchableWithoutFeedback>

                </Modal>
            </View>
        );
    }, [descriptionModal]);



    const renderScheduleData = ({ item }) => {

        var options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };

        var formattedDate = new Intl.DateTimeFormat('en-US', options).format(item?.scheduleDate && item?.scheduleDate?.toDate());


        return (

            <TouchableOpacity style={{ marginBottom: 20 }} >

                <Text style={{ color: Colors.buttonColor, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >
                    {formattedDate} {item?.scheduleTime?.toDate()?.toLocaleTimeString()}
                </Text>

                <View style={{ marginTop: 10, padding: 10, backgroundColor: "#e6e6e6", borderRadius: 8 }} >

                    <TouchableOpacity style={{ padding: 5, flexDirection: "row", justifyContent: "space-between", backgroundColor: "#e6e6e6", borderRadius: 10, alignItems: "center" }}  >
                        {item?.driverData && <View style={{ flexDirection: "row", alignItems: "center" }} >
                            <Image source={{ uri: item.driverData?.profile }} style={{ width: 60, height: 60, borderRadius: 100 }} />

                            <View style={{ marginLeft: 5, justifyContent: "center" }} >
                                <View style={{ flexDirection: "row", alignItems: "center" }} >
                                    <Text style={{ fontFamily: "Poppins-Medium", fontSize: 16, color: Colors.black, height: 20 }} >{item.driverData?.fullName.length > 7 ? `${item.driverData?.fullName.slice(0, 8)}...` : item.driverData?.fullName}</Text>
                                    <Image source={require("../../Images/star.png")} style={{ marginLeft: 5, marginTop: 5 }} />
                                    <Text style={{ fontFamily: "Poppins-Regular", fontSize: 14, color: Colors.black, height: 20, marginTop: 5, marginLeft: 3 }} >({item?.driverData?.rating})</Text>

                                </View>


                                {(item?.driverData?.selectedCategory == "walker" || item?.driverData?.selectedCategory == "sitter") && <Text style={{ fontFamily: "Poppins-Medium", fontSize: 12, color: Colors.black, }} >Pet Experience: {item.driverData?.petExperience}</Text>}


                                {(item?.driverData?.selectedCategory == "walker" || item?.driverData?.selectedCategory == "sitter") &&
                                    <TouchableOpacity onPress={() => handleShowDescription(item)} style={{ width: 120, borderRadius: 1, borderRadius: 10, justifyContent: "center", padding: 2 }}  >
                                        <Text style={{ fontFamily: "Poppins-Medium", fontSize: 12, color: Colors.main, marginLeft: 3 }} >Show Description</Text>
                                    </TouchableOpacity>
                                }

                                {item?.driverData && item?.driverData?.selectedCategory == "driver" && <Text style={{ fontFamily: "Poppins-Medium", fontSize: 16, color: Colors.gray, height: 20 }} >{item.driverData?.VehicleDetails?.vehicleName}</Text>}
                                {item?.driverData && item?.driverData?.selectedCategory == "driver" && <Text style={{ fontSize: 12, color: Colors.white, borderRadius: 30, backgroundColor: "#808080", textAlign: "center", marginTop: 5, padding: 0, width: 80, padding: 2 }} >{item?.driverData?.VehicleDetails?.vehicleModelNum}</Text>
                                }
                            </View>

                        </View>}

                        {!item.driverData && <Text style={{ fontFamily: "Poppins-SemiBold", color: Colors.buttonColor, fontSize: 14 }} >We are finding {item?.type == "PetSitter" ? "sitter" : item?.type == "PetWalk" ? "walker" : "driver"} for you</Text>}

                        <View style={{ alignItems: "flex-end" }} >

                            <Text style={{ fontFamily: "Poppins-SemiBold", color: Colors.black, fontSize: 22 }} >{item.fare ? "$" : ""}{item?.fare ? Number(item?.fare).toFixed(2) : ""}</Text>

                            {item?.driverData && <View style={{ flexDirection: "row" }} >

                                <View style={{ width: 40, height: 40, backgroundColor: Colors.buttonColor, justifyContent: "center", alignItems: "center", borderRadius: 100 }} >


                                    <TouchableOpacity onPress={() => Linking.openURL(`tel:${item?.phoneNumber}`)} >
                                        <MaterialIcons name="phone" size={25} color={Colors.white} />
                                    </TouchableOpacity>
                                </View>


                                <View style={{ width: 40, height: 40, backgroundColor: Colors.gray, justifyContent: "center", alignItems: "center", borderRadius: 100, marginLeft: 5 }} >
                                    <TouchableOpacity onPress={() => navigation.navigate("ChatSingle", { data: item, screenName: "ScheduleRide", nested: false })}  >
                                        <MaterialIcons name="chat" size={25} color={Colors.white} />
                                    </TouchableOpacity>
                                </View>

                            </View>}


                        </View>


                    </TouchableOpacity>

                    {item?.type !== "PetSitter" && <View style={{ flexDirection: "row", padding: 5, alignItems: "center", width: "100%" }} >


                        <IonIcons name="location" color={Colors.buttonColor} size={30} />
                        <Text style={{ color: "#808080", fontSize: 14, fontFamily: "Poppins-Medium", marginLeft: 10, width: "85%" }} >Current Location: {item?.pickupAddress}</Text>

                    </View>}

                    {item?.type == "PetSitter" && (item?.driverData || item?.selectedOption?.name == "My Location") && <View style={{ flexDirection: "row", padding: 5, alignItems: "center", width: "100%" }} >


                        <IonIcons name="location" color={Colors.buttonColor} size={30} />
                        <Text style={{ color: "#808080", fontSize: 14, fontFamily: "Poppins-Medium", marginLeft: 10, width: "85%" }} >{item?.selectedOption?.name == "My Location" ? "Customer Location" : "Sitter Location"}: {item?.pickupAddress}</Text>

                    </View>}

                    {item?.type == "PetSitter" && <View style={{ flexDirection: "row", padding: 5, alignItems: "center", width: "100%" }} >


                        {/* <IonIcons name="location" color={Colors.buttonColor} size={30} /> */}
                        <Text style={{ color: "#808080", fontSize: 14, fontFamily: "Poppins-Medium", marginLeft: 10, width: "85%" }} >Option: {item?.selectedOption?.name}</Text>

                    </View>}

                    {item?.type == "PetSitter" && <View style={{ flexDirection: "row", padding: 5, alignItems: "center", width: "100%" }} >


                        {/* <IonIcons name="location" color={Colors.buttonColor} size={30} /> */}
                        <Text style={{ color: "#808080", fontSize: 14, fontFamily: "Poppins-Medium", marginLeft: 10, width: "85%" }} >Duration: {Number(item?.duration) / 60 > 1 ? Math.ceil(Number(item.duration)) / 60 : item.duration} {Number(item?.duration) / 60 > 1 ? "Hours" : "Minutes"}  </Text>

                    </View>}

                    {item?.dropoffAddress && <View style={{ flexDirection: "row", padding: 5, alignItems: "center" }} >

                        <IonIcons name="location" color={Colors.buttonColor} size={30} />

                        <Text style={{ color: "#808080", fontSize: 14, fontFamily: "Poppins-Medium", marginLeft: 10, width: "85%" }} >Drop Off Location: {item.dropoffAddress}</Text>

                    </View>}


                    {item?.bookingType == "twoWay" && <View style={{ flexDirection: "row", padding: 5, alignItems: "center", width: "100%" }} >


                        <IonIcons name="location" color={Colors.buttonColor} size={30} />
                        <Text style={{ color: "#808080", fontSize: 14, fontFamily: "Poppins-Medium", marginLeft: 10, width: "85%" }} >Return Pick up Location: {item?.returnPickupAddress}</Text>

                    </View>}

                    {item?.bookingType == "twoWay" && <View style={{ flexDirection: "row", padding: 5, alignItems: "center", width: "100%" }} >


                        <IonIcons name="location" color={Colors.buttonColor} size={30} />
                        <Text style={{ color: "#808080", fontSize: 14, fontFamily: "Poppins-Medium", marginLeft: 10, width: "85%" }} >Return Drop off Location: {item?.returnDropoffAddress}</Text>

                    </View>}


                    {!item?.driverTakeRide && <CustomButton onPress={() => navigation.navigate("ScheduleCancelRide", item)} text={"Cancel Booking"} styleContainer={{ alignSelf: "center", width: "90%" }} />
                    }
                </View>

                {descriptionModal && item?.driverData?.showDescription && ShowDescriptionModal(item)}

            </TouchableOpacity>
        )

    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors.white }} >

            <View style={{ marginTop: 5 }} >
                <CustomHeader
                    onPress={() => navigation.goBack()}
                    iconname={"arrow-back-outline"}
                    text="Scheduled Bookings"
                    color={Colors.black}
                />
            </View>

            <View style={{ paddingHorizontal: 20, marginVertical: 20, marginBottom: 20 }} >


                <FlatList

                    data={scheduleData}
                    renderItem={renderScheduleData}
                    contentContainerStyle={{
                        marginBottom: 20
                    }}
                    style={{ marginBottom: 20 }}

                />


            </View>



        </View>
    )
}

export default ScheduleRide


const styles = StyleSheet.create({

    mapContainer: {
        width: "100%",
        height: 350,
        borderRadius: 10,
        overflow: 'hidden',

    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,

    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        width: '80%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },

})