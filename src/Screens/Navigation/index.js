import React, { useState, useEffect, useContext } from 'react';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../SplashScreen';
import OnBoardingScreen from '../OnboardingScreen';
import Login from '../Login';
import Signup from '../Signup';
import ForgotPassword from '../ForgotPassword';
import Location from '../Location';
import Home from '../Home';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PetDetails from '../PetDetails';
import Chat from '../Chat';
import { Image, TouchableOpacity, TouchableOpacityBase, View } from 'react-native';
import Colors from '../../Constant/Color';
import Icon from "react-native-vector-icons/AntDesign"
import MedicalTrip from '../MedicalTrip';
import Ionicons from "react-native-vector-icons/Ionicons"
import PetSelect from '../PetSelect';
import PaymentMethod from '../PaymentMethod';
import Drivers from '../Drivers';
import SinglePetDetail from '../SinglePetDetail';
import Profile from '../Profile';
import ScheduleRide from '../ScheduleRide';
import ScheduleRideDetails from '../ScheduleRideDetails';
import RideCancel from '../RideCancel';
import PassengerRideDetail from '../PassengerRideDetailScreen';
import Track from '../Track';
import PetGrooming from '../PetGrooming';
import FriendsAndFamily from '../FriendsAndFamily';
import ScheduleRideDate from '../ScheduleRideDate';
import GooglePlace from '../googlePlaceScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserDetails from '../UserDetails';
import Pets from '../Pets';
import Wallet from '../wallet';
import Notification from '../Notification';
import History from '../History';
import PassengerDeposits from '../PassengerEarning';
import PassengerSpents from '../PassnegerSpents';
import PetWalk from '../PetWalk';
import AccountSetting from '../AccountSetting';
import UpdatePassword from '../updatePassword';
import EditProfile from '../EdiitProfile';
import PrivacyPolicy from '../PrivacyPolicy';
import ChatSingle from '../Home/singleChat';
import TermsAndConditions from '../TermsAndCondition';
import AntDesign from "react-native-vector-icons/AntDesign"
import ScheduleCancelRide from '../ScheduleCancelRide';
import Support from '../Support';
import PetHotel from '../PetHotel';
import Claims from '../Claims';
import ClaimDetails from '../ClaimsDetails';
import Petsitter from '../PetSitter';
import FontAwesome from "react-native-vector-icons/FontAwesome5"
import BookingContext from '../../Context/bookingContext/context';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import SittersGallery from '../SittersGallery';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


// const bookingCont = useContext(BookingContext)

// const {bookingData} = bookingCont






// if (!bookingData) {
//   ToastAndroid.show("No Track Ride", ToastAndroid.SHORT)
//   return
// }





function CustomTabBar(navigation, chatScreen, setChatScreen, homeScreen, setHomeScreen, petScreen, setPetScreen) {


  const handleNavigateToChat = () => {


    setChatScreen(true)
    setHomeScreen(false)
    setPetScreen(false)

    navigation.navigate("Chats")

  }

  const handleNavigateToHome = () => {


    setChatScreen(false)
    setHomeScreen(true)
    setPetScreen(false)

    navigation.navigate("Home")

  }

  const handleNavigateToPet = () => {


    setChatScreen(false)
    setHomeScreen(false)
    setPetScreen(true)

    navigation.navigate("PetDetails")

  }

  return (
    <View style={{ backgroundColor: '#E6E6E6', height: 80, borderTopEndRadius: 40, borderTopStartRadius: 40, justifyContent: "space-around", alignItems: "center", flexDirection: "row" }}>

      <TouchableOpacity onPress={() => handleNavigateToHome()} >

        <Ionicons name="home" color={homeScreen ? Colors.green : Colors.gray} size={40} />

      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleNavigateToPet()} style={{ height: 40, width: 40, borderRadius: 10, backgroundColor: petScreen ? Colors.buttonColor : Colors.gray, justifyContent: "center", alignItems: "center" }} >

        <Icon name="plus" size={20} color={Colors.white} />

      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleNavigateToChat()} >

        <AntDesign name="wechat" size={50} color={chatScreen ? Colors.buttonColor : Colors.gray} />

      </TouchableOpacity>


    </View>
  );
}




// const handleRouteToTrackScreen = () => {


// let isTracked = false

// firestore().collection("Request").doc(auth().currentUser?.uid).get().then((doc) => {

//   let data = doc.data()

//   if (!data || data?.userResponse || (data?.bookingStatus !== "running" && data?.userResponse) || data.bookingStatus == "cancelled" || data?.requestStatus !== "accept") {
//     ToastAndroid.show("No rides to track", ToastAndroid.SHORT)
//     isTracked = false
//     return
//   }

//   else {

//     isTracked = true
//     // setBookingData(data)
//     // navigation.navigate("PassengerRideDetail")

//   }
// })

// return isTracked

// // bookingData && bookingData?.bookingStatus == "running" ? 


// }

// let tracked = await handleRouteToTrackScreen()


