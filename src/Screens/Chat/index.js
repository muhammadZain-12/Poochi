import React, { useContext, useEffect } from 'react';
import { View, Image, TouchableOpacity, Text, FlatList, BackHandler, ToastAndroid, } from 'react-native';
import Colors from '../../Constant/Color';
import Icons from 'react-native-vector-icons/Ionicons';
import { useState } from 'react';
import LoginContext from '../../Context/loginContext/context';
import LocationContext from '../../Context/locationContext/context';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useIsFocused } from '@react-navigation/native';
import BookingContext from '../../Context/bookingContext/context';
import IonIcons from "react-native-vector-icons/Ionicons"
import FontAwesome from "react-native-vector-icons/FontAwesome5"
import NotificationContext from '../../Context/NotificationContext/context';

function Chat({ navigation }) {
  const loginCont = useContext(LoginContext);
  const locationCont = useContext(LocationContext);

  const bookingCont = useContext(BookingContext)
  const notificationCont = useContext(NotificationContext)



  const { bookingData, setBookingData } = bookingCont
  const { notification, setNotification, unseenNotification, setUnseenNotifications } = notificationCont


  const focus = useIsFocused()

  const { loginData } = loginCont;
  const { locationData } = locationCont;

  const [drivers, setDrivers] = useState([

    // {
    //   image: require('../../Images/driverProfile.png'),
    //   name: 'James Smith',
    //   about: 'Good Evening',
    //   lastMsgTime: '3m',
    //   pendingMsg: '0',
    //   id: 0,
    // },
    // {
    //   image: require('../../Images/driverProfile.png'),
    //   name: 'James Smith',
    //   about: 'Good Evening',
    //   lastMsgTime: '3m',
    //   pendingMsg: '0',
    //   id: 1,
    // },
    // {
    //   image: require('../../Images/driverProfile.png'),
    //   name: 'James Smith',
    //   about: 'Good Evening',
    //   lastMsgTime: '3m',
    //   pendingMsg: '0',
    //   id: 2,
    // },
    // {
    //   image: require('../../Images/driverProfile.png'),
    //   name: 'James Smith',
    //   about: 'Good Evening',
    //   lastMsgTime: '3m',
    //   pendingMsg: '0',
    //   id: 3,
    // },
    // {
    //   image: require('../../Images/driverProfile.png'),
    //   name: 'James Smith',
    //   about: 'Good Evening',
    //   lastMsgTime: '3m',
    //   pendingMsg: '0',
    //   id: 4,
    // },
    // {
    //   image: require('../../Images/driverProfile.png'),
    //   name: 'James Smith',
    //   about: 'Good Evening',
    //   lastMsgTime: '3m',
    //   pendingMsg: '0',
    //   id: 5,
    // },
  ]);

  const [allDrivers, setAllDrivers] = useState([])

  const getAllChatData = () => {

    let id = auth().currentUser.uid

    let driver = []

    firestore()
      .collection('Drivers').get().then((querySnapshot) => {

        let data = querySnapshot.forEach((doc) => {

          let data = doc?.data()

          let mergeId = id + data?.id

          data.mergeId = mergeId

          driver.push(data)

        })

        Promise.all(driver).then(data => {

          setAllDrivers(data)

        })
      })

  }



  function removeDuplicatesById(inputArray) {
    const uniqueObjectMap = {};
    const uniqueArray = [];

    inputArray.forEach((obj) => {
      if (!uniqueObjectMap.hasOwnProperty(obj.driverData.id)) {
        uniqueObjectMap[obj.id] = true;
        uniqueArray.push(obj);
      }
    });


    return uniqueArray;
  }



  const getAllChats = () => {


    let driverPromises = allDrivers.map((driver) => {
      return new Promise((resolve, reject) => {
        const unsubscribe = firestore()
          .collection('ChatRoom')
          .doc(driver?.mergeId)
          .collection('messages')
          .onSnapshot((querySnapshot) => {
            const chatData = [];

            querySnapshot.forEach((doc) => {
              const data = doc?.data();
              data.driverData = driver
              chatData.push(data);
            });

            resolve(chatData); // Resolve the promise after accumulating chat messages
          });

        // Store the unsubscribe function in case you need to stop listening to this chat

        return () => {
          unsubscribe()
        }
        // driver.unsubscribe = unsubscribe;
      });
    });

    // Wait for all promises to resolve
    Promise.all(driverPromises)
      .then((chats) => {

        // console.log(chats,"chatsss")

        let dataToChats = chats.filter((chat) => chat.length > 0);

        const updatedChats = dataToChats.map((chat) => {
          const pendingMessage = chat.filter((message) => !message.read && message.sentBy === message.driverData?.id);


          // console.log(chat, "chatss")

          // let myLastChats = dataToChats && dataToChats.length > 0 && dataToChats.map((e, i) => {

          // let values = Object.values(e)

          // console.log(values,"values")

          let lastChatMessage;

          if (chat.length > 0) {
            // Sort the chats by createdAt property in descending order
            chat.sort((a, b) => b?.createdAt - a?.createdAt);

            lastChatMessage = chat[0].text;



            console.log('Last chat message:', lastChatMessage);
          } else {
            console.log('No chat messages in the array.');
          }


          // const lastChatMessage = chat[chat.length - 1].text;

          // console.log(lastChatMessage, "lastChatMessage")

          // return {
          //   ...e,
          //   lastMessage: lastChatMessage.text
          // }


          // })

          // console.log(dataToChats.lastMessage, "dataToChatsss")

          // const lastChatMessage = chats[chats.length - 1];

          const latestObject = chat.reduce((prev, current) => {
            return prev.createdAt.toDate() > current.createdAt.toDate() ? prev : current;
          }, chat[0]);


          return {
            ...latestObject,
            pendingMsg: pendingMessage.length,
            lastMessage: lastChatMessage,
            lastMsgTime: latestObject.createdAt.toDate().toLocaleTimeString(),
            userData: {
              id: auth().currentUser?.uid
            }
          };
        });

        const result = removeDuplicatesById(updatedChats);
        setDrivers(result)

      })
      .catch((error) => {
        console.error('Error:', error);
      });



  }

  useEffect(() => {

    getAllChatData()


  }, [focus])


  useEffect(() => {

    if (allDrivers && allDrivers.length > 0) {

      getAllChats()

    }

  }, [allDrivers.length, focus])



  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {

      if (focus) {
        navigation.navigate('Tab', {
          screen: "Home"
        });
      }
      return true; // Return true to prevent the default back action
    });

    return () => {
      backHandler.remove(); // Cleanup the event listener
    }
  }, [focus]);



  const renderDrivers = ({ item }) => {

    return (
      <TouchableOpacity
        onPress={() => navigation.replace("ChatSingle", { data: item, screenName: "Chats", nested: true })}
        style={{
          flexDirection: 'row',
          width: "90%",
          alignSelf: "center",
          justifyContent: 'space-between',
          marginTop: 20,
        }}>
        <View style={{ flexDirection: 'row' }}>
          <Image source={{ uri: item.driverData?.profile }} style={{ width: 50, height: 50, borderRadius: 100 }} />

          <View style={{ marginLeft: 10 }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Poppins-SemiBold',
                color: Colors.black,
                height: 20,
              }}>
              {item.driverData?.fullName}
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Poppins-Medium',
                color: Colors.gray,
              }}>
              {item?.lastMessage}
            </Text>
          </View>
        </View>

        <View>
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Poppins-SemiBold',
              color: Colors.black,
              height: 20,
            }}>
            {item.lastMsgTime}
          </Text>

          {item.pendingMsg ? <View
            style={{
              width: 24,
              height: 24,
              backgroundColor: Colors.buttonColor,
              borderRadius: 100,
              alignSelf: 'flex-end',
              marginTop: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Poppins-Medium',
                color: Colors.white,
              }}>
              {item.pendingMsg}
            </Text>
          </View>
            : ""}
        </View>
      </TouchableOpacity>
    );
  };


  const handleRouteToTrackScreen = () => {


    if (!bookingData) {
      ToastAndroid.show("No Track Ride", ToastAndroid.SHORT)
      return
    }

    firestore().collection("Request").doc(bookingData?.userData?.id).get().then((doc) => {

      let data = doc.data()

      if ((data?.bookingStatus !== "running" && data?.userReponse) || data.bookingStatus == "cancelled") {
        ToastAndroid.show("No Track Ride", ToastAndroid.SHORT)
      }

      else {


        setBookingData(data)
        navigation.navigate("PassengerRideDetail")



      }

    })


    // bookingData && bookingData?.bookingStatus == "running" ? 


  }


  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 20,
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image
            source={{ uri: loginData.profile }}
            style={{ width: 70, height: 70, borderRadius: 100 }}
          />
        </TouchableOpacity>

        <View>
          <Text style={{ color: Colors.black, fontFamily: "Poppins-Bold", fontSize: 18 }} >Hi {loginData.fullName}</Text>
        </View>


        <View style={{ flexDirection: "row" }} >

          <TouchableOpacity onPress={() => navigation.navigate("Notification")} style={{ padding: 5 }} >

            {unseenNotification && unseenNotification.length > 0 && <View style={{ width: 20, height: 20, backgroundColor: "red", borderRadius: 50, position: "absolute", left: 20, justifyContent: "center", alignItems: "center", top: -5 }} >

              <Text style={{ color: Colors.white, fontFamily: "Poppins-Medium", fontSize: 14 }}>{unseenNotification?.length}</Text>


            </View>}

            <IonIcons name="notifications" size={30} color={Colors.buttonColor} />


          </TouchableOpacity>


          <TouchableOpacity style={{ padding: 5 }} onPress={() => handleRouteToTrackScreen()} >
            <FontAwesome name="route" size={25} color={Colors.buttonColor} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ paddingHorizontal: 10, flex: 1, justifyContent: "center", alignItems: "center" }}>
        {/* <Text
          style={{
            fontFamily: 'Poppins-Bold',
            color: Colors.black,
            fontSize: 32,
          }}>
          Coming Soon
        </Text> */}

        <View style={{ marginTop: 0, marginBottom: 20 }}>
          {drivers && drivers.length > 0 ? <FlatList data={drivers} renderItem={renderDrivers} /> :
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
              <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 28, color: Colors.black }} >No Chats</Text>
            </View>
          }
        </View>
      </View>
    </View>
  );
}

export default Chat
