import React, { useState, useRef, useEffect } from 'react';
import { Image, Text, Touchable, TouchableOpacity, FlatList, View, Dimensions, ScrollView } from 'react-native';
import Colors from '../../Constant/Color';
import Icons from "react-native-vector-icons/Feather"

function Home({ navigation }) {


  const { height, width } = Dimensions.get('screen');


  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const HomePageBanner = [
    {
      id: 1,
      image: require('../../Images/banner.png'),
    },
    {
      id: 2,
      image: require('../../Images/banner.png'),
    },
    {
      id: 3,
      image: require('../../Images/banner.png'),
    },
  ];


  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % HomePageBanner.length;
    setCurrentIndex(nextIndex);
    flatListRef.current.scrollToIndex({ animated: true, index: nextIndex });
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      nextImage();
    }, 5000);

    // Cleanup function to clear interval on unmount
    return () => clearInterval(intervalId);
  }, [currentIndex]);


  return <View style={{ flex: 1, backgroundColor: Colors.white }} >

    <ScrollView>

      <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 20, alignItems: "center" }} >

        <Image source={require("../../Images/profile.png")} />

        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }} >

          <Image source={require("../../Images/location.png")} />

          <Text style={{ fontSize: 18, fontWeight: "bold", color: Colors.black, fontSize: 16, marginLeft: 5 }} >Chicago, US</Text>

          <Icons size={20} color="gray" name="chevron-down" />

        </TouchableOpacity>

        <View style={{ flexDirection: "row" }} >

          <TouchableOpacity>

            <Image source={require("../../Images/notification.png")} />


          </TouchableOpacity>


          <TouchableOpacity style={{ marginLeft: 5 }} >
            <Image source={require("../../Images/tracking.png")} />

          </TouchableOpacity>
        </View>




      </View>

      <View style={{ paddingHorizontal: 20 }} >

        <Text style={{ color: Colors.black, fontFamily: "Poppins-Bold", fontSize: 16 }} >Hi Smith</Text>
        <Text style={{ color: Colors.gray, fontFamily: "Poppins-Regular", fontSize: 18 }} >Good Morning!</Text>


        <View
          // colors={[Color.mainColor, Color.white]}
          style={{ zIndex: 2, width: "100%", borderRadius: 10 }}>
          <FlatList
            ref={flatListRef}
            data={HomePageBanner}
            showsHorizontalScrollIndicator={false}
            onScroll={e => {
              const x = e.nativeEvent.contentOffset.x;
              setCurrentIndex((x / (width - 50)).toFixed(0));
            }}
            horizontal
            renderItem={({ item, index }) => {
              return (
                <View
                  style={{
                    width: width,
                    // height: '100%',
                    alignItems: 'flex-start',
                    justifyContent: "center",

                    padding: 0,
                    margin: 0,
                  }}>
                  <Image
                    source={item.image}
                    style={{ width: width - 40, height: 150, borderRadius: 10 }}
                    resizeMode="stretch"
                  />
                </View>
              );
            }}
          />
        </View>


        <View style={{ paddingHorizontal: 20 }} >

          <Text style={{ textAlign: "center", color: Colors.black, fontFamily: "Poppins-SemiBold", fontSize: 24, marginTop: 20 }} >Our Services</Text>


          <View style={{ width: "100%", flexWrap: "wrap", justifyContent: "space-between", flexDirection: "row" }} >

            <TouchableOpacity style={{ width: "49%" }} onPress={() => navigation.navigate("MedicalTrip")} >

              <Image source={require("../../Images/medical.png")} style={{ width: "100%", borderRadius: 10 }} />

              <Text style={{ textAlign: "center", fontFamily: "Poppins-SemiBold", fontSize: 16, color: Colors.black, marginTop: 5 }} >Medical Trip</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ width: "49%" }} >
              <Image source={require("../../Images/petWalk.png")} style={{ width: "100%", borderRadius: 10 }} />
              <Text style={{ textAlign: "center", fontFamily: "Poppins-SemiBold", fontSize: 16, color: Colors.black, marginTop: 5 }} >Pet Walk</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ width: "49%" }} >
              <Image source={require("../../Images/friends.png")} style={{ width: "100%", marginTop: 10, borderRadius: 10 }} />

              <Text style={{ textAlign: "center", fontFamily: "Poppins-SemiBold", fontSize: 16, color: Colors.black, marginTop: 5 }} >Friends & Family</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ width: "49%" }} >
              <Image source={require("../../Images/grooming.png")} style={{ width: "100%", marginTop: 10, borderRadius: 10 }} />

              <Text style={{ textAlign: "center", fontFamily: "Poppins-SemiBold", fontSize: 16, color: Colors.black, marginTop: 5 }} >Pet Grooming</Text>
            </TouchableOpacity>

          </View>


        </View>

      </View>


    </ScrollView>


  </View>;
}

export default Home;
