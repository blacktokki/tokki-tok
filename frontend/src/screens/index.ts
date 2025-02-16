import LoginScreen from "./login/LoginScreen";
import DemoScreen from "./login/DemoScreen";
import ChatScreen from "./main/ChatScreen";
import HomeScreen from "./main/HomeScreen";
// import BoardEditScreen from "../lib/blacktokki-board/BoardEditScreen";
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
    // BoardScreen:{
    //     title:'board',
    //     component:BoardScreen,
    //     path:'board'
    // },
} as Screens

export const login = {
    LoginScreen:{
        path: 'login',
        title: 'Sign in',
        component:LoginScreen
    },
    DemoScreen:{
        title:'',
        component:DemoScreen,
        path:'demo'
    }
} as Screens

export const modal = {
    // BoardEditScreen:{
    //     title:'board',
    //     component:BoardEditScreen,
    //     path:'modal/board'
    // },
} as Screens