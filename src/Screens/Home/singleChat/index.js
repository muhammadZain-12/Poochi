import React, { useState, useEffect, useContext, useCallback } from 'react'
import { Text, StyleSheet, View, Image, TouchableOpacity, ActivityIndicator, BackHandler } from 'react-native'
import { GiftedChat, Bubble, Send, InputToolbar, Composer, Avatar } from 'react-native-gifted-chat'
import Colors from '../../../Constant/Color'
import CustomHeader from '../../../Components/CustomHeader'
import FontAwesome from "react-native-vector-icons/FontAwesome"
import BookingContext from '../../../Context/bookingContext/context'
import { useIsFocused } from '@react-navigation/native'
// import metroConfig from '../../../../metro.config'
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import LoginContext from '../../../Context/loginContext/context'
import axios from 'axios'
import IonIcons from "react-native-vector-icons/Ionicons"


export default function ChatSingle({ navigation, route }) {


    const focus = useIsFocused()

    let data = route.params?.data
    let screenName = route?.params?.screenName
    let nested = route?.params?.nested




    const bookingCont = useContext(BookingContext)

    const loginCont = useContext(LoginContext)

    const { bookingData, setBookingData } = bookingCont

    const { loginData } = loginCont

    const [mergeId, setMergerId] = useState("")
    const [driverMergeId, setDriverMergeId] = useState("")
    const [messages, setMessages] = useState([])



    useEffect(() => {

        if (data) {

            let userId = data?.userData?.id
            let driverId = data?.driverData?.id

            // console.log(userId)

            let merge = userId + driverId
            let driverMergeId = driverId + userId

            setMergerId(merge)
            setDriverMergeId(driverMergeId)
        }



    }, [])

    const ReadAllMessages = async (props) => {

        if (props?._id) {
            try {
                const messageRef = await firestore().collection('ChatRoom')
                    .doc(data?.userData?.id + data?.driverData?.id)
                    .collection('messages')
                    .doc(props?._id)

                messageRef.update({
                    'read': true,
                    received: true,

                })

                const messageReference = await firestore().collection('ChatRoom')
                    .doc(data?.driverData?.id + data?.userData?.id)
                    .collection('messages')
                    .doc(props?._id)
                // return
                messageReference.update({
                    'read': true,
                    received: true,

                })

            }
            catch (e) {
                console.log(e);
            }
        }
    }


    const getMessages = () => {
        const messageRef = firestore()
            .collection('ChatRoom')
            .doc(data?.userData?.id + data?.driverData?.id)
            .collection('messages')
            .orderBy('createdAt', 'desc');

        const unsubscribe = messageRef.onSnapshot((querySnap) => {



            const allMessages = querySnap?.docs?.map((item) => {


                let now = new Date()
                let nowGetTime = now.getTime()
                let chatDate = item?._data?.createdAt?.toDate()
                let chatGetTime = chatDate?.getTime()

                let diff = nowGetTime - chatGetTime

                let diffHours = diff / 1000 / 60 / 60



                if ((item?._data?.sentBy == data?.driverData?.id) && !item?._data?.read && Number(diffHours) < 36) {

                    ReadAllMessages(item?._data);
                    return {
                        ...item?._data,
                        read: true,
                        received: true,
                        createdAt: Date.parse(new Date()),
                    }
                }

                else if (Number(diffHours) < 36) {
                    return {
                        ...item?._data,
                        createdAt: Date.parse(new Date()),

                    }

                }

            }).filter(Boolean);


            setMessages(allMessages && allMessages.length > 0 ? allMessages : [])

        })
        return () => {
            unsubscribe();
            setMessages([]);
        };
    };
    useEffect(() => {

        getMessages();

    }, [data]);

    const onSend = useCallback((messages = []) => {

        let message = messages[0]

        message = { ...message, sent: true }

        messages[0] = message



        setMessages(previousMessages =>
            GiftedChat.append(previousMessages, messages),
        )


        let mymsg = null;
        const msg = messages[0]
        mymsg = {
            ...msg,
            sentBy: loginData.id,
            sentTo: data?.driverData?.id,
            createdAt: new Date(),
            sent: true,
            read: false,
            received: false,
            image: null,
            audio: null,
            video: null,
            category: 'text',
        }


        firestore().collection('ChatRoom')
            .doc(data?.userData?.id + data?.driverData?.id)
            .collection('messages')
            .doc(mymsg?._id)
            .set({
                ...mymsg,
                createdAt: firestore.FieldValue.serverTimestamp(),
            })
            .then(() => {
                console.log('message send');
            })


        firestore().collection('ChatRoom')
            .doc(data?.driverData?.id + data?.userData?.id)
            .collection('messages')
            .doc(mymsg?._id)
            .set({
                ...mymsg,
                createdAt: firestore.FieldValue.serverTimestamp(),
                user: {
                    _id: 2,
                    avatar: loginData?.profile
                }

            })
            .then(() => {

                if (data?.driverData?.token) {

                    var noti = JSON.stringify({
                        notification: {
                            body: `${mymsg?.text}`,
                            title: `${loginData?.fullName} `,
                            sound : "default"
                        },
                        to: data?.driverData?.token,
                    });
                    let config = {
                        method: 'post',
                        url: 'https://fcm.googleapis.com/fcm/send',
                        headers: {
                            Authorization:
                                'key=AAAAzwxYyNA:APA91bEU1Zss73BLEraf4jDgob9rsAfxshC0GBBxbgPo340U5DTWDVbS9MYudIPDjIvZwNH7kNkucQ0EHNQtnBcjf5gbhbn09qU0TpKagm2XvOxmAvyBSYoczFtxW7PpHgffPpdaS9fM',
                            'Content-Type': 'application/json',
                        },
                        data: noti,
                    };

                    axios(config)
                        .then(res => {
                            console.log('message send');
                        })
                        .catch(error => {
                            // setRequestInProcess(false)
                            console.log(error, "error")
                        });

                }
            })





    }, [])



    const renderBubble = (props) => {

        return (

            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: "rgba(25,162,13,0.2)",
                        borderTopRightRadius: 0
                    },
                    left: {
                        backgroundColor: "#e6e6e6",
                        borderBottomLeftRadius: 0,
                        marginLeft: 0,

                    },

                }}
                textStyle={{
                    right: {
                        color: "#5a5a5a"
                    },
                }}


            />
        )

    }

    const renderSend = (props) => {

        return (
            <Send {...props}
                containerStyle={{
                    justifyContent: "center"
                }}
            >
                <View style={{ alignItems: "center", justifyContent: "center", marginRight: 10 }} >
                    <IonIcons name="send-outline" size={30} color={Colors.buttonColor} />
                </View>
            </Send>
        )

    }

    const renderScrollToBottom = (props) => {

        return (
            <FontAwesome name="angle-double-down" size={20} color={Colors.black} />
        )

    }


    const renderInputToolbar = (props) => {

        return (
            <InputToolbar
                {...props}

                containerStyle={{
                    borderTopWidth: 0,


                }}



                textInputStyle={{
                    borderWidth: 1,
                    borderRadius: 10,
                    marginHorizontal: 5,
                    paddingVertical: 15,
                    paddingHorizontal: 15,
                    color: Colors.black,
                    marginLeft: 30

                }}


            >

            </InputToolbar>

        )

    }

    const renderLoading = () => {

        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
                <ActivityIndicator color={Colors.black} size="large" />
            </View>
        )

    }


    // const renderAvatar = (props) => {

    //     return (
    //         <Avatar
    //         {...props}


    //         >

    //         <View style={{width:40}} >

    //             <Image source={require("../../../Images/send.png")} style={{width:20,height:20,borderWidth:1,borderRadius:100}} />
    //         </View>

    //             </Avatar>
    //     )

    // }

    // console.log(data, "dataa")



    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {

            if (nested && focus) {
                navigation.replace('Tab', {
                    screen: screenName
                });
            } else if (!nested && focus) {
                navigation.replace(screenName)
            } else {
                navigation.goBack()
            }
            return true; // Return true to prevent the default back action
        });

        return () => {
            backHandler.remove(); // Cleanup the event listener
        }
    }, [focus]);

    const handleGoBack = () => {

        if (nested) {
            navigation.replace('Tab', {
                screen: screenName
            });
        } else {
            navigation.replace(screenName)
        }
    }

    return (
        <View style={{ backgroundColor: Colors.white, flex: 1 }} >
            <View style={{ marginTop: 5 }} >
                <CustomHeader
                    onPress={() => handleGoBack()}
                    iconname={"arrow-back-outline"}
                    text={"Chat"}
                    color={Colors.black}
                />
            </View>

            {/* <View style={{ marginBottom: 20, flex: 1, flexDirection: "row" }} > */}
            {/* <TouchableOpacity style={{ width: "10%", borderRadius: 100, height: 25, width: 25, position: "absolute", bottom: 10, zIndex: 100, justifyContent: "center", alignItems: "center", left: 10 }} >

                    <Image source={require("../../../Images/pluss.png")} style={{ width: 20, height: 20 }} />

                </TouchableOpacity> */}

            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: 1,
                }}
                renderSend={renderSend}
                scrollToBottom

                renderBubble={renderBubble}
                alwaysShowSend
                // isLoadingEarlier={true}
                // renderLoading={renderLoading}
                renderInputToolbar={renderInputToolbar}
                scrollToBottomComponent={renderScrollToBottom}
                textInputStyle={{ color: "#808080", fontFamily: "Poppins-Medium", fontSize: 16 }}
            />

            {/* </View> */}


        </View>
    )

}

const styles = StyleSheet.create({})

