import { View, Text, Dimensions, Image, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import CustomHeader from '../../Components/CustomHeader';
import Colors from '../../Constant/Color';
import DropDownPicker from 'react-native-dropdown-picker';
import { useState } from 'react';
import { getEnforcing } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import Icons from 'react-native-vector-icons/Feather';
import CustomButton from '../../Components/CustomButton';


function PetDetails({ navigation }) {

  let { width, height } = Dimensions.get("window")
  const [healthIssue, setHealthIssue] = useState(false)

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
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


  console.log(natureOfPet, "natureOfPets")


  return <View style={{ flex: 1, backgroundColor: Colors.white }} >
    <ScrollView style={{ flex: 1 }} nestedScrollEnabled={true} >

      <CustomHeader text={"Enter pet Details"} />


      <View style={{ paddingHorizontal: 15, marginTop: 10 }} >

        <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 18, color: Colors.black }} >Upload Images</Text>

        <View style={{ width: "100%", justifyContent: "space-between", flexDirection: "row", marginTop: 10 }} >

          <TouchableOpacity style={{ width: width / 3.5, height: 100, backgroundColor: "#E6E6E6", borderRadius: 15, justifyContent: "center", alignItems: "center" }} >

            <Image source={require("../../Images/picker.png")} />


          </TouchableOpacity>
          <TouchableOpacity style={{ width: width / 3.5, height: 100, backgroundColor: "#E6E6E6", borderRadius: 15, justifyContent: "center", alignItems: "center" }} >
            <Image source={require("../../Images/picker.png")} />

          </TouchableOpacity>
          <TouchableOpacity style={{ width: width / 3.5, height: 100, backgroundColor: "#E6E6E6", borderRadius: 15, justifyContent: "center", alignItems: "center" }} >
            <Image source={require("../../Images/picker.png")} />

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
            containerStyle={{ height: 60, borderWidth: 0, borderRadius: 5, backgroundColor: "#e6e6e6", alignItems: "center", justifyContent: "center", marginTop: 10 }}
            style={{ backgroundColor: "#E6E6E6", borderRadius: 5, borderWidth: 0, paddingVertical: 10, }}
            textStyle={{ fontSize: 16 }}
            dropDownContainerStyle={{ zIndex: 999 }}
            placeholder={'Gender'}
            placeholderStyle={{ color: "gray" }}
          />

          <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }} >


            <DropDownPicker
              open={openWeight}
              value={weight}
              items={weightOptions}
              setOpen={setOpenWeight}
              setValue={setWeight}
              setItems={setWeightOptions}
              containerStyle={{ height: 60, borderWidth: 0, borderRadius: 5, backgroundColor: "#e6e6e6", alignItems: "center", justifyContent: "center", marginTop: 10, width: "49%" }}
              style={{ backgroundColor: "#E6E6E6", borderRadius: 5, borderWidth: 0, paddingVertical: 10, zIndex: 100 }}
              textStyle={{ fontSize: 16 }}
              dropDownContainerStyle={{ zIndex: 999 }}
              placeholder={'Weight'}
              placeholderStyle={{ color: "gray" }}
            />

            <DropDownPicker
              open={openHeight}
              value={heights}
              items={heightOptions}
              setOpen={setOpenHeight}
              setValue={setHeight}
              setItems={setHeightOptions}
              containerStyle={{ height: 60, borderWidth: 0, borderRadius: 5, backgroundColor: "#e6e6e6", alignItems: "center", justifyContent: "center", marginTop: 10, width: "49%" }}
              style={{ backgroundColor: "#E6E6E6", borderRadius: 5, borderWidth: 0, paddingVertical: 10, zIndex: 100 }}
              textStyle={{ fontSize: 16 }}
              dropDownContainerStyle={{ zIndex: 999 }}
              placeholder={'Height'}
              placeholderStyle={{ color: "gray" }}
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

    </ScrollView>
  </View>;
}

export default PetDetails;
