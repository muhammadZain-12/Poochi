import { View, Text, TextInput, ToastAndroid, ActivityIndicator, BackHandler } from "react-native"
import Colors from "../../Constant/Color"
import CustomHeader from "../../Components/CustomHeader"
import { useState, useEffect, useContext } from "react"
import CustomButton from "../../Components/CustomButton"
import auth from "@react-native-firebase/auth"
import firestore from "@react-native-firebase/firestore"
import LoginContext from "../../Context/loginContext/context"

function Support({ navigation }) {

    let [emailData, setEmailData] = useState({
        title: "",
        body: "",

    })

    const loginCont = useContext(LoginContext)

    const { loginData } = loginCont


    const [loading, setLoading] = useState(false)


    function generateRandomId(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomId = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomId += characters.charAt(randomIndex);
        }

        return randomId;
    }



    const handleSubmitData = () => {

        let values = Object.values(emailData)
        let flag = values.some((e, i) => !e)
        if (flag) {
            ToastAndroid.show("required fields are missing", ToastAndroid.SHORT)
            return
        }

        let messageId = generateRandomId(20)

        emailData.date = new Date()
        emailData.reply = false
        emailData.userData = loginData
        emailData.messageId = messageId


        let id = auth().currentUser?.uid
        setLoading(true)
        firestore().collection("Support").doc(id).set({
            emails: firestore.FieldValue.arrayUnion(emailData)
        }, { merge: true }).then((res) => {
            setLoading(false)
            ToastAndroid.show("Your message has been sent", ToastAndroid.SHORT)
            setEmailData({
                title: "",
                body: ""
            })
        }).catch((error) => {

            ToastAndroid.show(error.message, ToastAndroid.SHORT)

        })


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


    return (

        <View style={{ flex: 1, backgroundColor: Colors.white }} >

            <View style={{ marginTop: 5 }} >
                <CustomHeader
                    onPress={() => navigation.goBack()}
                    iconname={"arrow-back-outline"}
                    text="Support"
                    color={Colors.black}
                />
            </View>


            <View style={{ paddingHorizontal: 20, marginTop: 20 }} >

                <TextInput
                    style={{
                        backgroundColor: "#e6e6e6",
                        borderRadius: 5,
                        marginTop: 10,
                        width: '100%',
                        padding: 15,
                        borderWidth: 0,
                        color: Colors.black,
                        fontSize: 16,
                        paddingHorizontal: 10,
                    }}
                    value={emailData.title}
                    onChangeText={(e) => setEmailData({ ...emailData, title: e })}
                    placeholder="Subject"
                    placeholderTextColor={Colors.gray}
                />

                <TextInput

                    multiline={true}
                    numberOfLines={10}
                    style={{ backgroundColor: "#e6e6e6", borderRadius: 5, marginBottom: 10, marginTop: 10, fontFamily: "Poppins-Regular", color: Colors.black, fontSize: 16, paddingHorizontal: 10, textAlignVertical: "top", }}
                    placeholder='Tell us about your inquiry'
                    placeholderTextColor={"gray"}
                    value={emailData.body}
                    onChangeText={(e) => setEmailData({ ...emailData, body: e })}
                />
                <CustomButton onPress={handleSubmitData} text={loading ? <ActivityIndicator color={Colors.white} size="small" /> : "Submit"} styleContainer={{ width: "90%", alignSelf: "center", marginBottom: 20, marginTop: 10 }} />



            </View>

        </View>


    )
}

export default Support