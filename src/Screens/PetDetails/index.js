import React, { useEffect } from "react"
import { View, Text, Dimensions, Image, TextInput, ScrollView, TouchableOpacity, ToastAndroid, PermissionsAndroid, ActivityIndicator, BackHandler } from 'react-native';
import CustomHeader from '../../Components/CustomHeader';
import Colors from '../../Constant/Color';
import DropDownPicker from 'react-native-dropdown-picker';
import { useState } from 'react';
import { getEnforcing } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import Icons from 'react-native-vector-icons/Feather';
import CustomButton from '../../Components/CustomButton';
import ModalImg from '../../Components/modalimg';
import { launchCamera, launchImageLibrary } from "react-native-image-picker"
import storage, { FirebaseStorageTypes } from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { toDecimal } from "geolib";

function PetDetails({ navigation, route }) {

  let petData = route?.params

  let { width, height } = Dimensions.get("window")
  const [healthIssue, setHealthIssue] = useState(false)
  const [visible1, setVisible1] = useState(false)
  const [visible2, setVisible2] = useState(false)
  const [visible3, setVisible3] = useState(false)
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Dog', value: 'dog' },
    { label: 'Cat', value: 'cat' },
  ]);
  const [openGender, setOpenGender] = useState(false)
  const [gender, setGender] = useState(null)
  const [genderOptions, setGenderOptions] = useState([
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ]);

  const [image1, setImage1] = useState("")
  const [image1url, setImage1url] = useState("")
  const [image2, setImage2] = useState("")
  const [image2url, setImage2Url] = useState("")
  const [image3, setImage3] = useState("")
  const [image3Url, setImage3Url] = useState("")


  let initialNature = [

    {
      label: "Fearful",
      selected: false
    },
    {
      label: "Angry",
      selected: false
    },
    {
      label: "Playful",
      selected: false
    },
    {
      label: "Anxious",
      selected: false
    },

  ]

  const [natureOfPet, setNatureOfPets] = useState(initialNature)

  let otherInitialData = {
    breed: "",
    petName: "",
    weight: "",
    height: "",
    additionalDetails: "",
  }

  const [otherData, setOtherData] = useState(otherInitialData)
  const [loading, setLoading] = useState(false)



  console.log(otherData, "otherData")

  React.useEffect(() => {

    if (petData && Object.keys(petData).length > 0 && !petData?.screen) {

      setOtherData({

        additionalDetails: petData.additionalDetails,
        height: petData.height,
        weight: petData.weight,
        petName: petData.petName,
        breed: petData.breed
      })
      setGender(petData.gender)
      setValue(petData.typeOfPet)
      setImage1(petData.image1)
      setImage1url(petData.image1)
      setImage2(petData.image2)
      setImage2Url(petData.image2)
      setImage3(petData.image3)
      setImage3Url(petData.image3)
      setHealthIssue(petData.healthIssue)
      setNatureOfPets(natureOfPet.map((e, i) => {
        if (e.label == petData.natureOfPet) {
          return {
            ...e,
            selected: true
          }
        } else {
          return {
            ...e,
            selected: false
          }
        }
      }))
    }

  }, [petData])


  const uploadImageToFirebase = async (imageUri, imageName) => {
    const reference = storage().ref(`images/${imageName}`);
    await reference.putFile(imageUri);
  };


  const getDownloadURLFromFirebase = async (imageName) => {
    const reference = storage().ref(`images/${imageName}`);
    try {
      const url = await reference.getDownloadURL();
      return url;
    } catch (error) {
      console.error('Error getting download URL:', error);
      throw error;
    }
  };


  const openGallery = async () => {
    hideModal1();
    let options = {
      saveToPhotos: true,
      mediaType: 'photo',
    };
    const result = await launchImageLibrary(options);
    if (result.didCancel) {
      hideModal1();
      ToastAndroid.show("Image Permission Denied", ToastAndroid.SHORT)
    } else if (result.errorCode == 'permission') {
      hideModal1();
      ToastAndroid.show("Image Permission Not Satisfied", ToastAndroid.SHORT)
    } else if (result.errorCode == 'others') {
      hideModal1();
      ToastAndroid.show(result.errorMessage, ToastAndroid.SHORT);
    } else {
      hideModal1();
      let uri = result.assets[0].uri
      let filename = result.assets[0].fileName
      setImage1url(uri)
      await uploadImageToFirebase(uri, filename);

      // Get the download URL of the uploaded image
      const downloadURL = await getDownloadURLFromFirebase(filename);

      setImage1(downloadURL)

    }
  };

  const openCamera = async () => {
    const permissions = [
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  ];


  const granted = await PermissionsAndroid.requestMultiple(permissions);


  if (
      granted[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED &&
      granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED
  ) {
      hideModal1();
      let options = {
        saveToPhotos: true,
        mediaType: 'photo',
      };
      const result = await launchCamera(options);
      if (result.didCancel) {
        hideModal1();
        ToastAndroid.show("Image Permission Denied", ToastAndroid.SHORT)
      } else if (result.errorCode == 'permission') {
        hideModal1();
        ToastAndroid.show("Image Permission Not Satisfied", ToastAndroid.SHORT)
      } else if (result.errorCode == 'others') {
        hideModal1();
        ToastAndroid.show(result.errorMessage, ToastAndroid.SHORT);
      } else {
        hideModal1();

        let uri = result.assets[0].uri
        let filename = result.assets[0].fileName
        setImage1url(uri)
        await uploadImageToFirebase(uri, filename);
        const downloadURL = await getDownloadURLFromFirebase(filename);
        setImage1(downloadURL)



      }
    } else {
      ToastAndroid.show("Permission not granted", ToastAndroid.SHORT)
    }
  };



  const openCamera2 = async () => {
    const permissions = [
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  ];


  const granted = await PermissionsAndroid.requestMultiple(permissions);


  if (
      granted[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED &&
      granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED
  ) {
      hideModal2();
      let options = {
        saveToPhotos: true,
        mediaType: 'photo',
      };
      const result = await launchCamera(options);
      if (result.didCancel) {
        hideModal2();
        ToastAndroid.show("Image Permission Denied", ToastAndroid.SHORT)
      } else if (result.errorCode == 'permission') {
        hideModal2();
        ToastAndroid.show("Image Permission Not Satisfied", ToastAndroid.SHORT)
      } else if (result.errorCode == 'others') {
        hideModal2();
        ToastAndroid.show(result.errorMessage, ToastAndroid.SHORT);
      } else {
        hideModal2();

        let uri = result.assets[0].uri
        let filename = result.assets[0].fileName


        setImage2Url(uri)

        // Provide a unique name for the image
        await uploadImageToFirebase(uri, filename);

        // Get the download URL of the uploaded image
        const downloadURL = await getDownloadURLFromFirebase(filename);

        setImage2(downloadURL)



      }
    } else {
      ToastAndroid.show("Permission not granted", ToastAndroid.SHORT)
    }
  };
  const openGallery2 = async () => {
    hideModal2();
    let options = {
      saveToPhotos: true,
      mediaType: 'photo',
    };
    const result = await launchImageLibrary(options);
    if (result.didCancel) {
      hideModal2();
      ToastAndroid.show("Image Permission Denied", ToastAndroid.SHORT)
    } else if (result.errorCode == 'permission') {
      hideModal2();
      ToastAndroid.show("Image Permission Not Satisfied", ToastAndroid.SHORT)
    } else if (result.errorCode == 'others') {
      hideModal2();
      ToastAndroid.show(result.errorMessage, ToastAndroid.SHORT);
    } else {
      hideModal2();
      let uri = result.assets[0].uri
      let filename = result.assets[0].fileName
      setImage2Url(uri)
      await uploadImageToFirebase(uri, filename);
      const downloadURL = await getDownloadURLFromFirebase(filename);
      setImage2(downloadURL)

    }
  };


  const openCamera3 = async () => {
    const permissions = [
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  ];


  const granted = await PermissionsAndroid.requestMultiple(permissions);


  if (
      granted[PermissionsAndroid.PERMISSIONS.CAMERA] === PermissionsAndroid.RESULTS.GRANTED &&
      granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED
  ) {
      hideModal3();
      let options = {
        saveToPhotos: true,
        mediaType: 'photo',
      };
      const result = await launchCamera(options);
      if (result.didCancel) {
        hideModal3();
        ToastAndroid.show("Image Permission Denied", ToastAndroid.SHORT)
      } else if (result.errorCode == 'permission') {
        hideModal3();
        ToastAndroid.show("Image Permission Not Satisfied", ToastAndroid.SHORT)
      } else if (result.errorCode == 'others') {
        hideModal3();
        ToastAndroid.show(result.errorMessage, ToastAndroid.SHORT);
      } else {
        hideModal3();

        let uri = result.assets[0].uri

        let filename = result.assets[0].fileName

        setImage3Url(uri)
        // Provide a unique name for the image
        await uploadImageToFirebase(uri, filename);

        // Get the download URL of the uploaded image
        const downloadURL = await getDownloadURLFromFirebase(filename);

        setImage3(downloadURL)



      }
    } else {
      ToastAndroid.show("Permission not granted", ToastAndroid.SHORT)
    }
  };
  const openGallery3 = async () => {
    hideModal3();
    let options = {
      saveToPhotos: true,
      mediaType: 'photo',
    };
    const result = await launchImageLibrary(options);
    if (result.didCancel) {
      hideModal3();
      ToastAndroid.show("Image Permission Denied", ToastAndroid.SHORT)
    } else if (result.errorCode == 'permission') {
      hideModal3();
      ToastAndroid.show("Image Permission Not Satisfied", ToastAndroid.SHORT)
    } else if (result.errorCode == 'others') {
      hideModal3();
      ToastAndroid.show(result.errorMessage, ToastAndroid.SHORT);
    } else {
      hideModal3();
      let uri = result.assets[0].uri

      let filename = result.assets[0].fileName
      setImage3Url(uri)
      await uploadImageToFirebase(uri, filename);
      const downloadURL = await getDownloadURLFromFirebase(filename);
      setImage3(downloadURL)

    }
  };


  const hideModal1 = () => setVisible1(false);
  const hideModal2 = () => setVisible2(false);
  const hideModal3 = () => setVisible3(false);


  const selectNatureOfPet = (ind) => {

    setNatureOfPets(natureOfPet && natureOfPet.length > 0 && natureOfPet.map((e, i) => {
      if (ind == i) {
        return {
          ...e,
          selected: true
        }
      }
      else {
        return {
          ...e,
          selected: false
        }
      }
    }))
  }


  function generateRandomId(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomId = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomId += characters.charAt(randomIndex);
    }

    return randomId;
  }



  console.log(petData, "PETdTA")

  const handleSubmitData = async () => {


    if (petData && Object.keys(petData).length > 0 && !petData.screen) {


      let myData = {

        image1: image1,
        typeOfPet: value,
        gender: gender,
        breed: otherData.breed,
        petName: otherData.petName,
        height: otherData.height,
        weight: otherData.weight,
        additionalDetails: otherData.additionalDetails,
        natureOfPet: natureOfPet.filter((e, i) => e.selected),
        healthIssue: healthIssue,
        petId: petData.petId
      }



      if (myData.natureOfPet.length > 0) {
        myData.natureOfPet = myData.natureOfPet[0].label
      }

      let dataToSend = { ...myData, ...otherData }


      let checkData = { ...dataToSend }

      delete checkData.healthIssue
      delete checkData.additionalDetails



      let flag = Object.values(checkData).some((e, i) => !e)


      if (flag) {
        ToastAndroid.show("Required Fields are missing", ToastAndroid.SHORT)
        return
      }

      let currentUser = auth().currentUser

      if (!currentUser) {
        setLoading(false)
        return
      } else {

        setLoading(true)

        firestore().collection("Pets").doc(currentUser.uid).get().then((doc) => {
          let myData = doc.data()

          myData = myData.pets

          let dataNotMatched = myData && myData.length > 0 && myData.filter((e, i) => e.petId !== petData.petId)

          let mergeData = [...dataNotMatched, dataToSend]

          let sendingData = {
            pets: mergeData
          }



          firestore().collection("Pets").doc(currentUser.uid).set(sendingData).then((res) => {
            ToastAndroid.show("Pet has been succesfully edited", ToastAndroid.SHORT)
            setLoading(false)
            navigation.navigate("Pets", mergeData)
          }).catch((error) => {
            setLoading(false)
            ToastAndroid.show(erorr.message, ToastAndroid.SHORT)
          })

        })




      }




      return

    }


    let myData = {

      image1: image1,
      // image2: image2,
      // image3: image3,
      typeOfPet: value,
      gender: gender,
      natureOfPet: natureOfPet.filter((e, i) => e.selected),
      healthIssue: healthIssue ? healthIssue : false
    }


    if (myData.natureOfPet.length > 0) {
      myData.natureOfPet = myData.natureOfPet[0].label
    }

    let dataToSend = { ...myData, ...otherData }

    let checkData = { ...dataToSend }

    delete checkData.healthIssue
    delete checkData.additionalDetails


    if (!image1url) {

      ToastAndroid.show("Image is missing", ToastAndroid.SHORT)
      return

    }

    if (!value) {

      ToastAndroid.show("Pet Type is missing", ToastAndroid.SHORT)
      return

    }

    if (!gender) {

      ToastAndroid.show("Gender is missing", ToastAndroid.SHORT)
      return

    }

    if (myData?.natureOfPet && myData?.natureOfPet == 0) {

      ToastAndroid.show("Select Nature of pet", ToastAndroid.SHORT)
      return
    }

    if (!otherData?.petName) {
      ToastAndroid.show("PetName is missing", ToastAndroid.SHORT)
      return
    }

    if (!otherData?.breed) {
      ToastAndroid.show("Breed is missing", ToastAndroid.SHORT)
      return
    }

    if (!otherData?.weight) {
      ToastAndroid.show("Weight is missing", ToastAndroid.SHORT)
      return
    }

    if (!otherData?.height) {
      ToastAndroid.show("Height is missing", ToastAndroid.SHORT)
      return
    }




    let flag = Object.values(checkData).some((e, i) => !e)



    if (flag) {
      ToastAndroid.show("Required Fields are missing", ToastAndroid.SHORT)
      return
    }

    let currentUser = auth().currentUser

    if (!currentUser) {
      return
    } else {

      setLoading(true)

      let petId = await generateRandomId(15)


      let id = currentUser.uid

      dataToSend.petId = petId
      dataToSend.userId = currentUser.uid

      if (!healthIssue) {
        dataToSend.healthIssue = false
      }

      if (!dataToSend?.additionalDetails) {
        dataToSend.additionalDetails = ""
      }


      firestore().collection("Pets").doc(id).set(
        {
          pets: firestore.FieldValue.arrayUnion(dataToSend)
        }, { merge: true }
      ).then((res) => {
        setLoading(false)
        setNatureOfPets(initialNature)
        setHealthIssue(false)
        setValue("")
        setGender("")
        setImage1url("")
        setImage1("")
        // setImage2Url("")
        setOtherData(otherInitialData)
        // setImage2("")
        // setImage3("")
        // setImage3Url("")
        ToastAndroid.show("Pet has been successfully added", ToastAndroid.SHORT)

        if (petData?.screen && petData?.name) {
          navigation.navigate(petData?.screen, petData?.name)
          setLoading(false)
          return
        }
        else if (petData?.screen) {
          navigation.navigate(petData?.screen, petData?.name)
          setLoading(false)
          return
        }


        navigation.navigate("Tab", {
          screen: "Home"
        })
      }).catch((error) => {
        setLoading(false)
        ToastAndroid.show(error?.message, ToastAndroid.SHORT)
      })
    }
  }


  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Replace 'TabScreenName' with the name of your tab screen
      // This will navigate to the specified tab screen when the back button is pressed

      if (petData?.screen) {
        navigation.replace(petData?.screen, petData?.name)
        setLoading(false)
        return true
      }
      else {
        return true; // Return true to prevent the default back action
      }
    });

    return () => backHandler.remove(); // Cleanup the event listener

  }, []);



  return loading ? <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >

    <ActivityIndicator size={"large"} color={Colors.black} />

  </View> : <View style={{ flex: 1, backgroundColor: Colors.white }} >
    <ScrollView style={{ flex: 1 }} nestedScrollEnabled={true} >
      <View style={{ marginTop: 10 }} >
        <CustomHeader text={"Enter New Pet"} />
      </View>

      <View style={{ paddingHorizontal: 15, marginTop: 10 }} >

        <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 18, color: Colors.black }} >Upload Pet Image</Text>

        <View style={{ width: "100%", flexDirection: "row", marginTop: 10, justifyContent: "center" }} >

          <TouchableOpacity onPress={() => setVisible1(true)} style={{ width: width / 3.5, height: 100, backgroundColor: "#E6E6E6", borderRadius: 15, justifyContent: "center", alignItems: "center" }} >

            {image1url ? <Image source={{ uri: image1url }} style={{ width: width / 3.5, height: 100, borderRadius: 10 }} resizeMode='cover' /> : <Image source={require("../../Images/picker.png")} />}


          </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => setVisible2(true)} style={{ width: width / 3.5, height: 100, backgroundColor: "#E6E6E6", borderRadius: 15, justifyContent: "center", alignItems: "center" }} >
            {image2url ? <Image source={{ uri: image2url }} style={{ width: width / 3.5, height: 100, borderRadius: 10 }} resizeMode='cover' /> : <Image source={require("../../Images/picker.png")} />}

          </TouchableOpacity>
          <TouchableOpacity onPress={() => setVisible3(true)} d style={{ width: width / 3.5, height: 100, backgroundColor: "#E6E6E6", borderRadius: 15, justifyContent: "center", alignItems: "center" }} >
            {image3Url ? <Image source={{ uri: image3Url }} style={{ width: width / 3.5, height: 100, borderRadius: 10 }} resizeMode='cover' /> : <Image source={require("../../Images/picker.png")} />}

          </TouchableOpacity> */}

        </View>


        <View style={{ marginTop: 10 }} >



          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            containerStyle={{ height: 60, borderWidth: 0, borderRadius: 5, backgroundColor: "#e6e6e6", alignItems: "center", justifyContent: "center", zIndex: 100 }}
            style={{ backgroundColor: "#E6E6E6", borderRadius: 5, borderWidth: 0, paddingVertical: 10, zIndex: 100 }}
            textStyle={{ fontSize: 16 }}
            dropDownContainerStyle={{ zIndex: 999 }}
            placeholder={'Type Of Pet'}
            placeholderStyle={{ color: "gray" }}
          />

          <TextInput
            style={{
              backgroundColor: "#e6e6e6",
              borderRadius: 5,
              marginTop: 10,
              width: '100%',
              padding: 15,
              borderWidth: 0,
              color: Colors.black,

              fontSize: 16,
              paddingHorizontal: 10,
            }}
            value={otherData.breed}
            onChangeText={(e) => setOtherData({ ...otherData, breed: e })}
            placeholder="Breed"
            placeholderTextColor={Colors.gray}
          />
          <TextInput
            style={{
              backgroundColor: "#e6e6e6",
              borderRadius: 5,
              marginTop: 10,
              width: '100%',
              padding: 15,
              borderWidth: 0,
              color: Colors.black,

              fontSize: 16,
              paddingHorizontal: 10,
            }}
            value={otherData.petName}
            onChangeText={(e) => setOtherData({ ...otherData, petName: e })}
            placeholder="Pet Name"
            placeholderTextColor={Colors.gray}
          />


          <DropDownPicker
            open={openGender}
            value={gender}
            items={genderOptions}
            setOpen={setOpenGender}
            setValue={setGender}
            setItems={setGenderOptions}
            containerStyle={{ height: 60, borderWidth: 0, borderRadius: 5, backgroundColor: "#e6e6e6", alignItems: "center", justifyContent: "center", marginTop: 10, zIndex: 100 }}
            style={{ backgroundColor: "#E6E6E6", borderRadius: 5, borderWidth: 0, paddingVertical: 10, }}
            textStyle={{ fontSize: 16 }}
            dropDownContainerStyle={{ zIndex: 800 }}
            placeholder={'Gender'}
            placeholderStyle={{ color: "gray" }}
          />

          <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }} >


            <TextInput

              style={{ color: Colors.black, backgroundColor: "#E6E6E6", borderRadius: 5, borderWidth: 0, paddingVertical: 15, width: "49%", marginTop: 10, paddingHorizontal: 10, fontSize: 14, fontFamily: "Poppins-Regular" }}
              placeholder={'Weight in lb'}
              placeholderTextColor={"gray"}
              keyboardType='number-pad'
              value={otherData.weight}
              onChangeText={(e) => setOtherData({ ...otherData, weight: e })}
            />

            <TextInput

              style={{ color: Colors.black, backgroundColor: "#E6E6E6", borderRadius: 5, borderWidth: 0, paddingVertical: 15, width: "49%", marginTop: 10, paddingHorizontal: 10, fontSize: 14, fontFamily: "Poppins-Regular" }}
              placeholder={'Height in inches'}
              placeholderTextColor={"gray"}
              keyboardType='number-pad'
              value={otherData.height}
              onChangeText={(e) => setOtherData({ ...otherData, height: e })}
            />

          </View>


          <Text style={{ fontSize: 18, fontFamily: "Poppins-SemiBold", color: Colors.black, marginTop: 10, zIndex: -10 }} >Nature Of Pet</Text>


          <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", zIndex: -10 }} >


            {natureOfPet && natureOfPet.length > 0 && natureOfPet.map((e, i) => {

              return (

                <TouchableOpacity onPress={() => selectNatureOfPet(i)} key={i} style={{ flexDirection: "row", alignItems: "flex-start" }} >

                  <View style={{ width: 18, height: 18, borderRadius: 100, borderWidth: e.selected ? 0 : 1, alignSelf: "center", backgroundColor: e.selected ? Colors.buttonColor : "white" }} >
                  </View>
                  <Text style={{ fontSize: 16, fontFamily: "Poppins-Regular", color: Colors.gray, marginLeft: 5 }} >{e.label}</Text>

                </TouchableOpacity>


              )

            })}



          </View>



          <TextInput

            multiline={true}
            numberOfLines={6}
            style={{ backgroundColor: "#e6e6e6", borderRadius: 5, marginBottom: 10, marginTop: 10, fontFamily: "Poppins-Regular", color: Colors.black, fontSize: 16, paddingHorizontal: 10, textAlignVertical: "top", }}
            placeholder='tell us more about your pet (Optional)'
            placeholderTextColor={"gray"}
            value={otherData.additionalDetails}
            onChangeText={(e) => setOtherData({ ...otherData, additionalDetails: e })}
          />



          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }} >

            <TouchableOpacity
              style={{
                width: 20,
                height: 20,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
                borderWidth: 1,
                borderColor: Colors.black,
              }}

              onPress={() => setHealthIssue(!healthIssue)}

            >
              {healthIssue && <Icons name="check" color={Colors.black} size={15} />}
            </TouchableOpacity>

            <Text
              style={{
                marginLeft: 8,
                fontSize: 16,

                color: Colors.black,
                fontFamily: 'Poppins-SemiBold',
              }}>
              Injury or any other health issue?
            </Text>


          </View>




        </View>



      </View>



      <CustomButton onPress={handleSubmitData} text="Submit" styleContainer={{ width: "80%", alignSelf: "center", marginBottom: 20, marginTop: 10 }} />


      <ModalImg
        modalVisible={visible1}
        openGallery={openGallery}
        openCamera={openCamera}
        closeModal={hideModal1}
      />


      <ModalImg
        modalVisible={visible2}
        openGallery={openGallery2}
        openCamera={openCamera2}
        closeModal={hideModal2}
      />

      <ModalImg
        modalVisible={visible3}
        openGallery={openGallery3}
        openCamera={openCamera3}
        closeModal={hideModal3}
      />


    </ScrollView>
  </View>;
}

export default PetDetails;
