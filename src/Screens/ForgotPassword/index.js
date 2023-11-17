import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, ToastAndroid } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import Colors from '../../Constant/Color';
import auth from '@react-native-firebase/auth';
import CustomButton from '../../Components/CustomButton';
import { useSafeAreaFrame } from 'react-native-safe-area-context';

function ForgotPassword({ navigation }) {


  const [email, setEmail] = useState("")

  const forgotHandler = async () => {
    try {
      // await firebase().auth().sendPasswordResetEmail(email);
      auth().sendPasswordResetEmail(email);
      setEmail('');
      ToastAndroid.show(
        "Password reset link has been sent to your email",
        ToastAndroid.SHORT,
      );
      navigation.navigate('Login');
    } catch (err) {
      ToastAndroid.show(err.message, ToastAndroid.SHORT);
    }
  };
  const ForgotPassValidationHandler = () => {


    if (!email) {
      ToastAndroid.show("Kindly enter email", ToastAndroid.SHORT)
      return
    }

    const strongRegex = new RegExp(
      '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$',
    );

    if (!strongRegex.test(email)) {

      ToastAndroid.show(
        "Invalid Email Address",
        ToastAndroid.SHORT
      );
      return false;
    }

    forgotHandler();

  };


  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <Icons
        onPress={() => navigation.goBack()}
        name="arrow-back-outline"
        size={25}
        color={Colors.black}
        style={{ marginLeft: 10, marginTop: 10 }}
      />

      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={require('../../Images/Wave.png')}
          style={{ width: 100, height: 100 }}
        />

        <Text
          style={{
            marginTop: 30,
            fontSize: 32,
            color: Colors.black,
            fontFamily: 'Poppins-Bold',
            fontWeight: 'bold',
          }}>
          Forgot Password
        </Text>

        <TextInput
          style={{
            backgroundColor: Colors.input,
            borderRadius: 5,
            width: '90%',
            borderWidth: 1,
            borderColor: Colors.gray,
            marginTop: 30,
            padding: 15,
            color: Colors.black,
            fontSize: 16,
            paddingHorizontal: 20,
          }}
          onChangeText={(e) => setEmail(e)}
          placeholder="Enter Your Email"
          placeholderTextColor={Colors.gray}
        />

        <CustomButton
          text="Continue"
          styleContainer={{
            alignSelf: 'center',
            marginTop: 30,
            width: '90%',
          }}
          onPress={ForgotPassValidationHandler}
          btnTextStyle={{ fontSize: 18 }}
        />
      </View>
    </View>
  );
}

export default ForgotPassword;
