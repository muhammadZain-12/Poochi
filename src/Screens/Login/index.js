import React, { useState, useContext, useCallback } from 'react';
import {
  ImageBackground,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  ToastAndroid,
  ActivityIndicator,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  PermissionsAndroid,
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
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import LocationContext from '../../Context/locationContext/context';
import { GOOGLE_MAP_KEY } from '../../Constant/GoogleMapKey';


export default function Login() {


  const navigation = useNavigation();
  
  Geocoder.init(GOOGLE_MAP_KEY);



  const [goggleLoading, setGoogleLoading] = useState(false);
  const [secureEntry, setSecureEntry] = useState(true);
  const [loading, setLoading] = useState(false);
  const [signinData, setSigninData] = useState({
    email: "",
    password: ""
  })

  const [agreeTermsAndCondition, setAgreeTermsAndCondition] = useState(false)

  const [modalVisible, setModalVisible] = useState(true)

  const context = useContext(LoginContext)
  const locationCont = useContext(LocationContext)

  const { loginData, setLoginData } = context
  const { locationData, setLocationData } = locationCont



  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '889265375440-76ihli23dk6ulbuamsujt41t0t3gvdcs.apps.googleusercontent.com',
      androidClientId:
        '889265375440-jbbsvsaa0p98bs1itd620d3qbl4hs6rh.apps.googleusercontent.com',
    });
  }, []);


  const locationPermission = () =>
    new Promise(async (resolve, reject) => {
      if (Platform.OS === 'ios') {
        try {
          const permissionStatus = await Geolocation.requestAuthorization(
            'whenInUse',
          );
          if (permissionStatus === 'granted') {
            return resolve('granted');
          }
          reject('Permission not granted');
        } catch (error) {
          return reject(error);
        }
      }
      return PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      )
        .then(granted => {
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            resolve('granted');
          }
        })
        .catch(error => {
          return reject(error);
        });
    });


  const getAddressFromCoords = async (latitude, longitude) => {
    try {
      const response = await Geocoder.from(latitude, longitude);
      const address = response.results[0].formatted_address;

      return address
    } catch (error) {
      console.error('Error:', error);
    }
  };


  async function onGoogleButtonPress() {
    setGoogleLoading(true);
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }
  const afterGoogleLogin = res => {

    let { user } = res;
    let { uid } = user;

    setGoogleLoading(false);

    firestore().collection("Users").doc(uid).get().then(async (doc) => {
      let data = doc.data()

      setLoginData(data)

      if (!data?.agree) {
        navigation.replace("TermsAndCondition")
        return
      }

      // if (data && data?.status == "blocked") {
      //   await GoogleSignin.signOut()
      //   await auth().signOut()
      //   ToastAndroid.show("Your id has been blocked", ToastAndroid.SHORT)
      //   return
      // }

      let email = user.email

      let loginAuth = {
        email: email,
      };

      loginAuth = JSON.stringify(loginAuth);
      AsyncStorage.setItem("user", loginAuth);


      if(data?.agree && !data?.fullName ){

        navigation.replace("UserDetails")
        return

      }

      if (data) {
        setLoginData(data)

        locationPermission().then(res => {
          if (res == 'granted') {
            Geolocation.getCurrentPosition(async (position) => {
              let id = auth()?.currentUser?.uid
              let address = await getAddressFromCoords(position.coords.latitude, position.coords.longitude)


              let data = {
                currentAddress: address,
                currentLocation: {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude
                }
              }


              setLocationData({
                ...locationData,
                currentLocation: data.currentLocation,
                currentAddress: data.currentAddress
              })


              firestore().collection("Users").doc(id).update(data).then((res) => {





                let dataToSend = {
                  currentAddress: address,
                  currentLocation: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                  }
                }
                setLoading(false)

                navigation.replace('Tab', {
                  screen: {
                    name: "Home",
                    params: {
                      data: dataToSend
                    }
                  },
                });

              }).catch((error) => {
                setLoading(false)
                ToastAndroid.show(error.message, ToastAndroid.SHORT)

              })



            },
              error => {

              },
              { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
            );
          } else {

            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'Location',
                },
              ],
            });
          }
        });
      }
      else {

        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'UserDetails',
              params: {
                email: email,
              },
            },
          ],
        });

      }


    })

  };


  const togglePassword = () => {
    setSecureEntry(!secureEntry);
  };

  const signInValidation = async () => {

    let { email, password } = signinData

    const strongRegex = new RegExp(
      '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$',
    );
    if (!email) {
      ToastAndroid.show('Please Enter Email', ToastAndroid.SHORT);
      return false;
    }

    let emailTest = strongRegex.test(email)

    if (!emailTest) {

      ToastAndroid.show('Please Enter Valid Email', ToastAndroid.SHORT);
      return false;
    }

    else if (password == '' || password.length < 8) {

      if (password == '') {
        ToastAndroid.show('Password cannot be empty', ToastAndroid.SHORT);
        return false;
      }
      if (password.length < 8) {
        ToastAndroid.show(
          'Password Must Contain 8 characters',
          ToastAndroid.SHORT,
        );
        return false;
      }
      return false;
    }

    try {
      setLoading(true);
      const isUserLogin = await auth()
        .signInWithEmailAndPassword(email, password)
        .then(async res => {

          let { user } = res;

          let { uid } = user;


          let loginAuth = {
            email: email,
            password: password,
          };

          loginAuth = JSON.stringify(loginAuth);

          AsyncStorage.setItem("user", loginAuth)

          setLoading(false);

          firestore().collection("Users").doc(uid).get().then(async (doc) => {
            let data = doc.data()


            setLoginData(data)




            if (!data?.agree) {
              navigation.replace("TermsAndCondition")
              return
            }

            // if (data && data?.status == "blocked") {
            //   // await GoogleSignin.signOut()
            //   await auth().signOut()
            //   ToastAndroid.show("Your id has been blocked", ToastAndroid.SHORT)
            //   return
            // }
            ToastAndroid.show("Login Succesfully", ToastAndroid.SHORT);
            if (data) {

              setLoginData(data)

              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'Location',
                  },
                ],
              });



            } else {


              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'UserDetails',
                    params: {
                      email: user.email,
                    },
                  },
                ],
              });

            }
          })
        });

    } catch (err) {
      setLoading(false);
      ToastAndroid.show(
        err.message ?? 'Your email is not valid',
        ToastAndroid.SHORT,
      );
    }


  };



  return (
    goggleLoading ? (
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
            Login
          </Text>

          <TouchableOpacity
            style={{
              marginBottom: 10,
              margin: 20,
              backgroundColor: Colors.input,
              borderWidth: 1,
              borderRadius: 10,
              padding: 10,
              justifyContent: 'center',
            }}
            onPress={() =>
              onGoogleButtonPress()
                .then(res => afterGoogleLogin(res))
                .catch(error => setGoogleLoading(false))
            }
          >
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 7,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={require('../../Images/google.png')}
                style={{ width: 30, height: 30 }}
              />
              <Text
                style={{
                  marginLeft: 20,
                  fontFamily: 'Poppins-Regular',
                  color: '#61277D',
                  fontSize: 18,
                }}>
                Google
              </Text>
            </View>
          </TouchableOpacity>

          <View
            style={{
              marginTop: 10,
              margin: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{ width: '44%', borderBottomWidth: 1 }}></View>
            <Text
              style={{
                width: '10%',
                color: Colors.black,
                textAlign: 'center',
                fontSize: 18,
              }}>
              or
            </Text>
            <View style={{ width: '44%', borderBottomWidth: 1 }}></View>
          </View>

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
              onChangeText={(e) => setSigninData({ ...signinData, email: e })}
              placeholder="Email"
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
                onChangeText={(e) => setSigninData({ ...signinData, password: e })}
                placeholder="Password"
                placeholderTextColor={Colors.gray}
                secureTextEntry={secureEntry}
              />
              <Icons
                name={secureEntry ? 'eye' : 'eye-off'}
                color={Colors.gray}
                size={25}
                onPress={togglePassword}
                style={{ width: '15%' }}
              />
            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")} >
            <Text
              style={{
                color: Colors.red,
                paddingHorizontal: 20,
                fontSize: 14,
                textAlign: 'right',
              }}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <CustomButton
            text={loading ? <ActivityIndicator size={"small"} color={Colors.white} /> : "Log in"}
            styleContainer={{
              alignSelf: 'center',
              marginTop: 30,
              width: '90%',
            }}
            onPress={() => signInValidation()}
            btnTextStyle={{ fontSize: 18 }}
          />
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text
              style={{
                marginHorizontal: 20,
                marginVertical: 15,
                fontSize: 16,
                textAlign: "center",
                color: Colors.black,
                fontFamily: 'Poppins-Regular',
              }}>
              Don't have account?{' '}
              <Text
                style={{
                  fontWeight: 'bold',
                  fontFamily: 'Poppins-Bold',
                  color: Colors.green,
                }}>
                Sign up
              </Text>
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}



