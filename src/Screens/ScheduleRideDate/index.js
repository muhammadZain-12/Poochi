import React, { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
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
        // setShowDatePicker(Platform.OS === 'ios'); // Hide the picker on iOS when a date is selected
        setDate(currentDate);
    };

    const [time, setTime] = useState(new Date())




    const onChangeTime = (event, selectedDate) => {
        setShowTimePicker(false)
        const currentDate = selectedDate || date;
        // setShowDatePicker(Platform.OS === 'ios'); // Hide the picker on iOS when a date is selected
        setTime(currentDate);
    };




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

            <CustomButton onPress={() => screen == "medical" && navigation.navigate("MedicalTrip", { date: date, time: time })} text={"Done"} styleContainer={{ position: "absolute", bottom: 40, width: "90%", alignSelf: "center" }} />

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