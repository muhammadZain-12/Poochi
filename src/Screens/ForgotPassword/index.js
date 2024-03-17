import React, { useCallback, useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, ToastAndroid, StyleSheet, Modal } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import Colors from '../../Constant/Color';
import auth from '@react-native-firebase/auth';
import CustomButton from '../../Components/CustomButton';
import { useSafeAreaFrame } from 'react-native-safe-area-context';
import IonIcons from "react-native-vector-icons/Ionicons"


function ForgotPassword({ navigation }) {


  const [email, setEmail] = useState("")
  const [resetPasswordSendModal, setResetPasswordSendModal] = useState(false)





  const ShowLocationModal = useCallback(() => {
    return (
      <View style={styles.centeredView}>
        <Modal animationType="slide" transparent={true} visible={resetPasswordSendModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Image style={{ width: 100, height: 100 }} resizeMode='cover' source={require('../../Images/reset.png')} />

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
                Reset Password Successfully Sent to your Email!
              </Text>


              <CustomButton
                text={'Back to Login'}
                linearStyle={{ borderRadius: 10 }}
                styleContainer={{ width: '85%', marginTop: 10, borderRadius: 0 }}
                onPress={() => navigation?.navigate("Login")}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }, [resetPasswordSendModal]);

  console.log(email, "email")


  const forgotHandler = async () => {
    try {
      // await firebase().auth().sendPasswordResetEmail(email);
      auth().sendPasswordResetEmail(email);
      setEmail('');

      setResetPasswordSendModal(true)

      // ToastAndroid.show(
      //   "Password reset link has been sent to your email",
      //   ToastAndroid.SHORT,
      // );
      // navigation.navigate('Login');
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
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 35, height: 35, borderWidth: 2, margin: 10, justifyContent: "center", alignItems: "center", borderRadius: 10, borderColor: "#D9D9D9" }} >
        <IonIcons

          name="chevron-back-outline"
          size={20}
          color={Colors.black}

        />
      </TouchableOpacity>

      <View
        style={{
          flex: 1,
          // justifyContent: 'center',
          // alignItems: 'center',
        }}>
        <Image
          source={require('../../Images/Wave.png')}
          style={{ width: 100, height: 100, alignSelf: "center" }}
        />

        <Text
          style={{
            marginTop: 30,
            fontSize: 24,
            color: Colors.black,
            fontFamily: 'Poppins-SemiBold',
            textAlign: "center",
            alignSelf: "center"
            // fontWeight: 'bold',
          }}>
          Forgot Your Password?
        </Text>

        <Text
          style={{
            // marginTop: 30,
            fontSize: 14,
            color: Colors.black,
            fontFamily: 'Poppins-Regular',
            textAlign: "center",
            width: "80%",
            alignSelf: "center"
            // fontWeight: 'bold',
          }}>
          Please enter your email to receive reset password link.
        </Text>

        <View style={{
          flexDirection: 'row', alignItems: 'center', width: '100%', backgroundColor: Colors.input, paddingVertical: 5,
          paddingHorizontal: 15, borderRadius: 5,
          borderWidth: 1,
          borderColor: '#b2b2b1',
          width: "90%",
          marginTop: 30,
          alignSelf: "center"
        }}>
          <Image source={require("../../Images/envelope.png")} style={{ width: 20, height: 20, marginRight: 5 }} />

          <TextInput
            style={{
              color: Colors.black,
              fontSize: 16,

            }}
            onChangeText={(e) => setEmail(e)}
            placeholder="Enter Your Email"
            placeholderTextColor={Colors.gray}
          />
        </View>
        <CustomButton
          text="Proceed"
          styleContainer={{
            alignSelf: 'center',
            marginTop: 30,
            width: '90%',
            position: "absolute",
            bottom: 10
          }}
          linearStyle={{ borderRadius: 10 }}
          onPress={ForgotPassValidationHandler}
          btnTextStyle={{ fontSize: 18 }}
        />
      </View>

      {resetPasswordSendModal && <ShowLocationModal />}

    </View>
  );
}

export default ForgotPassword;


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
    width: '80%',
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
