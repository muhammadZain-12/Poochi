import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native"
import React from "react"
import Colors from "../../Constant/Color"
import Icons from "react-native-vector-icons/Ionicons"


function Profile({ navigation }) {
    return (

        <View style={{ flex: 1, backgroundColor: Colors.white }} >

            <View style={{ paddingHorizontal: 20, marginTop: 10, flexDirection: "row", width: "75%", justifyContent: "space-between" }} >

                <Icons onPress={() => navigation.goBack()} name="arrow-back-outline" color={Colors.black} size={25} />
                <View>
                    <Image source={require("../../Images/profile2.png")} style={{ alignSelf: "center" }} />
                    <Text style={{ textAlign: "center", fontFamily: "Poppins-SemiBold", color: Colors.black, fontSize: 18 }} >James Smith</Text>
                </View>

            </View>

            <ScrollView>

                <View style={{ paddingHorizontal: 20, marginTop: 20 }} >

                    <TouchableOpacity style={{ width: "100%", backgroundColor: "#D9d9D9", padding: 15, borderRadius: 10, flexDirection: "row", alignItems: "center" }} >

                        <View style={{ width: 50, height: 50, justifyContent: "center", alignItems: "center", backgroundColor: Colors.white, borderRadius: 100 }} >

                            <Image source={require("../../Images/setting1.png")} />

                        </View>
                        <Text style={{ marginLeft: 15, color: "#21263D", fontFamily: "Poppins-Medium", fontSize: 18 }} >Pets</Text>

                    </TouchableOpacity>


                </View>
                <TouchableOpacity style={{ paddingHorizontal: 20, marginTop: 20 }} >

                    <View style={{ width: "100%", backgroundColor: "#D9d9D9", padding: 15, borderRadius: 10, flexDirection: "row", alignItems: "center" }} >

                        <View style={{ width: 50, height: 50, justifyContent: "center", alignItems: "center", backgroundColor: Colors.white, borderRadius: 100 }} >

                            <Image source={require("../../Images/201.png")} />

                        </View>
                        <Text style={{ marginLeft: 15, color: "#21263D", fontFamily: "Poppins-Medium", fontSize: 18 }} >Account Setting</Text>

                    </View>


                </TouchableOpacity>
                <TouchableOpacity style={{ paddingHorizontal: 20, marginTop: 20 }} >

                    <View style={{ width: "100%", backgroundColor: "#D9d9D9", padding: 15, borderRadius: 10, flexDirection: "row", alignItems: "center" }} >

                        <View style={{ width: 50, height: 50, justifyContent: "center", alignItems: "center", backgroundColor: Colors.white, borderRadius: 100 }} >

                            <Image source={require("../../Images/track.png")} />

                        </View>
                        <Text style={{ marginLeft: 15, color: "#21263D", fontFamily: "Poppins-Medium", fontSize: 18 }} >Track Your Ride</Text>

                    </View>


                </TouchableOpacity>
                <TouchableOpacity style={{ paddingHorizontal: 20, marginTop: 20 }} >

                    <View style={{ width: "100%", backgroundColor: "#D9d9D9", padding: 15, borderRadius: 10, flexDirection: "row", alignItems: "center" }} >

                        <View style={{ width: 50, height: 50, justifyContent: "center", alignItems: "center", backgroundColor: Colors.white, borderRadius: 100 }} >

                            <Image source={require("../../Images/setting.png")} />

                        </View>
                        <Text style={{ marginLeft: 15, color: "#21263D", fontFamily: "Poppins-Medium", fontSize: 18 }} >Privacy Policy</Text>

                    </View>


                </TouchableOpacity>
                <TouchableOpacity style={{ paddingHorizontal: 20, marginTop: 20 }} >

                    <View style={{ width: "100%", backgroundColor: "#D9d9D9", padding: 15, borderRadius: 10, flexDirection: "row", alignItems: "center" }} >

                        <View style={{ width: 50, height: 50, justifyContent: "center", alignItems: "center", backgroundColor: Colors.white, borderRadius: 100 }} >

                            <Image source={require("../../Images/i24support.png")} />

                        </View>
                        <Text style={{ marginLeft: 15, color: "#21263D", fontFamily: "Poppins-Medium", fontSize: 18 }} >Help & Support</Text>

                    </View>


                </TouchableOpacity>
                <TouchableOpacity style={{ paddingHorizontal: 20, marginTop: 20, marginBottom: 20 }} >

                    <View style={{ width: "100%", backgroundColor: "#D9d9D9", padding: 15, borderRadius: 10, flexDirection: "row", alignItems: "center" }} >

                        <View style={{ width: 50, height: 50, justifyContent: "center", alignItems: "center", backgroundColor: Colors.white, borderRadius: 100 }} >

                            <Image source={require("../../Images/i24support.png")} />

                        </View>
                        <Text style={{ marginLeft: 15, color: "#21263D", fontFamily: "Poppins-Medium", fontSize: 18 }} >Log Out</Text>

                    </View>


                </TouchableOpacity>

            </ScrollView>

        </View>

    )

}

export default Profile