import React, { useState,  useEffect,  useMemo,useLayoutEffect } from "react"
import useMessengerMemberList from './lists/useMessengerMemberList';
import useMessengerChannelList from './lists/useMessengerChannelList';
import { avatarFromChannel } from '../components/Avatar';
import useResizeContext from './useResizeContext';
import useModalsContext from './useModalsContext';
import InviteModal from '../modals/InviteModal';
import useLangContext from './useLangContext';
import useAuthContext from "./useAuthContext";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import HeaderRight from "../components/HeaderRight";
import ChannelEditModal from "../modals/ChannelEditModal";

export default (navigation:StackNavigationProp<any, any>, route:RouteProp<any, any>,channel_id:any, type:string, headerShown:boolean)=>{
    const { lang, locale } = useLangContext()
    const {auth} = useAuthContext()
    const { setModal } = useModalsContext()
    const windowType = useResizeContext()
    const channelList = useMessengerChannelList(type, auth)
    const channel = channelList?.find(v=>v.id==parseInt(channel_id))
    const channelAvatar = channel?avatarFromChannel(channel, auth.user):undefined
    const memberList = useMessengerMemberList(channel_id)
    const member_id = useMemo(()=>memberList?.find(v=>v.user == auth.user?.id)?.id, [auth, memberList])


    useLayoutEffect(() => {
        navigation.setOptions({
          headerRight: ()=> <HeaderRight extra={channel?.type=='messenger'?[
            {title:lang('invite'), onPress:()=>setModal(InviteModal, {id:channel_id})},
            {title:lang('setting'), onPress:()=>setModal(ChannelEditModal, {id:channel_id, type:channel?.type, member_id})}
          ] : [
            {title:lang('setting'), onPress:()=>setModal(ChannelEditModal, {id:channel_id, type:channel?.type, member_id})}
          ]}/>,
          title: channelAvatar?.name,
          headerShown
        });
      }, [navigation, route, member_id, locale, windowType, headerShown, channel]);
    
      const back = ()=>{
        if(navigation.canGoBack())
            navigation.goBack()
          else{
            navigation.navigate('HomeScreen', {tab:2})
          }
      }
      
      useEffect(()=>{
        setModal(null, null)
        if (!channel_id)
          back()
      }, [route])
      useEffect(()=>{
        if (memberList===null || (memberList!=undefined && memberList.find(v=>v.user==auth.user?.id)==undefined))
          back()
      }, [memberList])
      useEffect(()=>{
        if(channelList===null || (channelList!=undefined && channel==undefined))
            back()
      }, [channelList])
}