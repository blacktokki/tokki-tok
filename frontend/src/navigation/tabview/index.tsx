import React from 'react';
import { TabView, SceneMap,NavigationState, SceneRendererProps, TabBar } from 'react-native-tab-view';
import MemberTab, {MemberIcon} from "./MemberTabView";
// import OneTab, {ConfigIcon} from "./OneTab";
import DrawerTab  from './DrawerTabView';
import MessengerTab, {MessengerIcon} from "./MessengerTabView";
import useLangContext from '../../hooks/useLangContext';

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
    // ThreeTab:{
    //     title:'board',
    //     component:BoardTab,
    //     icon:BoardIcon
    // },
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
    // ThreeTab:{
    //     title:'board',
    //     component:DrawerTab.Board,
    //     icon:BoardIcon
    // }
} as Record<string, {title:string, component:React.ComponentType<any>, icon:JSX.Element}>


export default (props:{tabs:typeof drawerTabs, tabBarPosition:"top"|"bottom", index?:number, onTab?:(index:number)=>void})=>{
  const { lang } = useLangContext()
  const [index, setIndex] = React.useState(props.index || 0);
  const entries = Object.entries(props.tabs)
  const onTab = props.onTab
  const icons = Object.assign({}, ...entries.map(([k, v])=>({[k]:v.icon})))
  return <TabView
    renderTabBar={(props:SceneRendererProps & {navigationState: NavigationState<any>})=>{
      return <TabBar
        {...props}
        indicatorStyle={{ backgroundColor: "#2196F3" }}
        style={{ backgroundColor:'white' }}
        activeColor={'black'}
        inactiveColor={'black'}
        renderIcon={(scene)=>icons[scene.route.key]}
        onTabPress={(scene)=>onTab?.(entries.findIndex(([k, v])=>k == scene.route.key))}
      />
    }}
    navigationState={{ index, routes: entries.map(([k, v])=>({key:k, title:lang(v.title)}))}}
    onIndexChange={setIndex}
    renderScene={SceneMap(Object.assign({}, ...entries.map(([k, v])=>({[k]:v.component}))))}
    tabBarPosition={props.tabBarPosition}
  />
}

