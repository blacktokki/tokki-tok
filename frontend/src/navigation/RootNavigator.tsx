import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import React, {useMemo} from 'react';
import { View } from 'react-native';
import { QueryClient, QueryClientProvider } from "react-query";
import { Ionicons } from '@expo/vector-icons';
import useResizeWindow from '../hooks/useResizeWindow';
import NotFoundScreen from '../screens/NotFoundScreen';
import {main, login, modal} from '../screens';
import DrawerNavigator from './DrawerNavigator';
import useAuthContext, {AuthProvider} from '../hooks/useAuthContext';
import { WebSocketProvider } from '../hooks/useWebsocketContext';
import HeaderRight from '../components/HeaderRight'
import Colors from '../constants/Colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import useFirebase, { FirebaseProvider } from '../hooks/useFirebaseContext';

const Root = createStackNavigator();

const queryClient = new QueryClient();

export default function RootNavigator() {
    const windowType = useResizeWindow();
    return (
            <AuthProvider>
                <QueryClientProvider client={queryClient}>
                    {/* devtools */}
                    {/* <ReactQueryDevtools initialIsOpen={true} /> */}
                        <Root.Navigator
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
                </QueryClientProvider>
            </AuthProvider>
    );
}

const Main = createStackNavigator();

function headerLeft(navigation:any, route:any, windowType:string){
    const canGOBackScreen = ['HomeScreen', 'LoginScreen'].findIndex(v=>v == route.name) == -1
    const goBack = ()=>{
        if (navigation.canGoBack())
            navigation.goBack()
        else if (canGOBackScreen)
            navigation.replace('HomeScreen')
    }
    if (windowType=='portrait' && canGOBackScreen)
        return <TouchableOpacity onPress={goBack}><Ionicons size={24} style={{marginHorizontal:20 }} name="arrow-back"/></TouchableOpacity>
    return null
}

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
        {auth.user?<DrawerNavigator user={auth.user}/>:undefined}
        <View style={{flex:1}}>
            <FirebaseProvider user={auth.user}>
                <WebSocketProvider disable={auth.user === null || auth.user === undefined}>
                    <Main.Navigator
                        screenOptions={({navigation, route})=>({
                            headerStyle:{backgroundColor:Colors.header},
                            headerTitleStyle:{color:'white'},
                            headerLeft:()=>headerLeft(navigation, route, windowType),
                            headerRight:()=><HeaderRight/>,
                            headerLeftContainerStyle:{backgroundColor:'white', borderBottomWidth:1, borderColor:Colors.borderColor},
                            cardStyle:{flexShrink:1},
                            animationEnabled:windowType=='portrait',
                            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
                        })}
                    >
                        {entries.map(([key, screen])=><Main.Screen key={key} name={key} component={screen.component} options={{ title: screen.title }} />)}
                        <Main.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
                    </Main.Navigator>
                </WebSocketProvider>
            </FirebaseProvider>
        </View>
    </View>:<></>);
}