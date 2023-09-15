import { View, Text, Dimensions, Image, TextInput, ScrollView, TouchableOpacity, ToastAndroid, PermissionsAndroid } from 'react-native';
import CustomHeader from '../../Components/CustomHeader';
import Colors from '../../Constant/Color';
import DropDownPicker from 'react-native-dropdown-picker';
import { useState } from 'react';
import { getEnforcing } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import Icons from 'react-native-vector-icons/Feather';
import CustomButton from '../../Components/CustomButton';
import ModalImg from '../../Components/modalimg';
import { launchCamera, launchImageLibrary } from "react-native-image-picker"
import storage from '@react-native-firebase/storage';



function PetDetails({ navigation }) {

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

  const [openWeight, setOpenWeight] = useState(false)
  const [weight, setWeight] = useState(null)

  const [weightOptions, setWeightOptions] = useState([
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ]);

  const [openHeight, setOpenHeight] = useState(false)
  const [heights, setHeight] = useState(null)

  const [heightOptions, setHeightOptions] = useState([
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ]);

  const [image1, setImage1] = useState("")
  const [image1url, setImage1url] = useState("")
  const [image2, setImage2] = useState("")
  const [image2url, setImage2Url] = useState("")
  const [image3, setImage3] = useState("")
  const [image3Url, setImage3Url] = useState("")


  const [natureOfPet, setNatureOfPets] = useState([

    {
      label: "Fear",
      selected: false
    },
    {
      label: "Anger",
      selected: false
    },
    {
      label: "Playful",
      selected: false
    },
    {
      label: "Anxiety",
      selected: false
    },

  ])


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
      const downloadURL = await getDownloadURLFromFirebase(imageName);
      console.log('Download URL:', downloadURL);

      setImage1(downloadURL)

    }
  };

  const openCamera = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
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
        const downloadURL = await getDownloadURLFromFirebase(imageName);
        setImage1(downloadURL)



      }
    }
  };




  const openCamera2 = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
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
        const downloadURL = await getDownloadURLFromFirebase(imageName);
        console.log('Download URL:', downloadURL);

        setImage2(downloadURL)



      }
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
      const downloadURL = await getDownloadURLFromFirebase(imageName);
      setImage2(downloadURL)

    }
  };


  const openCamera3 = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
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
        const downloadURL = await getDownloadURLFromFirebase(imageName);
        console.log('Download URL:', downloadURL);

        setImage3(downloadURL)



      }
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
      const downloadURL = await getDownloadURLFromFirebase(imageName);
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


  return <View style={{ flex: 1, backgroundColor: Colors.white }} >
    <ScrollView style={{ flex: 1 }} nestedScrollEnabled={true} >

      <CustomHeader text={"Enter pet Details"} />


      <View style={{ paddingHorizontal: 15, marginTop: 10 }} >

        <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 18, color: Colors.black }} >Upload Images</Text>

        <View style={{ width: "100%", justifyContent: "space-between", flexDirection: "row", marginTop: 10 }} >

          <TouchableOpacity onPress={() => setVisible1(true)} style={{ width: width / 3.5, height: 100, backgroundColor: "#E6E6E6", borderRadius: 15, justifyContent: "center", alignItems: "center" }} >

            {image1url ? <Image source={{ uri: image1url }} style={{ width: 100, height: 100, borderRadius: 10 }} resizeMode='cover' /> : <Image source={require("../../Images/picker.png")} />}


          </TouchableOpacity>
          <TouchableOpacity onPress={() => setVisible2(true)} style={{ width: width / 3.5, height: 100, backgroundColor: "#E6E6E6", borderRadius: 15, justifyContent: "center", alignItems: "center" }} >
            {image2url ? <Image source={{ uri: image2url }} style={{ width: 100, height: 100, borderRadius: 10 }} resizeMode='cover' /> : <Image source={require("../../Images/picker.png")} />}

          </TouchableOpacity>
          <TouchableOpacity onPress={() => setVisible3(true)} d style={{ width: width / 3.5, height: 100, backgroundColor: "#E6E6E6", borderRadius: 15, justifyContent: "center", alignItems: "center" }} >
            {image3Url ? <Image source={{ uri: image3Url }} style={{ width: 100, height: 100, borderRadius: 10 }} resizeMode='cover' /> : <Image source={require("../../Images/picker.png")} />}

          </TouchableOpacity>

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

              style={{ backgroundColor: "#E6E6E6", borderRadius: 5, borderWidth: 0, paddingVertical: 15, width: "49%", marginTop: 10, paddingHorizontal: 10, fontSize: 14, fontFamily: "Poppins-Regular" }}
              placeholder={'Weight in lbs'}
              placeholderTextColor={"gray"}
            />

            <TextInput

              style={{ backgroundColor: "#E6E6E6", borderRadius: 5, borderWidth: 0, paddingVertical: 15, width: "49%", marginTop: 10, paddingHorizontal: 10, fontSize: 14, fontFamily: "Poppins-Regular" }}
              placeholder={'Height in inches'}
              placeholderTextColor={"gray"}
            />

          </View>


          <Text style={{ fontSize: 18, fontFamily: "Poppins-SemiBold", color: Colors.black, marginTop: 10, zIndex: -10 }} >Nature Of Pet</Text>


          <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center", zIndex: -10 }} >


            {natureOfPet && natureOfPet.length > 0 && natureOfPet.map((e, i) => {

              return (

                <TouchableOpacity onPress={() => selectNatureOfPet(i)} key={i} style={{ flexDirection: "row", alignItems: "flex-start" }} >

                  <View style={{ width: 18, height: 18, borderRadius: 100, borderWidth: 1, alignSelf: "center", backgroundColor: e.selected ? "blue" : "white" }} >
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



      <CustomButton text="Submit" styleContainer={{ width: "80%", alignSelf: "center", marginBottom: 20, marginTop: 10 }} />


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
