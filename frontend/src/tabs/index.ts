import React from "react";
import MemberTab, {MemberIcon} from "./MemberTab";
import OneTab, {ConfigIcon} from "./OneTab";
import DrawerTab  from './DrawerTab';
import MessengerTab, {MessengerIcon} from "./MessengerTab";
import BoardTab, {BoardIcon}  from "./BoardTab";

export const bottomTabs = {
    OneTab:{
        title:'member',
        component:MemberTab,
        icon:MemberIcon,
    },
    TwoTab:{
        title:'messenger',
        component:MessengerTab,
        icon:MessengerIcon
    },
    ThreeTab:{
        title:'board',
        component:BoardTab,
        icon:BoardIcon
    },
    // FourTab:{
    //     title:'config',
    //     component:OneTab,
    //     icon:ConfigIcon
    // }
} as Record<string, {title:string, component:React.ComponentType<any>, icon:JSX.Element}>

export const drawerTabs = {
    TwoTab:{
        title:'messenger',
        component:DrawerTab.Messenger,
        icon:MessengerIcon
    },
    ThreeTab:{
        title:'board',
        component:DrawerTab.Board,
        icon:BoardIcon
    }
} as Record<string, {title:string, component:React.ComponentType<any>, icon:JSX.Element}>