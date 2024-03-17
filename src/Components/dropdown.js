import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ToastAndroid,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../Constant/Color';

const CustomDropDown = (props) => {
    let {
        ddTitle,
        categoryData,
        dataShow,
        searchData,
        searchFunc,
        subject,
        search,
        headingStyle,
        categoryShow,
        dropdownPlace,
        dropdownContainerStyle,
        icon,
        setSelectedSubject,
        selectedSubject,
    } = props;

    const [selectedServicedata, setSelectedServicedata] = useState({});
    const [serviceDD, setServiceDD] = useState(false);
    const SelectedServices = (item) => {
        setSelectedSubject(item);
        setServiceDD(!serviceDD);
    };

    const filterSearchData = (text) => {
        if (text.length > 0) {
            searchFunc(text, search);
        }
    };

    return (
        <View>
            <View
                style={{
                    borderRadius: 5,
                    overflow: 'hidden',
                    marginHorizontal: 0,
                    marginVertical: 5,
                }}>
                {ddTitle && (
                    <Text
                        style={{
                            fontFamily: 'Poppins-Regular',
                            color: Colors.gray,
                            fontSize: 14,
                            // fontWeight: 'bold',
                            marginVertical: 5,
                            marginHorizontal: 5,
                            ...headingStyle,
                        }}>
                        {ddTitle}
                    </Text>
                )}
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setServiceDD(!serviceDD)}
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingVertical: 10,
                        paddingHorizontal: 10,
                        borderWidth: 1,
                        borderTopLeftRadius: 5,
                        borderTopRightRadius: 5,
                        borderBottomWidth: serviceDD ? 0 : 1,
                        borderBottomLeftRadius: serviceDD ? 1 : 5,
                        borderBottomRightRadius: serviceDD ? 1 : 5,
                        borderColor: Colors.gray,
                        alignItems: 'center',
                        ...dropdownContainerStyle,
                    }}>
                    {selectedServicedata &&
                        Object.keys(selectedServicedata).length > 0 ? (
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems:"center",
                                width: '100%',
                            }}>
                            <Text
                                style={{
                                    color: Colors.gray,
                                    fontFamily: 'Poppins-SemiBold',
                                    fontSize: 14,
                                }}>
                                {selectedServicedata.complain_name &&
                                    selectedServicedata.complain_name > 10
                                    ? selectedServicedata.complain_name.slice(0, 10)
                                    : selectedServicedata.complain_name}
                            </Text>
                            {serviceDD ? (
                                <Image
                                    source={require('../Images/up.png')}
                                    style={{ width: 20, height: 20 }}
                                />
                            ) : (
                                <Image
                                    source={require('../Images/down.png')}
                                    style={{ width: 20, height: 20 }}
                                />
                            )}
                        </View>
                    ) : (
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems:"center",
                                // justifyContent: 'space-between',
                                width: '100%',
                            }}>
                            <Image source={require("../Images/state.png")} style={{ width: 15, height: 15, marginRight: 5 }} />
                            <View style={{justifyContent:"space-between",flexDirection:"row",width:icon ? "95%" : "100%"}} >
                            <Text
                                style={{
                                    color: Colors.gray,
                                    fontFamily: 'Poppins-SemiBold',
                                    fontSize: 14,
                                }}>
                                {selectedSubject
                                    ? selectedSubject.subject
                                    : dropdownPlace ?? ddTitle}
                            </Text>
                            {serviceDD ? (
                                <Image
                                    source={require('../Images/up.png')}
                                    style={{ width: 15, height: 20 }}
                                    resizeMode="contain"
                                />
                            ) : (
                                <Image
                                    source={require('../Images/down.png')}
                                    style={{ width: 20, height: 20 }}
                                />
                            )}
                            </View>
                        </View>
                    )}
                </TouchableOpacity>
            </View>
            {categoryData && (
                <View
                    style={{
                        borderBottomEndRadius: 5,
                        borderBottomStartRadius: 5,
                        borderWidth: !serviceDD ? 0 : 1,
                        borderTopWidth: !serviceDD ? 0 : 1,
                        borderColor: Colors.gray,
                        top: -14,
                    }}>
                    <ScrollView style={{ maxHeight: 100 }} nestedScrollEnabled={true}>
                        {serviceDD == true &&
                            Array.from(
                                new Set(
                                    categoryData &&
                                    categoryData.map((item) => item.complain_name),
                                ),
                            ).map((e, i) => {
                                return (
                                    <TouchableOpacity
                                        onPress={() =>
                                            SelectedServices(
                                                categoryData.find(
                                                    (item) => item.complain_name === e,
                                                ),
                                            )
                                        }
                                        key={i}
                                        style={{
                                            flexDirection: 'row',
                                            paddingHorizontal: 10,
                                            marginVertical: 5,
                                            gap: 10,
                                        }}>
                                        <Text
                                            style={{
                                                color: Colors.gray,
                                                fontFamily: 'Poppins-SemiBold',
                                                fontSize: 14,
                                            }}>
                                            {e}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                    </ScrollView>
                </View>
            )}
            {subject && (
                <View
                    style={{
                        borderBottomEndRadius: 5,
                        borderBottomStartRadius: 5,
                        borderWidth: !serviceDD ? 0 : 1,
                        borderTopWidth: !serviceDD ? 0 : 1,
                        borderColor: Colors.gray,
                        top: -10,
                    }}>
                    <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled={true}>
                        {serviceDD == true && (
                            <View>
                                {search && (
                                    <TextInput
                                        onChangeText={e => filterSearchData(e)}
                                        style={{
                                            paddingHorizontal: 10,
                                            marginVertical: 0,
                                            color: 'black',
                                            backgroundColor: 'white',
                                            borderBottomWidth: 1,
                                            gap: 0,
                                            height: 38,
                                        }}
                                        placeholder={'SEARCH'}
                                        placeholderTextColor={'black'}
                                    />
                                )}
                                {searchData && searchData?.length > 0
                                    ? Array.from(
                                        new Set(
                                            searchData &&
                                            searchData?.map((item) => item.subject),
                                        ),
                                    )
                                        .map((e, i) => {
                                            return (
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        SelectedServices(
                                                            subject.find(
                                                                (item) => `${item.subject}` === e,
                                                            ),
                                                        )
                                                    }
                                                    key={i}
                                                    style={{
                                                        flexDirection: 'row',
                                                        paddingHorizontal: 10,
                                                        marginVertical: 5,
                                                        gap: 10,
                                                    }}>
                                                    <Text
                                                        style={{
                                                            color: Colors.gray,
                                                            fontFamily: 'Poppins-SemiBold',
                                                            fontSize: 14,
                                                        }}>
                                                        {e ?? selectedSubject}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })
                                        .filter(Boolean)
                                    : Array.from(
                                        new Set(
                                            subject && subject?.map((item) => item?.subject),
                                        ),
                                    )
                                        .map((e, i) => {

                                            return (
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        SelectedServices(
                                                            subject?.find(
                                                                (item) => `${item.subject}` === e,
                                                            ),
                                                        )
                                                    }
                                                    key={i}
                                                    style={{
                                                        flexDirection: 'row',
                                                        paddingHorizontal: 10,
                                                        marginVertical: 5,
                                                        gap: 10,
                                                    }}>
                                                    <Text
                                                        style={{
                                                            color: Colors.gray,
                                                            fontFamily: 'Poppins-SemiBold',
                                                            fontSize: 14,
                                                        }}>
                                                        {e ?? selectedSubject}
                                                    </Text>
                                                </TouchableOpacity>
                                            );

                                        })
                                        .filter(Boolean)}
                            </View>
                        )}
                    </ScrollView>
                </View>
            )}
        </View>
    );
};

export default CustomDropDown;

const styles = StyleSheet.create({});
