import React, { useContext, useState } from 'react';
import {
  ImageBackground,
  StyleSheet,
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



export default function SplashScreen({ navigation }) {

  let context = useContext(LoginContext)
  let bookingCont = useContext(BookingContext)

  let { bookingData, setBookingData } = bookingCont
  let { loginData, setLoginData } = context

  setTimeout(() => {
    const CheckUser = auth().currentUser;

    if (CheckUser) {

      firestore().collection("Users").doc(CheckUser.uid).get().then((doc) => {
        let data = doc.data()

        if (data) {
          setLoginData(data)


          firestore().collection("Request").doc(CheckUser.uid).get().then((doc) => {

            let data = doc.data()


            if (data && data?.bookingStatus == "complete" && !data?.userResponse) {

              setBookingData(data)
              navigation.replace("PassengerRideDetail")
              return

            }



            if (data && data.bookingStatus == "running" && !data?.rideCancelByPassenger && !data?.rideCancelByDriver) {

              setBookingData(data)
              navigation.replace('Tab');

            } else {
              navigation.replace('Location');
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
      navigation.replace('OnBoardingScreen');
    }
  }, 3000);

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
