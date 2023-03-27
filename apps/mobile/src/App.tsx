import 'expo-dev-client';

import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Suspense, useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RelayEnvironmentProvider } from 'react-relay';

import { MobileErrorReportingProvider } from '~/contexts/MobileErrorReportingProvider';
import { createRelayEnvironment } from '~/contexts/relay/RelayProvider';
import { MainTabNavigator } from '~/navigation/MainTabNavigator/MainTabNavigator';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [relayEnvironment] = useState(() => createRelayEnvironment());

  const [fontsLoaded] = useFonts({
    GTAlpinaStandardLight: require('~/shared/fonts/GT-Alpina-Standard-Light.ttf'),
    GTAlpinaStandardLightItalic: require('~/shared/fonts/GT-Alpina-Standard-Light-Italic.ttf'),

    GTAlpinaMedium: require('~/shared/fonts/GT-Alpina-Condensed-Medium.ttf'),
    GTAlpinaMediumItalic: require('~/shared/fonts/GT-Alpina-Condensed-Medium-Italic.ttf'),

    GTAlpinaLight: require('~/shared/fonts/GT-Alpina-Condensed-Light.ttf'),
    GTAlpinaLightItalic: require('~/shared/fonts/GT-Alpina-Condensed-Light-Italic.ttf'),

    GTAlpinaBold: require('~/shared/fonts/GT-Alpina-Condensed-Bold-Italic.ttf'),
    GTAlpinaBoldItalic: require('~/shared/fonts/GT-Alpina-Condensed-Bold-Italic.ttf'),

    ABCDiatypeMono: require('~/shared/fonts/ABCDiatypeMono-Medium.ttf'),
    ABCDiatypeRegular: require('~/shared/fonts/ABCDiatype-Regular.ttf'),
    ABCDiatypeMedium: require('~/shared/fonts/ABCDiatype-Medium.ttf'),
    ABCDiatypeBold: require('~/shared/fonts/ABCDiatype-Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <RelayEnvironmentProvider environment={relayEnvironment}>
      <Suspense fallback={null}>
        <MobileErrorReportingProvider>
          <SafeAreaProvider>
            <NavigationContainer>
              <MainTabNavigator />
            </NavigationContainer>
          </SafeAreaProvider>
        </MobileErrorReportingProvider>
      </Suspense>
    </RelayEnvironmentProvider>
  );
}