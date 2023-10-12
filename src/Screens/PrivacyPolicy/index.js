import React from "react"
import { View, Text, ScrollView, Linking, TouchableOpacity } from "react-native"
import Colors from "../../Constant/Color"
import CustomHeader from "../../Components/CustomHeader"
import { Link } from "@react-navigation/native"

function PrivacyPolicy({ navigation }) {
    return (
        <View style={{ flex: 1, backgroundColor: Colors.white }} >


            <View style={{ marginTop: 10 }} >
                <CustomHeader

                    text={"Privacy Policy"}
                    iconname={"arrow-back-outline"}
                    color={Colors.black}
                    onPress={() => navigation.goBack()}


                />

            </View>
            <ScrollView style={{marginBottom:20}}  >
                {/* <Text style={{ fontSize: 18, fontFamily: "Poppins-Medium", color: Colors.black, marginHorizontal: 20, marginTop: 10,borderWidth:2 }} > */}
                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginTop: 10, marginHorizontal: 20 }} >
                    Introduction
                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                    Welcome to the "Poochie" Pet Transportation Services App! Xox Rides Inc owns all the rights to the "Poochie" app. This SERVICE is provided by XOX Rides Inc. and is intended for use as is. At Poochie, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you use our app and the services we provide.
                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                    At Poochie, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Poochie and how we use it.
                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                    This page is used to inform visitors regarding my policies with the collection, use, and disclosure of Personal Information if anyone decided to use my Service. At XOX Rides Inc. and/or dba Poochie App and Poochie, our mission is to make people's lives easier through pet transportation services and provide a platform to help you transport your pets from point A to point B. To do this, we need to collect, use and disclose some of your personal information.
                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                    If you choose to use my Service, then you agree to the collection and use of information in relation to this policy. The Personal Information that We collect is used for providing and improving the Service. We will not use or share your information with anyone except as described in this Privacy Policy.
                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                    The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, which are accessible at Poochie unless otherwise defined in this Privacy Policy.
                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                    If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
                </Text>

                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginTop: 10, marginHorizontal: 20 }} >
                    Scope of this policy
                </Text>


                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >

                    This Policy applies to all Poochie users, including customers (pet owners), drivers (including driver applicants), third-party companies, and all Poochie platforms and services, including our apps, websites, features and other services (collectively, " Poochie Platform"). Please remember that your use of the Poochie Platform is also subject to our Terms of Service.

                </Text>

                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginTop: 10, marginHorizontal: 20 }} >

                    Information Collection and Use
                </Text>


                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >

                    For a better experience, while using our Service, We may require you to provide us with certain personally identifiable information. The information that We requests will be retained on your device and is not collected by me in any way.

                </Text>

                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                    A. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Personal Information:

                        <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >

                            We may collect personal information from you, such as your name, email address, date of birth, contact information, payment details, and pet-related information when you register for our services or use the app.
                            You may choose to share additional info with us, like your photo or saved addresses (e.g., home or groomer).
                        </Text>


                    </Text>

                </Text>


                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                    B. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Location Information:

                        <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                            We may collect your device's location information if you enable location services on the app. This information is used for providing pet transportation services and for the safety and security of your pets and device permissions as well as whether you are using the platform as a Customer or Driver.

                        </Text>


                    </Text>

                </Text>


                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                    C. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Driver Information:

                        <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                            When you apply to be a driver, we collect the information you provide in your application, including your name, email address, phone number, date of birth, profile photo, home address, government identification number (such as Social Security number) and the driver’s ID number, license information, vehicle information and car insurance information. We collect the payment information you provide to us, including your bank routing number and tax information. At some point after you become a driver, we may ask you to provide additional information, including information to confirm your identity.

                        </Text>


                    </Text>

                </Text>

                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                    D. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Customer:

                        <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >

                            When you open and use the Poochie app, we collect the precise location of your device. Poochie Analog does not collect your location data.

                        </Text>


                    </Text>

                </Text>

                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                    E. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Drivers:

                        <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >

                            We collect your device's precise location when you open and use the App, including when the App is running in the background while in driver mode. Poochie Analog does not collect your location data.

                        </Text>


                    </Text>

                </Text>

                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                    F. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Usage Information:

                        <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >

                            We collect information about how you interact with our app, including your interactions, preferences, and settings including pet shipping information such as date, time, destination, distance, route, payment and whether you use a promotional or referral code.

                        </Text>


                    </Text>

                </Text>

                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                    G. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Ratings and Feedback:

                        <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                            When you rate and provide feedback to a customer or driver, we collect all the information you provide in the feedback. communicate. If you contact us or we contact you, we will collect any information you provide, including the content of any messages or attachments you send us.
                        </Text>


                    </Text>

                </Text>


                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginTop: 10, marginHorizontal: 20 }} >
                    Communications Between Customers and Drivers:

                </Text>


                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                    We work with third parties to facilitate phone calls and text messages between customers and drivers without revealing one party's actual phone number to the other party. However, when we use third parties to provide communications services, we collect information about those communications, including participants' phone numbers, dates and times, and the content of text messages. Poochie Analog does not use third parties to facilitate communications. Poochie Customer Service facilitates simulated Poochie communication between customers and drivers.
                </Text>


                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginTop: 10, marginHorizontal: 20 }} >

                    How We Use Your Information:
                </Text>


                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >

                    We do not sell your personal information. We may need to share your personal information with other users, third parties, and service providers.

                </Text>

                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                    A. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Providing Services:

                        <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                            We use your information to provide pet transportation services, including matching you with drivers and facilitating the transportation of your pets.
                        </Text>
                    </Text>

                </Text>


                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                    B. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Communication:

                        <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                            We may use your contact information to send you notifications, updates, and important information about the app and services.

                        </Text>


                    </Text>

                </Text>


                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                    C. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Improvement:

                        <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                            We use collected data to improve our app and services, analyze user behavior, and enhance user experience.
                        </Text>


                    </Text>

                </Text>

                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                    We use your personal information to provide an intuitive, useful, efficient and beneficial experience on our Platform. For this purpose, we use your personal data to:

                </Text>



                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >
                    1) Verify your identity and maintain your account, settings and preferences.
                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >
                    2) Connect with your pet’s rides and track their progress;

                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >
                    3) Calculate prices and process payments;
                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >

                    4) Allow customers and drivers to communicate about their pets’ trips and share their location with others.
                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >

                    5) Communicate with you about your pet’s rides and experiences;
                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                    6) Collect feedback about your experience;
                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >

                    7) enable additional services and programs with third parties; and
                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >

                    8) Carry out promotional activities.
                </Text>

                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                    Maintain the security of the Poochie Platform and its users. Our platform is designed to provide a safe experience for you and your pet, whether on the go, in our app or through Poochie Analog. For this purpose, we use your personal data to:

                </Text>


                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >
                    1)
                    Verify the identity of customers and drivers;
                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >
                    2)
                    Ensure that drivers and their vehicles meet safety requirements.

                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >
                    3)
                    Investigate and resolve incidents, accidents and insurance claims;
                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >

                    4)
                    Promote safe driving behavior and avoid unsafe activities;
                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >

                    5)
                    Detect and prevent fraud; and
                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                    6)
                    Block and remove unsafe or fraudulent customers and drivers from Poochie.
                </Text>

                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                    Build and maintain Poochie communities. Poochie is committed to being an active part of the pet services community. We use your personal information to communicate with you about events and promotions. Provide customer support. We strive to give you the best experience possible, including providing support when you need it. For this purpose, we use your personal data to:
                </Text>

                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                    1)
                    Investigate and assist you with any questions or issues you have about Poochie
                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                    2)

                    To provide you with support or response. Improvements to the Poochie platform.
                </Text>


                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                    We are constantly working to improve your experience and provide you with new and useful features. For this purpose, we use your personal data to:
                </Text>


                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                    1)
                    Conduct research, testing and analysis;
                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                    2)

                    Develop new products, features, partnerships and services;
                </Text>

                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                    3)
                    Prevent, detect and resolve software or hardware errors and problems; and
                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                    4)
                    Monitor and improve our operations and processes, including security practices, algorithms and other modeling.

                </Text>


                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                    Respond to legal processes and requests. From time to time, laws, government agencies or other regulatory bodies impose requirements and obligations on the services we wish to provide. In such cases, we may use your personal information to respond to these requests or obligations.
                </Text>


                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginTop: 10, marginHorizontal: 20 }} >

                    Sharing Between Poochie Users:

                </Text>


                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                    A. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Customers and Drivers:

                        <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                            Customer Information Shared with Drivers, When we receive a pet ride request, we share with the driver the scheduled pickup time and date, pickup location, destination, customer name, pet name and information, ratings, and customer demographics (e.g. Approximate number of trips) and number of years as a customer) and the information the customer includes in their customer profile. We also communicate customer ratings and feedback to drivers on a weekly basis. (When we share reviews and feedback with drivers, we remove the customer identification associated with the reviews and feedback, but drivers may be able to identify the customer who provided the review or feedback.)
                        </Text>
                    </Text>

                </Text>


                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                    B. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Driver information shared with Customer:

                        <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                            Approximately 30 minutes before booking a ride, we share the driver's name, profile photo, rating, real-time location, as well as the vehicle's make, model, color, and license plate, along with other information from the driver directory and profile, with the customer. For example: B. Information and driver statistics that the driver wants to add (e.g., approximate number of trips and number of years as a driver). Sharing of customer and driver information in Poochie Analog may be restricted. Although we help customers and drivers communicate with each other to arrange pet pickups, we do not share your actual phone number or other contact information with other users. If you report a lost or found item to us, we will attempt to connect you with the relevant customer or driver, including sharing actual contact information with your consent.

                        </Text>


                    </Text>

                </Text>


                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                    C. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Referral Programs:

                        <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                            If referral program is available, When you refer someone to the Poochie Platform, we let them know that you initiated the referral. If another user refers to you, we may share information about your use of the Poochie Platform with that user. For example, referral sources may receive bonuses when you join the Poochie platform.
                        </Text>


                    </Text>

                </Text>


                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginTop: 10, marginHorizontal: 20 }} >


                    Sharing With Third-Party Service Providers for Business Purposes:

                </Text>

                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                    Depending on whether you are a customer or a driver, Poochie may share the following categories of your personal information for business purposes in order to provide you with the various features and services of the Poochie Platform:
                </Text>


                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                    1)  Personally identifiable information, such as your name, address, email address, date of birth, government identification number (such as Social Security number), pet information, driver’s license information, vehicle information, and vehicle insurance information;

                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                    2)
                    Financial information, such as bank routing numbers, tax information and any other payment information you provide to us;

                </Text>

                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                    3)  Itinerary information, driver/customer statistics and feedback, driver/customer transaction history and other business information;

                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                    4)  Internet or other electronic network activity information, such as: B. Your IP address, browser type, operating system version, network operator and/or manufacturer, device identifiers and mobile advertising identifiers; and


                </Text>

                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                    5) Location data.


                </Text>


                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginTop: 10, marginHorizontal: 20 }} >
                    Disclosure of Your Information
                </Text>


                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginTop: 10, marginHorizontal: 20 }} >
                    We may disclose your information in the following situations:
                </Text>


                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                    A. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Service Providers:

                        <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                            We may share your information with third-party service providers who assist us in providing and improving our services.
                        </Text>


                    </Text>

                </Text>

                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginTop: 10, marginHorizontal: 20 }} >

                    We  may employ third-party companies and individuals due to the following reasons:
                </Text>

                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                    1)
                    To facilitate our Service;

                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                    2)
                    To provide the Service on our behalf;

                </Text>

                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                    3)
                    To perform Service-related services; or

                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                    4)
                    To assist us in analyzing how our Service is used.
                </Text>

                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginTop: 10, marginHorizontal: 20 }} >
                    We want to inform users of this Service that these third parties have access to their Personal Information. The reason is to perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose.
                </Text>

                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                    B. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Legal Compliance:

                        <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                            We may disclose your information to comply with legal obligations, such as responding to court orders or government requests.
                        </Text>


                    </Text>

                </Text>

                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                    C. <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Protection of Rights:

                        <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                            We may disclose your information to protect our rights, privacy, safety, or property and that of our users.

                        </Text>


                    </Text>

                </Text>

                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                    We share these categories of personal information with our service providers for the following business purposes:
                </Text>

                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                    1)
                    Maintain and maintain your Poochie Account;

                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                    2)
                    Process or perform travel;

                </Text>

                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                    3)
                    Provide customer service;

                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                    4)
                    Process customer transactions;
                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                    5)
                    Process driver applications and payments;
                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                    6)
                    Detect and prevent fraud;
                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                    7)
                    Process insurance claims;
                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                    8)
                    Offer loyalty and promotional programs to drivers;
                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                    9)
                    Provide marketing and advertising services to Poochie;
                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                    10)
                    Provide financing;
                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                    11)
                    Provide emergency services as requested;
                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                    12)
                    Provide analytical services to Poochie; and
                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                    13)
                    Conduct internal research to develop the Poochie platform
                </Text>


                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginTop: 10, marginHorizontal: 20 }} >

                    Information We Collect from Third Partiesn
                </Text>


                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                    <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Third Party Services:

                        <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                            Third-party services provide us with the information we need for core aspects of the Poochie Platform, as well as additional services, programs, loyalty benefits and promotions that may enhance your Poochie experience. These third-party services include background check providers, insurance partners, financial services providers, marketing providers and other companies. We receive the following information about you from these third-party services:

                        </Text>




                    </Text>



                </Text>

                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                    1)

                    Information that makes the Poochie platform safer, such as B. Driver background check information;
                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                    2)
                    Information about your participation in third-party programs that provide insurance coverage and financial instruments, such as: B. Insurance, payment, transaction and fraud detection information;
                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                    3)Information about the operation of loyalty and advertising programs, such as B. Information about your use of such programs; and

                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                    4)
                    Information about you provided by certain services, such as B. Demographic information and market segment information.
                </Text>


                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                    <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Pet Business Services:

                        <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                            Sometimes, pet companies or animal organizations can order dog rides for your pet. If a pet company orders a ride for your pet through our Service, they will provide us with your contact information and the pick-up and drop-off location for your ride. Referral Program. If someone recommends you to Poochie, we collect information about you from that referral, including your name and contact information.

                        </Text>




                    </Text>



                </Text>

                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold", marginTop: 10, marginHorizontal: 40 }} >

                    <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Other Users and Sources:

                        <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >

                            Other users or public or third party sources (such as law enforcement agencies, insurance companies, the media or pedestrians) may provide information about you to us, for example as part of an investigation of an incident or to assist you.

                        </Text>




                    </Text>



                </Text>

                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginTop: 10, marginHorizontal: 20 }} >

                    For Legal Reasons and to Protect the Poochie Platform

                </Text>


                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >

                    We may share your personal information as required by law or for the purposes for which we determine that sharing your personal information is reasonably necessary or appropriate:

                </Text>

                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                    1)
                    To comply with any applicable federal, state or local law or regulation, civil, criminal or governmental investigation, investigation or proceeding, or enforceable governmental request;

                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                    2)
                    Respond to legal process (such as a search warrant, subpoena, summons or court order);
                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                    3) Enforce our Terms of Use;


                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                    4) Cooperate with law enforcement agencies in connection with any conduct or activity that we reasonably and in good faith believe may violate federal, state, or local law; or

                </Text>

                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                    5)  To exercise or defend legal rights to protect our rights, property, interests or safety, or the rights, property, interests or safety of you, third parties or the public, to the extent required or permitted by law.

                </Text>


                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginTop: 10, marginHorizontal: 20 }} >

                    In Connection with Sale or Merger

                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >

                    We may use your personal data as part of negotiations or in connection with a change of corporate control, such as: B. A reorganization, merger or sale of our assets.

                </Text>

                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginTop: 10, marginHorizontal: 20 }} >


                    Upon Your Further Direction

                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >

                    With your permission or upon your direction, we may disclose your personal information to interact with a third party or for other purposes.

                </Text>

                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginTop: 10, marginHorizontal: 20 }} >


                    How We Store and Protect Your Information

                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >

                    We will retain your data for as long as necessary to provide the Poochie Platform to you and our other users. This means that we will retain your profile information for as long as you maintain your account. We retain transaction data such as pet rides and payments for at least seven years to ensure we can perform legitimate business functions, such as settling tax obligations. If you request to cancel your account, we will delete your information as described in the "Cancel Your Account" section below. We take reasonable and appropriate measures to protect your personal information. However, no security measures can be 100% effective and we cannot guarantee the security of your data, including from unauthorized interference or actions of third parties.

                </Text>


                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginTop: 10, marginHorizontal: 20 }} >


                    Your Rights And Choices Regarding Your Data

                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >


                    Poochie provides ways for you to access and delete your personal information as well as exercise other data rights that give you certain control over your personal information.

                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >


                    You have certain rights regarding your information, including the right to access, correct, or delete your data. You can also opt-out of receiving promotional communications from us.
                    The app does use third-party services that may collect information used to identify you.

                </Text>

                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >


                    Link to the privacy policy of third-party service providers used by the app

                </Text>
                <TouchableOpacity onPress={() => Linking.openURL("https://policies.google.com/privacy")} >
                    <Text style={{ color: "blue", fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >


                        Google Play Services
                    </Text>
                </TouchableOpacity>



                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginTop: 10, marginHorizontal: 20 }} >
                    All Users


                </Text>


                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Email Subscription:

                    <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                        You may unsubscribe from our commercial or promotional emails at any time by clicking "unsubscribe" in these messages. We will continue to send you transactional and relationship emails related to your use of the Poochie Platform. Please note that opting out of receiving text messages may affect your use of the Poochie Platform (e.g., receiving notification that your pet's ride has arrived or that your pet has arrived at its destination). Poochie Analog uses text messaging to communicate with customers and drivers.

                    </Text>


                </Text>
                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Push Notifications:

                    <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                        You can opt out of receiving push notifications through your device settings. Please note that opting out of receiving push notifications may affect your use of the Poochie Platform (for example, if you receive a notification that your pet's ride has arrived or that your pet has arrived at its destination). Poochie Analog does not use push notifications.

                    </Text>


                </Text>
                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Location information:

                    <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                        You can prevent your device from sharing location information through your device's system settings. However, if you do so, it may affect Poohies' ability to provide you with the full range of features and services. Poochie Analog does not collect location information.

                    </Text>


                </Text>
                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >Cookie Tracking:

                    <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                        You can modify your cookie settings on your browser, but if you delete or choose not to accept our cookies, you may be missing out on certain features of the Poochie Platform.
                    </Text>
                </Text>


                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >
                    Security:

                    <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                        We take reasonable measures to protect your information from unauthorized access, disclosure, or alteration. However, no method of data transmission or storage is completely secure, and we cannot guarantee its absolute security.
                    </Text>
                </Text>
                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} >
                    Log File

                    <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                        Poochie follows a standard procedure of using log files. These files log visitors when they use the app. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the app, tracking users' movement on the app, and gathering demographic information.
                    </Text>
                </Text>
                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-SemiBold" }} > Cookies


                    <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                        Cookies are files with a small amount of data that are commonly used as anonymous unique identifiers. These are sent to your browser from the websites that you visit and are stored on your device's internal memory.
                    </Text>
                </Text>

                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                    This Service does not use these “cookies” explicitly. However, the app may use third-party code and libraries that use “cookies” to collect information and improve their services. You have the option to either accept or refuse these cookies and know when a cookie is being sent to your device. If you choose to refuse our cookies, you may not be able to use some portions of this Service.
                </Text>

                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                    We may use "cookies", tracking pixels, data analysis tools such as Google Analytics, SDKs and other third-party technologies to collect information to understand how you browse the Poochie platform and interact with Poochie ads to enhance your Poochie experience and allow you to Be safer, learn what content is popular, improve your site experience, show you better ads on other sites and remember your preferences. Cookies are small text files placed on your device by a web server; they store basic information and help websites and applications recognize your browser. We may use session cookies and persistent cookies. The session cookie disappears when you close your browser. Persistent cookies remain after closing the browser You can access it every time you use the Poochie Platform. You should consult your web browser to change your cookie settings. If you delete or choose not to accept cookies from us, you may miss out on certain features of the Poochie Platform. This section does not apply to Poochie Analog.
                </Text>



                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginTop: 10, marginHorizontal: 20 }} >
                    Our Advertising Partners
                </Text>

                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >
                    Some of the advertisers in our app may use cookies and web beacons. Our advertising partners are listed below. Each of our advertising partners has their own Privacy Policy for their policies on user data. For easier access, we hyperlinked to their Privacy Policies below.
                </Text>

                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20, marginLeft: 40 }} >


                    1) Google <TouchableOpacity onPress={() => Linking.openURL("https://policies.google.com/technologies/ads")} >
                        <Text style={{ color: "blue" }} >
                            https://policies.google.com/technologies/ads
                        </Text>
                    </TouchableOpacity>

                </Text>


                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginTop: 10, marginHorizontal: 20 }} >


                    Privacy Policies:

                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >

                    You may consult this list to find the Privacy Policy for each of the advertising partners of Poochie.

                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >

                    Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Beacons that are used in their respective advertisements and links that appear on Poochie. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on this app or other apps or websites.

                </Text>

                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >

                    Note that Poochie has no access to or control over these cookies that are used by third-party advertisers.

                </Text>


                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginTop: 10, marginHorizontal: 20 }} >



                    Third Party Privacy Policies
                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >

                    Poochie's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.

                </Text>

                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginTop: 10, marginHorizontal: 20 }} >


                    Online Privacy Policy Only:

                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >

                    This Privacy Policy applies only to our online activities and is valid for visitors to our App with regards to the information that they shared and/or collected in Poochie. This policy is not applicable to any information collected offline or via channels other than this app. Our Privacy Policy was created with the help of the App Privacy Policy Generator from App-Privacy-Policy.com

                </Text>

                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginTop: 10, marginHorizontal: 20 }} >

                    Links to Other Sites

                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >

                    This Service may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by me. Therefore, I strongly advise you to review the Privacy Policy of these websites. I have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.


                </Text>

                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginTop: 10, marginHorizontal: 20 }} >

                    Children’s Privacy

                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >

                    Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.


                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >

                    So, Poochie does not knowingly collect any Personal Identifiable Information from children under the age of 18. If you think that your child provided this kind of information on our App, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.


                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >

                    So, Poochie does not knowingly collect any Personal Identifiable Information from children under the age of 18. If you think that your child provided this kind of information on our App, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.

                </Text>


                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginTop: 10, marginHorizontal: 20 }} >


                    Consent

                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >

                    By using our app, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.


                </Text>


                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginTop: 10, marginHorizontal: 20 }} >


                    Changes to This Privacy Policy

                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >

                    As the Poochie Platform changes and data protection laws develop, we may update this policy from time to time. If we update, we will do so online, and if we make any material changes, we will notify you via the Poochie Platform or other communication methods (such as email). If you use the Poochie Application, you agree to the most current terms of this Policy.


                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >

                    Thus, you are advised to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page.


                </Text>

                <Text style={{ color: Colors.black, fontSize: 18, fontFamily: "Poppins-Bold", marginTop: 10, marginHorizontal: 20 }} >



                    Contact Us
                </Text>
                <Text style={{ color: Colors.black, fontSize: 16, fontFamily: "Poppins-Medium", marginHorizontal: 20 }} >

                    If you have any questions or concerns about your privacy or anything in this policy, including if you need to access this policy in an alternative format, we encourage you to contact us at <TouchableOpacity onPress={() => Linking.openURL("tel:818-213-3884")} >
                        <Text style={{ color: "blue",fontFamily:"Poppins-Bold" }} > 818-213-3884 </Text>
                    </TouchableOpacity>


                </Text>



            </ScrollView>
        </View>
    )
}

export default PrivacyPolicy