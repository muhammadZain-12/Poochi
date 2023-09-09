import React, { useState, useEffect } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
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


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();




function CustomTabBar(navigation) {



  return (
    <View style={{ backgroundColor: '#E6E6E6', height: 80, borderTopEndRadius: 40, borderTopStartRadius: 40, justifyContent: "space-around", alignItems: "center", flexDirection: "row" }}>

      <TouchableOpacity onPress={() => navigation.navigate("Home")} >

        <Image source={require("../../Images/home.png")} />

      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("PetDetails")} style={{ height: 40, width: 40, borderRadius: 10, backgroundColor: Colors.buttonColor, justifyContent: "center", alignItems: "center" }} >

        <Icon name="plus" size={20} color={Colors.white} />

      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Chats")} >

        <Image source={require("../../Images/chat.png")} />

      </TouchableOpacity>


    </View>
  );
}


function MyTabs() {

  const navigation = useNavigation()

  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
      tabBarLabel: () => null, // Hide tab bar labels
    }}
      tabBar={() => CustomTabBar(navigation)}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="PetDetails" component={PetDetails} />
      <Tab.Screen name="Chats" component={Chat} />
    </Tab.Navigator>
  );
}


export default function Navigation() {



  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MedicalTrip"
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="OnBoardingScreen" component={OnBoardingScreen} />
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
