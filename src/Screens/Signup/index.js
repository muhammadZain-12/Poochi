import React, { useContext, useState } from 'react';
import {
  ImageBackground,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  PermissionsAndroid,
  //   TextInput,
  ScrollView,
  ToastAndroid,
  ActivityIndicator,
  Image,
  StatusBar,
  KeyboardAvoidingView,
} from 'react-native';
import CustomButton from '../../Components/CustomButton';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
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
import axios from 'axios';
import { Base_Uri } from '../../Constant/BaseUri';
import LocationContext from '../../Context/locationContext/context';
import BookingContext from '../../Context/bookingContext/context';

export default function Signup() {
  const navigation = useNavigation();
  const context = useContext(LoginContext)

  const { loginData, setLoginData } = context


  const locationCont = useContext(LocationContext)
  let bookingCont = useContext(BookingContext)

  const { locationData, setLocationData } = locationCont
  let { bookingData, setBookingData } = bookingCont


  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    name: ""
  })
  const [secureEntry, setSecureEntry] = useState(true);
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  const [goggleLoading, setGoogleLoading] = useState(false);
  const togglePassword = () => {
    setSecureEntry(!secureEntry);
  };

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


    firestore().collection("Users").doc(uid).get().then(async (doc) => {
      let data = doc.data()

      setLoginData(data)

      if (!data?.agree) {
        setGoogleLoading(false)
        navigation.replace("TermsAndCondition")

        return
      }


      let email = user.email

      let loginAuth = {
        email: email,
      };

      loginAuth = JSON.stringify(loginAuth);
      AsyncStorage.setItem("user", loginAuth);


      if (data?.agree && !data?.fullName) {
        setGoogleLoading(false)
        navigation.replace("UserDetails")
        return
      }


      if (data) {

        setLoginData(data)

        firestore().collection("Request").doc(user.uid).get().then((doc) => {

          let data = doc.data()
          setGoogleLoading(false)
          if (data && data?.bookingStatus == "complete" && !data?.userResponse) {

            setBookingData(data)
            locationPermission().then(res => {
              if (res == 'granted') {
                Geolocation.getCurrentPosition(async (position) => {


                  let id = user.uid

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


                  firestore().collection("Users").doc(id).update({

                    currentAddress: address,
                    currentLocation: {
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude
                    }

                  }).then((res) => {

                    let dataToSend = {
                      currentAddress: address,
                      currentLocation: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                      }
                    }
                    navigation.replace('PassengerRideDetail');

                  }).catch((error) => {
                    setGoogleLoading(false)
                    ToastAndroid.show(error.message, ToastAndroid.SHORT)

                  })



                },
                  error => {

                  },
                  { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
                );
              } else {

                setGoogleLoading(false)
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
            return

          }

          if (data && data.bookingStatus == "running" && !data?.rideCancelByPassenger && !data?.rideCancelByDriver) {

            setBookingData(data)
            locationPermission().then(res => {
              if (res == 'granted') {
                Geolocation.getCurrentPosition(async (position) => {


                  let id = user.uid

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


                  firestore().collection("Users").doc(id).update({

                    currentAddress: address,
                    currentLocation: {
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude
                    }

                  }).then((res) => {

                    let dataToSend = {
                      currentAddress: address,
                      currentLocation: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                      }
                    }
                    navigation.replace('Tab', {
                      screen: {
                        name: "Home",
                        params: {
                          data: dataToSend
                        }
                      },
                    });

                  }).catch((error) => {
                    setGoogleLoading(false)
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

          } else {


            locationPermission().then(res => {
              if (res == 'granted') {
                Geolocation.getCurrentPosition(async (position) => {


                  let id = user.uid

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


                  firestore().collection("Users").doc(id).update({

                    currentAddress: address,
                    currentLocation: {
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude
                    }

                  }).then((res) => {

                    let dataToSend = {
                      currentAddress: address,
                      currentLocation: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                      }
                    }
                    navigation.replace('Tab', {
                      screen: {
                        name: "Home",
                        params: {
                          data: dataToSend
                        }
                      },
                    });

                  }).catch((error) => {
                    setGoogleLoading(false)
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
        }).catch((error) => {
          setGoogleLoading(false)
          console.log(error, "error")
        })

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


    }).catch((error) => {

      ToastAndroid.show(error.message, ToastAndroid.SHORT)
      setGoogleLoading(false);


    })

  };



  const handleSignupUser = async () => {

    if (!signupData.name) {
      ToastAndroid.show("Name is missing", ToastAndroid.SHORT)
      return
    }

    if (!signupData.email) {
      ToastAndroid.show("Email is missing", ToastAndroid.SHORT)
      return
    }
    else if (signupData.password == '' || signupData.password.length < 8) {

      if (signupData.password == '') {
        ToastAndroid.show('Password cannot be empty', ToastAndroid.SHORT);
        return false;
      }
      if (signupData.password.length < 8) {
        ToastAndroid.show(
          'Password Must Contain 8 characters',
          ToastAndroid.SHORT,
        );
        return false;
      }
      return false;
    }

    // if (!agree) {
    //   ToastAndroid.show("Kindly accept terms and conditions", ToastAndroid.SHORT)
    //   return
    // }



    const strongRegex = new RegExp(
      '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$',
    );

    let emailTest = strongRegex.test(signupData.email)


    if (!emailTest) {
      ToastAndroid.show("Invalid Email", ToastAndroid.SHORT)
      return
    }


    setLoading(true)

    try {
      const isUserCreated = await auth().createUserWithEmailAndPassword(
        signupData.email,
        signupData.password,
      );


      let { user } = isUserCreated

      let { uid } = user


      auth().signInWithEmailAndPassword(signupData.email, signupData.password).then((userCredential) => {

        ToastAndroid.show("Sign Up Successful", ToastAndroid.SHORT)
        navigation.navigate("TermsAndCondition")
        setLoading(false)


      }).catch((error) => {


        setLoading(false)
        ToastAndroid.show(error.message, ToastAndroid.SHORT)
      })

    } catch (error) {

      setLoading(false)
      ToastAndroid.show(error.message, ToastAndroid.SHORT)
    }

  }

  const handleTextChange = inputText => {
    const formattedText = inputText.replace(/\s/g, '');
    setEmail(formattedText);
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
            Sign Up
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
                  color: '#61677D',
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
              onChangeText={(e) => setSignupData({ ...signupData, name: e })}
              placeholder="Name"
              placeholderTextColor={Colors.gray}
            />
            <TextInput
              style={{
                backgroundColor: Colors.input,
                borderRadius: 5,
                width: '100%',
                marginTop: 15,
                padding: 15,
                borderWidth: 1,
                borderColor: '#b2b2b1',
                color: Colors.black,
                fontSize: 16,
                paddingHorizontal: 20,
              }}
              onChangeText={(e) => setSignupData({ ...signupData, email: e })}
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
                onChangeText={(e) => setSignupData({ ...signupData, password: e })}
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

          {/* <View style={{ paddingHorizontal: 20, flexDirection: 'row' }}>
            <TouchableOpacity
              style={{
                width: 25,
                height: 25,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
                borderWidth: 1,
                borderColor: Colors.green,
              }}
              onPress={() => setAgree(!agree)}
            >

              {agree && <Icons name="check" color={Colors.black} size={20} />}
            </TouchableOpacity>

            <Text
              style={{
                marginLeft: 10,
                fontSize: 14,
                color: Colors.black,
                fontFamily: 'Poppins-regular',
              }}>
              I'm agree to the{' '}
              <Text style={{ color: Colors.green }}>Terms of Service</Text> and{' '}
              <Text style={{ color: Colors.green }}>Privacy Policy</Text>{' '}
            </Text>
          </View> */}

          <CustomButton
            text={loading ? <ActivityIndicator size={"small"} color={Colors.white} /> : "Create Account"}
            styleContainer={{
              alignSelf: 'center',
              marginTop: 30,
              width: '90%',
            }}
            onPress={() => handleSignupUser()}
            btnTextStyle={{ fontSize: 18 }}
          />
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text
              style={{
                marginHorizontal: 20,
                marginVertical: 15,
                fontSize: 16,
                textAlign: "center",
                color: Colors.black,
                fontFamily: 'Poppins-Regular',
              }}>
              Already have account?{' '}
              <Text
                style={{
                  fontWeight: 'bold',
                  fontFamily: 'Poppins-Bold',
                  color: Colors.green,
                }}>
                Login
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
