import React, { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ToastAndroid } from "react-native"
import DateTimePicker from '@react-native-community/datetimepicker'
import Colors from "../../Constant/Color"
import CustomHeader from "../../Components/CustomHeader"
import CustomButton from "../../Components/CustomButton"

function ScheduleRideDate({ navigation, route }) {


    let screen = route.params


    const [date, setDate] = useState(new Date());


    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false)

    const onChange = (event, selectedDate) => {
        setShowDatePicker(false)
        const currentDate = selectedDate || date;
        setDate(currentDate);
    };

    const [time, setTime] = useState(new Date())

    const onChangeTime = (event, selectedDate) => {

        setShowTimePicker(false)
        const currentDate = selectedDate || date;
        setTime(currentDate);
    };




    const navigateToOtherPage = () => {




        let now = new Date()

        let nowYear = now.getFullYear()
        let nowMonth = now.getMonth()
        let nowDate = now.getDate()




        let selectedDate = date.getTime()
        let selectedYear = date.getFullYear()
        let selectedMonth = date.getMonth()
        let userSelectedDate = date.getDate()






        if (nowYear > selectedYear) {

            ToastAndroid.show("you cannot schedule ride of previous year", ToastAndroid.SHORT)
            return


        }

        if (nowYear == selectedYear && nowMonth > selectedMonth) {
            ToastAndroid.show("you cannot schedule ride of previous month", ToastAndroid.SHORT)
            return
        }

        if (nowYear == selectedYear && nowMonth == selectedMonth && nowDate > userSelectedDate) {

            ToastAndroid.show("you cannot schedule ride of previous Days", ToastAndroid.SHORT)
            return

        }

        if (nowYear == selectedYear && nowMonth == selectedMonth && nowDate == userSelectedDate) {
            let nowGetTime = now.getTime()

            let selectedGetTime = time.getTime()

            let diff = selectedGetTime - nowGetTime

            let diffHours = diff / 1000 / 60 / 60

            if (Number(diffHours) < 3) {
                ToastAndroid.show("you must schedule ride atleast after 3 hours of current time", ToastAndroid.SHORT)
                return
            }

            if (screen == "medical") {

                navigation.navigate("MedicalTrip", { date: date, time: time })


            }
            else if (screen == "grooming") {
                navigation.navigate("PetGrooming", { date: date, time: time })
            }
            else if (screen == "friends") {
                navigation.navigate("FriendsAndFamily", { date: date, time: time })
            }
            else if (screen == "petWalk") {
                navigation.navigate("PetWalk", { date: date, time: time })
            }

        } else {

            if (screen == "medical") {
                navigation.navigate("MedicalTrip", { date: date, time: time })
            }
            else if (screen == "grooming") {
                navigation.navigate("PetGrooming", { date: date, time: time })
            }
            else if (screen == "friends") {
                navigation.navigate("FriendsAndFamily", { date: date, time: time })
            }
            else if (screen == "petWalk") {
                navigation.navigate("PetWalk", { date: date, time: time })
            }


        }

    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors.white }} >


            <View style={{ marginTop: 5 }} >
                <CustomHeader
                    onPress={() => navigation.goBack()}
                    iconname={"arrow-back-outline"}
                    text="Schedule Ride"
                    color={Colors.black}
                />
            </View>

            <View style={{ paddingHorizontal: 20, marginTop: 40 }} >

                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ backgroundColor: "#e6e6e6", padding: 10, borderRadius: 10, paddingVertical: 15 }} >
                    <Text style={{ fontFamily: "Poppins-SemiBold", color: Colors.buttonColor, fontSize: 16 }} >{date ? date?.toString() : "Select Date"}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode="date" // Change to "time" for a time picker
                        display="spinner" // Change to "spinner" for Android
                        onChange={onChange}
                    />
                )}

                <TouchableOpacity onPress={() => setShowTimePicker(true)} style={{ backgroundColor: "#e6e6e6", padding: 10, borderRadius: 10, paddingVertical: 15, marginTop: 20 }} >
                    <Text style={{ fontFamily: "Poppins-SemiBold", color: Colors.buttonColor, fontSize: 16 }} >{time ? time?.toLocaleTimeString() : "Select Time"}</Text>
                </TouchableOpacity>
                {showTimePicker && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={time}
                        mode="time"
                        is24Hour={true}
                        display="spinner"
                        onChange={onChangeTime}
                    />
                )}





            </View>

            <CustomButton onPress={() => navigateToOtherPage()} text={"Done"} styleContainer={{ position: "absolute", bottom: 40, width: "90%", alignSelf: "center" }} />

        </View>
    )
}

export default ScheduleRideDate



const styles = StyleSheet.create({
    customDatePicker: {
        backgroundColor: 'white', // Customize the background color
        borderRadius: 10, // Customize border radius
        marginTop: 20, // Customize margin
        // Add more custom styles as needed
    },
});