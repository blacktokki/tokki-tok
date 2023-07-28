/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { NavigationContainer, DefaultTheme, DarkTheme, NavigationContainerRef } from '@react-navigation/native';
import * as React from 'react';

import LinkingConfiguration from './LinkingConfiguration';
import RootNavigator from './RootNavigator';

import { useColorScheme as useDefaultColorScheme } from 'react-native';
import { useColorScheme as useColorScheme } from 'react-native-appearance';
import { ResizeContextProvider } from '../hooks/useResizeContext';
import { enableScreens } from 'react-native-screens';
import { replaceInviteeState } from '../hooks/useInvitee';

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
