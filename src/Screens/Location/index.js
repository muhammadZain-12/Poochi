import React, { useCallback, useState, useContext } from 'react';
import {
  Image,
  Modal,
  PermissionsAndroid,
  ActivityIndicator,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Colors from '../../Constant/Color';
import CustomButton from '../../Components/CustomButton';
import Geolocation from 'react-native-geolocation-service';
import { useIsFocused } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from "@react-native-firebase/auth"
import Geocoder from 'react-native-geocoding';
import { GOOGLE_MAP_KEY } from '../../Constant/GoogleMapKey';
import LocationContext from '../../Context/locationContext/context';


function Location({ navigation }) {

  const locationCont = useContext(LocationContext)

  const { locationData, setLocationData } = locationCont

  const [modalVisible, setModalVisible] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null)
  const [loading, setLoading] = useState(false)

  Geocoder.init(GOOGLE_MAP_KEY);

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
        })
        .catch(error => {
          return reject(error);
        });
    });


  const getAddressFromCoords = async (latitude, longitude) => {
    try {
      const response = await Geocoder.from(latitude, longitude);
      const address = response.results[0].formatted_address;

      return address
    } catch (error) {
      console.error('Error:', error);
    }
  };



  const getUserPermissionForLocation = async () => {

    setLoading(true)

    locationPermission().then(res => {
      if (res == 'granted') {
        Geolocation.getCurrentPosition(async (position) => {

          setCurrentLocation(position.coords)

          let id = auth()?.currentUser?.uid


          let address = await getAddressFromCoords(position.coords.latitude, position.coords.longitude)



          let data = {
            currentAddress: address,
            currentLocation: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          }


          setLocationData({
            ...locationData,
            currentLocation: data.currentLocation,
            currentAddress: data.currentAddress
          })


          firestore().collection("Users").doc(id).update(data).then((res) => {

            let dataToSend = {
              currentAddress: address,
              currentLocation: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              }
            }
            setLoading(false)

            navigation.replace('Tab', {
              screen: {
                name: "Home",
                params: {
                  data: dataToSend
                }
              },
            });

          }).catch((error) => {
            setLoading(false)
            ToastAndroid.show(error.message, ToastAndroid.SHORT)

          })



        },
          error => {
          
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
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
                text={loading ? <ActivityIndicator color="white" size="small" /> : 'Use my location'}
                styleContainer={{ width: '100%', marginTop: 10 }}
                onPress={() => getUserPermissionForLocation()}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }, [modalVisible, loading]);

  return (
    <View style={{ height: '100%', width: '100%' }}>
      <MapView
        initialRegion={{
          latitude: currentLocation ? currentLocation.latitude : 37.152,
          longitude: currentLocation ? currentLocation.longitude : 37.202,
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
