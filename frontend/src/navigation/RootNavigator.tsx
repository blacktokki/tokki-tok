import { createStackNavigator } from '@react-navigation/stack';
import React, {useMemo} from 'react';
import { View } from 'react-native';
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import useResizeWindow from '../hooks/useResizeWindow';
import NotFoundScreen from '../screens/NotFoundScreen';
import {main, login, modal} from '../screens';
import DrawerNavigator from './DrawerNavigator';
import useAuthContext, {AuthProvider} from '../hooks/useAuthContext';

const Root = createStackNavigator();

export const queryClient = new QueryClient();

export default function RootNavigator() {
    const windowType = useResizeWindow();
    return (
            <AuthProvider>
                <QueryClientProvider client={queryClient}>
                    {/* devtools */}
                    <ReactQueryDevtools initialIsOpen={true} />
                    <Root.Navigator
                        mode= 'modal'
                        headerMode= 'none'
                        screenOptions={{
                            cardStyle:{
                                backgroundColor:"transparent",
                                opacity:0.99,
                            }
                        }}
                    >
                        <Root.Screen name="Main" component={MainNavigator} options={{headerShown:false}}/>
                        {Object.entries(modal).map(([key, screen])=><Root.Screen key={key} name={key} component={screen.component} options={(props)=>
                            ({ title: screen.title, cardStyle:{backgroundColor:windowType=='portrait'?'white':'transparent'}})
                        } />)}
                    </Root.Navigator>
                </QueryClientProvider>
            </AuthProvider>
    );
}

const Main = createStackNavigator();

function MainNavigator(){
    const windowType = useResizeWindow();
    const {auth} = useAuthContext()
    const entries = useMemo(()=>{
        if (auth.user === undefined)
            return []
        console.log('current user: ', auth.user)
        return Object.entries(auth.user === null?login:main)
    }, [auth])
    return (auth.user!==undefined?<View style={{flexDirection:'row', flex:1}}>
        {auth.user && windowType=='landscape'?<DrawerNavigator/>:undefined}
        <View style={{flex:1, flexDirection:'column-reverse'}}>
            <Main.Navigator>
                {entries.map(([key, screen])=><Main.Screen key={key} name={key} component={screen.component} options={(props)=>
                    ({ title: screen.title })
                } />)}
                <Main.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
            </Main.Navigator>
        </View>
    </View>:<></>);
}