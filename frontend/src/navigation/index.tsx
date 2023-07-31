/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import * as React from 'react';
import { useColorScheme as useDefaultColorScheme } from 'react-native';
import { useColorScheme as useColorScheme } from 'react-native-appearance';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer, DefaultTheme, DarkTheme, NavigationContainerRef } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';

import useResizeContext, { ResizeContextProvider } from '../hooks/useResizeContext';
import useInvitee, { replaceInviteeState } from '../hooks/useInvitee';
import { modal } from '../screens';
import LinkingConfiguration from './LinkingConfiguration';
import MainNavigator from './MainNavigator';
import './init';


enableScreens();

const navigationRef = React.createRef<NavigationContainerRef>();

export function navigate(name:string, params?:any) {
  if (params)
    navigationRef.current?.navigate(name, params);
  navigationRef.current?.navigate(name);
}

let electronVersion:string|undefined;
try{
  electronVersion = process?.versions?.['electron']
}
catch(e){
  electronVersion = undefined
}

export default function Navigation() {
  const defaultColorScheme = useDefaultColorScheme()
  const userColorScheme = useColorScheme()
  const colorScheme = userColorScheme =='no-preference'?defaultColorScheme:userColorScheme
  return <NavigationContainer
    ref={navigationRef}
    documentTitle={{formatter: (options, route) => {return `TOKKI TOK`}}}
    linking={electronVersion?undefined:LinkingConfiguration}
    theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <ResizeContextProvider>
          <RootNavigator />
        </ResizeContextProvider>
  </NavigationContainer>
}


// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Root = createStackNavigator();

function RootNavigator() {
    const windowType = useResizeContext();
    useInvitee()
    return <Root.Navigator
        mode= 'modal'
        headerMode= 'screen'
        screenOptions={{
            cardStyle:{backgroundColor:"white"},
            animationEnabled: true,
            cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
    >
        <Root.Screen name="Main" component={MainNavigator} options={{headerShown:false}}/>
        {Object.entries(modal).map(([key, screen])=><Root.Screen key={key} name={key} component={screen.component} options={{
            title: screen.title,
            gestureDirection: windowType == 'landscape'?'vertical-inverted':'vertical'
        }} />)}
    </Root.Navigator>
}


(function(l) {  // for github-page
    if (l !== undefined && l.search[1] === '/' ) {
        var decoded = l.search.slice(1).split('&').map(function(s) { 
        return s.replace(/~and~/g, '&')
        }).join('?');
        window.history.replaceState(null, '',
            l.pathname.slice(0, -1) + decoded + l.hash
        );
    }
}(window.location))

replaceInviteeState(window.location)

const IGNORE_WERNINGS:string[] = ['setNativeProps', 'useNativeDriver'];

const warnLogger = console.warn

console.warn = (message: string|Object) => {
    var warn = true;
    if (message instanceof Object){
      warn = false;
    }
    else if (IGNORE_WERNINGS.some(log=>message.includes(log))){
      warn = false
    };
    if (warn){
      warnLogger(message);
    }
    else{
        // console.log(message)
    }
};
