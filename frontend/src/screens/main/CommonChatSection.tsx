import React, { useEffect, useMemo, useRef, useState} from 'react';
import { Platform, StyleProp, View, ViewStyle } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import CommonButton from '../../components/CommonButton';
import { useMessengerContentMutation } from '../../hooks/lists/useMessengerContentList';
import useAuthContext from '../../hooks/useAuthContext';
import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';
import { View as ThemedView } from '../../components/Themed' 
import useIsMobile from '../../hooks/useIsMobile';
import DateTimePickerModal from '../../modals/DateTimePickerModal'
import useLangContext from '../../hooks/useLangContext';
import { Entypo } from '../../lib/@expo/vector-icons';
import TimerTags, { timerFormat } from '../../components/Messages/TimerTags';
import UploadTags from '../../components/Messages/UploadTags';
import Messages from '../../components/Messages';
import useModalsContext from '../../hooks/useModalsContext';
import NotePickerModal from '../../modals/NotePickerModal';

function uploadFile(){
    return new Promise<Blob|undefined>((resolve, reject)=>{
      if (Platform.OS == 'web'){
        var input = document.createElement('input');
        input.type = 'file';
        input.onchange = e => { 
          resolve((e.target as any).files[0])
        }
        input.onabort = reject
        input.onerror = reject
        input.click();
      }
      else
        resolve(undefined)
    })
  }

export default ({channel_id, style, extraButtons}:{channel_id:number, style?:StyleProp<ViewStyle>, extraButtons?:{title:string, onPress:()=>void, disabled?:boolean}[]})=>{
    const theme = useColorScheme()
    const { lang } = useLangContext()
    const isMobile = useIsMobile()
    const {auth} = useAuthContext()
    const { setModal } = useModalsContext()
    const inputRef = useRef<TextInput>(null)
    const [value, setValue] = useState('')
    const [editorValue, setEditorValue] = useState('')
    const [timer, setTimer] = useState<string>()
    const [messageEvent, sendToScreen] = useState<{value:string, editorValue:string}>()
    const [bottomTab, setBottomTab] = useState<boolean>(false)
    const [autoFocus, setAutoFocus] = useState<boolean|null>(null)
    const valueLines = useMemo(()=>bottomTab?1:value.split("\n").length, [value, bottomTab])
    const contentMutation = useMessengerContentMutation()
    const postValue = ()=>{
        if (value.length>0){
          contentMutation.create({channel:channel_id, user:auth.user?.id, content:value, timer})
          setTimer(undefined)
          setBottomTab(false)
          setValue('')
          setAutoFocus(true)
        }
      }
      const onKeyPress = (e:any) => {
        if (!isMobile){
          const event = e as KeyboardEvent;
            if (!event.shiftKey && event.key === "Enter"){
              postValue()
              event.preventDefault()
          }
        }
      }
      
      useEffect(()=>{
        if(messageEvent){
          setValue(value.concat(value.length>0?"\n":"", messageEvent.value))
          setEditorValue(editorValue.concat("\r\n", messageEvent.editorValue))
          sendToScreen(undefined)
        }
      }, [messageEvent, value, editorValue])
      useEffect(()=>{
        if(autoFocus){
          (inputRef.current as any).focus?.()
          setAutoFocus(false)
        }
      }, [autoFocus])
      // useEffect(()=>{
      //   if (autoFocus==null && !isMobile){
      //     const timeout = setTimeout(()=>setAutoFocus(true), 500)
      //     return ()=>clearTimeout(timeout)
      //   }
      // })


    return <View style={style}>
      <Messages channel_id={channel_id} auth={auth} reverse sendToScreen={sendToScreen}/>
      <View style={{position:'absolute', flexDirection:'row'}}>
        <UploadTags channel_id={channel_id}/>
        <TimerTags channel_id={channel_id}/>
      </View>
      <ThemedView style={{bottom:0, width:'100%', paddingTop:15, paddingBottom:10, paddingHorizontal:19}}>
        <View style={{alignItems:'center', width:'100%',flexDirection:'row'}}>
          <CommonButton title={''} style={{height:'100%', paddingTop:8, borderTopRightRadius:0, borderBottomRightRadius:0, justifyContent:'center'}} onPress={()=>{setBottomTab(!bottomTab)}}>
            <View style={{top:-2}}>
              <Entypo name={bottomTab?"cross":"plus"} size={24} color={Colors[theme].text}/>
            </View>
          </CommonButton>
          {timer && <CommonButton style={{height:'100%', paddingTop:8, borderRadius:0}} title={`⌚${timerFormat(timer)}`} onPress={()=>{setModal(DateTimePickerModal, {datetime:timer, callback:(datetime:string)=>setTimer(datetime)});setBottomTab(false)}}/>}
          <TextInput
              ref={inputRef}
              value={value} 
              onChangeText={setValue}
              onKeyPress={onKeyPress}
              style={{flex:1, borderWidth:1, minHeight:41, borderColor:Colors.borderColor, backgroundColor:Colors[theme].background, color:Colors[theme].text, paddingVertical:1, paddingHorizontal:3}}
              onFocus={()=>setBottomTab(false)}
              multiline 
              numberOfLines={valueLines}/>
          <CommonButton style={{height:'100%', paddingTop:8, borderTopLeftRadius:0, borderBottomLeftRadius:0, justifyContent:'center'}} title={'💬'} onPress={postValue}/>
        </View>
        {bottomTab && <View style={{alignItems:'center', width:'100%', flexDirection:'row', paddingTop:15, paddingBottom:5}}>
          <CommonButton style={{height:80, flex:1, justifyContent:'center', marginRight:15}} title={`📤\n ${lang('File')}`} onPress={()=>uploadFile().then(f=>{contentMutation.create({channel:channel_id, user:auth.user?.id, content:'', file:f});setBottomTab(false)})}/>
          <CommonButton style={{height:80, flex:1, justifyContent:'center', marginRight:15}} title={`✏️\n ${lang('Note')}`} onPress={()=>{setModal(NotePickerModal, {callback:(editor:number)=>{contentMutation.create({channel:channel_id, user:auth.user?.id, content:'', editor});setBottomTab(false)}})}}/>
          <CommonButton style={{height:80, flex:1, justifyContent:'center', marginRight:15}} title={`⌚\n ${lang('Timer')}`} onPress={()=>{setModal(DateTimePickerModal, {datetime:timer, callback:(datetime:string)=>setTimer(datetime)});setBottomTab(false)}}/>
          {extraButtons?.map((v, k)=><CommonButton key={k} style={{height:80, flex:1, justifyContent:'center', marginRight:15}} title={v.title} onPress={()=>{v.onPress();setBottomTab(false)}} disabled={v.disabled}/>)}
        </View>}
      </ThemedView>
    </View>
}