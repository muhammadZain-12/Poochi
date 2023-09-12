import React from 'react'
import { View, StyleSheet, Image, useWindowDimensions, Touchable, TouchableOpacity, Text } from 'react-native'
import Colors from '../Constant/Color';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function CustomHeader({ onPress, iconname, color, source, rightButton, cancelRideFunction, iconStyle, text, image, imageFunc }) {
    const { height } = useWindowDimensions();


    return (
        <View style={styles.header}>


            <Ionicons
                onPress={onPress}
                name={iconname}
                size={25}
                color={color}
                style={[styles.backIcon, { ...iconStyle }]}
            />
            {/* <Image
                style={[styles.Logo, { height: height * 0.06 }]}
                resizeMode="contain"
                source={source}
            /> */}

            <Text style={{ fontSize: 18, fontFamily: "Poppins-SemiBold", color: Colors.black, width: "60%", textAlign: "center" }} >{text}</Text>


            {rightButton && <TouchableOpacity onPress={cancelRideFunction} style={{ position: "absolute", right: 10 }} ><Text style={{ color: "red", fontSize: 16 }} >Cancel Ride</Text></TouchableOpacity>}

            <View style={{ width: "20%" }} >
                {image ? <TouchableOpacity onPress={imageFunc} style={{ alignSelf: "flex-end", marginRight: 20, width: 60 }} >
                    <Image source={image} style={{ alignSelf: "flex-end" }} />
                </TouchableOpacity>
                    :
                    <View>
                    </View>
                }

            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    backIcon: {
        flex: 1,
        marginLeft: 10,
        width: "20%"
    },
    emptyContainer: {
        flex: 1
    },
    header: {
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    Logo: {
        flex: 1,
        width: '15%',
    },
    personImg: {
        width: '10%',
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: Colors.black,
        marginTop: 25,
        borderRadius: 5,
    },
    toggle: {
        width: '5%'
    }
})