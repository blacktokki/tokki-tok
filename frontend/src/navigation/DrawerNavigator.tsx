import { useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TabView, SceneMap,NavigationState, SceneRendererProps, TabBar } from 'react-native-tab-view';
import Profile from '../components/Profile';
import TextButton from '../components/TextButton';
import Colors from '../constants/Colors';
import useResizeWindow from '../hooks/useResizeWindow';
import { drawerTabs } from '../tabs';
import { UserMembership } from '../types';
import useModalsContext from '../hooks/useModalsContext';
import ChannelEditModal from '../modals/ChannelEditModal';

export const TabViewNavigator = (props:{tabs:typeof drawerTabs, tabBarPosition:"top"|"bottom", index?:number, onTab?:(index:number)=>void})=>{
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
    navigationState={{ index, routes: entries.map(([k, v])=>({key:k, title:v.title}))}}
    onIndexChange={setIndex}
    renderScene={SceneMap(Object.assign({}, ...entries.map(([k, v])=>({[k]:v.component}))))}
    tabBarPosition={props.tabBarPosition}
  />
}


export default React.memo(({user}:{user:UserMembership})=> {
  const { colors } = useTheme();
  const windowType = useResizeWindow();
  const [index, setIndex] = useState(0);
  const { setModal } = useModalsContext()
  const onAddList = [
    ()=>setModal(ChannelEditModal, {type:'messenger'}),
    ()=>setModal(ChannelEditModal, {type:'board'})
  ]
  return windowType=='landscape'?<View
      style={[
        styles.tabBar,
        {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        // tabBarStyle,
      ]}
      pointerEvents={false ? 'none' : 'auto'}
    >
      <Profile userId={user.id} username={user.username} name={user.name}/>
      <View style={{flexDirection:'row-reverse'}}>
          <TextButton title='+' textStyle={{fontSize:20}} style={{borderRadius:20}} onPress={onAddList[index]}/>
      </View>
      <View accessibilityRole="tablist" style={styles.content}>
        {Object.keys(drawerTabs).length>1 ? 
          <TabViewNavigator tabs={drawerTabs} tabBarPosition={"top"} onTab={setIndex}/>: 
          <View style={{borderTopWidth:1, flex:1, borderColor:colors.border}}>            
            {Object.values(drawerTabs).map(drawerTab=>{const Tab = drawerTab.component; return <Tab key={drawerTab.title}/>})}
          </View>
        }
      </View>
    </View>:<View style={{width:0}}></View>
})

{/*<Text style={[styles.label, { color: d.isFocused ? colors.primary : '#222' }]}></Text> */}

const styles = StyleSheet.create({
    tabBar: {
      width:240,
      elevation: 8,
      borderRightWidth:1,
      borderColor:Colors.borderColor
    },
    content: {
      flex: 1,
      flexDirection: 'row',
    },
    tab: {
        flex: 1,
        alignItems: 'center',
    },
    label: {
        textAlign: 'center',
        backgroundColor: 'transparent',
      },
  });