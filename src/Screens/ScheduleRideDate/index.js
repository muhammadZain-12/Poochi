import React, { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ToastAndroid, BackHandler } from "react-native"
import DateTimePicker from '@react-native-community/datetimepicker'
import Colors from "../../Constant/Color"
import CustomHeader from "../../Components/CustomHeader"
import CustomButton from "../../Components/CustomButton"

function ScheduleRideDate({ navigation, route }) {

    let screen = route.params

    var options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };



    const [date, setDate] = useState(new Date());


    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false)

    const onChange = (event, selectedDate) => {
        setShowDatePicker(false)
        const currentDate = selectedDate || date.toDate();

        // var options = {
        //     year: 'numeric',
        //     month: 'long',
        //     day: 'numeric'
        //   };

        //   var formattedDate = new Intl.DateTimeFormat('en-US', options).format(currentDate);


        setDate(selectedDate);
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

            ToastAndroid.show("you cannot schedule booking of previous year", ToastAndroid.SHORT)
            return


        }

        if (nowYear == selectedYear && nowMonth > selectedMonth) {
            ToastAndroid.show("you cannot schedule booking of previous month", ToastAndroid.SHORT)
            return
        }

        if (nowYear == selectedYear && nowMonth == selectedMonth && nowDate > userSelectedDate) {

            ToastAndroid.show("you cannot schedule ride of previous Days", ToastAndroid.SHORT)
            return

        }

        if (nowYear == selectedYear && nowMonth == selectedMonth && nowDate == userSelectedDate) {


            const scheduledDateTime = new Date(
                date?.getFullYear(),
                date?.getMonth(),
                date?.getDate(),
                time?.getHours(),
                time?.getMinutes(),
                time?.getSeconds()
            );

            const nowDateTime = new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                new Date().getDate(),
                new Date().getHours(),
                new Date().getMinutes(),
                new Date().getSeconds()
            );

            let nowGetTime = nowDateTime.getTime()

            let selectedGetTime = scheduledDateTime.getTime()

            let diff = selectedGetTime - nowGetTime

            let diffHours = diff / 1000 / 60 / 60


            if (Number(diffHours) < 0) {
                ToastAndroid.show("You cannot schedule booking of previous hours", ToastAndroid.SHORT)
            }

            if (Number(diffHours) < 3) {
                ToastAndroid.show("Booking must be scheduled 3 hours prior to current time", ToastAndroid.SHORT)
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
            else if (screen == 'hotel') {
                navigation.navigate("PetHotel", { date: date, time: time })
            }

            else if (screen == "PetSitter") {
                navigation.navigate("PetSitter", { date: date, time: time })
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
            else if (screen == 'hotel') {
                navigation.navigate("PetHotel", { date: date, time: time })
            }
            else if (screen == "PetSitter") {
                navigation.navigate("PetSitter", { date: date, time: time })
            }


        }

    }


    React.useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            // Replace 'TabScreenName' with the name of your tab screen
            // This will navigate to the specified tab screen when the back button is pressed


            navigation.goBack()

            return true; // Return true to prevent the default back action

        });

        return () => backHandler.remove(); // Cleanup the event listener

    }, []);


    return (
        <View style={{ flex: 1, backgroundColor: Colors.white }} >


            <View style={{ marginTop: 5 }} >
                <CustomHeader
                    onPress={() => navigation.goBack()}
                    iconname={"arrow-back-outline"}
                    text={screen == "PetSitter" ? "Schedule With Sitter" : "Schedule A Ride"}
                    color={Colors.black}
                />
            </View>

            <View style={{ paddingHorizontal: 20, marginTop: 40 }} >


                <Text style={{ fontSize: 16, fontFamily: "Poppins-SemiBold", color: Colors.black, marginBottom: 20 }} >Reservations must be made 3 hours prior to booking time</Text>

                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ backgroundColor: "#e6e6e6", padding: 10, borderRadius: 10, paddingVertical: 15 }} >
                    <Text style={{ fontFamily: "Poppins-SemiBold", color: Colors.buttonColor, fontSize: 16 }} >{date ? new Intl.DateTimeFormat('en-US', options).format(date) : "Select Date"}</Text>
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
                    <Text style={{ fontFamily: "Poppins-SemiBold", color: Colors.buttonColor, fontSize: 16 }} >{time ? time?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Select Time"}</Text>
                </TouchableOpacity>
                {showTimePicker && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={time}
                        mode="time"
                        is24Hour={false}
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