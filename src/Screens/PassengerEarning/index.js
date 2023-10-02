import React, { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList, Dimensions } from "react-native"
import Colors from "../../Constant/Color";
import Icon from 'react-native-vector-icons/AntDesign';
import CustomHeader from "../../Components/CustomHeader";
function PassengerDeposits({ route, navigation }) {

    const [allWalletData, setAllWalletData] = useState(true)
    const [allMonthlyData, setAllMonthlyData] = useState(false)

    let data = route.params.data

    let { allData, monthlyData, todayData } = data

    const getSortedDetails = () => {


        if (allWalletData) {
            setAllWalletData(false)
            setAllMonthlyData(true)
            return
        }

        if (allMonthlyData) {
            setAllMonthlyData(false)
            return
        }

        if (!allMonthlyData) {
            setAllWalletData(true)
        }



    }


    const renderDepositData = ({ item, index }) => {

        let date = item.date.toDate().toString().slice(0, 15)

        if (item && item?.deposit) {

            return (
                <View>
                    <TouchableOpacity
                        style={{
                            alignItems: 'flex-start',
                            width: '100%',
                            paddingHorizontal: 30,
                            paddingVertical: 5,
                            borderBottomWidth: 1,
                            borderColor: Colors.primary,
                            
                        }}>
                        {/* Date is mentioned Here */}
                        <Text style={[styles.text, { marginTop: 5,fontFamily:"Poppins-Medium" }]}>{date}</Text>
                        <Text
                            style={[
                                styles.text,
                                { paddingTop: 5, marginBottom: 5, fontSize: 18,fontFamily:"Poppins-Medium" },
                            ]}>
                            Deposit: <Text style={{ color: "#080808" }} > &#x20AC;{item?.deposit} </Text>
                        </Text>


                    </TouchableOpacity>
                </View>
            );
        }
    };

    return (

        <View style={{ flex: 1, backgroundColor: Colors.white }} >
            <ScrollView style={{ flex: 1 }} >
                <View style={{ marginTop: 5 }} >
                    <CustomHeader
                        onPress={() => navigation.goBack()}
                        iconname={"arrow-back-outline"}
                        text="Deposit"
                        color={Colors.black}
                    />
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center", borderBottomColor: Colors.black, borderBottomWidth: 3 }} >
                    <Text style={{ color: Colors.black, fontSize: 32, padding: 20, fontWeight: "500", fontFamily: "Poppins-SemiBold" }}>
                        Your Deposits
                    </Text>

                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                        onPress={() => getSortedDetails()}>
                        <Text
                            style={{
                                color: Colors.black,
                                paddingRight: 5,
                            }}>
                            {allWalletData ? 'All Data' : allMonthlyData ? 'This Month' : "Today"}
                        </Text>
                        <TouchableOpacity>
                            <Icon name="down" color={Colors.secondary} />
                        </TouchableOpacity>
                    </TouchableOpacity>
                </View>
                {(allWalletData && allData.length == 0) || (allMonthlyData && monthlyData.length == 0) || (!allWalletData && !allMonthlyData && todayData.length == 0) ? <View style={{ backgroundColor: Colors.white, alignItems: "center", justifyContent: "center", height: Dimensions.get("window").height - 100 }}>
                    <Text style={{ fontSize: 32, color: Colors.black }} >No Deposits</Text>
                </View>
                    :
                    <View>

                        <FlatList
                            data={allWalletData ? allData : allMonthlyData ? monthlyData : todayData}
                            renderItem={renderDepositData}
                            keyExtractor={(item, i) => i}
                        />
                    </View>}
            </ScrollView>
        </View>
    )

}

export default PassengerDeposits

const styles = StyleSheet.create({

    headerContainer: {
        backgroundColor: Colors.white,
        zIndex: 1,
    }, Heading: {
        color: Colors.black,
        fontSize: 28,
        fontWeight: '500',
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