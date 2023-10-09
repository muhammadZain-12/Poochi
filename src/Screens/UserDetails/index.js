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
import countriesObject from '../../Constant/countries';
import ModalDropdown from 'react-native-modal-dropdown';
import CustomDropDown from '../../Components/dropdown';


DropDownPicker.setListMode("SCROLLVIEW")


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
        mobileNumber: "+1",
        streetAddress: "",
        extendedAddress: "",
        state: "",
        city: "",
        zipCode: ""
    })

    const [allCountries, setAllCountries] = useState(countriesObject)
    const [selectedCountry, setSelectedCountry] = useState({
        subject : "United States",
        value : "United States",
        id : 186
    })
    const [openCountry, setOpenCountry] = useState(false)

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

        if (!signinData?.fullName) {
            ToastAndroid.show("Full Name is missing", ToastAndroid.SHORT)
            return
        }
        if (!signinData?.mobileNumber) {
            ToastAndroid.show("Mobile Number is missing", ToastAndroid.SHORT)
            return
        }
        if (!signinData?.city) {
            ToastAndroid.show("City is missing", ToastAndroid.SHORT)
            return
        }
        if (!selectedCountry) {
            ToastAndroid.show("Country is missing", ToastAndroid.SHORT)
            return
        }
        if (!signinData?.streetAddress) {
            ToastAndroid.show("Street Address is missing", ToastAndroid.SHORT)
            return
        }

        if (!signinData?.extendedAddress) {
            ToastAndroid.show("Extended Address is missing", ToastAndroid.SHORT)
            return
        }

        if (!signinData?.state) {
            ToastAndroid.show("State is missing", ToastAndroid.SHORT)
            return
        }

        if (!image1) {
            ToastAndroid.show("Image is missing", ToastAndroid.SHORT)
            return
        }

        if (!signinData?.zipCode) {
            ToastAndroid.show("Zip Code is missing", ToastAndroid.SHORT)
            return
        }

        if (!gender) {
            ToastAndroid.show("Gender is missing", ToastAndroid.SHORT)
            return
        }



        let dataToSend = {

            fullName: signinData.fullName,
            mobileNumber: signinData.mobileNumber,
            country: selectedCountry,
            city: signinData.city,
            streetAddress: signinData.streetAddress,
            extendedAddress: signinData?.extendedAddress,
            profile: image1,
            state: signinData?.state,
            zipCode: signinData?.zipCode,
            gender: gender,
            email: email,
            created_at: new Date(),
            id: uid

        }

        console.log(dataToSend, "DATAtOsEND")



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
                    // onPress={() => navigation.goBack()}
                    // iconname={"arrow-back-outline"}
                    text="Complete Your Profile"
                    color={Colors.black}
                />
            </View>


            <View style={{ width: "100%", justifyContent: "center", alignItems: "center", marginTop: 10 }} >

                <TouchableOpacity onPress={() => setVisible1(true)} style={{ width: 100, height: 100, backgroundColor: "#e6e6e6", borderRadius: 100, alignItems: "center", justifyContent: "center" }} >

                    <Image source={image1url ? { uri: image1url } : require("../../Images/box.png")} style={image1url && { width: 100, height: 100, borderRadius: 100 }} />

                </TouchableOpacity>

            </View>



            <KeyboardAvoidingView
                behavior="height"
                style={{ flex: 1, backgroundColor: Colors.white }}>
                <ScrollView nestedScrollEnabled={true} style={{ flex: 1 }} >
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
                                value={signinData.fullName}
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
                                    value={signinData.mobileNumber}
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
                                containerStyle={{ height: 60, borderRadius: 5, alignItems: "center", justifyContent: "center", marginTop: 10, elevation: 0, zIndex: 100 }}
                                style={{ backgroundColor: Colors.input, borderRadius: 5, borderWidth: 1, paddingVertical: 17, borderColor: '#b2b2b1', }}
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
                                    borderWidth: 1,
                                    borderColor: '#b2b2b1',
                                    color: Colors.black,
                                    fontSize: 16,
                                    marginTop: 10,
                                    paddingHorizontal: 20,
                                }}
                                value={signinData.streetAddress}
                                onChangeText={(e) => setSigninData({ ...signinData, streetAddress: e })}
                                placeholder="Street Address"
                                placeholderTextColor={Colors.gray}
                            />

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
                                    marginTop: 10,
                                    paddingHorizontal: 20,
                                }}
                                value={signinData.extendedAddress}
                                onChangeText={(e) => setSigninData({ ...signinData, extendedAddress: e })}
                                placeholder="Extended Address"
                                placeholderTextColor={Colors.gray}
                            />


                            <CustomDropDown
                                setSelectedSubject={setSelectedCountry}

                                selectedSubject={selectedCountry}
                                dropdownPlace={"Select Country"}
                                dropdownContainerStyle={{
                                    paddingVertical: 15,
                                    marginTop: 10,
                                    borderWidth: 1,
                                    borderColor: '#b2b2b1',
                                    paddingHorizontal: 20,
                                    backgroundColor: Colors.input

                                }}
                                subject={countriesObject}
                            //   categoryShow={"complain_name"}
                            />






                            <TextInput
                                style={{
                                    backgroundColor: Colors.input,
                                    borderRadius: 5,
                                    width: '100%',
                                    padding: 15,
                                    marginTop: 10,
                                    borderWidth: 1,
                                    borderColor: '#b2b2b1',
                                    color: Colors.black,
                                    fontSize: 16,
                                    paddingHorizontal: 20,
                                }}
                                value={signinData.state}
                                onChangeText={(e) => setSigninData({ ...signinData, state: e })}
                                placeholder="State"
                                placeholderTextColor={Colors.gray}
                            />
                            <TextInput
                                style={{
                                    backgroundColor: Colors.input,
                                    borderRadius: 5,
                                    width: '100%',
                                    padding: 15,
                                    marginTop: 10,
                                    borderWidth: 1,
                                    borderColor: '#b2b2b1',
                                    color: Colors.black,
                                    fontSize: 16,
                                    paddingHorizontal: 20,
                                }}
                                value={signinData.city}
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
                                    marginTop: 10,
                                    borderWidth: 1,
                                    borderColor: '#b2b2b1',
                                    color: Colors.black,
                                    fontSize: 16,
                                    paddingHorizontal: 20,
                                }}
                                keyboardType='numeric'
                                value={signinData.zipCode}
                                onChangeText={(e) => setSigninData({ ...signinData, zipCode: e })}
                                placeholder="Zip Code"
                                placeholderTextColor={Colors.gray}
                            />

                        </View>


                        <CustomButton
                            text={loading ? <ActivityIndicator size={"small"} color={Colors.white} /> : "Next"}
                            styleContainer={{
                                alignSelf: 'center',
                                marginTop: 30,
                                width: '90%',
                                marginBottom:30
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
