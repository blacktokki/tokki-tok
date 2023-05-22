import LoginScreen from "./main/LoginScreen";
import ChatScreen from "./main/ChatScreen";
import HomeScreen from "./main/HomeScreen";
import TabOneScreen from "./main/TabOneScreen";
// import BoardScreen from "../lib/blacktokki-board/BoardScreen";
// import BoardEditScreen from "../lib/blacktokki-board/BoardEditScreen";
import { Screens } from "../types";
import lang from "../lang"

export const main = {
    HomeScreen:{
        title:lang('home'),
        component:HomeScreen,
        path:'home',
    },
    ChatScreen:{
        title:lang('chat'),
        component:ChatScreen,
        path:'chat'
    },
    // BoardScreen:{
    //     title:'board',
    //     component:BoardScreen,
    //     path:'board'
    // },
    TabOneScreen:{
        title:'tab one',
        component:TabOneScreen,
        path:'one'
    },
} as Screens

export const login = {
    LoginScreen:{
        path: 'login',
        title: lang('Sign in'),
        component:LoginScreen
    },
} as Screens

export const modal = {
    // BoardEditScreen:{
    //     title:'board',
    //     component:BoardEditScreen,
    //     path:'modal/board'
    // },
} as Screens