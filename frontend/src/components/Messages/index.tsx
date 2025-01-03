import React, {useCallback, useMemo, useRef} from "react"
import { View, TouchableOpacity } from 'react-native';
import { FlatList } from "react-native-gesture-handler";
import { Auth } from "../../hooks/useAuthContext";
import useMessengerContentList, { MessengerContentPage } from "../../hooks/lists/useMessengerContentList"
import useIsMobile from "../../hooks/useIsMobile"
import useModalsContext from "../../hooks/useModalsContext"
import { Text } from '../Themed' 
import Avatar from '../Avatar';
import LinkPreview from './LinkPreview';
import FilePreview from './FilePreview';
import MessageModal from '../../modals/MessageModal';
import CommonSection from "../CommonSection";
import { timerToString } from "./TimerTags";
import useViewerContentList from "../../hooks/lists/useMessengerViewerList";
import EditorPreview from "./EditorPreview";
import { MessengerContent } from "../../types";
import MessageContentView from "./MessageContentView";

const MessengerContentPageItem = React.memo((props:MessengerContentPage & {ownerId?:number, reverse?:boolean, getOnPress?:(content:MessengerContent)=>()=>void})=>{
    const lastTouchRef = useRef(Date.now()) 
    const touchableRef = useRef(()=>{
      return Date.now() - lastTouchRef.current > 350
    })
    const isMobile = useIsMobile()
    let nextPage = props.next;
      while(nextPage?.next && nextPage.current.length==0){
        nextPage = nextPage.next
      }
      const nextContent = nextPage?.current[0]
      return <View 
        style={{flexDirection: props.reverse?'column-reverse':'column'}}
        onTouchMove={()=>{lastTouchRef.current=Date.now()}}
      >  
        {props.current.map((content, index2)=>{
          const next = index2 + 1 < props.current.length?props.current[index2+1]:nextContent
          const created:string = content.created.slice(0, 16)
          const date = created.slice(0, 10)
          const isSystem = content.user == null
          const isFirst = next==undefined || (content.user != next.user || created != next.created.slice(0, 16))
          const isSelf = props.ownerId == content.user
          const dayChanged = next==undefined || date != next.created.slice(0, 10)
          const message = content.message_set[0]
          if (isSystem)
            return <View key={content.id} style={{flexDirection:'row', justifyContent:'center', width:'100%', marginVertical:5}}>
              <Text>{message.content}</Text>
            </View>
          return <View key={content.id}>
            {dayChanged?<View style={{flexDirection:'row', justifyContent:'center', width:'100%'}}><Text>{date}</Text></View>:undefined}
            <View key={content.id} style={{flexDirection:'row', justifyContent:isSelf?'space-between':'flex-start', width:'100%'}}>
              {isFirst && !isSelf? <View style={{marginTop:3, marginLeft:12}}><Avatar name={content.name} userId={content.user} size={36}/></View>:<View style={{width:48}}/>}
              <CommonSection autoScale outerContainerStyle={{maxWidth:'90%'}} title={isFirst?content.name:undefined} titleStyle={{flex:undefined}} bodyStyle={{padding:10}} subtitle={`${created.slice(11)}`}>
                <TouchableOpacity onLongPress={props.getOnPress?.(content)}>
                  {content.timer && <View style={{flexDirection:'row', alignItems:'stretch'}}>
                    <Text style={{fontSize:12}}>⌚</Text>
                    <Text style={{fontSize:12}} selectable={!isMobile}>{timerToString(content.timer)}</Text>
                  </View>}
                  <MessageContentView selectable={!isMobile} textStyle={{textAlign:isSelf?'right':'left'}} onPressLink={touchableRef.current()?undefined:()=>{}} content={message.content}/>
                  {
                    content.attatchment_set.map((attatchment, aIndex)=>{
                      if (attatchment.type=='editor')
                        return <EditorPreview key={aIndex} editor={attatchment} touchableRef={touchableRef}/>
                      if (attatchment.type=='file')
                        return <FilePreview key={aIndex} file={attatchment} isMobile={isMobile} showBorder={false} touchableRef={touchableRef}/>
                      if (attatchment.type=='link')
                        return <LinkPreview key={aIndex} link={attatchment} isMobile={isMobile} touchableRef={touchableRef}/>
                    })
                  }
                </TouchableOpacity>
              </CommonSection>
            </View>
          </View>
        })}
      </View>
  
  })

export default (props:{channel_id:number, auth?:Auth, reverse?:boolean, sendToScreen?:(e:any)=>void})=>{
    const height = useRef(0)
    const {data, fetchNextPage } = props.auth?useMessengerContentList(props.channel_id):useViewerContentList(props.channel_id)
    const ownerId = useMemo(()=>props.auth?.user?.id, [props.auth])
    const { setModal } = useModalsContext()
    const getOnPress = (content: MessengerContent)=>()=>setModal(MessageModal, {content, isOwner:ownerId == content.user, sendToScreen:props.sendToScreen})
    const renderItem = useCallback(({item, index}:{item:MessengerContentPage, index:number})=><MessengerContentPageItem 
      {...item} 
      ownerId={ownerId} 
      reverse={props.reverse}
      getOnPress={getOnPress}  
    />, [ownerId])
    return <FlatList
        style={{flexDirection: props.reverse?'column-reverse':'column'}}
        contentContainerStyle={{padding:10, flexGrow:1, flexDirection: props.reverse?'column-reverse':'column'}}
        data={data?.pages}
        renderItem={renderItem}
        onScroll={(e)=>{
          if (e.nativeEvent.contentSize.height - height.current + (props.reverse?1:-1)*e.nativeEvent.contentOffset.y < 1)
            fetchNextPage()
        }}
        onLayout={(p)=>{height.current = p.nativeEvent.layout.height}}
      />
}