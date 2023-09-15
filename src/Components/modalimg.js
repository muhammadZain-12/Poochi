import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Modal,
    ToastAndroid,
    Alert,
    PermissionsAndroid,
} from 'react-native';

import Colors from '../Constant/Color';

export default function ModalImg({
    modalVisible,
    openGallery,
    openCamera,
    removeImage,
    closeModal,
}) {






    //   const [modalVisible, setModalVisible] = useState(false);
    //   const showModal = () => setModalVisible(true);
    //   const hideModal = () => setModalVisible(false);
    return (
        <Modal transparent={true} visible={modalVisible} animationType="slide">
            <View style={styles.backContainer}>
                <View style={styles.frontContainer}>
                    <TouchableOpacity style={styles.innerContainer} onPress={openCamera}>
                        <Text style={styles.textStyle}>{"Take Photo"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.midContainer} onPress={openGallery} >
                        <Text style={styles.textStyle}>{"Upload Photo"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.innerContainer} onPress={closeModal}>
                        <Text style={styles.textStyle}>{"Close"}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
const styles = StyleSheet.create({
    backContainer: {
        backgroundColor: '#000000aa',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    frontContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerContainer: {
        padding: 10,
        paddingHorizontal: 30,
    },
    midContainer: {
        padding: 10,
        paddingHorizontal: 30,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: Colors.gray
    },
    removeContainer: {
        padding: 10,
        paddingHorizontal: 30,
        borderBottomWidth: 1,
        borderColor: Colors.gray
    },
    textStyle: {
        fontSize: 15,
        color: Colors.black
    }
})