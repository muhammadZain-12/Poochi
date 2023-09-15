import React from 'react';
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

export default function SplashScreen({ navigation }) {
  setTimeout(() => {
    const CheckUser = auth().currentUser;

    if (CheckUser) {
      navigation.replace('Tab');
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
