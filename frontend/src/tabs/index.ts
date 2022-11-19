import React from "react";
import MemberTab from "./MemberTab";
import OneTab from "./OneTab";
import DrawerTab from './DrawerTab';
import MessengerTab from "./MessengerTab";
import BoardTab from "./BoardTab";

export const bottomTabs = {
    OneTab:{
        title:'member',
        component:MemberTab,
    },
    TwoTab:{
        title:'messenger',
        component:MessengerTab,
    },
    ThreeTab:{
        title:'board',
        component:BoardTab,
    },FourTab:{
        title:'config',
        component:OneTab,
    }
} as Record<string, {title:string, component:React.ComponentType<any>}>

export const drawerTabs = {
    OneTab:{
        title:'member',
        component:DrawerTab.Member,
    },
    TwoTab:{
        title:'messenger',
        component:DrawerTab.Messenger,
    },
    ThreeTab:{
        title:'board',
        component:DrawerTab.Board
    }
} as Record<string, {title:string, component:React.ComponentType<any>}>