import React from "react"
import { View,Text,TouchableOpacity } from "react-native"
import CustomHeader from "../../Components/CustomHeader"
import CustomButton from "../../Components/CustomButton"
import Colors from "../../Constant/Color"



function SinglePetDetail() {
    return <View style={{ flex: 1, backgroundColor: Colors.white }} >

        <View style={{ marginTop: 5 }} >
            <CustomHeader
                onPress={() => navigation.goBack()}
                iconname={"arrow-back-outline"}
                text="Pet Select"
                color={Colors.black}
            />
        </View>

    </View>
}


export default SinglePetDetail