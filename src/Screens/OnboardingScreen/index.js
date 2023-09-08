import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  StatusBar,
  FlatList,
  View,
  ImageBackground,
  Image,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import Colors from '../../Constant/Color';
import Icons from 'react-native-vector-icons/AntDesign';

const slides = [
  {
    id: '1',
    image: require('../../Images/onboard1.png'),
    title: 'Let us give the best treatment',
    subtitle:
      'Just turn on your location and you will find the nearest pet care you wish.',
  },
  {
    id: '2',
    image: require('../../Images/onboard2.png'),
    title: 'Find Pet Care Around Your Location',
    subtitle:
      'Just turn on your location and you will find the nearest pet care you wish.',
  },
  {
    id: '3',
    image: require('../../Images/onboard3.png'),
    title: 'Book Appointment With us!',
    subtitle: 'What do you think? book our veterinanians now ',
  },
];

export default function OnBoardingScreen({navigation}) {
  const {width, height} = Dimensions.get('window');

  const ref = useRef(null);
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);

  const updateCurrentSlideIndex = e => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    console.log(contentOffsetX,"currnetoffsetx");
    const currentIndex = Math.floor(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  };

  const goToNext = () => {
    const nextSlideIndex = currentSlideIndex + 1;
    const offset = nextSlideIndex * width;
    ref?.current?.scrollToOffset({offset});
    setCurrentSlideIndex(nextSlideIndex);
  };

  const Slide = ({item}) => {
    // console.log(item)
    return (
      <View style={styles.centerItems}>
        <Image
          source={item.image}
          style={{height: Dimensions.get('window').height,width:width}}
          resizeMode="cover"
        />
        <View
          style={[
            styles.textContainer,
            {position: 'absolute', bottom: 130, left: 0, width: '85%'},
          ]}>
          <Text
            style={[
              styles.title,
              {
                color: Colors.white,
                width: '90%',
                fontFamily: 'Poppins-Bold',
                fontWeight: 'bold',
                textTransform: 'capitalize',
              },
            ]}>
            {item.title}
          </Text>
          <Text
            style={[
              styles.subtitle,
              {
                color: Colors.white,
                fontSize: 12,
                width: '90%',
                fontFamily: 'Poppins-Regular',
              },
            ]}>
            {item.subtitle}
          </Text>
        </View>
      </View>
    );
  };

  const Footer = () => {
    return (
      <View style={[styles.footerContainer, {justifyContent: 'center'}]}>
        {currentSlideIndex == slides.length - 1 ? (
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 40,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              {/* Render indicator */}
              {slides.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    {
                      backgroundColor:
                        currentSlideIndex == index
                          ? Colors.green
                          : Colors.white,
                      width: 8,
                      height: 8,
                      borderRadius: 10,
                    },
                  ]}
                />
              ))}
            </View>

            <View>
              <TouchableOpacity onPress={()=>navigation.replace("Login")}>
                <View
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 100,
                    backgroundColor: Colors.green,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icons name="arrowright" color="white" size={20} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 40,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              {/* Render indicator */}
              {slides.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    {
                      backgroundColor:
                        currentSlideIndex == index
                          ? Colors.green
                          : Colors.white,
                      width: 8,
                      height: 8,
                      borderRadius: 10,
                    },
                  ]}
                />
              ))}
            </View>

            <View>
              <TouchableOpacity onPress={goToNext}>
                <View
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 100,
                    backgroundColor: Colors.green,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icons name="arrowright" color="white" size={20} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.rootContainer}>
      <View style={styles.innerTopContainer}>
        <FlatList
          ref={ref}
          onMomentumScrollEnd={updateCurrentSlideIndex}
          data={slides}
          contentContainerStyle={{height: height}}
          showsHorizontalScrollIndicator={false}
          horizontal
          pagingEnabled
          renderItem={({item}) => <Slide item={item} />}
        />
      </View>
      <View style={styles.innerBottomContainer}>
        <Footer />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  centerItems: {
    flex: 1,
  },
  dots: {
    width: 15,
    height: 8,
    borderRadius: 10,
    backgroundColor: 'grey',
  },
  footerContainer: {
    flex: 1,
    backgroundColor: 'black',
    width: '100%',
    // alignItems: 'center',
    // justifyContent: 'center'
  },
  indicator: {
    height: 2.5,
    width: 10,
    backgroundColor: Colors.gray,
    marginHorizontal: 3,
    borderRadius: 2,
  },
  innerTopContainer: {
    // flex: 3
    height: '85%',
    alignItems: 'center',
  },
  innerBottomContainer: {
    height: '15%',
    width: '100%',
    alignItems: 'center',
  },
  nextStyles: {
    fontSize: 20,
    color: Colors.black,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  rootContainer: {
    flex: 1,
    alignItems: 'center',
  },
  subtitle: {
    color: Colors.black,
    fontSize: 10,
    lineHeight: 20,
  },
  title: {
    color: Colors.black,
    fontSize: 20,
  },
  textContainer: {
    alignItems: 'center',
  },
  UpperContainer: {
    flex: 1,
    alignSelf: 'center',
  },
});
