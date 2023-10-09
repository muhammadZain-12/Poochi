/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
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
import IdleTimerManager from 'react-native-idle-timer';
import NotificationState from './src/Context/NotificationContext/state';
import ChooseLocationState from './src/Context/pickupanddropoffContext/state';

function App() {
  useEffect(() => {
    // Disable screen timeout when the component mounts
    IdleTimerManager.setIdleTimerDisabled(true);

    // Re-enable screen timeout when the component unmounts
    return () => {
      IdleTimerManager.setIdleTimerDisabled(false);
    };
  }, []);

  return (
    <StripeProvider
      publishableKey={
        // 'pk_live_51NV3dXCcj0GzAQ3bNw68XeWwEbjWiZ6rLVXhwrMMbsSICdE90ujuXCnHxJ5wnbVVSKmOGnciPUERSre7j99rMwJV00UWbIphFy'
        'pk_live_51NV3dXCcj0GzAQ3bNw68XeWwEbjWiZ6rLVXhwrMMbsSICdE90ujuXCnHxJ5wnbVVSKmOGnciPUERSre7j99rMwJV00UWbIphFy'
      }>
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <SelectedPetState>
          <NotificationState>
            <BookingState>
              <ChooseLocationState>
                <CardDetailsState>
                  <LoginState>
                    <LocationState>
                      <Navigation />
                    </LocationState>
                  </LoginState>
                </CardDetailsState>
              </ChooseLocationState>
            </BookingState>
          </NotificationState>
        </SelectedPetState>
      </View>
    </StripeProvider>
  );
}

export default App;
