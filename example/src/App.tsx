import {
  NavigationAction,
  NavigationContainer,
  NavigationState,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { View } from 'react-native';
import {
  Container,
  useDarkTheme,
  useLightTheme,
  usePresetPalette,
} from 'react-native-chat-room';

import { AppDev } from './__dev__/AppDev';
import type { RootParamsList, RootParamsName } from './routes';
import {
  ChatroomListScreen,
  ChatroomScreen,
  LoginListScreen,
  LoginScreen,
  ReportScreen,
  TopMenuScreen,
} from './screens';

const env = require('./env');

const Root = createNativeStackNavigator<RootParamsList>();

export function App() {
  const [initialRouteName] = React.useState('TopMenu' as RootParamsName);
  const palette = usePresetPalette();
  const dark = useDarkTheme(palette);
  const light = useLightTheme(palette);

  const formatNavigationState = (
    state: NavigationState | undefined,
    result: string[] & string[][]
  ) => {
    if (state) {
      const ret: string[] & string[][] = [];
      for (const route of state.routes) {
        ret.push(route.name);
        if (route.state) {
          formatNavigationState(
            route.state as NavigationState | undefined,
            ret
          );
        }
      }
      result.push(ret);
    }
  };

  return (
    <React.StrictMode>
      <Container
        appKey={env.appKey}
        isDevMode={env.isDevMode}
        palette={palette}
        theme={light ? light : dark}
      >
        <NavigationContainer
          onStateChange={(state: NavigationState | undefined) => {
            const rr: string[] & string[][] = [];
            formatNavigationState(state, rr);
            console.log(
              'dev:onStateChange:',
              JSON.stringify(rr, undefined, '  ')
            );
            // console.log('onStateChange:o:', JSON.stringify(state));
          }}
          onUnhandledAction={(action: NavigationAction) => {
            console.log('dev:onUnhandledAction:', action);
          }}
          onReady={() => {
            console.log('dev:onReady:');
          }}
          fallback={
            <View style={{ height: 100, width: 100, backgroundColor: 'red' }} />
          }
        >
          <Root.Navigator initialRouteName={initialRouteName}>
            <Root.Screen
              name={'TopMenu'}
              options={{
                headerShown: true,
              }}
              component={TopMenuScreen}
            />
            <Root.Screen
              name={'Login'}
              options={{
                headerShown: true,
              }}
              component={LoginScreen}
            />
            <Root.Screen
              name={'LoginList'}
              options={{
                headerShown: true,
              }}
              component={LoginListScreen}
            />
            <Root.Screen
              name={'ChatroomList'}
              options={{
                headerShown: true,
              }}
              component={ChatroomListScreen}
            />
            <Root.Screen
              name={'TestChatroom'}
              options={{
                headerShown: true,
              }}
              component={ChatroomScreen}
            />
            <Root.Screen
              name={'TestReport'}
              options={{
                headerShown: true,
              }}
              component={ReportScreen}
            />
          </Root.Navigator>
        </NavigationContainer>
      </Container>
    </React.StrictMode>
  );
}

let AppWrapper = App;
try {
  const isDev = require('./env').test;
  if (isDev === true) {
    AppWrapper = AppDev;
  }
} catch (error) {
  console.warn(error);
}

export default AppWrapper;
