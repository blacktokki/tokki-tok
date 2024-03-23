import LoginScreen from "./login/LoginScreen";
import DemoScreen from "./login/DemoScreen";
import ChatScreen from "./main/ChatScreen";
import HomeScreen from "./main/HomeScreen";
import MyContentScreen from "./main/MyContentScreen";
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
    MyContentScreen:{
        title:'my content',
        component:MyContentScreen,
        path:'mycontent'
    },
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