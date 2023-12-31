import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import React, { useCallback } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Linking,
    ScrollView,
    Image,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import CustomHeader from '../../Components/CustomHeader';
import Colors from '../../Constant/Color';
function History({ navigation }) {
    const [bookingData, setBookingData] = useState([]);
    const [cancelledBookingData, setCancelledBookingData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentTab, setCurrentTab] = useState([
        {
            index: 0,
            name: 'completed',
            selected: true,
        },
        {
            index: 1,
            name: 'cancelled',
            selected: false,
        },
    ]);

    const getBookingData = () => {
        setLoading(true);
        const id = auth().currentUser.uid;

        firestore()
            .collection('Booking')
            .doc(id)
            .get()
            .then(doc => {
                if (doc._exists) {
                    let data = doc?.data();
                    let sortedBookings = data?.Bookings.length > 0 && data?.Bookings?.sort((a, b) => (a.requestDate).toDate().getTime() - (b.requestDate).toDate().getTime());
                    sortedBookings = sortedBookings.length > 0 && sortedBookings.reverse()
                    setBookingData(sortedBookings.length > 0 ? sortedBookings : []);
                    setLoading(false);
                } else {
                    setLoading(false)
                }
            });
    };




    // const getCancelRidesData = () => {
    //     setLoading(true);
    //     firestore()
    //         .collection('RideCancel')
    //         .get()
    //         .then(doc => {

    //             console.log(doc._docs, "doc")

    //             if (doc._docs[0]._exists) {

    //                 const id = auth().currentUser.uid;
    //                 let data = doc._docs;

    //                 let myNames = [];
    //                 data = data.forEach((e, i) => {
    //                     let myData = e._data.cancelledRides;
    //                     myData &&
    //                         myData.length > 0 &&
    //                         myData.map((j, ind) => {
    //                             if (j.passengerData.id == id) {
    //                                 myNames.push(j);
    //                             }
    //                         });
    //                 });
    //                 let sortedBookings = myNames.length > 0 && myNames.sort((a, b) => (a.date).toDate().getTime() - (b.date).toDate().getTime());
    //                 sortedBookings = sortedBookings.reverse()
    //                 setCancelledBookingData(sortedBookings.length > 0 ? sortedBookings : []);
    //                 setLoading(false);
    //             } else {
    //                 setLoading(false)
    //             }
    //         });
    // };

    useEffect(() => {
        getBookingData();
        // getCancelRidesData();
    }, []);

    const activateTab = index => {
        setCurrentTab(
            currentTab &&
            currentTab.length > 0 &&
            currentTab.map((e, i) => {
                if (e.index == index) {
                    return {
                        ...e,
                        selected: true,
                    };
                } else {
                    return {
                        ...e,
                        selected: false,
                    };
                }
            }),
        );
    };

    const renderBookingData = ({ item, index }) => {
        let date = item?.requestDate?.toDate();
        let stringDate = date.toString();
        stringDate = stringDate.slice(0, 15);

        // let fare = null;
        // if (
        //     item.driverData &&
        //     item.driverData.bidFare &&
        //     item.driverData.bidFare > 0
        // ) {
        //     console.log(item.driverData.bidFare, 'bidFare');
        //     item.passengerData.selectedCar[0].carMiles.map((e, i) => {
        //         if (
        //             item.passengerData.distance >= e.rangeMin &&
        //             item.passengerData.distance <= e.rangeMax
        //         ) {
        //             let serviceCharges = e.serviceCharge;
        //             let creditCardFee = (Number(item.passengerData.fare) * 5) / 100;
        //             let totalCharges = Number(serviceCharges) + Number(creditCardFee);
        //             fare = (Number(item.driverData.bidFare) + totalCharges).toFixed(2);
        //         }
        //     });
        // }

        return (

            <TouchableOpacity onPress={() => navigation.navigate("ScheduleRideDetails", item)} style={{ marginBottom: 20, width: Dimensions.get("window").width - 30, marginTop: 10 }} >

                <Text style={{ color: Colors.buttonColor, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >
                    {stringDate}
                </Text>

                <View style={{ marginTop: 10, padding: 10, backgroundColor: "#e6e6e6", borderRadius: 8 }} >

                    <TouchableOpacity style={{ padding: 5, flexDirection: "row", justifyContent: "space-between", backgroundColor: "#e6e6e6", borderRadius: 10, alignItems: "center" }}  >
                        <View style={{ flexDirection: "row", alignItems: "center" }} >
                            <Image source={{ uri: item?.driverData?.profile }} style={{ width: 60, height: 60, borderRadius: 10 }} />

                            <View style={{ marginLeft: 5, justifyContent: "center" }} >
                                <View style={{ flexDirection: "row", alignItems: "center" }} >
                                    <Text style={{ fontFamily: "Poppins-Medium", fontSize: 18, color: Colors.black, height: 20 }} >{item.driverData?.fullName}</Text>
                                    <Image source={require("../../Images/star.png")} style={{ marginLeft: 5, marginTop: 5 }} />
                                    <Text style={{ fontFamily: "Poppins-Regular", fontSize: 14, color: Colors.black, height: 20, marginTop: 5, marginLeft: 3 }} >({item?.driverData?.rating})</Text>
                                </View>
                                <Text style={{ fontFamily: "Poppins-Medium", fontSize: 16, color: Colors.gray, height: 20 }} >{item.driverData?.VehicleDetails?.vehicleName}</Text>
                                <Text style={{ fontSize: 12, color: Colors.white, borderRadius: 30, backgroundColor: "#808080", textAlign: "center", marginTop: 5, padding: 0, width: 80, padding: 2 }} >{item.driverData?.VehicleDetails?.vehicleModelNum}</Text>

                            </View>

                        </View>

                        <View style={{ alignItems: "flex-end" }} >

                            <Text style={{ fontFamily: "Poppins-SemiBold", color: Colors.black, fontSize: 22 }} >${item.fare}</Text>

                            <View style={{ flexDirection: "row" }} >

                                <View style={{ width: 40, height: 40, backgroundColor: Colors.buttonColor, justifyContent: "center", alignItems: "center", borderRadius: 100 }} >


                                    <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.driverData?.mobileNumber}`)} >
                                        <Image source={require("../../Images/phone.png")} />
                                    </TouchableOpacity>
                                </View>


                                <View style={{ width: 40, height: 40, backgroundColor: Colors.gray, justifyContent: "center", alignItems: "center", borderRadius: 100, marginLeft: 5 }} >
                                    <TouchableOpacity>
                                        <Image source={require("../../Images/message.png")} />
                                    </TouchableOpacity>
                                </View>

                            </View>


                        </View>


                    </TouchableOpacity>


                    <View style={{ flexDirection: "row", padding: 5, alignItems: "center" }} >

                        <Image source={require("../../Images/Location3.png")} />

                        <Text style={{ color: "#808080", fontSize: 14, fontFamily: "Poppins-Medium", marginLeft: 10 }} >Booking Id: {item?.bookingId}</Text>

                    </View>

                    <View style={{ flexDirection: "row", padding: 5, alignItems: "center" }} >

                        <Image source={require("../../Images/Location3.png")} />

                        <Text style={{ color: "#808080", fontSize: 14, fontFamily: "Poppins-Medium", marginLeft: 10 }} >Pickup Address: {item.pickupAddress}</Text>

                    </View>


                    <View style={{ flexDirection: "row", padding: 5, alignItems: "center" }} >

                        <Image source={require("../../Images/Location3.png")} />

                        <Text style={{ color: "#808080", fontSize: 14, fontFamily: "Poppins-Medium", marginLeft: 10 }} >Dropoff Address: {item.dropoffAddress}</Text>

                    </View>

                </View>



            </TouchableOpacity>
        )

    };



    console.log(bookingData, "bookingData")

    const renderCancelBookingData = ({ item, index }) => {

        console.log(item, "items")

        let fare = null;
        let date = item?.date?.toDate();
        let stringDate = date?.toString().slice(0, 15);
        if (
            item.driverData &&
            item.driverData.bidFare &&
            item.driverData.bidFare > 0
        ) {
            console.log(item.driverData.bidFare, 'bidFare');
            item.passengerData.selectedCar[0].carMiles.map((e, i) => {
                if (
                    item.passengerData.distance >= e.rangeMin &&
                    item.passengerData.distance <= e.rangeMax
                ) {
                    let serviceCharges = e.serviceCharge;
                    let creditCardFee = (Number(item.passengerData.fare) * 5) / 100;
                    let totalCharges = Number(serviceCharges) + Number(creditCardFee);
                    fare = (Number(item.driverData.bidFare) + totalCharges).toFixed(2);
                }
            });
        }

        return (
            <View>
                <TouchableOpacity
                    style={{
                        alignItems: 'flex-start',
                        width: '100%',
                        paddingHorizontal: 30,
                        borderBottomWidth: 1,
                        borderColor: Colors.primary,
                    }}
                    onPress={() =>
                        navigation.navigate('PassengerHistorySingleData', {
                            item,
                            fare: fare,
                        })
                    }
                >
                    {/* Date is mentioned Here */}
                    <Text style={[styles.text, { marginTop: 5 }]}>{stringDate}</Text>
                    <Text style={[styles.text, { marginTop: 5 }]}>{item?.passengerData?.bookingId}</Text>
                    <Text
                        style={[styles.text, { paddingTop: 5, fontSize: 14 }]}
                        numberOfLines={1}
                    >
                        {item.passengerData.pickupAddress}
                    </Text>
                    <Text
                        style={[styles.text, { paddingTop: 5, fontSize: 14 }]}
                        numberOfLines={1}
                    >
                        {item.passengerData.dropOffAddress}
                    </Text>
                    <Text
                        style={[
                            styles.text,
                            { paddingTop: 5, fontSize: 14, marginBottom: 10 },
                        ]}
                    >
                        Fare:{' '}
                        &#x20AC;{
                            item.passengerData.bidFare
                                ? item.passengerData.bidFare
                                : item.passengerData.fare}

                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    const firstRoute = useCallback(() => {
        return (
            <View style={{ marginVertical: 20, width: "100%" }}>
                {bookingData && bookingData.length == 0 ? (
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: Dimensions.get('window').height / 2,
                            width: Dimensions.get('window').width,
                        }}
                    >
                        <Text
                            style={{
                                color: 'black',
                                fontSize: 24,
                                textAlign: 'center',
                                width: '100%',
                                fontFamily: "Poppins-SemiBold"
                            }}
                        >
                            You have not done any booking yet
                        </Text>

                    </View>
                ) : (

                    <FlatList
                        data={bookingData}
                        renderItem={renderBookingData}
                        keyExtractor={(items, index) => index}
                        contentContainerStyle={{ justifyContent: "center", alignItems: "center", borderWidth: 1 }}
                    />
                )}
            </View>
        );
    }, [currentTab, bookingData]);

    const secondeRoute = useCallback(() => {
        return (
            <View style={{ marginVertical: 20, flex: 1 }}>
                {cancelledBookingData && cancelledBookingData.length == 0 ? (
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: Dimensions.get('window').height / 2,
                            width: Dimensions.get('window').width,
                        }}
                    >
                        <Text
                            style={{
                                color: 'black',
                                fontSize: 24,
                                textAlign: 'center',
                                width: '100%',
                                fontFamily: "Poppins-SemiBold"
                            }}
                        >
                            You don't have any cancelled booking
                        </Text>
                    </View>
                ) : (
                    ""
                    // <FlatList
                    //     data={cancelledBookingData}
                    //     renderItem={renderCancelBookingData}
                    //     keyExtractor={(items, index) => index}
                    // />
                )}
            </View>
        );
    }, [currentTab, cancelledBookingData]);

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
            <ScrollView style={{ marginBottom: 40 }}>
                <Text style={[styles.Heading, { fontFamily: "Poppins-Bold" }]}>Bookings History</Text>
                <View
                    style={{
                        width: '100%',
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'center',
                    }}
                >
                    <TouchableOpacity
                        onPress={() => activateTab(0)}
                        style={{
                            width: '45%',
                            borderRadius: 10,
                            borderWidth: 1,
                            marginLeft: 10,
                            padding: 10,
                            borderColor: Colors.black,
                            backgroundColor: currentTab.some(
                                (e, i) => e.index == 0 && e.selected,
                            )
                                ? Colors.buttonColor
                                : 'white',
                        }}
                    >
                        <Text
                            style={[
                                styles.text,
                                {
                                    color: currentTab.some((e, i) => e.index == 0 && e.selected)
                                        ? Colors.white
                                        : Colors.black,
                                    fontFamily: "Poppins-Medium"
                                },
                            ]}
                        >
                            Completed
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => activateTab(1)}
                        style={{
                            width: '45%',
                            borderRadius: 10,
                            borderWidth: 1,
                            marginLeft: 10,
                            padding: 10,
                            borderColor: Colors.black,
                            backgroundColor: currentTab.some(
                                (e, i) => e.index == 1 && e.selected,
                            )
                                ? Colors.buttonColor : 'white',
                        }}
                    >
                        <Text
                            style={[
                                styles.text,
                                {
                                    color: currentTab.some((e, i) => e.index == 1 && e.selected)
                                        ? Colors.white
                                        : Colors.black,
                                    fontFamily: "Poppins-Medium"
                                },
                            ]}
                        >
                            Cancelled
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    {loading ? (
                        <View
                            style={{
                                height: Dimensions.get('window').height / 2 + 20,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <ActivityIndicator size="large" color={Colors.main} />
                        </View>
                    ) : currentTab &&
                        currentTab.length > 0 &&
                        currentTab.some((e, i) => e.index == 0 && e.selected) ? (
                        firstRoute()
                    ) : (
                        secondeRoute()
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        zIndex: 1,
        backgroundColor: "transparent",
    },
    Heading: {
        color: Colors.black,
        fontSize: 28,
        fontWeight: '900',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    text: {
        color: Colors.black,
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
    },
});

export default History;