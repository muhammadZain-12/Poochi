import React, {useCallback, useState} from 'react';
import {
  Image,
  Modal,
  PermissionsAndroid,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Colors from '../../Constant/Color';
import CustomButton from '../../Components/CustomButton';
import Geolocation from 'react-native-geolocation-service';
import { useIsFocused } from '@react-navigation/native';

function Location({navigation}) {
  const [modalVisible, setModalVisible] = useState(true);

  const focus = useIsFocused()

  const locationPermission = () =>
    new Promise(async (resolve, reject) => {
      if (Platform.OS === 'ios') {
        try {
          const permissionStatus = await Geolocation.requestAuthorization(
            'whenInUse',
          );
          if (permissionStatus === 'granted') {
            return resolve('granted');
          }
          reject('Permission not granted');
        } catch (error) {
          return reject(error);
        }
      }
      return PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      )
        .then(granted => {
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            resolve('granted');
          }
          return reject('Location Permission denied');
        })
        .catch(error => {
          console.log('Ask Location permission error: ', error);
          return reject(error);
        });
    });

  const getUserPermissionForLocation = async () => {
    locationPermission().then(res => {
      if (res == 'granted') {
        Geolocation.getCurrentPosition(
          position => {
            console.log(position);
            navigation.navigate('Tab');
          },
          error => {
            // See error code charts below.
            console.log(error.code, error.message);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      } else {
        ToastAndroid.show(
          'Location Permission not satisfied',
          ToastAndroid.SHORT,
        );
      }
    });
  };

  const ShowLocationModal = useCallback(() => {
    return (
      <View style={styles.centeredView}>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Image source={require('../../Images/LocationIcon.png')} />

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
                Enable Your Location
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
                Choose your location to start finding the request around you
              </Text>

              <CustomButton
                text={'Use my location'}
                styleContainer={{width: '100%', marginTop: 10}}
                onPress={() => getUserPermissionForLocation()}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }, [modalVisible]);

  return (
    <View style={{height: '100%', width: '100%'}}>
      <MapView
        initialRegion={{
          latitude: 37.152,
          longitude: 37.202,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        style={StyleSheet.absoluteFill}
      />

      {modalVisible && focus && ShowLocationModal()}
    </View>
  );
}

export default Location;

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
