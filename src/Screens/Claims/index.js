import React, { useState, useEffect, useContext } from "react"
import { View, Text, TouchableOpacity, Image, FlatList, ScrollView, StyleSheet, Dimensions, BackHandler } from "react-native"
import Colors from "../../Constant/Color"
import CustomHeader from "../../Components/CustomHeader"
import ClaimContext from "../../Context/ClaimContext/context"
import Video from 'react-native-video';


function Claims({ navigation }) {

    const claimCont = useContext(ClaimContext)
    const { claim, setClaim } = claimCont
    const [showImages, setShowImages] = useState(false)
    const [showVideo, setShowVideo] = useState(false)
    const [indexShow, setIndexShow] = useState(null)
    const [pause, setPause] = useState(false)



    let width = Dimensions.get("window").width

    var options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    const showImageEvidences = (ind) => {

        setClaim(claim && claim.length > 0 && claim.map((e, i) => {

            if (ind == i) {
                return {
                    ...e,
                    showImages: !e?.showImages
                }
            } else {
                return e
            }

        }))

    }

    const showVideoEvidences = (ind) => {

        setClaim(claim && claim.length > 0 && claim.map((e, i) => {

            if (ind == i) {
                return {
                    ...e,
                    showVideo: !e?.showVideo
                }
            } else {
                return e
            }

        }))

    }


    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            // Replace 'TabScreenName' with the name of your tab screen
            // This will navigate to the specified tab screen when the back button is pressed

            navigation.goBack()

            return true; // Return true to prevent the default back action

        });

        return () => backHandler.remove(); // Cleanup the event listener

    }, []);


    const renderClaimData = ({ item, index }) => {


        let date = new Intl.DateTimeFormat('en-US', options).format(item?.created_at?.toDate());


        return (

            <View style={{ width: "95%", alignSelf: "center", borderWidth: 1, padding: 10, borderRadius: 10, justifyContent: "center", backgroundColor: "#e6e6e6", marginBottom: 10 }} >

                <Text style={{ color: Colors.buttonColor, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >
                    {date}
                </Text>

                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >
                    Booking Id: {item?.bookingId}
                </Text>

                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }} >
                    <View style={{ flexDirection: "row", alignItems: "center" }} >
                        <Image source={{ uri: item?.driverData?.profile }} style={{ width: 60, height: 60, borderRadius: 10 }} />

                        <View style={{ marginLeft: 5, justifyContent: "center" }} >
                            <View style={{ flexDirection: "row", alignItems: "center" }} >
                                <Text style={{ fontFamily: "Poppins-Medium", fontSize: 18, color: Colors.black }} >{item.driverData?.fullName.length>8 ? `${item.driverData?.fullName.slice(0,8)}...`: item.driverData?.fullName }</Text>
                                <Image source={require("../../Images/star.png")} style={{ marginLeft: 5, marginTop: 5 }} />
                                <Text style={{ fontFamily: "Poppins-Regular", fontSize: 14, color: Colors.black, marginTop: 5, marginLeft: 3 }} >({item?.driverData?.rating})</Text>
                            </View>
                            <Text style={{ fontSize: 16, color: Colors.gray }} >{item.driverData?.VehicleDetails?.vehicleName}</Text>
                            <Text style={{ fontSize: 12, color: Colors.white, borderRadius: 30, backgroundColor: "#808080", textAlign: "center", marginTop: 5, padding: 0, width: 80, padding: 2 }} >{item.driverData?.VehicleDetails?.vehicleModelNum}</Text>
                        </View>
                    </View>

                    <View>

                        <Text style={{ fontSize: 18, fontFamily: "Poppins-SemiBold", color: Colors.black }} >
                            Deduction:
                        </Text>
                        <Text style={{ fontSize: 18, fontFamily: "Poppins-SemiBold", color: Colors.black, alignSelf: "flex-end" }} >
                            ${item?.deductedAmount}
                        </Text>

                    </View>

                </View>

                <TouchableOpacity onPress={() => showImageEvidences(index)} >
                    <Text style={{ color: "blue", fontSize: 16, textDecorationLine: "underline", marginTop: 20 }} >{item.showImages ? "Hide Image Evidences" : "Show Image Evidences"}</Text>
                </TouchableOpacity>

                {item?.showImages && <View style={{ width: "100%", marginTop: 20 }} >

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}  >

                        <Image source={{ uri: item?.imageEvidence1 }} style={{ width: 200, height: 200, marginLeft: 10, borderRadius: 5 }} />
                        <Image source={{ uri: item?.imageEvidence2 }} style={{ width: 200, height: 200, marginLeft: 10 }} />
                        <Image source={{ uri: item?.imageEvidence3 }} style={{ width: 200, height: 200, marginLeft: 10 }} />

                    </ScrollView>

                </View>}


                <TouchableOpacity onPress={() => showVideoEvidences(index)} >
                    <Text style={{ color: "blue", fontSize: 16, textDecorationLine: "underline", marginTop: 20 }} >{item.showVideo ? "Hide Video Evidence" : "Show Video Evidence"}</Text>
                </TouchableOpacity>


                {item?.showVideo && <TouchableOpacity onPress={() => setPause(!pause)} style={{ width: "100%", height: 400, marginTop: 10, alignContent: "center" }} >

                    <Video source={{ uri: item?.videoEvidence }}   // Can be a URL or a local file.
                        ref={(ref) => {
                            this.player = ref
                        }}
                        repeat={true}
                        paused={pause}
                        onBuffer={this.onBuffer}                // Callback when remote video is buffering
                        onError={this.videoError}               // Callback when video cannot be loaded
                        style={[styles.backgroundVideo]} />

                </TouchableOpacity>}


            </View>
        )


    }


    return (
        <View style={{ flex: 1, backgroundColor: Colors.white }} >

            <CustomHeader
                onPress={() => navigation.goBack()}
                iconname={"arrow-back-outline"}
                text="Claims"
                color={Colors.black}
            />

            {

                claim && claim.length > 0 ? <FlatList
                    contentContainerStyle={{
                        marginTop: 20,
                        marginBottom: 20
                    }}
                    data={claim}
                    renderItem={renderClaimData}


                /> : <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >

                    <Text style={{ fontSize: 28, fontFamily: "Poppins-SemiBold", color: Colors.black }} >No Claims</Text>


                </View>

            }

        </View>
    )
}

export default Claims


var styles = StyleSheet.create({
    backgroundVideo: {
        position: 'absolute',
        left: 15,
        bottom: 0,
        right: 0,
        top: 0
    },
});