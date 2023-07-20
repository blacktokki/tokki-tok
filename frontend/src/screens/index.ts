import LoginScreen from "./main/LoginScreen";
import ChatScreen from "./main/ChatScreen";
import HomeScreen from "./main/HomeScreen";
// import BoardScreen from "../lib/blacktokki-board/BoardScreen";
// import BoardEditScreen from "../lib/blacktokki-board/BoardEditScreen";
import { Screens } from "../types";
import DemoScreen from "./main/DemoScreen";

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