import LoginScreen from "./main/LoginScreen";
import ChatScreen from "./main/ChatScreen";
import HomeScreen from "./main/HomeScreen";
import TabOneScreen from "./main/TabOneScreen";
import BoardScreen from "./main/BoardScreen";
import BoardEditScreen from "./BoardEditScreen";
import ChannelEditScreen from "./ChannelEditScreen"
import { Screens } from "../types";

export const main = {
    HomeScreen:{
        title:'home',
        component:HomeScreen,
        path:'home',
    },
    ChatScreen:{
        title:'chat',
        component:ChatScreen,
        path:'chat'
    },
    BoardScreen:{
        title:'board',
        component:BoardScreen,
        path:'board'
    },
    TabOneScreen:{
        title:'tab one',
        component:TabOneScreen,
        path:'one'
    },
} as Screens

export const login = {
    LoginScreen:{
        path: 'login',
        title: '로그인',
        component:LoginScreen
    },
} as Screens

export const modal = {
    BoardEditScreen:{
        title:'board',
        component:BoardEditScreen,
        path:'modal/board'
    },
    ChannelEditScreen:{
        title:'board',
        component:ChannelEditScreen,
        path:'modal/channel'
    },
} as Screens