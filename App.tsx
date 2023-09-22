/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import Navigation from './src/Screens/Navigation';
import LoginState from './src/Context/loginContext/state';
import LocationState from './src/Context/locationContext/state';
import SelectedPetState from './src/Context/SelectedPetContext/state';
import {StripeProvider} from '@stripe/stripe-react-native';
import CardDetailsState from './src/Context/CardDetailsContext/state';
import BookingState from './src/Context/bookingContext/state';

function App() {
  return (
    <StripeProvider
      publishableKey={
        'pk_test_51Ns5qjEIzbD1XxPEyV0X99pxj7tfmuq409BG0so0rlEOBy8YwGsVUhBrAt3vBiukTHt9lGwI3qBmoKA1XL3hNsrt007AxKXaFm'
      }>
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <SelectedPetState>
          <BookingState>
            <CardDetailsState>
              <LoginState>
                <LocationState>
                  <Navigation />
                </LocationState>
              </LoginState>
            </CardDetailsState>
          </BookingState>
        </SelectedPetState>
      </View>
    </StripeProvider>
  );
}

export default App;
