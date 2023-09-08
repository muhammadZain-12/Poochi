import React from 'react';
import {View, Text, Image, TouchableOpacity, TextInput} from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import Colors from '../../Constant/Color';
import CustomButton from '../../Components/CustomButton';

function ForgotPassword({navigation}) {
  return (
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      <Icons
        onPress={() => navigation.goBack()}
        name="arrow-back-outline"
        size={25}
        color={Colors.black}
        style={{marginLeft: 10, marginTop: 10}}
      />

      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={require('../../Images/Wave.png')}
          style={{width: 100, height: 100}}
        />

        <Text
          style={{
            marginTop: 30,
            fontSize: 32,
            color: Colors.black,
            fontFamily: 'Poppins-Bold',
            fontWeight: 'bold',
          }}>
          Forget Password
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
          placeholder="Email ID"
          placeholderTextColor={Colors.gray}
        />

        <CustomButton
          text="Continue"
          styleContainer={{
            alignSelf: 'center',
            marginTop: 30,
            width: '90%',
          }}
          btnTextStyle={{fontSize: 18}}
        />
      </View>
    </View>
  );
}

export default ForgotPassword;
