import React, { useState, useContext } from 'react';
import {
    ImageBackground,
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    //   TextInput,
    ScrollView,
    ToastAndroid,
    ActivityIndicator,
    Image,
    StatusBar,
    PermissionsAndroid,
    KeyboardAvoidingView,
} from 'react-native';
import CustomButton from '../../Components/CustomButton';
import CustomHeader from '../../Components/CustomHeader';
import Colors from '../../Constant/Color';
import { TextInput } from 'react-native';
import Icons from 'react-native-vector-icons/Feather';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import DropDownPicker from 'react-native-dropdown-picker';
import ModalImg from '../../Components/modalimg';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import LoginContext from '../../Context/loginContext/context';


export default function UserDetails({ route }) {
    const navigation = useNavigation();



    let email = route?.params?.email ? route?.params?.email : route.params


    const context = useContext(LoginContext)

    let { loginData, setLoginData } = context



    const [goggleLoading, setGoogleLoading] = useState(false);
    const [secureEntry, setSecureEntry] = useState(true);
    const [loading, setLoading] = useState(false);
    const [signinData, setSigninData] = useState({
        fullName: "",
        mobileNumber: "",
        country: "",
        city: "",
        address: ""
    })


    const [openGender, setOpenGender] = useState(false)
    const [gender, setGender] = useState(null)
    const [genderOptions, setGenderOptions] = useState([
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
    ]);
    const [image1, setImage1] = useState("")
    const [image1url, setImage1url] = useState("")
    const [visible1, setVisible1] = useState(false)




    const uploadImageToFirebase = async (imageUri, imageName) => {
        const reference = storage().ref(`images/${imageName}`);
        await reference.putFile(imageUri);
    };


    const getDownloadURLFromFirebase = async (imageName) => {
        const reference = storage().ref(`images/${imageName}`);
        try {
            const url = await reference.getDownloadURL();
            return url;
        } catch (error) {
            console.error('Error getting download URL:', error);
            throw error;
        }
    };


    const openGallery = async () => {
        hideModal1();
        let options = {
            saveToPhotos: true,
            mediaType: 'photo',
        };
        const result = await launchImageLibrary(options);
        if (result.didCancel) {
            hideModal1();
            ToastAndroid.show("Image Permission Denied", ToastAndroid.SHORT)
        } else if (result.errorCode == 'permission') {
            hideModal1();
            ToastAndroid.show("Image Permission Not Satisfied", ToastAndroid.SHORT)
        } else if (result.errorCode == 'others') {
            hideModal1();
            ToastAndroid.show(result.errorMessage, ToastAndroid.SHORT);
        } else {
            hideModal1();
            let uri = result.assets[0].uri
            let filename = result.assets[0].fileName
            setImage1url(uri)
            await uploadImageToFirebase(uri, filename);

            // Get the download URL of the uploaded image
            const downloadURL = await getDownloadURLFromFirebase(filename);

            setImage1(downloadURL)

        }
    };

    const openCamera = async () => {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            hideModal1();
            let options = {
                saveToPhotos: true,
                mediaType: 'photo',
            };
            const result = await launchCamera(options);
            if (result.didCancel) {
                hideModal1();
                ToastAndroid.show("Image Permission Denied", ToastAndroid.SHORT)
            } else if (result.errorCode == 'permission') {
                hideModal1();
                ToastAndroid.show("Image Permission Not Satisfied", ToastAndroid.SHORT)
            } else if (result.errorCode == 'others') {
                hideModal1();
                ToastAndroid.show(result.errorMessage, ToastAndroid.SHORT);
            } else {
                hideModal1();

                let uri = result.assets[0].uri
                let filename = result.assets[0].fileName
                setImage1url(uri)
                await uploadImageToFirebase(uri, filename);
                const downloadURL = await getDownloadURLFromFirebase(filename);
                setImage1(downloadURL)



            }
        }
    };

    const hideModal1 = () => setVisible1(false);








    const signInValidation = async () => {

        let uid = auth().currentUser.uid

        let dataToSend = {

            fullName: signinData.fullName,
            mobileNumber: signinData.mobileNumber,
            country: signinData.country,
            city: signinData.city,
            address: signinData.address,
            profile: image1,
            gender: gender,
            email: email,
            created_at: new Date(),
            id: uid

        }


        let values = Object.values(dataToSend)

        let flag = values.some((e, i) => !e)

        if (flag) {
            ToastAndroid.show("Required Fields are missing", ToastAndroid.SHORT)
            return
        }



        setLoading(true)



        firestore().collection("Users").doc(uid).set(dataToSend).then((res) => {

            ToastAndroid.show("Details has been submitted Succesfully", ToastAndroid.SHORT)
            setLoginData(dataToSend)
            setLoading(false)
            navigation.navigate("Location")


        }).catch((error) => {
            setLoading(false)
            ToastAndroid.show(error.message, ToastAndroid.SHORT)
        })


    };



    return (
        <View style={{ flex: 1, backgroundColor: Colors.white }} >
            <View style={{ marginTop: 5 }} >
                <CustomHeader
                    onPress={() => navigation.goBack()}
                    iconname={"arrow-back-outline"}
                    text="Complete Your Profile"
                    color={Colors.black}
                />
            </View>


            <View style={{ width: "100%", justifyContent: "center", alignItems: "center", marginTop: 10 }} >

                <TouchableOpacity onPress={() => setVisible1(true)} style={{ width: 100, height: 100, backgroundColor: "#e6e6e6", borderRadius: 10, alignItems: "center", justifyContent: "center" }} >

                    <Image source={image1url ? { uri: image1url } : require("../../Images/box.png")} style={image1url && { width: 100, height: 100, borderRadius: 10 }} />

                </TouchableOpacity>

            </View>



            <KeyboardAvoidingView
                behavior="height"
                style={{ flex: 1, backgroundColor: Colors.white }}>
                <ScrollView>
                    <View style={{ flex: 1, backgroundColor: Colors.white }}>
                        <StatusBar
                            animated={true}
                            backgroundColor="#fff"
                            barStyle={'dark-content'}
                        />

                        <View style={{ margin: 20, marginTop: 10, marginBottom: 10 }}>
                            <TextInput
                                style={{
                                    backgroundColor: Colors.input,
                                    borderRadius: 5,
                                    width: '100%',
                                    padding: 15,
                                    borderWidth: 1,
                                    borderColor: '#b2b2b1',
                                    color: Colors.black,
                                    fontSize: 16,
                                    paddingHorizontal: 20,
                                }}
                                onChangeText={(e) => setSigninData({ ...signinData, fullName: e })}
                                placeholder="Full Name"
                                placeholderTextColor={Colors.gray}
                            />

                            <View
                                style={{
                                    backgroundColor: Colors.input,
                                    borderRadius: 5,
                                    width: '100%',
                                    marginTop: 15,

                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    borderWidth: 1,
                                    borderColor: '#b2b2b1',
                                }}>
                                <TextInput
                                    style={{
                                        backgroundColor: Colors.input,
                                        borderRadius: 5,
                                        width: '85%',
                                        padding: 15,
                                        color: Colors.black,
                                        fontSize: 16,
                                        paddingHorizontal: 20,
                                    }}
                                    keyboardType='phone-pad'
                                    onChangeText={(e) => setSigninData({ ...signinData, mobileNumber: e })}
                                    placeholder="Mobile Number"
                                    placeholderTextColor={Colors.gray}
                                />
                            </View>

                            <DropDownPicker
                                open={openGender}
                                value={gender}
                                items={genderOptions}
                                setOpen={setOpenGender}
                                setValue={setGender}
                                setItems={setGenderOptions}
                                containerStyle={{ height: 60, borderWidth: 0, borderRadius: 5, backgroundColor: "#e6e6e6", alignItems: "center", justifyContent: "center", marginTop: 10, zIndex: 100 }}
                                style={{ backgroundColor: Colors.input, borderRadius: 5, borderWidth: 0, paddingVertical: 10, }}
                                textStyle={{ fontSize: 16 }}
                                dropDownContainerStyle={{ zIndex: 800 }}
                                placeholder={'Gender'}
                                placeholderStyle={{ color: "gray" }}
                            />


                            <TextInput
                                style={{
                                    backgroundColor: Colors.input,
                                    borderRadius: 5,
                                    width: '100%',
                                    padding: 15,
                                    marginTop: 20,
                                    borderWidth: 1,
                                    borderColor: '#b2b2b1',
                                    color: Colors.black,
                                    fontSize: 16,
                                    paddingHorizontal: 20,
                                }}
                                onChangeText={(e) => setSigninData({ ...signinData, country: e })}
                                placeholder="Country"
                                placeholderTextColor={Colors.gray}
                            />
                            <TextInput
                                style={{
                                    backgroundColor: Colors.input,
                                    borderRadius: 5,
                                    width: '100%',
                                    padding: 15,
                                    marginTop: 20,
                                    borderWidth: 1,
                                    borderColor: '#b2b2b1',
                                    color: Colors.black,
                                    fontSize: 16,
                                    paddingHorizontal: 20,
                                }}
                                onChangeText={(e) => setSigninData({ ...signinData, city: e })}
                                placeholder="City"
                                placeholderTextColor={Colors.gray}
                            />
                            <TextInput
                                style={{
                                    backgroundColor: Colors.input,
                                    borderRadius: 5,
                                    width: '100%',
                                    padding: 15,
                                    marginTop: 20,
                                    borderWidth: 1,
                                    borderColor: '#b2b2b1',
                                    color: Colors.black,
                                    fontSize: 16,
                                    paddingHorizontal: 20,
                                }}
                                onChangeText={(e) => setSigninData({ ...signinData, address: e })}
                                placeholder="Address"
                                placeholderTextColor={Colors.gray}
                            />

                        </View>


                        <CustomButton
                            text={loading ? <ActivityIndicator size={"small"} color={Colors.white} /> : "Next"}
                            styleContainer={{
                                alignSelf: 'center',
                                marginTop: 30,
                                width: '90%',
                            }}
                            onPress={() => signInValidation()}
                            btnTextStyle={{ fontSize: 18 }}
                        />
                    </View>
                </ScrollView>

                <ModalImg
                    modalVisible={visible1}
                    openGallery={openGallery}
                    openCamera={openCamera}
                    closeModal={hideModal1}
                />

            </KeyboardAvoidingView>
        </View>
    );
}
