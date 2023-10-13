import React, { useContext, useEffect, useState } from 'react';
import {
  ImageBackground,
  StyleSheet,
  PermissionsAndroid,
  ToastAndroid,
  View,
  useWindowDimensions,
  Image,
  Text,
  TextInput,
} from 'react-native';
import Colors from '../../Constant/Color';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import LoginContext from '../../Context/loginContext/context';
import BookingContext from '../../Context/bookingContext/context';
import LocationContext from '../../Context/locationContext/context';
import Geocoder from 'react-native-geocoding';
import { GOOGLE_MAP_KEY } from '../../Constant/GoogleMapKey';
import Geolocation from 'react-native-geolocation-service';

export default function SplashScreen({ navigation }) {


  Geocoder.init(GOOGLE_MAP_KEY);



  let context = useContext(LoginContext)
  let bookingCont = useContext(BookingContext)
  let locationCont = useContext(LocationContext)

  let { bookingData, setBookingData } = bookingCont
  let { loginData, setLoginData } = context
  let { locationData, setLocationData } = locationCont



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


  useEffect(() => {




    const CheckUser = auth().currentUser;

    if (CheckUser) {

      firestore().collection("Users").doc(CheckUser.uid).get().then((doc) => {
        let data = doc.data()

        if (!data?.agree) {
          setLoginData(data)
          navigation.replace("TermsAndCondition")
          return
        }



        if (data) {
          setLoginData(data)

          firestore().collection("Request").doc(CheckUser.uid).get().then((doc) => {

            let data = doc.data()


            if (data && data?.bookingStatus == "complete" && !data?.userResponse) {

              setBookingData(data)
              locationPermission().then(res => {
                if (res == 'granted') {
                  Geolocation.getCurrentPosition(async (position) => {


                    let id = CheckUser.uid

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
              return

            }

            if (data && data.bookingStatus == "running" && !data?.rideCancelByPassenger && !data?.rideCancelByDriver) {

              setBookingData(data)
              locationPermission().then(res => {
                if (res == 'granted') {
                  Geolocation.getCurrentPosition(async (position) => {


                    let id = CheckUser.uid

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

            } else {


              locationPermission().then(res => {
                if (res == 'granted') {
                  Geolocation.getCurrentPosition(async (position) => {


                    let id = CheckUser.uid

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

          }).catch((error) => {

            console.log(error, "error")

          })



          // navigation.replace('Location');

        } else {
          navigation.replace("UserDetails", { email: CheckUser.email })
        }

      })

    } else {

      setTimeout(() => {
        navigation.replace('OnBoardingScreen');
      }, 3000);
    };

  }, [])
  return (
    <View style={styles.imgContainer}>
      <Image
        style={[styles.Logo]}
        resizeMode="cover"
        source={require('../../Images/SplashScreen.png')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  Logo: {
    height: "100%",
    width: "100%",
  },
  imgContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
