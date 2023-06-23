import React from 'react'
import TextButton from "./TextButton"
import useAuthContext from "../hooks/useAuthContext"
import useResizeContext from '../hooks/useResizeContext'
import { View } from 'react-native'
import useModalsContext from '../hooks/useModalsContext'
import GuestLogoutModal from '../modals/GuestLogoutModal'
import useLangContext from '../hooks/useLangContext'
import useColorScheme from '../hooks/useColorScheme'
import Colors from '../constants/Colors'

type ButtonProps = {title:string, onPress:()=>void, windowType?:'landscape'|'portrait'}

export default (props:{extra?:ButtonProps[]})=>{
    const { lang } = useLangContext()
    const theme = useColorScheme()
    const {auth, dispatch} = useAuthContext()
    const { setModal } = useModalsContext()
    const windowType = useResizeContext()
    const defaultButtonProps:ButtonProps[] = [{title:lang('sign out'), onPress:()=>{
        if (auth?.user?.username.endsWith(".guest")){
            setModal(GuestLogoutModal, {})
        }
        else{
            dispatch({type:"LOGOUT_REQUEST"})
        }
    }}]
    const buttonProps = (props.extra?[...props.extra, ...defaultButtonProps]:defaultButtonProps).filter(v=>v.windowType==windowType || v.windowType == undefined)
    return<View style={{flexDirection:'row'}}>
        {buttonProps.map((v,k)=><TextButton key={k} {...v} textStyle={{color:Colors[theme].text}} color='#gray'/>)}
    </View>
}
  