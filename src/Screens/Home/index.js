import React, { useState, useRef, useEffect, useContext, useCallback } from 'react';
import { Image, Text, Touchable, TouchableOpacity, FlatList, View, Dimensions, ScrollView, ToastAndroid, Modal, StyleSheet, ActivityIndicator, Linking } from 'react-native';
import Colors from '../../Constant/Color';
import Icons from "react-native-vector-icons/Feather"
import LoginContext from '../../Context/loginContext/context';
import LocationContext from '../../Context/locationContext/context';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import BookingContext from '../../Context/bookingContext/context';
import cardDetailsContext from '../../Context/CardDetailsContext/context';
import SelectedPetContext from '../../Context/SelectedPetContext/context';
import { Link, useIsFocused } from '@react-navigation/native';
import NotificationContext from '../../Context/NotificationContext/context';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChooseLocationContext from '../../Context/pickupanddropoffContext/context';
import IonIcons from "react-native-vector-icons/Ionicons"
import FontAwesome from "react-native-vector-icons/FontAwesome5"
import ScheduleRideContext from '../../Context/ScheduleRideContext/context';
import axios from 'axios';
import CustomButton from '../../Components/CustomButton';
import RadiusContext from '../../Context/RadiusContext/context';
import Font from "react-native-vector-icons/FontAwesome"
import ClaimContext from '../../Context/ClaimContext/context';


