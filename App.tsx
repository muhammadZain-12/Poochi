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

function App() {
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <SelectedPetState>
        <LoginState>
          <LocationState>
            <Navigation />
          </LocationState>
        </LoginState>
      </SelectedPetState>
    </View>
  );
}

export default App;
