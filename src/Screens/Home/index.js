import React, { useState, useRef, useEffect, useContext } from 'react';
import { Image, Text, Touchable, TouchableOpacity, FlatList, View, Dimensions, ScrollView, ToastAndroid } from 'react-native';
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
import { useIsFocused } from '@react-navigation/native';
import NotificationContext from '../../Context/NotificationContext/context';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChooseLocationContext from '../../Context/pickupanddropoffContext/context';
import IonIcons from "react-native-vector-icons/Ionicons"
import FontAwesome from "react-native-vector-icons/FontAwesome5"

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

  const { loginData, setLoginData } = context
  const { locationData, setLocationData } = locationCont
  const { bookingData, setBookingData } = bookingCont
  const { cardDetails, setCardDetails } = cardDetailCont
  const { selectedPets, setSelectedPets } = selectedPetCont
  const { notification, setNotification, unseenNotification, setUnseenNotifications } = notificationCont
  const { pickup, setPickup, pickupAddress, setPickupAddress, dropoff, setDropoff, dropoffAddress, setDropoffAddress, returnPickup, setReturnPickup
    , returnPickupAddress, setReturnPickupAddress, returnDropoff, setReturnDropoff, returnDropoffAddress, setReturnDropoffAddress } = chooseLocationCont




  const focus = useIsFocused()


  const [currentIndex, setCurrentIndex] = useState(0);
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


  const [scheduleData, setScheduleData] = useState([

    {
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
    },
    {
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
    },
    {
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
    }
  ])


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

  useEffect(() => {

    if (loginData?.status == "blocked") {

      ToastAndroid.show("You have been blocked", ToastAndroid.SHORT)

      handleLogoutUser()

    }

  }, [focus])


  const getNotifications = () => {

    let id = auth().currentUser?.uid

    const unsubscribe = firestore().collection("Notification").doc(id).onSnapshot(querySnapshot => {

      if (querySnapshot.exists) {


        let data = querySnapshot.data()


        let allNotification = data?.notification


        let unseenNotification = allNotification && allNotification.length > 0 && allNotification.filter((e, i) => !e.seen)

        setUnseenNotifications(unseenNotification)


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

        let sorting = filterNotification && filterNotification.length > 0 && filterNotification.sort((a, b) => b?.date?.toDate() - a?.date.toDate())
        setNotification(sorting)

      }

    })


    return () => {
      unsubscribe()
    }



  }


  useEffect(() => {


    getNotifications()


  }, [focus])


  console.log(currentIndex, "currentIndex")

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




  useEffect(() => {


    sendDeviceTokenToDatabase()

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


    if (!bookingData) {
      ToastAndroid.show("No Track Ride", ToastAndroid.SHORT)
      return
    }

    firestore().collection("Request").doc(bookingData?.userData?.id).get().then((doc) => {

      let data = doc.data()

      if ((data?.bookingStatus !== "running" && data?.userReponse) || data.bookingStatus == "cancelled") {
        ToastAndroid.show("No Track Ride", ToastAndroid.SHORT)
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

      <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 20, alignItems: "center" }} >
        <TouchableOpacity onPress={() => navigation.navigate("Profile")} >
          <Image source={{ uri: loginData.profile }} style={{ width: 70, height: 70, borderRadius: 100 }} />
        </TouchableOpacity>

        {/* <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }} >

          <Image source={require("../../Images/location.png")} />

          <Text style={{ fontSize: 18, fontWeight: "bold", color: Colors.black, fontSize: 16, marginLeft: 5 }} >{locationData?.currentAddress?.slice(0, 10)}...</Text>

          <Icons size={20} color="gray" name="chevron-down" />

        </TouchableOpacity> */}

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
          <View style={{ flexDirection: "row", justifyContent: "space-between" }} >

            {/* {scheduleData && scheduleData.length > 0 && <TouchableOpacity onPress={() => navigation.navigate("ScheduleRide", scheduleData)} style={{ backgroundColor: "#d9d9d9", borderRadius: 30, padding: 10, height: 50, justifyContent: "center", alignItems: "center" }} >
              <Text style={{ color: Colors.black, fontFamily: "Poppins-Medium", fontSize: 14 }} >Schedule Ride <Image source={require("../../Images/callender.png")} style={{ width: 20, height: 20 }} /> </Text>
            </TouchableOpacity>} */}
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

          <Text style={{ textAlign: "center", color: Colors.black, fontFamily: "Poppins-SemiBold", fontSize: 22, marginTop: 20, marginBottom: 20 }} >Where would you like to go?</Text>


          <View style={{ width: "100%", flexWrap: "wrap", justifyContent: "space-between", flexDirection: "row" }} >

            <TouchableOpacity style={{ width: "49%" }} onPress={() => handleNavigateToBooking("MedicalTrip")} >

              <Image source={require("../../Images/medical.png")} style={{ width: "100%", borderRadius: 10 }} />

              <Text style={{ textAlign: "center", fontFamily: "Poppins-SemiBold", fontSize: 16, color: Colors.black, marginTop: 5 }} >Medical Trip</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleNavigateToBooking("PetWalk")} style={{ width: "49%" }} >
              <Image source={require("../../Images/dog.jpg")} style={{ width: "100%",height:180, borderRadius: 10 }} />
              <Text style={{ textAlign: "center", fontFamily: "Poppins-SemiBold", fontSize: 16, color: Colors.black, marginTop: 5 }} >Dog Hotel</Text>
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


    </ScrollView>


  </View>;
}

export default Home;
