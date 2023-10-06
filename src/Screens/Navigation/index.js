import React, { useState, useEffect } from 'react';
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


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();




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

        <Image source={homeScreen ? require("../../Images/home.png") : require("../../Images/home1.png")} />

      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleNavigateToPet()} style={{ height: 40, width: 40, borderRadius: 10, backgroundColor: petScreen ? Colors.buttonColor : Colors.gray, justifyContent: "center", alignItems: "center" }} >

        <Icon name="plus" size={20} color={Colors.white} />

      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleNavigateToChat()} >

        <Image source={chatScreen ? require("../../Images/chat1.png") : require("../../Images/chat.png")} style={{ width: 40, height: 40 }} />

      </TouchableOpacity>


    </View>
  );
}


function MyTabs() {

  const navigation = useNavigation()

  const [chatScreen, setChatScreen] = useState(false)
  const [homeScreen, setHomeScreen] = useState(true)
  const [petScreen, setPetScreen] = useState(false)



  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
      tabBarLabel: () => null, // Hide tab bar labels
    }}
      tabBar={() => CustomTabBar(navigation, chatScreen, setChatScreen, homeScreen, setHomeScreen, petScreen, setPetScreen)}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="PetDetails" component={PetDetails} />
      <Tab.Screen name="Chats" component={Chat} />
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
        <Stack.Screen name="SinglePetDetails" component={SinglePetDetail} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="ScheduleRide" component={ScheduleRide} />
        <Stack.Screen name="ScheduleRideDetails" component={ScheduleRideDetails} />
        <Stack.Screen name="RideCancel" component={RideCancel} />
        <Stack.Screen options={{
          unmountOnBlur: true
        }} name="PassengerRideDetail" component={PassengerRideDetail} />
        <Stack.Screen name="Track" component={Track} />
        <Stack.Screen name="PetGrooming" component={PetGrooming} />
        <Stack.Screen name="PetWalk" component={PetWalk} />
        <Stack.Screen name="FriendsAndFamily" component={FriendsAndFamily} />
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