function Home({ navigation }) {


  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '889265375440-76ihli23dk6ulbuamsujt41t0t3gvdcs.apps.googleusercontent.com',
      androidClientId:
        '889265375440-jbbsvsaa0p98bs1itd620d3qbl4hs6rh.apps.googleusercontent.com',
    });
  }, []);


  const { height, width } = Dimensions.get('screen');

  const context = useContext(LoginContext)
  const locationCont = useContext(LocationContext)
  const bookingCont = useContext(BookingContext)
  const cardDetailCont = useContext(cardDetailsContext)
  const selectedPetCont = useContext(SelectedPetContext)
  const notificationCont = useContext(NotificationContext)
  const chooseLocationCont = useContext(ChooseLocationContext)
  const scheduleRideCont = useContext(ScheduleRideContext)
  const claimCont = useContext(ClaimContext)
  let radiusCont = useContext(RadiusContext)



  const { loginData, setLoginData } = context
  const { locationData, setLocationData } = locationCont
  const { bookingData, setBookingData } = bookingCont
  const { cardDetails, setCardDetails } = cardDetailCont
  const { selectedPets, setSelectedPets } = selectedPetCont
  const { notification, setNotification, unseenNotification, setUnseenNotifications } = notificationCont
  const { pickup, setPickup, pickupAddress, setPickupAddress, dropoff, setDropoff, dropoffAddress, setDropoffAddress, returnPickup, setReturnPickup
    , returnPickupAddress, setReturnPickupAddress, returnDropoff, setReturnDropoff, returnDropoffAddress, setReturnDropoffAddress } = chooseLocationCont
  const { scheduleData, setScheduleData } = scheduleRideCont
  const { claim, setClaim } = claimCont
  let { radius, setRadius,scheduleRideRadius,setScheduleRideRadius } = radiusCont





  const focus = useIsFocused()


  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false)
  const flatListRef = useRef(null);


  const HomePageBanner = [

    {
      id: 2,
      image: require('../../Images/banner2.jpg'),
    },
    {
      id: 3,
      image: require('../../Images/banner3.jpg'),
    },
    {
      id: 4,
      image: require('../../Images/banner4.jpg'),
    },
  ];


  // const [scheduleData, setScheduleData] = useState([

  //   {
  //     image: require("../../Images/driverProfile.png"),
  //     name: "Robert",
  //     car: "Toyota Prius",
  //     rating: 4.9,
  //     carModel: "AA 5841 AO",
  //     currentLocation: "Chicago,US",
  //     DropoffLocation: "PET Hospital",
  //     scheduleDate: "09-Sep-2023",
  //     scheduleTime: "06:30 PM",
  //     fare: 30,
  //     phoneNumber: "+921234567890",
  //     pickupCords: {
  //       latitude: -10.68860,
  //       longitude: -106.27245
  //     },
  //     dropoffCords: {
  //       latitude: -10.69860,
  //       longitude: -106.30245
  //     },
  //     last4: "8970",
  //     cardType: "visa"
  //   },
  //   {
  //     image: require("../../Images/driverProfile.png"),
  //     name: "Robert",
  //     car: "Toyota Prius",
  //     rating: 4.9,
  //     carModel: "AA 5841 AO",
  //     currentLocation: "Chicago,US",
  //     DropoffLocation: "PET Hospital",
  //     scheduleDate: "09-Sep-2023",
  //     scheduleTime: "06:30 PM",
  //     fare: 30,
  //     phoneNumber: "+921234567890",
  //     pickupCords: {
  //       latitude: -10.68860,
  //       longitude: -106.27245
  //     },
  //     dropoffCords: {
  //       latitude: -10.69860,
  //       longitude: -106.30245

  //     },
  //     last4: "8970",
  //     cardType: "visa"
  //   },
  //   {
  //     image: require("../../Images/driverProfile.png"),
  //     name: "Robert",
  //     car: "Toyota Prius",
  //     rating: 4.9,
  //     carModel: "AA 5841 AO",
  //     currentLocation: "Chicago,US",
  //     DropoffLocation: "PET Hospital",
  //     scheduleDate: "09-Sep-2023",
  //     scheduleTime: "06:30 PM",
  //     fare: 30,
  //     phoneNumber: "+921234567890",
  //     pickupCords: {
  //       latitude: -10.68860,
  //       longitude: -106.27245
  //     },
  //     dropoffCords: {
  //       latitude: -10.69860,
  //       longitude: -106.30245

  //     },
  //     last4: "8970",
  //     cardType: "visa"
  //   }
  // ])


  const [trackData, setTrackData] = useState({
    image: require("../../Images/driverProfile.png"),
    name: "Robert",
    car: "Toyota Prius",
    rating: 4.9,
    carModel: "AA 5841 AO",
    currentLocation: "Chicago,US",
    DropoffLocation: "PET Hospital",
    scheduleDate: "09-Sep-2023",
    scheduleTime: "06:30 PM",
    fare: 30,
    phoneNumber: "+921234567890",
    pickupCords: {
      latitude: -10.68860,
      longitude: -106.27245
    },
    dropoffCords: {
      latitude: -10.69860,
      longitude: -106.30245

    },
    last4: "8970",
    cardType: "visa"
  })




  const sendNotificationToUser = () => {

    let acceptedRides = scheduleData && scheduleData.length > 0 && scheduleData.filter((e, i) => {
      return e?.userData?.id == auth().currentUser.uid && e?.ScheduleRidestatus == "pending" && e?.getDriverStatus == "accepted"
    })


    acceptedRides && acceptedRides.length > 0 && acceptedRides.forEach((e, i) => {



      const scheduledDateTime = new Date(
        e?.scheduleDate?.toDate()?.getFullYear(),
        e?.scheduleDate?.toDate()?.getMonth(),
        e?.scheduleDate?.toDate()?.getDate(),
        e?.scheduleTime?.toDate()?.getHours(),
        e?.scheduleTime?.toDate()?.getMinutes(),
        e?.scheduleTime?.toDate()?.getSeconds()
      );

      const nowDateTime = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
        new Date().getHours(),
        new Date().getMinutes(),
        new Date().getSeconds()
      );

      let scheduleGetTime = scheduledDateTime.getTime()
      let nowGetTime = nowDateTime.getTime()


      let diff = scheduleGetTime - nowGetTime

      diffHours = diff / 1000 / 60 / 60



      if (diffHours > 0 && diffHours < 3 && !e?.userAcknowledge) {


        var notificationData = JSON.stringify({
          notification: {
            body: `Your next Scheduled Ride time is ${scheduledDateTime.toLocaleDateString()}  ${scheduledDateTime.toLocaleTimeString()}`,
            title: `Hi ${e?.userData?.fullName}`,
          },
          to: e?.userData?.token,
        });
        let config = {
          method: 'post',
          url: 'https://fcm.googleapis.com/fcm/send',
          headers: {
            Authorization:
              'key=AAAAzwxYyNA:APA91bEU1Zss73BLEraf4jDgob9rsAfxshC0GBBxbgPo340U5DTWDVbS9MYudIPDjIvZwNH7kNkucQ0EHNQtnBcjf5gbhbn09qU0TpKagm2XvOxmAvyBSYoczFtxW7PpHgffPpdaS9fM',
            'Content-Type': 'application/json',
          },
          data: notificationData,
        };
        axios(config)
          .then(res => {


            let notification = JSON.parse(notificationData)

            let notificationToSend = {

              title: notification.notification.title,
              body: notification.notification.body,
              date: new Date()


            }

            firestore().collection("PassengerNotification").doc(e?.userData?.id).set({
              notification: firestore.FieldValue.arrayUnion(notificationToSend)
            }, { merge: true }).then(() => {


              firestore().collection("ScheduleRides").doc(e?.userData?.id).get().then((doc) => {

                let data = doc?.data()

                let scheduleRides = data?.scheduleRides

                let otherData = scheduleRides.length > 0 && scheduleRides.filter((j, i) => j.bookingId !== e?.bookingId)
                e.userAcknowledge = true

                let allData = [...otherData, e]

                firestore().collection("ScheduleRides").doc(e?.userData?.id).set({
                  scheduleRides: allData
                }).then((res) => {

                  console.log("notification has been succesfully send")

                }).catch((error) => {
                  ToastAndroid.show(error?.message, ToastAndroid.SHORT)
                })
              })

              // 
              // console.log("Notification has been send successfully")
              // setAcceptLoader(false)

              // firestore().collection("")


            })



          })
          .catch(error => {
            console.log(error, "errorsssss")
            // setAcceptLoader(false)
          });
      }

    })



  }



  useEffect(() => {

    let interval;

    if (scheduleData && scheduleData.length > 0) {

      interval = setInterval(() => {

        sendNotificationToUser()

      }, 60000);

    }

    return () => clearInterval(interval)


  }, [scheduleData.length, focus])




  useEffect(() => {

    if (bookingData?.bookingStatus !== "running") {

      setCardDetails("")
      setSelectedPets("")
      setDropoff({})
      setReturnPickup({})
      setReturnDropoff({})
      setReturnPickupAddress("")
      setReturnDropoffAddress("")
      setDropoffAddress("")

    }

  }, [focus])


  const getRadius = () => {

    firestore().collection("fareCharges").doc("qweasdzxcfgrw").onSnapshot(querySnapshot => {
      let data = querySnapshot?.data()

      let radius = data?.mileRadius
      let scheduleRadius = data?.scheduleMileRadius

      setRadius(radius)
      setScheduleRideRadius(Number(data?.scheduleMileRadius))

    })

  }



  
  useEffect(() => {
    getRadius()
  }, [])

  const handleLogoutUser = async () => {

    AsyncStorage.removeItem("user")


    if (GoogleSignin.isSignedIn()) {


      await GoogleSignin.signOut()
      await auth().signOut()
      // ToastAndroid.show("Logout Successfully", ToastAndroid.SHORT)
      setLoginData("")
      setLocationData("")
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'Login',

          },
        ],
      });
    } else {

      auth().signOut().then((res) => {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'Login',

            },
          ],
        });
        setLoginData("")
        setLocationData("")
        // ToastAndroid.show("Logout Successfully", ToastAndroid.SHORT)

      }).catch((error) => {

        // ToastAndroid.show("Logout Unsuccessfull", ToastAndroid.SHORT)


      })
    }

  }


  const handleRouteToSupport = () => {

    Linking.openURL("mailto:apppoochie@gmail.com")
    setModalVisible(false)
    handleLogoutUser()

  }

  const handleCancel = () => {

    setModalVisible(false)
    handleLogoutUser()

  }

  const ShowLocationModal = useCallback(() => {
    return (
      <View style={styles.centeredView}>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Image style={{ width: 100, height: 100 }} resizeMode='cover' source={require('../../Images/alert.png')} />
              <Text
                style={[
                  styles.modalText,
                  {
                    color: Colors.black,
                    fontSize: 20,
                    fontFamily: 'Poppins-SemiBold',
                    marginTop: 10,
                    fontWeight: '600',
                    marginBottom: 5,
                  },
                ]}>
                Your Id has been blocked
              </Text>

              <Text
                style={[
                  styles.modalText,
                  {
                    color: Colors.gray,
                    fontSize: 14,
                    fontFamily: 'Poppins-SemiBold',
                    marginTop: 0,
                    padding: 0,
                    width: '100%',
                  },
                ]}>
                contact to the app support if you don't know the reason
              </Text>
              <View style={{ width: "100%", justifyContent: "space-between", flexDirection: "row" }} >
                <CustomButton
                  text={'Support'}
                  styleContainer={{ width: '49%', marginTop: 10 }}
                  onPress={() => handleRouteToSupport()}
                  linearStyle={{ borderRadius: 5, padding: 0 }}
                />

                <CustomButton
                  text={'Cancel'}
                  styleContainer={{ width: '49%', marginTop: 10 }}
                  onPress={() => handleCancel()}
                  linearStyle={{ borderRadius: 5, padding: 0 }}
                  bgColor={true}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }, [modalVisible]);



  useEffect(() => {

    firestore().collection("Users").doc(loginData?.id).onSnapshot(querySnapshot => {

      let userData = querySnapshot?.data()

      let blockStatus = userData?.status

      if (blockStatus == "blocked") {
        // ToastAndroid.show("You have been blocked", ToastAndroid.SHORT)
        setModalVisible(true)
        // handleLogoutUser()
      }

    })

  }, [focus])






  const getNotifications = () => {

    let id = auth().currentUser?.uid

    const unsubscribe = firestore().collection("PassengerNotification").doc(id).onSnapshot(querySnapshot => {

      if (querySnapshot.exists) {


        let data = querySnapshot.data()



        let allNotification = data?.notification




        let now = new Date().getDate()
        let nowMonth = new Date().getMonth()
        let nowYear = new Date().getFullYear()

        let filterNotification = allNotification && allNotification.length > 0 && allNotification.filter((e, i) => {

          let date = e.date.toDate()

          let notDate = date.getDate()
          let notMonth = date.getMonth()
          let notYear = date.getFullYear()


          if (now == notDate && nowMonth == notMonth && nowYear == notYear) {

            return e

          }
        })

        let unseenNotification = filterNotification && filterNotification.length > 0 && filterNotification.filter((e, i) => !e.seen)

        setUnseenNotifications(unseenNotification)


        let sorting = filterNotification && filterNotification.length > 0 && filterNotification.sort((a, b) => b?.date?.toDate() - a?.date.toDate())
        setNotification(sorting)

      }
    })
    return () => {
      unsubscribe()
    }
  }

  const getScheduleRides = () => {
    const unsubscribe = firestore().collection("ScheduleRides").doc(loginData.id).onSnapshot(querySnapshot => {

      let data = querySnapshot.data()


      if (data && data?.scheduleRides) {

        let rides = data?.scheduleRides && data?.scheduleRides.length > 0 && data?.scheduleRides.filter((e, i) => {

          const scheduledDateTime = new Date(
            e?.scheduleDate?.toDate()?.getFullYear(),
            e?.scheduleDate?.toDate()?.getMonth(),
            e?.scheduleDate?.toDate()?.getDate(),
            e?.scheduleTime?.toDate()?.getHours(),
            e?.scheduleTime?.toDate()?.getMinutes(),
            e?.scheduleTime?.toDate()?.getSeconds()
          );

          const nowDateTime = new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate(),
            new Date().getHours(),
            new Date().getMinutes(),
            new Date().getSeconds()
          );

          let scheduleGetTime = scheduledDateTime.getTime()
          let nowGetTime = nowDateTime.getTime()

          return e?.ScheduleRidestatus == "pending" && (scheduleGetTime > nowGetTime)
        })

        setScheduleData(rides)

      } else {
        setScheduleData([])
      }



    })

    return () => {
      unsubscribe()
    }

  }


  useEffect(() => {


    getNotifications()
    getScheduleRides()


  }, [focus])

  const nextImage = () => {

    if (currentIndex == HomePageBanner.length - 1) {
      const nextIndex = 0
      setCurrentIndex(nextIndex);
      flatListRef.current.scrollToIndex({ animated: true, index: nextIndex });
      return
    }

    const nextIndex = (Number(currentIndex) + 1)
    setCurrentIndex(nextIndex);
    flatListRef.current.scrollToIndex({ animated: true, index: nextIndex });
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      nextImage();
    }, 5000);

    // Cleanup function to clear interval on unmount
    return () => clearInterval(intervalId);
  }, [currentIndex]);


  const sendDeviceTokenToDatabase = () => {
    messaging()
      .requestPermission()
      .then(() => {
        // Retrieve the FCM token
        return messaging().getToken();
      })
      .then(token => {
        messaging()
          .subscribeToTopic('all_devices')
          .then(() => {

            let id = auth().currentUser?.uid

            firestore().collection("Users").doc(id).update({
              token: token
            }).then(() => {

              setLoginData({
                ...loginData,
                token: token
              })

              console.log("token has been successfully send to database")

            }).catch((error) => {

              console.log(error, "error")

            })

          })
          .catch(error => {
            console.error('Failed to subscribe to topic: all_devices', error);
          });
      })
      .catch(error => {
        console.error(
          'Error requesting permission or retrieving token:',
          error,
        );
      });
  };



  const getClaimData = async () => {

    let allClaims = []

    let unsubscribe = firestore().collection("DamagesClaim").onSnapshot((querySnapshot) => {

      querySnapshot.forEach((doc) => {

        let data = doc?.data()

        let claims = data?.claims

        if (claims && claims.length > 0) {

          claims.map((e, i) => {

            if (e?.status == "completed" && e?.userId == auth().currentUser?.uid) {


              allClaims.push(e)

            }

          })

        }


      })

      setClaim(allClaims)

    })

    return () => {

      unsubscribe()

    }

  }


  useEffect(() => {


    sendDeviceTokenToDatabase()
    getClaimData()

  }, [])



  const handleNavigateToBooking = (routeName) => {



    if (!bookingData) {
      navigation.navigate(routeName)
      return
    }

    firestore().collection("Request").doc(bookingData?.userData?.id).get().then((doc) => {

      let data = doc.data()

      if (!data) {

        navigation.navigate(routeName)
        return

      }

      if (data?.bookingStatus !== "running") {
        navigation.navigate(routeName)
      }

      else {


        setBookingData(data)
        ToastAndroid.show("Your booking is in process you cannot make another booking", ToastAndroid.SHORT)



      }

    })






  }



  const handleRouteToTrackScreen = () => {


    // if (!bookingData) {
    //   ToastAndroid.show("No Track Ride", ToastAndroid.SHORT)
    //   return
    // }

    firestore().collection("Request").doc(auth().currentUser?.uid).get().then((doc) => {

      let data = doc.data()

      if (!data || data?.userResponse || (data?.bookingStatus !== "running" && data?.userResponse) || data.bookingStatus == "cancelled") {
        ToastAndroid.show("No rides to track", ToastAndroid.SHORT)
        return
      }

      else {


        setBookingData(data)
        navigation.navigate("PassengerRideDetail")

      }
    })


    // bookingData && bookingData?.bookingStatus == "running" ? 


  }


  return <View style={{ flex: 1, backgroundColor: Colors.white }} >

    <ScrollView>

      <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 20, alignItems: "center", paddingBottom: 10 }} >
        <TouchableOpacity onPress={() => navigation.navigate("Profile")} >
          <Image source={{ uri: loginData.profile }} style={{ width: 70, height: 70, borderRadius: 100 }} />
        </TouchableOpacity>

        <View>
          <Text style={{ color: Colors.black, fontFamily: "Poppins-Bold", fontSize: 18 }} >Hi {loginData.fullName}</Text>
        </View>


        <View style={{ flexDirection: "row" }} >

          <TouchableOpacity onPress={() => navigation.navigate("Notification")} style={{ padding: 5 }} >

            {unseenNotification && unseenNotification.length > 0 && <View style={{ width: 20, height: 20, backgroundColor: "red", borderRadius: 50, position: "absolute", left: 20, justifyContent: "center", alignItems: "center", top: -5 }} >

              <Text style={{ color: Colors.white, fontFamily: "Poppins-Medium", fontSize: 14 }}>{unseenNotification?.length}</Text>


            </View>}
            <IonIcons name="notifications" size={30} color={Colors.buttonColor} />


          </TouchableOpacity>


          <TouchableOpacity style={{ padding: 5 }} onPress={() => handleRouteToTrackScreen()} >
            <FontAwesome name="route" size={25} color={Colors.buttonColor} />
          </TouchableOpacity>
        </View>




      </View>

      <View style={{ paddingHorizontal: 20 }} >


        <View>
          <View style={{ flexDirection: "row", justifyContent: "flex-end", marginBottom: 10 }} >

            {scheduleData && scheduleData.length > 0 && <TouchableOpacity onPress={() => navigation.navigate("ScheduleRide")} style={{ backgroundColor: "#d9d9d9", borderRadius: 30, padding: 10, justifyContent: "center", alignItems: "center" }} >
              <Text style={{ color: Colors.black, fontFamily: "Poppins-Medium", fontSize: 14 }} >Scheduled Rides <Font size={25} name="calendar-plus-o" color={Colors.buttonColor} /> </Text>
            </TouchableOpacity>}
          </View>





        </View>

        <View
          // colors={[Color.mainColor, Color.white]}
          style={{ zIndex: 2, width: "100%", borderRadius: 10 }}>
          <FlatList
            ref={flatListRef}
            data={HomePageBanner}
            showsHorizontalScrollIndicator={false}
            onScroll={e => {
              const x = e.nativeEvent.contentOffset.x;
              setCurrentIndex((x / (width - 50)).toFixed(0));
            }}
            horizontal
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  style={{
                    width: width,
                    alignItems: 'flex-start',
                    justifyContent: "center",
                    padding: 0,
                    margin: 0,
                  }}

                  onPress={() => navigation.navigate("PetWalk")}

                >
                  <Image
                    source={item.image}
                    style={{ width: width - 40, height: 150, borderRadius: 10 }}
                    resizeMode="stretch"
                  />
                </TouchableOpacity>
              );
            }}
          />
        </View>


        <View style={{ paddingHorizontal: 20 }} >

          <Text style={{ textAlign: "center", color: Colors.black, fontFamily: "Poppins-SemiBold", fontSize: 22, marginTop: 20, marginBottom: 20 }} >Where Would You Like To Go?</Text>


          <View style={{ width: "100%", flexWrap: "wrap", justifyContent: "space-between", flexDirection: "row" }} >

            <TouchableOpacity style={{ width: "49%" }} onPress={() => handleNavigateToBooking("MedicalTrip")} >

              <Image source={require("../../Images/medical.png")} style={{ width: "100%", borderRadius: 10 }} />

              <Text style={{ textAlign: "center", fontFamily: "Poppins-SemiBold", fontSize: 16, color: Colors.black, marginTop: 5 }} >Medical Trip</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleNavigateToBooking("PetHotel")} style={{ width: "49%" }} >
              <Image source={require("../../Images/dog.jpg")} style={{ width: "100%", height: 180, borderRadius: 10 }} />
              <Text style={{ textAlign: "center", fontFamily: "Poppins-SemiBold", fontSize: 16, color: Colors.black, marginTop: 5 }} >Pet Hotel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleNavigateToBooking("FriendsAndFamily")} style={{ width: "49%" }} >
              <Image source={require("../../Images/friends.png")} style={{ width: "100%", marginTop: 10, borderRadius: 10 }} />

              <Text style={{ textAlign: "center", fontFamily: "Poppins-SemiBold", fontSize: 16, color: Colors.black, marginTop: 5 }} >Friends & Family</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleNavigateToBooking("PetGrooming")} style={{ width: "49%" }} >
              <Image source={require("../../Images/grooming.png")} style={{ width: "100%", marginTop: 10, borderRadius: 10 }} />

              <Text style={{ textAlign: "center", fontFamily: "Poppins-SemiBold", fontSize: 16, color: Colors.black, marginTop: 5 }} >Pet Grooming</Text>
            </TouchableOpacity>

          </View>


        </View>

      </View>


      {modalVisible && ShowLocationModal()}

    </ScrollView>


  </View>;
}

export default Home;


const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    paddingVertical: 30,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});