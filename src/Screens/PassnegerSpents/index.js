import React from 'react';
import { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    FlatList,
    Dimensions,
} from 'react-native';
import Colors from '../../Constant/Color';
import Icon from 'react-native-vector-icons/AntDesign';
import CustomHeader from '../../Components/CustomHeader';
function PassengerSpents({ route, navigation }) {
    const [allWalletData, setAllWalletData] = useState(true);
    const [allMonthlyData, setAllMonthlyData] = useState(false);

    let data = route.params.data;


    var options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    let { allData, monthlyData, todayData } = data;




    allData = allData && allData.length > 0 && allData.filter((e, i) => e.spent || e.cancellationCharges)
    monthlyData = monthlyData && monthlyData.length > 0 && monthlyData.filter((e, i) => e.spent || e.cancellationCharges)
    todayData = todayData && todayData.length > 0 && todayData.filter((e, i) => e.spent || e.cancellationCharges)





    const getSortedDetails = () => {
        if (allWalletData) {
            setAllWalletData(false);
            setAllMonthlyData(true);
            return;
        }

        if (allMonthlyData) {
            setAllMonthlyData(false);
            return;
        }

        if (!allMonthlyData) {
            setAllWalletData(true);
        }
    };

    const renderDepositData = ({ item, index }) => {

        let date = new Intl.DateTimeFormat('en-US', options).format(item.date.toDate())

        if ((item && item?.spent) || item?.cancellationCharges) {
            return (
                <View>
                    <TouchableOpacity
                        style={{
                            alignItems: 'flex-start',
                            width: '100%',
                            paddingHorizontal: 30,
                            paddingVertical: 5,
                            borderBottomWidth: 1,
                            borderColor: Colors.main,
                            fontFamily: "Poppins-Medium"
                        }}>
                        {/* Date is mentioned Here */}
                        <Text style={[styles.text, { marginTop: 5 }]}>{date}</Text>
                        <Text
                            style={[
                                styles.text,
                                { paddingTop: 5, marginBottom: 5, fontSize: 18, fontFamily: "Poppins-Medium" },
                            ]}>
                            Fare:{' '}
                            <Text style={{ color: "#080808", fontFamily: "Poppins-Medium" }}> ${item.spent} </Text>
                        </Text>

                        {item.cancellationCharges && (
                            <Text
                                style={[
                                    styles.text,
                                    { paddingTop: 5, marginBottom: 5, fontSize: 18, fontFamily: "Poppins-Medium" },
                                ]}>
                                Cancellation Charges:{' '}
                                <Text style={{ color: "#080808", fontFamily: "Poppins-Medium" }}>
                                    {' '}
                                    $
                                    {item.cancellationCharges
                                        ? Number(item?.cancellationCharges).toFixed(2)
                                        : 0}
                                </Text>
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            );
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: Colors.white }}>
            <ScrollView>
                <View style={{ marginTop: 5 }} >
                    <CustomHeader
                        onPress={() => navigation.goBack()}
                        iconname={"arrow-back-outline"}
                        text="Spendings"
                        color={Colors.black}
                    />
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        borderBottomColor: Colors.black,
                        borderBottomWidth: 3,
                    }}>
                    <Text
                        style={{
                            color: Colors.black,
                            fontFamily: 'Poppins-SemiBold',
                            fontSize: 28,
                            padding: 20,
                            fontWeight: '600',
                        }}>
                        Spendings
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
                            {allWalletData
                                ? 'All Data'
                                : allMonthlyData
                                    ? 'This Month'
                                    : 'Today'}
                        </Text>
                        <TouchableOpacity>
                            <Icon name="down" color={Colors.secondary} />
                        </TouchableOpacity>
                    </TouchableOpacity>
                </View>
                {(allWalletData && allData.length == 0) ||
                    (allMonthlyData && monthlyData.length == 0) ||
                    (!allWalletData && !allMonthlyData && todayData.length == 0) ? (
                    <View
                        style={{
                            backgroundColor: Colors.white,
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: Dimensions.get('window').height - 100,
                        }}>
                        <Text style={{ fontSize: 32, color: Colors.black }}>No Spents</Text>
                    </View>
                ) : (
                    <View>
                        <FlatList
                            data={
                                allWalletData
                                    ? allData
                                    : allMonthlyData
                                        ? monthlyData
                                        : todayData
                            }
                            renderItem={renderDepositData}
                            keyExtractor={(item, i) => i}
                        />
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

export default PassengerSpents;

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: Colors.white,
        zIndex: 1,
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




