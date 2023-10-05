import React, { useContext, useState } from 'react';
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
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import LoginContext from '../../Context/loginContext/context';


export default function UpdatePassword() {
    const navigation = useNavigation();
    const context = useContext(LoginContext)
    const { loginData, setLoginData } = context



    const [secureEntry, setSecureEntry] = useState({
        old: false,
        new: false,
        confirm: false
    });
    const [googleLoading, setGoogleLoading] = useState(false);
    const [loading, setLoading] = useState(false)

    const [passwords, setPasswords] = useState({
        old: "",
        new: "",
        confirm: ""
    })


    const togglePassword = (name) => {


        if (name == "old") {
            setSecureEntry({
                ...secureEntry,
                old: !secureEntry.old
            });
        }

        else if (name == "new") {
            setSecureEntry({
                ...secureEntry,
                new: !secureEntry.new
            });
        }

        else {

            setSecureEntry({
                ...secureEntry,
                confirm: !secureEntry.confirm
            });

        }



    };




    const handleSignupUser = async () => {

        if (!passwords.old) {
            ToastAndroid.show("Old Password is missing", ToastAndroid.SHORT)
            return
        }

        if (!passwords.new) {
            ToastAndroid.show("New Password is missing", ToastAndroid.SHORT)
            return
        }
        else if (passwords.new == '' || passwords?.new?.length < 8) {

            if (passwords.new == '') {
                ToastAndroid.show('Password cannot be empty', ToastAndroid.SHORT);
                return false;
            }
            if (passwords.new.length < 8) {
                ToastAndroid.show(
                    'Password Must Contain 8 characters',
                    ToastAndroid.SHORT,
                );
                return false;
            }
            return false;
        }

        else if (passwords.confirm == '' || passwords?.confirm?.length < 8) {

            if (passwords.confirm == '') {
                ToastAndroid.show('Password cannot be empty', ToastAndroid.SHORT);
                return false;
            }
            if (passwords.confirm.length < 8) {
                ToastAndroid.show(
                    'Password Must Contain 8 characters',
                    ToastAndroid.SHORT,
                );
                return false;
            }
            return false;
        }


        if (passwords.confirm !== passwords.new) {

            ToastAndroid.show('Confirm Password does not match', ToastAndroid.SHORT)
            return false;

        }






        setLoading(true)


        try {
            const isUserCreated = await auth().signInWithEmailAndPassword(
                loginData.email,
                passwords.old,
            );

            let { user } = isUserCreated

            let { uid } = user



            user.updatePassword(passwords.new).then(() => {
                setLoading(false)
                ToastAndroid.show("password succesfully updated", ToastAndroid.SHORT)
            }).catch((error) => {
                setLoading(false)
                // An error ocurred
                ToastAndroid.show(error.message, ToastAndroid.SHORT)
                // ...
            });



            setLoading(false)
            ToastAndroid.show("Password Updated Successfully", ToastAndroid.SHORT)
            navigation.navigate("Profile")


        } catch (error) {
            console.log(error, "message")
            setLoading(false)
            ToastAndroid.show("Invalid Old Password", ToastAndroid.SHORT)
        }

    }



    return (
        googleLoading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator color={Colors.main} size="small" />
            </View>
        ) : <KeyboardAvoidingView
            behavior="height"
            style={{ flex: 1, backgroundColor: Colors.white }}>
            <ScrollView>
                <View style={{ flex: 1, backgroundColor: Colors.white }}>
                    <StatusBar
                        animated={true}
                        backgroundColor="#fff"
                        barStyle={'dark-content'}
                    />
                    <View style={{ alignItems: 'center', marginTop: 50 }}>
                        <Image source={require('../../Images/logo.png')} />
                    </View>
                    <Text
                        style={{
                            fontSize: 32,
                            fontFamily: 'Poppins-Bold',
                            marginTop: 20,
                            color: Colors.black,
                            textAlign: 'center',
                            fontWeight: 'bold',
                        }}>
                        Update Password
                    </Text>

                    <View style={{ margin: 20, marginTop: 20, marginBottom: 10 }}>



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
                                onChangeText={(e) => setPasswords({ ...passwords, old: e })}
                                placeholder="Old Password"
                                placeholderTextColor={Colors.gray}
                                secureTextEntry={secureEntry.old}
                            />
                            <Icons
                                name={secureEntry.old ? 'eye' : 'eye-off'}
                                color={Colors.gray}
                                size={25}
                                onPress={() => togglePassword("old")}
                                style={{ width: '15%' }}
                            />
                        </View>
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
                                onChangeText={(e) => setPasswords({ ...passwords, new: e })}
                                placeholder="New Password"
                                placeholderTextColor={Colors.gray}
                                secureTextEntry={secureEntry.new}
                            />
                            <Icons
                                name={secureEntry.new ? 'eye' : 'eye-off'}
                                color={Colors.gray}
                                size={25}
                                onPress={()=>togglePassword("new")}
                                style={{ width: '15%' }}
                            />
                        </View>
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
                                onChangeText={(e) => setPasswords({ ...passwords, confirm: e })}
                                placeholder="Confirm Password"
                                placeholderTextColor={Colors.gray}
                                secureTextEntry={secureEntry.confirm}
                            />
                            <Icons
                                name={secureEntry.confirm ? 'eye' : 'eye-off'}
                                color={Colors.gray}
                                size={25}
                                onPress={togglePassword}
                                style={{ width: '15%' }}
                            />
                        </View>
                    </View>



                    <CustomButton
                        text={loading ? <ActivityIndicator size={"small"} color={Colors.white} /> : "Update Password"}
                        styleContainer={{
                            alignSelf: 'center',
                            marginTop: 30,
                            width: '90%',
                        }}
                        onPress={() => handleSignupUser()}
                        btnTextStyle={{ fontSize: 18 }}
                    />

                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
