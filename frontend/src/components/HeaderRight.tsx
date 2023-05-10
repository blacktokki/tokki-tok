import React from 'react'
import TextButton from "./TextButton"
import useAuthContext from "../hooks/useAuthContext"
import useResizeWindow from '../hooks/useResizeWindow'
import { View } from 'react-native'
import lang from '../lang'

type ButtonProps = {title:string, onPress:()=>void, windowType?:'landscape'|'portrait'}

export default (props:{extra?:ButtonProps[]})=>{
    const {dispatch} = useAuthContext()
    const windowType = useResizeWindow()
    const defaultButtonProps:ButtonProps[] = [{title:lang('sign out'), onPress:()=>dispatch({type:"LOGOUT_REQUEST"})}]
    const buttonProps = (props.extra?[...props.extra, ...defaultButtonProps]:defaultButtonProps).filter(v=>v.windowType==windowType || v.windowType == undefined)
    return<View style={{flexDirection:'row'}}>
        {buttonProps.map((v,k)=><TextButton key={k} {...v} textStyle={{color:'white'}} color='#gray'/>)}
    </View>
}
  