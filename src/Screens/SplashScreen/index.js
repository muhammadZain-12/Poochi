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
  StatusBar,
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
import RadiusContext from '../../Context/RadiusContext/context';
import BannerContext from '../../Context/BannerContext/context';

export default function SplashScreen({ navigation }) {


  Geocoder.init(GOOGLE_MAP_KEY);


  let context = useContext(LoginContext)
  let bookingCont = useContext(BookingContext)
  let locationCont = useContext(LocationContext)
  let bannerCont = useContext(BannerContext)

  const { banners, setBanners } = bannerCont




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


    getBanners()

    const CheckUser = auth().currentUser;

    if (CheckUser) {

      firestore().collection("Users").doc(CheckUser.uid).get().then((doc) => {
        let data = doc.data()

        if (!data?.agree) {
          setLoginData(data)
          navigation.replace("TermsAndCondition")
          return
        }

        if (data?.agree && !data?.fullName) {

          navigation.replace("UserDetails")
          return

        }


        if (data) {
          setLoginData(data)

          firestore().collection("Request").doc(CheckUser.uid).get().then((doc) => {

            let data = doc.data()

            console.log(data, "dataaa")

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


                    console.log(address, "address")
                    console.log(position.coords, "coords")

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
            else {


              locationPermission().then(res => {



                if (res == 'granted') {
                  try {
                    Geolocation.getCurrentPosition(async (position) => {


                      console.log(position, "position")

                      let id = CheckUser.uid

                      console.log(id, "iddd")

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
                  } catch (error) {
                    console.log(error, "error")
                  }
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


  const getBanners = () => {

    firestore().collection("Banners").doc("banner321654987").onSnapshot(quertSnapshot => {

      let data = quertSnapshot.data()

      let allBanners = data?.banner

      setBanners(allBanners)

    })


  }




  return (
    <View style={styles.imgContainer}>

      <StatusBar
        animated={true}
        backgroundColor="#1bc8ff"
        barStyle={'light-content'}
      />
      <ImageBackground source={require("../../Images/SplashScreen.png")} resizeMode='cover' style={{ flex: 1, justifyContent: "center" }} >

        <View style={{ flex: 1, alignItems: "center" }} >

          <Image source={require("../../Images/logo1.png")} style={{ marginTop: 50 }} />



          <Image source={require("../../Images/taxi.png")} style={{ marginTop: 20, height: 120, width: 220 }} />


        </View>



        {/* <Image
        style={[styles.Logo]}
        resizeMode="cover"
        source={require('../../Images/SplashScreen.png')}
      /> */}
      </ImageBackground>
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
    // backgroundColor: Colors.white,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
});
