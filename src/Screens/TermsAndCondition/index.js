
import React, { useState, useContext, useCallback, useEffect } from 'react';
import {
    ImageBackground,
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    Modal,
    ScrollView,
    ToastAndroid,
    ActivityIndicator,
    Image,
    StatusBar,
    KeyboardAvoidingView,
    PermissionsAndroid,
} from 'react-native';
import Colors from '../../Constant/Color';
import CustomButton from '../../Components/CustomButton';
import CustomHeader from '../../Components/CustomHeader';
import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import LoginContext from '../../Context/loginContext/context';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';

function TermsAndConditions({ navigation, route }) {




    const [loading, setLoading] = useState(false)
    const [agree, setAgree] = useState(false)
    const [modalVisible, setModalVisible] = useState(true)

    const loginCont = useContext(LoginContext)


    const { loginData, setLoginData } = loginCont

    useEffect(() => {
        GoogleSignin.configure({
            webClientId:
                '889265375440-76ihli23dk6ulbuamsujt41t0t3gvdcs.apps.googleusercontent.com',
            androidClientId:
                '889265375440-jbbsvsaa0p98bs1itd620d3qbl4hs6rh.apps.googleusercontent.com',
        });
    }, []);



    const handleLogoutUser = async () => {

        AsyncStorage.removeItem("user")


        if (GoogleSignin.isSignedIn()) {


            await GoogleSignin.signOut()
            await auth().signOut()
            ToastAndroid.show("Logout Successfully", ToastAndroid.SHORT)
            setLoginData("")
            navigation.reset({
                index: 0,
                routes: [
                    {
                        name: 'Login',

                    },
                ],
            });
        } else {

            auth().signOut().then((res) => {
                navigation.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'Login',

                        },
                    ],
                });
                setLoginData("")
                ToastAndroid.show("Logout Successfully", ToastAndroid.SHORT)

            }).catch((error) => {

                ToastAndroid.show("Logout Unsuccessfull", ToastAndroid.SHORT)


            })
        }

    }



    const handleAgreePress = () => {

        let id = auth().currentUser?.uid

        firestore().collection("Users").doc(id).set({
            agree: true
        }).then(() => {
            navigation.replace("UserDetails")
        }).catch((error) => {
            console.log(error, "error")
        })
    }

    const handleDeclinePress = () => {

        handleLogoutUser()
    }

    const ShowLocationModal = useCallback(() => {
        return (
            <View style={styles.centeredView}>
                <Modal animationType="slide" transparent={true} visible={modalVisible}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <ScrollView style={{ marginBottom: 0, marginRight: 10, width: "100%" }}  >

                                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                    Welcome to Poochie!
                                    These terms and conditions outline the rules and regulations for the use of Poochie.
                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginTop: 10, marginHorizontal: 20 }} >
                                    Acceptance of Terms
                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, }} >
                                    By downloading or using the app, these terms will automatically apply to you – you should make sure therefore that you read them carefully before using the app. You’re not allowed to copy or modify the app, any part of the app, or our trademarks in any way. You’re not allowed to attempt to extract the source code of the app, and you also shouldn’t try to translate the app into other languages or make derivative versions. The app itself, and all the trademarks, copyright, database rights, and other intellectual property rights related to it belong to XOX Rides Inc.  </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                    XOX Rides Inc is committed to ensuring that the app is as useful and efficient as possible. For that reason, we reserve the right to make changes to the app or to charge for its services, at any time and for any reason. We will never charge you for the app or its services without making it very clear to you exactly what you’re paying for. </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                    You agree to comply with and be bound by these Terms & Conditions (the "Agreement"). If you do not agree to these terms, please do not use the App.
                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                    The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: "Client", "You" and "Your" refers to you, the person log on this website and compliant to the Company’s terms and conditions. "The Company", "Ourselves", "We", "Our" and "Us", refers to our Company. "Party", "Parties", or "Us", refers to both the Client and ourselves. All terms refer to the offer, acceptance and consideration of payment necessary to undertake the process of our assistance to the Client in the most appropriate manner for the express purpose of meeting the Client’s needs in respect of provision of the Company’s stated services, in accordance with and subject to, prevailing law of California. Any use of the above terminology or other words in the singular, plural, capitalization and/or he/she or they, are taken as interchangeable and therefore as referring to the same.
                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginTop: 10, marginHorizontal: 20 }} >
                                    Description of Services
                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                                    A. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >

                                        <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                            To use certain features of the App, Users are required to register and create an account. Users agree to provide accurate and up-to-date information during the registration process.

                                        </Text>


                                    </Text>

                                </Text>


                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                                    B. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >

                                        <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                            Users are responsible for maintaining the confidentiality of their account credentials and for all activities that occur under their account.
                                        </Text>


                                    </Text>

                                </Text>


                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginTop: 10, marginHorizontal: 20 }} >
                                    This Agreement contains an arbitration provision enforceable by the parties. Please take your time and seek the necessary help to understand the consequences of entering into this Agreement.
                                </Text>




                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginTop: 10, marginHorizontal: 20 }} >

                                    Contractual Relationship
                                </Text>



                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                                    A. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Agreement:

                                        <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                            This agreement (the "Agreement") is made between you (the "Customer" or "User") and XOX Rides Inc. and/or (dba "Poochie App") ("Poochie" or the "Company") (Poochieapp.com) (the "Party"). ”, collectively referred to as the “Parties”. The terms and conditions of this Agreement (the “Terms”) govern your use of the Application, Website, content, products and services provided by Poochie and its parent, subsidiaries, agents, affiliates, officers (individually and collectively, the "Services") are provided to the Director. Please read these Terms carefully as they constitute a legal agreement between you and Poochie.
                                        </Text>
                                    </Text>

                                </Text>


                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                                    B. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Summary Termination:

                                        <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                            By accessing or using the Services, you confirm your agreement to these Terms. If you do not agree to these Terms, you may not access or use the Services. This Agreement expressly supersedes any prior agreements or understandings with you. Poochie may immediately terminate this Agreement or any Services related to you at any time and for any reason, or generally cease providing or deny access to the Services, or any part thereof.</Text>
                                    </Text>

                                </Text>


                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                                    C. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Supplement Terms:

                                        <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                            Additional terms and conditions may apply to certain Services, such as policies for specific events, programs, activities or promotions. These additional terms will be disclosed to you through separate disclosures or in connection with the applicable Services. Additional terms and conditions are in addition to this Agreement and are deemed to be part of this Agreement with respect to the relevant Services. In the event of a conflict regarding related services, any Supplemental Terms will take precedence over these Terms.   </Text>


                                    </Text>

                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                                    D. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Poochie Amendments:

                                        <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                            Poochie may change this Agreement from time to time. If Poochie changes the Agreement, you will receive a message sent to the email address you provided in your contact information. Changes will be effective upon posting of these updated Terms on the Poochie Website. Your use of the Poochie Platform or Services following notification constitutes your agreement to be bound by the modified Agreement. For Services you used before the effective date of the change, you will continue to be bound by the provisions of these Terms from the date you first agreed to these Terms (or any subsequent changes to these Terms).
                                        </Text>

                                    </Text>
                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                                    E. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Brokerage Service:

                                        <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                            Poochie uses web-based technology to provide an online marketplace that connects customers, contract drivers ("Contractors") and pet service businesses (the "Poochie Platform"). Poochie software allows registered users to request pet transportation from contractors. Poochie software notifies contractors of available rides, and Poochie software facilitates the logistics and payment for rides. XOX Rides Inc. and/or dba Poochie or Poochie App or poochieapp.com are technology-based service intermediaries. The contractor is a pet services company.
                                        </Text>

                                    </Text>

                                </Text>


                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginTop: 10, marginHorizontal: 20 }} >

                                    You acknowledge that your ability to arrange for pet transportation through the use of Poochie does not constitute an indication of POOCHIE's role as a transportation, logistics or delivery service provider or transportation carrier.
                                </Text>



                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginHorizontal: 20 }} >
                                    License
                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                    Unless otherwise stated, Poochie and/or its licensors own the intellectual property rights for all material on Poochie. All intellectual property rights are reserved. You may access this from Poochie for your own personal use subjected to restrictions set in these terms and conditions.
                                    You must not:

                                </Text>



                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >
                                    1) Republish material from Poochie
                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >
                                    2) Sell, rent or sub-license material from Poochie

                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >
                                    3) Reproduce, duplicate or copy material from Poochie
                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >

                                    4) Redistribute content from Poochie
                                </Text>


                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                    This Agreement shall begin on the date hereof.
                                    Parts of this app offer an opportunity for users to post and exchange opinions and information in certain areas of the website. Poochie does not filter, edit, publish or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of Poochie, its agents and/or affiliates. Comments reflect the views and opinions of the person who posts their views and opinions. To the extent permitted by applicable laws, Poochie shall not be liable for the Comments or for any liability, damages or expenses caused and/or suffered as a result of any use of and/or posting of and/or appearance of the Comments on this website.

                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                    Poochie reserves the right to monitor all Comments and to remove any Comments which can be considered inappropriate, offensive or causes breach of these Terms and Conditions.
                                    You warrant and represent that:

                                </Text>


                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >
                                    1)
                                    You are entitled to post the Comments on our App and have all necessary licenses and consents to do so;
                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >
                                    2)
                                    The Comments do not invade any intellectual property right, including without limitation copyright, patent or trademark of any third party;

                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >
                                    3)
                                    The Comments do not contain any defamatory, libelous, offensive, indecent or otherwise unlawful material which is an invasion of privacy
                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >

                                    4)
                                    The Comments will not be used to solicit or promote business or custom or present commercial activities or unlawful activity.
                                </Text>


                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                    You hereby grant Poochie a non-exclusive license to use, reproduce, edit and authorize others to use, reproduce and edit any of your Comments in any and all forms, formats or media.
                                </Text>


                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginHorizontal: 20 }} >
                                    Restrictions:
                                </Text>


                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                                    1)
                                    Except as expressly permitted, you may not reproduce, modify, create derivative works from, distribute, license, lease, sell, resell, transfer, publicly display, perform, transfer or otherwise use the Service to stream, broadcast or otherwise exploit content created by Pucci.
                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                                    2)
                                    Unless permitted by law, you may not decompile, reverse engineer or disassemble the Services.
                                </Text>


                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                    3) You may not link, mirror or format any part of the Services, launch or launch any program or script for the purpose of crawling, indexing, inspecting or otherwise exploiting any part of the Services, or otherwise manipulate any part of the Services Impose an undue burden or impede the operation and/or functionality of any aspect of the Services.   </Text>


                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                                    4)
                                    You may not attempt to gain unauthorized access to or interfere with the Service or its related systems or networks.
                                </Text>




                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Third-Party Services and Content:

                                    <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                        The Services are provided or accessed in connection with pet services companies or third-party services that are not controlled by Poochie. You acknowledge that different terms of use and privacy policies apply to your use of such third-party services and content. Poochie does not endorse such third party services and content; in no event is Poochie responsible for any products or services provided by such third parties. In addition, if you use an application developed for Apple iOS, Android, Microsoft Windows or Blackberry-based mobile devices to access the Service, then Apple Inc., Google, Inc., Microsoft Corporation or BlackBerry Limited, respectively, are third-party beneficiaries of this Agreement . These third party beneficiaries are not parties to this Agreement and are not in any way responsible for providing or supporting the Services. Your access to the Services using these devices is subject to terms set forth in the applicable third-party beneficiary’s terms of service.
                                    </Text>

                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Ownership:

                                    <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                        The Services and all rights therein are and will remain the property of Poochie. Neither these Terms nor your use of the Services transfers or grants you any rights: (i) in or related to the Services, except for the limited license granted above; (ii) to use or reference Poochie in any manner company names, logos, product and service names, trademarks or service marks.</Text>

                                </Text>


                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginTop: 10, marginHorizontal: 20 }} >

                                    Access & use of the services:

                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                                    A. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >User Accounts:

                                        <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                            In order to use most features of the Services, you must register and maintain an active individual user Services account ("Account"). To obtain an Account, you must be 18 years of age or older, or the legal age of majority (other than 18) in your jurisdiction, unless otherwise permitted by a particular Service. Account registration requires you to provide Poochie with certain personal information, such as your name, address, mobile phone number, and age, and at least one valid payment method supported by Poochie. You agree to maintain accurate, complete and current information in your account. If you fail to maintain accurate, complete, and current account information, including providing an invalid or expired payment method, you may not access or use the Services.   </Text>
                                    </Text>

                                </Text>


                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                                    B. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >User Requirements and Conduct:

                                        <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                            The Service is not intended for persons under 18 years of age. You may not allow a third party to use your account or allow anyone under the age of 18 to arrange for pet transportation. You may not transfer or otherwise transfer your account to any other person or entity. You agree to comply with all applicable laws when accessing or using the Services, and you may access or use the Services only for lawful purposes (e.g., not to transport illegal or hazardous materials). You shall not cause annoyance, annoyance, inconvenience or property damage as a result of your access to or use of the Services. In some cases, you may be asked to provide proof of identity or other authentication method in order to access or use the Services. If you refuse to provide proof of identity or other method of authentication, you will be denied access to or use of the Services.
                                        </Text>

                                        <Text />

                                        <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginTop: 10, marginHorizontal: 20 }} >

                                            Conduct

                                        </Text>

                                        <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                                            1)   Users agree not to engage in any unlawful, fraudulent, or harmful conduct while using the App.
                                        </Text>
                                        <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                                            2)
                                            Users agree not to misuse the App by interfering with its functionality, attempting to gain unauthorized access to the App or its data, or engaging in any activity that disrupts or damages the App's operation.
                                        </Text>

                                    </Text>

                                </Text>


                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                                    C. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Text Messaging and Telephone Calls:

                                        <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                            You agree that Poochie may contact you, including for marketing purposes, by telephone or text message (including through an automatic telephone dialing system) at any telephone number provided by you or on your behalf in connection with your Poochie account. You understand that you are not required to provide this consent as a condition of purchasing any property, goods or services. You also understand that you may unsubscribe from text messages from Poochie at any time by contacting hello@poochieapp.com. If you do not choose to unsubscribe, Poochie may contact you as described in its Privacy Policy.  </Text>
                                    </Text>

                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                                    d. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >User Provided Content:

                                        <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                            From time to time, Poochie may, in its sole discretion, permit you to submit, upload, post or otherwise provide text, audio and/or visual content and information to Poochie through the Services, including comments and feedback related to the Services. Make support requests and submit contest and promotional entries ("User Content"). Any User Content you provide remains your property. However, by providing User Content to Poochie, you grant Poochie a worldwide, perpetual, irrevocable, transferable, royalty-free license, with the right to sublicense, use, reproduce, modify, create derivative works, distribute , publicly display, perform and otherwise exploit such User Content in all formats and distribution channels now known or hereafter developed (including in connection with Poochie's services and business and third party websites and services); without further notice to or consent from you, and without the requirement of payment to you or any other person or entity.  </Text>

                                    </Text>


                                    <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                                        e. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >You represent and warrant that:

                                            <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                                (i) you are the sole and exclusive owner of all User Content or you have all rights, licenses, consents and releases that are necessary to grant to Poochie the license to the User Content as described above; (ii) User Content that you submit, upload, publish or otherwise Neither the provision of such User Content nor Poochie's use of the User Content as permitted by this Agreement will infringe, misappropriate or violate any third party's intellectual property or proprietary rights, or violate any right of publicity or privacy, or result in the violation of any applicable laws or regulations. </Text>

                                        </Text>

                                    </Text>




                                </Text>


                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                                    f. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >You represent and warrant that:

                                        <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                            You are responsible for obtaining the data network access necessary to use the Services. If you access or use the Services through a device, you may be subject to your mobile network's data and messaging rates and fees. You are responsible for obtaining and updating compatible hardware or devices required to access and use the Services and Applications and any updates thereto. Poochie does not guarantee that the Services or any part thereof will operate on any specific hardware or equipment. In addition, the Service may experience interruptions and delays related to use of the Internet and electronic communications.
                                        </Text>

                                    </Text>
                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                                    g. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >You agree to not  provide:

                                        <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                            User Content that is defamatory, libelous, hateful, violent, obscene, pornographic, unlawful, or otherwise offensive, as determined by Poochie in its sole discretion, whether or not such material may be protected by law. Poochie may, but shall not be obligated to, review, monitor, or remove User Content, at Poochie’s sole discretion and at any time and for any reason, without notice to you. </Text>
                                    </Text>
                                </Text>


                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginTop: 10, marginHorizontal: 20 }} >

                                    Payment:
                                </Text>



                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                                    a. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Amount:

                                        <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                            The use of the Services will result in charges to you for the services you receive (“Charges”). Poochie will receive and/or enable your payment of the applicable Charges for services obtained through your use of the Services. Charges will be inclusive of applicable taxes where required by law. Charges will include other applicable fees, tolls, and/or surcharges including booking fees, municipal tolls, airport surcharges or processing fees.</Text>

                                    </Text>
                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                                    b. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >How Made:

                                        <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                            All Charges and payments will be enabled by Poochie, after which you will receive a receipt by email. If your Account payment method is determined to be expired, invalid or otherwise not able to be charged, you agree that Poochie may use a secondary payment method in your Account, if available. Charges you pay are final and non-refundable.

                                        </Text>

                                    </Text>


                                    <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                                        c. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Adjustments:

                                            <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                                4.3 Adjustments. As between you and Poochie, Poochie reserves the right to establish, remove, refund and/or revise Charges for the use of the Services at any time in Poochie’s sole discretion. Further, you acknowledge and agree that Charges applicable in certain geographical areas may increase substantially during times of high demand. Poochie will use reasonable efforts to inform you of Charges that may apply, provided that you will be responsible for Charges incurred under your Account regardless of your awareness of such Charges or the amounts thereof.

                                            </Text>
                                        </Text>

                                    </Text>




                                </Text>


                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                                    d. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Special Deals:

                                        <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                            Poochie may from time to time provide certain users with promotional offers and discounts that will result in different amounts charged for the same or similar services through the use of the Services, and you agree that such promotional offers and discounts, unless also made available to you, shall have no bearing on your use of the Services or the Charges applied to you.  </Text>
                                    </Text>
                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                                    e. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Service Cancellation:

                                        <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                            You may elect to cancel your scheduled Services up to 24 hours prior to the commencement of such Services, after which case you will be charged a cancellation fee of $15.00.    </Text>
                                    </Text>

                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                                    f. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Feedback:

                                        <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                            After you have received Services or goods obtained through the Services, you will have the opportunity via email to rate your experience and leave additional feedback. </Text>
                                    </Text>
                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                                    g. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Application of Payments:

                                        <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                            Poochie may use the proceeds of any Charges for any purpose, subject to any payment obligations it has to Contractors as a broker.
                                        </Text>
                                    </Text>

                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                                    h. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Tips:

                                        <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                            Poochie does not designate any portion of your payment as a tip or gratuity to Contractors. You understand and agree that, while you are free to provide additional payment as a gratuity to Contractors who provide you pet transportation services, you are under no obligation to do so. Gratuities are voluntary.
                                        </Text>
                                    </Text>

                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                                    i. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Repair Cleaning or Lost and Found Fees:

                                        <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                            You shall be responsible for the cost of repair for damage to, or necessary cleaning of Contractor vehicles and property resulting from use of pet transportation services under your Account in excess of normal “wear and tear” (“Repair or Cleaning”). In the event that a Repair or Cleaning request from the Contractor is verified by Poochie, Poochie will Charge your Account for the reasonable cost of such Repair or Cleaning using your payment method designated in your Account.  </Text>
                                    </Text>
                                </Text>






                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginHorizontal: 20 }} >
                                    User responsibilities:
                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                    Your Pets:  You hereby represent, represent and warrant that with respect to your pet using the Transportation Service:

                                </Text>



                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >
                                    1) the pet is yours;
                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >
                                    2) the pet is free of fleas, ticks, other pests and infectious diseases (such as mange);

                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >
                                    3)You have disclosed all material information about your pet, including any pre-existing veterinary illnesses, bite history, and behavioral issues that may be relevant to or affect the Transportation Services.
                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >

                                    4) the pet is not aggressive;
                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >

                                    5) you have liability insurance that covers injury and damage caused by your pet;
                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >

                                    6) the pet is fully vaccinated and licensed in accordance with local laws;
                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >

                                    7) You must provide accurate information about yourself and your pet.
                                </Text>



                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginTop: 10, marginHorizontal: 20 }} >

                                    Pet Damages

                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                    You are solely responsible for your pet's behavior. You will be responsible for all claims, costs, actions, demands, losses, damages and expenses of every kind or nature arising out of or relating to your conduct with your pet (including, without limitation, reasonable attorneys' fees and legal costs) ., including without limitation claims by third parties (including contractors) for any damage, loss or injury resulting from your pet biting or attacking such a third party.
                                </Text>


                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginTop: 10, marginHorizontal: 20 }} >

                                    Contractor Discretion:

                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                    Contractors have the sole and absolute discretion to reject or refuse any pet transportation services that you may request, even at the point of pickup, when:
                                </Text>


                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                                    1)  the physical condition or temperament of the pet prevents timely delivery, prevents safe transportation, or endangers the security of the pet;
                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                                    2)
                                    you vary the instructions and parameters of the desired service from that contained in your accepted order for pet transportation services (e.g. more than one pet, different pet, different time or place of delivery);
                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                                    3)  transportation would be unlawful.
                                </Text>


                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginTop: 10, marginHorizontal: 20 }} >
                                    Veterinary Care in Transit:
                                </Text>


                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                                    1)  You Are Reached. If a Contractor or Poochie reaches you with a request to authorize veterinary care for your pet and you refuse, you are solely responsible for the consequences to your Pet(s).      </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                                    2)
                                    You Are Not Reached. If you cannot be reached to authorize care, and your pet needs immediate veterinary care in the estimation and discretion of Poochie or the Contractor, you hereby authorize the Contractor and/or Poochie to obtain and authorize veterinary care for your pet. You are solely responsible for the costs of any such veterinary treatment for your pet(s); and, you consent to and authorize Poochie to charge any of your payment methods for such costs.</Text>

                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                                    3)No Liability to Poochie or Contractor. Whether or not you are reached, you waive, release and promise never to assert any claims or causes of action arising from seeking veterinary care or failure to seek such care against Poochie and Contractor, and their predecessors, successors or past or present subsidiaries, stockholders, directors, officers, employees, consultants, attorneys, agents, or assigns with respect to any matter, including without limitation any claims of negligence, emotional distress, fraud, breach of contract, or breach of the covenant of good faith and fair dealing.
                                </Text>


                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginTop: 10, marginHorizontal: 20 }} >
                                    INDEMNITY:
                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                    The parties expressly expect User to indemnify and comply with any exceptions to the general indemnification provisions contained in the laws applicable to this Agreement. You agree to indemnify and hold POOCHIE and its affiliates, and their officers, directors, employees and agents harmless from and against any and all claims, demands, losses, liabilities and expenses (including legal fees) arising out of or relating to: DAMAGES OF:   </Text>


                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                                    1)  Your use of the services or any services or goods obtained through your use of the services.

                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                                    2)
                                    Your breach or violation of any of these terms

                                </Text>


                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                                    3)Poochie’s use of your user content or

                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                                    4)your violation of the rights of any third party, including contractors.

                                </Text>


                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginTop: 10, marginHorizontal: 20 }} >
                                    Disclaimer
                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                    To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our App and the use of this website. Nothing in this disclaimer will:

                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                                    1)  limit or exclude our or your liability for death or personal injury;
                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                                    2)
                                    limit or exclude our or your liability for fraud or fraudulent misrepresentation;

                                </Text>


                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                                    3)limit any of our or your liabilities in any way that is not permitted under applicable law; or

                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                                    4)exclude any of our or your liabilities that may not be excluded under applicable law.

                                </Text>




                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                    The limitations and prohibitions of liability set in this Section and elsewhere in this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer, including liabilities arising in contract, in tort and for breach of statutory duty.
                                </Text>


                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginTop: 10, marginHorizontal: 20 }} >
                                    Limitation of liability:
                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                    Poochie shall not be liable for indirect, incidental, special, exemplary, punitive, or consequential damages, including lost profits, lost data, personal injury, or property damage related to, in connection with, or otherwise resulting from any use of the Services, regardless of the negligence (either active, affirmative, sole, or concurrent) of Poochie, even if Poochie has been advised of the possibility of such damages.
                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginTop: 10, marginHorizontal: 20 }} >
                                    Poochie shall not be liable for any damages, liability or losses arising out of:
                                </Text>


                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                                    1)  Your use of or reliance on the Services or your inability to access or use the Services; or
                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >
                                    2)Any transaction or relationship between you and any third-party provider, even if Poochie has been advised of the possibility of such damages. Poochie shall not be liable for delay or failure in performance resulting from causes beyond Poochie’s reasonable control. You acknowledge that third-party providers providing transportation services requested through some request products may offer ridesharing or peer-to-peer transportation services and may not be professionally licensed or permitted.
                                </Text>


                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginTop: 10, marginHorizontal: 20 }} >
                                    The Services may be used by you to request and schedule pet transportation services with contractors and other third-party providers, but you agree that Poochie has no responsibility or liability to you related to any transportation, goods or logistics services provided to you by contractor or other third-party providers other than as expressly set forth in these terms.
                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                    The limitations and disclaimer in this section 5 do not purport to limit liability or alter your rights as a consumer that cannot be excluded under applicable law. Because some states or jurisdictions do not allow the exclusion of or the limitation of liability for consequential or incidental damages, in such states or jurisdictions, Poochie’s liability shall be limited to the extent permitted by law. This provision shall have no effect on the choice of law provision set forth below.  </Text>


                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginTop: 10, marginHorizontal: 20 }} >
                                    Mutual arbitration provision:
                                </Text>


                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                                    A. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Arbitration Governs All Disputes:

                                        <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                            User and Poochie mutually agree to this Mutual Arbitration Provision, which is governed by the Federal Arbitration Act (9 U.S.C. §§ 1-12) (“FAA”) and shall apply to any and all disputes arising out of or relating to this Agreement including without limitation harassment, discrimination or retaliation claims. The Parties expressly agree that this Agreement shall be governed by the FAA even in the event User and/or Poochie are otherwise exempted from the FAA. Any disputes in this regard shall be resolved exclusively by an arbitrator.  </Text>
                                    </Text>

                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                                    B. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Class Arbitration Prohibited and Waived:

                                        <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                            User and Poochie mutually agree that by entering into this Agreement to arbitrate, both waive their right to have any dispute or Claim brought, heard or arbitrated as, or to participate in, a class action, collective action and/or representative action—including but not limited to actions brought pursuant to the Private Attorney General Act (“PAGA”), California Labor Code section 2699 et seq., and any request seeking a public injunction—and an arbitrator shall not have any authority to hear or arbitrate any class, collective or representative action, or to award relief to anyone but the individual in arbitration (“Arbitration Class Action Waiver”).  </Text>

                                    </Text>

                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                                    C. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Initiation of Arbitration:

                                        <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                            If either User or Poochie wishes to initiate arbitration, the initiating Party must notify the other Party in writing via certified mail, return receipt requested, or hand delivery within the applicable statute of limitations period. This demand for arbitration must include (1) the name and address of the Party seeking arbitration, (2) a statement of the legal and factual basis of the claim, and (3) a description of the remedy sought and (4) the amount in controversy. Any demand for arbitration by User must be delivered to XOX Rides Inc, attention CEO 350 Salem st unit 201 Glendale Ca. 91203.
                                        </Text>
                                    </Text>

                                </Text>


                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                                    D. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Arbitration Tribunal and Rules:

                                        <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                            Any arbitration shall be submitted to the International Institute for Conflict Prevention & Resolution (CPR), and governed by the CPR Administered Arbitration Rules and, when applicable, the CPR Employment-Related Mass-Claims Protocol (together, the “CPR Rules”) of the International Institute for Conflict Prevention & Resolution, except as follows:
                                        </Text>

                                    </Text>

                                </Text>


                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                    The arbitration shall be heard by one arbitrator (the “Arbitrator”) selected in accordance with the CPR Rules. The Arbitrator shall be an attorney with experience in the law underlying the dispute.
                                </Text>



                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginTop: 10, marginHorizontal: 20 }} >

                                    The arbitration shall take place in Los Angeles County, Ca.
                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                                    a)
                                    The CPR fee schedule will apply. The cost of the arbitration shall be borne equally by the Parties, except that each Party shall bear its own costs of preparation, counsel and presentation. A prevailing Party shall be entitled to an award of reasonable attorney’s fees and costs made by the Arbitrator and as a part of the arbitration award.

                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                                    b)
                                    The Arbitrator may issue orders (including subpoenas to third parties) allowing the Parties to conduct discovery sufficient to allow each Party to prepare that Party’s claims and/or defenses, taking into consideration that arbitration is designed to be a speedy and efficient method for resolving disputes.

                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                                    c)
                                    The Arbitrator shall be able to award any and all relief of an equitable nature, including but not limited to such relief as a temporary restraining order, a temporary and/or a permanent injunction, and shall also be able to award damages, with or without an accounting and costs The Arbitrator may issue orders to protect the confidentiality of proprietary information, trade secrets, or other sensitive information.

                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                                    d)
                                    The Arbitrator may hear motions to dismiss and/or motions for summary judgment and will apply the standards of the Federal Rules of Civil Procedure governing such motions.
                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                                    e)
                                    The Arbitrator’s decision or award shall be in writing with findings of fact and conclusions of law.
                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                                    f)
                                    Subject to the discretion of the Arbitrator or agreement of the Parties, any person having a direct interest in the arbitration may attend the arbitration hearing. The Arbitrator may exclude any non-party from any part of the hearing.   </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                                    g)
                                    Either User or Poochie may apply to a court of competent jurisdiction for temporary or preliminary injunctive relief on the ground that without such relief the arbitration provided in this paragraph may be rendered ineffectual. A Party may apply to any Federal or State court in Los Angeles County California to compel arbitration. Judgment upon the Award shall be entered by the District Court of Los Angeles County California, which court shall be invested with the authority to grant and enforce any interim or permanent relief or injunction awarded, notwithstanding any statutory provision providing for venue in some other Court.</Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                                    h)
                                    Survival. This Mutual Arbitration Provision will survive any termination of your relationship with Poochie.

                                </Text>


                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginTop: 10, marginHorizontal: 20 }} >
                                    Litigation class action waiver:
                                </Text>



                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginTop: 10, marginHorizontal: 20 }} >
                                    To the extent allowed by applicable law, separate and apart from the Mutual Arbitration Provision the Parties agree that any proceeding to litigate in court any dispute arising out of or relating to this Agreement, will be conducted solely on an individual basis, and User and Poochie agree not to seek to have any controversy, claim or dispute heard as a class action, a representative action, a collective action, a private attorney-general action, or in any proceeding in which User or Poochie acts or proposes to act in a representative capacity (“Litigation Class Action Waiver”). The Parties further agree that no proceeding will be joined, consolidated, or combined with another proceeding, without the prior written consent of all parties to any such proceeding.   </Text>

                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginTop: 10, marginHorizontal: 20 }} >
                                    Modifications:
                                </Text>


                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                                    a. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Amendment:

                                        <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                            This Agreement is the complete agreement of the Parties concerning the subject matter, and supersedes any prior agreements concerning the subject matter; and, may not be amended or in any manner modified except by a written instrument signed by authorized representatives of each and all Parties, except with respect to Poochie’s right to amend in section 1.4.  </Text>


                                    </Text>

                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                                    b. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Exception:

                                        <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                            Poochie’s right to amend may be changed by Poochie according to section 1.4 and will bind the User once adopted without User signature upon User use of the Poochie Platform or Services following notice of the modification of the policy.
                                            10. GOVERNING LAW AND LEGAL RECOURSE
                                        </Text>
                                    </Text>
                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                                    C. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >California Law.

                                        <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                            This Agreement shall be construed and enforced in accordance with the federal law of the United States of America and the laws of the State of California, excluding its conflicts of law’s provisions.
                                        </Text>


                                    </Text>

                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                                    d. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Electronic Signatures:

                                        <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                            The provisions of The Ca. Uniform Electronic Transaction Act (UETA) Electronic Transactions Act and the Federal Electronic Signatures in Global and National Commerce Act (ESIGN) apply; and signatures and assent rendered under such acts shall be valid for all purposes.   </Text>
                                    </Text>

                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                                    e. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Costs:

                                        <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                            Should either Party seek legal recourse to have the other Party comply with and/or fulfill any of its legal obligations under this Agreement, the prevailing Party shall be entitled to recover all reasonable attorney fees, expert fees and all costs incurred in connection therewith.  </Text>
                                    </Text>
                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                                    f. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Courts:

                                        <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                            Actions seeking judicial relief may be brought only before federal or state courts having jurisdiction in Los Angeles County Court and each Party irrevocably submits to personal jurisdiction and waives any objection to venue in such courts. This provision does not negate mandatory arbitration.</Text>
                                    </Text>
                                </Text>



                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginTop: 10, marginHorizontal: 20 }} >
                                    Notice:
                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                    Poochie may give notice by means of a general notice on the Services, electronic mail to your email address in your Account, telephone or text message to any phone number provided in connection with your account, or by written communication sent by first class mail or pre-paid post to any address connected with your Account. Such notice shall be deemed to have been given upon the expiration of 48 hours after mailing or posting (if sent by first class mail or pre-paid post) or 12 hours after sending (if sent by email or telephone). You may give notice to Poochie, with such notice deemed given when received by Poochie, at any time by first class mail or pre-paid post to our registered agent for service of process, c/o XOX Rides Inc. 350 Salem st unit 201 Glendale Ca. 91203  </Text>






                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginHorizontal: 20 }} >
                                    Merger, severability and interpretation
                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                                    <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Four Corners.

                                        <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                            The making, execution and delivery of this Agreement by the Parties hereto have been induced by no representations, statements, warranties or agreements other than those herein expressed. This Agreement embodies the entire understanding of the Parties hereto and there are no further or other agreements or understandings, written or oral, that govern this transaction.</Text>
                                    </Text>
                                </Text>


                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                                    <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Assignment:

                                        <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                            You may not assign this Agreement without Poochie’s prior written approval. Poochie may assign this Agreement without your consent to: </Text>
                                    </Text>
                                </Text>


                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                                    1)
                                    a subsidiary or affiliate;

                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                                    2)
                                    an acquirer of Poochie’s equity, business or assets; or

                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                                    3)
                                    a successor by merger. Any purported assignment in violation of this section shall be void. No joint venture, partnership, employment, or agency relationship exists between you, Poochie or Contractors as a result of this Agreement or use of the Services.

                                </Text>


                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                                    <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Severability:

                                        <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                            If any provision (or portion thereof) of this Agreement shall be declared invalid or unlawful, the remaining provisions shall not be affected thereby, and this Agreement shall be construed as if such invalid or unlawful provision (or portion thereof) had never been contained therein.
                                        </Text>

                                    </Text>

                                </Text>


                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                                    <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >No Waiver:

                                        <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                            The failure of Poochie or User in any instance to insist upon a strict performance of the terms of this Agreement or to exercise any option herein, shall not be construed as a waiver or relinquishment of such term or option and such term or option shall continue in full force and effect. This provision shall not affect the Severability and Survivability section of the Arbitration Agreement of these Terms.  </Text>

                                    </Text>

                                </Text>


                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                                    <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Headlines:

                                        <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                            Headings used throughout this Agreement are for administrative convenience only and shall be disregarded for the purpose of constructing and enforcing this Agreement.
                                        </Text>
                                    </Text>
                                </Text>



                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginHorizontal: 20 }} >
                                    Hyperlinking to our App
                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                    The following organizations may link to our App without prior written approval:

                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                                    1)
                                    Government agencies;
                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                                    2)
                                    Search engines;  </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                                    3)News organizations;
                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                                    4)
                                    Online directory distributors may link to our App in the same manner as they hyperlink to the Websites of other listed businesses; and
                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                                    5)
                                    System wide Accredited Businesses except soliciting non-profit organizations, charity shopping malls, and charity fundraising groups which may not hyperlink to our Website.    </Text>


                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                    These organizations may link to our home page, to publications or to other App information so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement or approval of the linking party and its products and/or services; and (c) fits within the context of the linking party's site.
                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                    We may consider and approve other link requests from the following types of organizations: </Text>

                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                                    1)
                                    commonly-known consumer and/or business information sources;
                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                                    2)dot.com community sites;
                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                                    3)associations or other groups representing charities;


                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                                    4)online directory distributors;
                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                                    5)  internet portals;
                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                                    6)  accounting, law and consulting firms; and
                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                                    7)  educational institutions and trade associations.
                                </Text>


                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >

                                    We will approve link requests from these organizations if we decide that: (a) the link would not make us look unfavorably to ourselves or to our accredited businesses; (b) the organization does not have any negative records with us; (c) the benefit to us from the visibility of the hyperlink compensates the absence of Poochie; and (d) the link is in the context of general resource information.
                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >

                                    These organizations may link to our App so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement or approval of the linking party and its products or services; and (c) fits within the context of the linking party's site.  </Text>


                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                    If you are one of the organizations listed in paragraph 2 above and are interested in linking to our App, you must inform us by sending an email to Poochie. Please include your name, your organization name, contact information as well as the URL of your site, a list of any URLs from which you intend to link to our App, and a list of the URLs on our site to which you would like to link. Wait 2-3 weeks for a response.
                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                    Approved organizations may hyperlink to our App as follows:
                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                                    1)By use of our corporate name; or
                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                                    2)By use of the uniform resource locator being linked to; or
                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >

                                    3)By use of any other description of our App being linked to that makes sense within the context and format of content on the linking party's site.

                                </Text>


                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                    No use of Poochie's logo or other artwork will be allowed for linking absent a trademark license agreement.
                                </Text>


                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                    As long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.
                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                    The Poochie app stores and processes personal data that you have provided to us, to provide my Service. It’s your responsibility to keep your phone and access to the app secure. We therefore recommend that you do not jailbreak or root your phone, which is the process of removing software restrictions and limitations imposed by the official operating system of your device. It could make your phone vulnerable to malware/viruses/malicious programs, compromise your phone’s security features and it could mean that the Poochie app won’t work properly or at all.
                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                    The app does use third-party services that declare their Terms and Conditions.
                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                    Link to Terms and Conditions of third-party service providers used by the app
                                </Text>

                                <TouchableOpacity onPress={() => Linking.openURL("https://policies.google.com/privacy")} >
                                    <Text style={{ color: "blue", fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 40 }} >


                                        Google Play Services
                                    </Text>
                                </TouchableOpacity>

                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                    You should be aware that there are certain things that XOX Rides Inc will not take responsibility for. Certain functions of the app will require the app to have an active internet connection. The connection can be Wi-Fi or provided by your mobile network provider, but XOX Rides Inc cannot take responsibility for the app not working at full functionality if you don’t have access to Wi-Fi, and you don’t have any of your data allowance left.
                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                    If you’re using the app outside of an area with Wi-Fi, you should remember that the terms of the agreement with your mobile network provider will still apply. As a result, you may be charged by your mobile provider for the cost of data for the duration of the connection while accessing the app, or other third-party charges. In using the app, you’re accepting responsibility for any such charges, including roaming data charges if you use the app outside of your home territory (i.e. region or country) without turning off data roaming. If you are not the bill payer for the device on which you’re using the app, please be aware that we assume that you have received permission from the bill payer for using the app.
                                </Text>


                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                    Along the same lines, XOX Rides Inc cannot always take responsibility for the way you use the app i.e. You need to make sure that your device stays charged – if it runs out of battery and you can’t turn it on to avail the Service, XOX Rides Inc cannot accept responsibility.
                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                    With respect to XOX Rides Inc’s responsibility for your use of the app, when you’re using the app, it’s important to bear in mind that although we endeavor to ensure that it is updated and correct at all times, we do rely on third parties to provide information to us so that we can make it available to you. XOX Rides Inc accepts no liability for any loss, direct or indirect, you experience as a result of relying wholly on this functionality of the app.
                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                    At some point, we may wish to update the app. The app is currently available on Android & iOS – the requirements for the both systems(and for any additional systems we decide to extend the availability of the app to) may change, and you’ll need to download the updates if you want to keep using the app. XOX Rides Inc does not promise that it will always update the app so that it is relevant to you and/or works with the Android & iOS version that you have installed on your device. However, you promise to always accept updates to the application when offered to you, We may also wish to stop providing the app, and may terminate use of it at any time without giving notice of termination to you. Unless we tell you otherwise, upon any termination, (a) the rights and licenses granted to you in these terms will end; (b) you must stop using the app, and (if needed) delete it from your device.
                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginHorizontal: 20 }} >iFrames

                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                    Without prior approval and written permission, you may not create frames around our Web Pages that alter in any way the visual presentation or appearance of our App.
                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginHorizontal: 20 }} >Content Liability

                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                    We shall not be held responsible for any content that appears on your App. You agree to protect and defend us against all claims that are rising on our App. No link(s) should appear on any Website that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.
                                </Text>


                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginHorizontal: 20 }} >Reservation of Rights

                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                    We reserve the right to request that you remove all links or any particular link to our App. You approve to immediately remove all links to our App upon request. We also reserve the right to amend these terms and conditions and its linking policy at any time. By continuously linking to our App, you agree to be bound to and follow these linking terms and conditions.
                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginHorizontal: 20 }} >Removal of links from our App

                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                    If you find any link on our App that is offensive for any reason, you are free to contact and inform us any moment. We will consider requests to remove links but we are not obligated to or so or to respond to you directly.
                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                    We do not ensure that the information on this website is correct, we do not warrant its completeness or accuracy; nor do we promise to ensure that the website remains available or that the material on the website is kept up to date.
                                </Text>


                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginHorizontal: 20 }} >Changes to This Terms and Conditions

                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                                    We may update our Terms and Conditions from time to time. Thus, you are advised to review this page periodically for any changes. We will notify you of any changes by posting the new Terms and Conditions on this page.
                                </Text>

                                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginTop: 10, marginHorizontal: 20 }} >
                                    Contact Us
                                </Text>
                                <Text style={{ color: Colors.black, fontSize: 12, fontFamily: "Poppins-Medium", marginHorizontal: 20, }} >

                                    If you have any questions or concerns about your privacy or anything in this policy, including if you need to access this policy in an alternative format, we encourage you to contact us at

                                    <Text style={{ color: "blue", fontFamily: "Poppins-Medium", fontSize: 12 }} > 818-213-3884 </Text>

                                </Text>

                            </ScrollView>
                            <View style={{ flexDirection: "row", justifyContent: "space-around", width: "100%", marginHorizontal: 20 }} >
                                <CustomButton
                                    onPress={handleDeclinePress}
                                    text={loading ? <ActivityIndicator color="white" size="small" /> : 'Decline'}
                                    styleContainer={{ width: '45%', marginTop: 10 }}
                                    linearStyle={{ padding: 1, borderRadius: 5 }}
                                />

                                <CustomButton
                                    onPress={handleAgreePress}
                                    text={loading ? <ActivityIndicator color="white" size="small" /> : 'Agree'}
                                    styleContainer={{ width: '45%', marginTop: 10 }}
                                    linearStyle={{ padding: 1, borderRadius: 5 }}
                                />

                            </View>
                        </View>
                    </View>
                </Modal >
            </View >
        );
    }, [modalVisible, loading]);


    return (
        <View style={{ flex: 1 }} >

            {modalVisible && ShowLocationModal()}

        </View>
    )
}

export default TermsAndConditions

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        // margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        paddingVertical: 10,
        width: '90%',
        height: "80%",
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});