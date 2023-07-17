import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import React, {useMemo} from 'react';
import { View } from 'react-native';
import { Ionicons } from '../lib/@expo/vector-icons';
import useResizeContext from '../hooks/useResizeContext';
import NotFoundScreen from '../screens/NotFoundScreen';
import {main, login, modal} from '../screens';
import DrawerNavigator from './DrawerNavigator';
import useAuthContext from '../hooks/useAuthContext';
import { WebSocketProvider } from '../hooks/useWebsocketContext';
import HeaderRight from '../components/HeaderRight'
import Colors from '../constants/Colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import useFirebaseContext, { FirebaseProvider } from '../hooks/useFirebaseContext';
import useIsMobile from '../hooks/useIsMobile';
import useColorScheme from '../hooks/useColorScheme';
import { ModalsProvider } from '../hooks/useModalsContext';
import modals from '../modals';
import useLangContext from '../hooks/useLangContext';
import CommonButton from '../components/CommonButton';
import useInvitee from '../hooks/useInvitee';

const Root = createStackNavigator();

export default function RootNavigator() {
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

const Main = createStackNavigator();

function headerLeft(navigation:any, route:any, windowType:string, theme:'light'|'dark', isMobile:boolean){
    const canGOBackScreen = ['HomeScreen', 'LoginScreen'].findIndex(v=>v == route.name) == -1
    const goBack = ()=>{
        if (navigation.canGoBack())
            navigation.goBack()
        else if (canGOBackScreen)
            navigation.replace('HomeScreen')
    }
    if (windowType=='portrait' && canGOBackScreen)
        return <TouchableOpacity onPress={goBack} disabled={!isMobile}>
            <CommonButton title={''} color={isMobile?Colors[theme].buttonBackgroundColor:Colors[theme].hoverColor} onPress={goBack} disabled={isMobile} style={{width:32, height:32, margin:16, paddingVertical:1, paddingHorizontal:4}}>
                <Ionicons size={24} color={Colors[theme].iconColor} name="arrow-back"/>
            </CommonButton>
        </TouchableOpacity>
    return null
}

const MainNavigator = ()=>{
    const windowType = useResizeContext();
    const isMobile = useIsMobile()
    const {auth} = useAuthContext()
    const theme = useColorScheme()
    const {lang, locale} = useLangContext()
    const entries = useMemo(()=>{
        if (auth.user === undefined)
            return []
        console.log('current user: ', auth.user)
        return Object.entries(auth.user === null?login:main)
    }, [auth, locale])
    const modalValues = useMemo(()=>{
        if (auth.user === undefined)
            return []
        return auth.user === null?[]:modals
    }, [auth])
    const backgroundStyle = theme=='light'?{}:{backgroundColor:'#010409'}
    return (auth.user!==undefined?<View style={{flexDirection:'row', flex:1}}>
        <ModalsProvider modals={modalValues}>
            {auth.user?<DrawerNavigator auth={auth}/>:undefined}
            <View style={[{flex:1}, backgroundStyle]}>
                <WebSocketProvider disable={auth.user === null || auth.user === undefined}>
                    <FirebaseProvider user={auth.user}>
                        <Main.Navigator
                            screenOptions={({navigation, route})=>({
                                headerStyle:{backgroundColor:Colors[theme].header, height:isMobile?50:undefined},
                                headerTitleStyle:{color:Colors[theme].text},
                                headerLeft:()=>headerLeft(navigation, route, windowType, theme, isMobile),
                                headerRight:()=><HeaderRight/>,
                                headerLeftContainerStyle:{backgroundColor:Colors[theme].header, borderBottomWidth:1, borderColor:Colors[theme].headerBottomColor},
                                cardStyle:[{flexShrink:1}, backgroundStyle],
                                animationEnabled:windowType=='portrait',
                                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
                            })}
                        >
                            {entries.map(([key, screen])=><Main.Screen key={key} name={key} component={screen.component} options={{ title: lang(screen.title) }} />)}
                            <Main.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
                        </Main.Navigator>
                    </FirebaseProvider>
                </WebSocketProvider>
            </View>
        </ModalsProvider>
    </View>:<></>);
}