function MyTabs() {

  const navigation = useNavigation()


  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: Colors.white,
        padding: 10,
        height: 70,
      },

      tabBarInactiveTintColor: Colors.gray,
      tabBarActiveTintColor: Colors.buttonColor,
      tabBarShowLabel: true,
      // tabBarLabel: () => null, // Hide tab bar labels
    }}
    // tabBar={() => CustomTabBar(navigation, chatScreen, setChatScreen, homeScreen, setHomeScreen, petScreen, setPetScreen)}
    >
      <Tab.Screen

        options={{
          tabBarIcon: ({ color, size }) => {
            return (
              <AntDesign
                color={color}
                size={size}
                name="home"
                // source={require('../../Images/Home.png')}
                style={{ width: 30, height: 30 }}
              />
            );
          },

          tabBarIconStyle: { marginTop: 10, padding: 0 },
          tabBarItemStyle: { marginBottom: 5 },
          tabBarLabelStyle: { fontSize: 12, marginTop: 10, fontFamily: "Poppins-Regular" },
          tabBarShowLabel: true,
        }}



        name="Home" component={Home} />

      <Tab.Screen

        options={{
          tabBarIcon: ({ color, size }) => {
            return (
              <View style={{ width: 75, height: 75, borderRadius: 100, backgroundColor: Colors.white, justifyContent: "center", alignItems: "center" }} >

                <View style={{ width: 50, height: 50, borderRadius: 100, backgroundColor: Colors.buttonColor, justifyContent: "center", alignItems: "center" }} >

                  <Image source={require("../../Images/iconpet.png")} style={{ width: 20, height: 20 }} />

                </View>

              </View>

            );
          },
          tabBarIconStyle: { marginTop: 0, padding: 0 },
          tabBarItemStyle: {
            marginBottom: 0,
            padding: 0,
            position: 'relative',
            bottom: 20,
          },
          tabBarLabel: "",
          tabBarShowLabel: false,
        }}

        name="PetDetails" component={PetDetails} />
      {
        <Tab.Screen

          options={{
            tabBarIcon: ({ color, size }) => {
              return (
                <FontAwesome style={{ width: 30, height: 30 }} name="route" size={size} color={color} />
              );
            },

            tabPress: ({ navigation, defaultHandler }) => {
              if (0) {
                handleTrackTabPress(); // Run your function when the "Track" screen tab is pressed
                defaultHandler(); // Ensure default navigation behavior if condition is fulfilled
              } else {

                console.log("hello world")

                // Handle the case when the condition is not fulfilled
                // For example, show a toast message or alert
              }
            },

            tabBarIconStyle: { marginTop: 10, padding: 0 },
            tabBarItemStyle: { marginBottom: 5 },
            tabBarLabelStyle: { fontSize: 12, marginTop: 10, fontFamily: "Poppins-Regular" },
            tabBarShowLabel: true,
            tabBarLabel: "Track"
          }}


          name="PassengerRideDetail" component={PassengerRideDetail} />}
    </Tab.Navigator>
  );
}


export default function Navigation() {


  const [isAppFirstLaunched, setIsAppFirstLaunched] = useState(null);

  useEffect(() => {
    async function setData() {
      const appData = await AsyncStorage.getItem('isAppFirstLaunched');
      if (appData == null) {
        setIsAppFirstLaunched(true);
        AsyncStorage.setItem('isAppFirstLaunched', 'false');
      } else {
        setIsAppFirstLaunched(false);
      }
    }
    setData();
  }, []);


  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="OnBoardingScreen" component={isAppFirstLaunched ? OnBoardingScreen : Login} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="Location" component={Location} />
        <Stack.Screen name="Tab" component={MyTabs} />
        <Stack.Screen name="MedicalTrip" component={MedicalTrip} />
        <Stack.Screen name="PetSelect" component={PetSelect} />
        <Stack.Screen name="PaymentMethod" component={PaymentMethod} />
        <Stack.Screen name="Drivers" component={Drivers} />
        <Stack.Screen name="SittersGallery" options={{
          freezeOnBlur: true
        }} component={SittersGallery} />
        <Stack.Screen name="SinglePetDetails" component={SinglePetDetail} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="ScheduleRide" component={ScheduleRide} />
        <Stack.Screen name="ScheduleRideDetails" component={ScheduleRideDetails} />
        <Stack.Screen name="RideCancel" component={RideCancel} />
        <Stack.Screen options={{
          unmountOnBlur: true,
          freezeOnBlur: true
        }} name="PassengerRideDetail" component={PassengerRideDetail} />
        <Stack.Screen name="Track" component={Track} />
        <Stack.Screen name="PetGrooming" component={PetGrooming} />
        <Stack.Screen name="PetWalk" component={PetWalk} />
        <Stack.Screen name="PetSitter" component={Petsitter} />
        <Stack.Screen name="FriendsAndFamily" component={FriendsAndFamily} />
        <Stack.Screen name="PetHotel" component={PetHotel} />
        <Stack.Screen name="ScheduleRideDate" component={ScheduleRideDate} />
        <Stack.Screen name="GooglePlace" component={GooglePlace} />
        <Stack.Screen name="UserDetails" component={UserDetails} />
        <Stack.Screen name="Pets" component={Pets} />
        <Stack.Screen name="wallet" component={Wallet} />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen name="History" component={History} />
        <Stack.Screen name="Deposits" component={PassengerDeposits} />
        <Stack.Screen name="Spents" component={PassengerSpents} />
        <Stack.Screen name="AccountSetting" component={AccountSetting} />
        <Stack.Screen name="UpdatePassword" component={UpdatePassword} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
        <Stack.Screen name="ChatSingle" component={ChatSingle} />
        <Stack.Screen name="TermsAndCondition" component={TermsAndConditions} />
        <Stack.Screen name="ScheduleCancelRide" component={ScheduleCancelRide} />
        <Stack.Screen name="Support" component={Support} />
        <Stack.Screen name="Claims" component={Claims} />
        <Stack.Screen name="ClaimsDetails" component={ClaimDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
