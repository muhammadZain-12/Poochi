import React, { useState } from 'react';
import {
  ImageBackground,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  //   TextInput,
  ScrollView,
  ToastAndroid,
  ActivityIndicator,
  Image,
  StatusBar,
  KeyboardAvoidingView,
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

export default function Signup() {
  const navigation = useNavigation();

  const [email, setEmail] = useState();
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [secureEntry, setSecureEntry] = useState(true);
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  const togglePassword = () => {
    setSecureEntry(!secureEntry);
  };

  const signInValidation = () => {
    const strongRegex = new RegExp(
      '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$',
    );
    if (!email) {
      setEmailError(true);
      ToastAndroid.show('Please Enter Valid Email', ToastAndroid.SHORT);
      return false;
    } else if (password == '' || password.length < 8) {
      setPasswordError(true);
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
    // else {
    // setEmail('');
    // setPassword('');
    // navigation.navigate('PassengerDetailScreen')
    signInHandler();
    // }
  };

  const handleTextChange = inputText => {
    const formattedText = inputText.replace(/\s/g, '');
    setEmail(formattedText);
  };

  return (
    <KeyboardAvoidingView
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
            }}>
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

          <View style={{ paddingHorizontal: 20, flexDirection: 'row' }}>
            <View
              style={{
                width: 25,
                height: 25,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
                borderWidth: 1,
                borderColor: Colors.green,
              }}>
              <Icons name="check" color={Colors.black} size={20} />
            </View>

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
          </View>

          <CustomButton
            text="Create Account"
            styleContainer={{
              alignSelf: 'center',
              marginTop: 30,
              width: '90%',
            }}
            onPress={() => navigation.navigate("Login")}
            btnTextStyle={{ fontSize: 18 }}
          />
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text
              style={{
                marginHorizontal: 20,
                marginVertical: 15,
                fontSize: 16,
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
                Login
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
