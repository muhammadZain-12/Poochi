import React, { useContext, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import CustomHeader from "../../Components/CustomHeader";
import Colors from "../../Constant/Color";
import NotificationContext from "../../Context/NotificationContext/context";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

function Notification({ navigation }) {


    const focus = useIsFocused()

    const notificationCont = useContext(NotificationContext)


    const { notification, setNotification, unseenNotification } = notificationCont



    const sendSeenProperty = () => {

        let id = auth()?.currentUser?.uid

        firestore().collection("Notification").doc(id).get().then((doc) => {

            let data = doc?.data()

            if (data && data?.notification) {


                let allNotifications = data?.notification


                allNotifications = allNotifications && allNotifications.length > 0 && allNotifications.map((e, i) => {
                    return {
                        ...e,
                        seen: true
                    }
                })


                setNotification(allNotifications)

                firestore().collection("Notification").doc(id).set({
                    notification: allNotifications
                }).then(() => {
                    console.log("seen property succesfully send")
                }).catch((error) => {

                    console.log(error, "error")

                })



            }



        })


    }


    useEffect(() => {

        if (unseenNotification && unseenNotification.length > 0) {
            sendSeenProperty()
        }


    }, [focus])


    const renderNotificationData = ({ item }) => {

        let notificationDate = item?.date?.toDate()

        let date = notificationDate.getDate()
        let month = notificationDate.getMonth() + 1
        let year = notificationDate.getFullYear()

        let fullDate = `${date} / ${month} / ${year}`


        return (

            <View style={{ marginBottom: 20 }} >

                <Text style={{ color: Colors.buttonColor, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >
                    {fullDate}
                </Text>

                <View style={{ marginTop: 10, padding: 10, backgroundColor: "#e6e6e6", borderRadius: 8 }} >

                    <View style={{ padding: 5, flexDirection: "row", justifyContent: "space-between", backgroundColor: "#e6e6e6", borderRadius: 10, alignItems: "center" }}  >
                        <View style={{ flexDirection: "row", alignItems: "center" }} >

                            <View style={{ marginLeft: 0, justifyContent: "center", width: "100%" }} >
                                <View style={{ flexDirection: "row", alignItems: "center" }} >
                                    <Text style={{ fontFamily: "Poppins-Medium", fontSize: 18, color: Colors.black, height: 20 }} >{item?.title}</Text>
                                </View>


                                <Text style={{ fontSize: 12, color: Colors.white, borderRadius: 10, backgroundColor: "#aaa", marginTop: 10, padding: 0, width: "100%", padding: 10 }} >{item?.body}</Text>

                            </View>

                        </View>




                    </View>






                </View>



            </View>
        )


    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors.white }} >
            <View style={{ marginTop: 5 }} >
                <CustomHeader
                    onPress={() => navigation.goBack()}
                    iconname={"arrow-back-outline"}
                    text="Notifications"
                    color={Colors.black}
                />
            </View>

            <View style={{ paddingHorizontal: 20, marginVertical: 20, marginBottom: 20 }} >


                {notification && notification.length > 0 ? <FlatList

                    data={notification}
                    renderItem={renderNotificationData}
                    contentContainerStyle={{
                        marginBottom: 20
                    }}
                    style={{ marginBottom: 20 }}

                /> : <View style={{ width: "100%", height: "90%", justifyContent: "center", alignItems: "center" }} >

                    <Text style={{ fontSize: 24, fontFamily: "Poppins-SemiBold", color: "#080808" }} >No Notifications</Text>

                </View>

                }


            </View>

        </View>
    )
}


export default Notification 