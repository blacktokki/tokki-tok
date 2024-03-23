import React, {useState, useEffect} from "react"
import dayjs from "dayjs";
import {View, TouchableOpacity} from 'react-native'
import { Text } from "../Themed";
import useTimerMessageContentList from "../../hooks/lists/useTimerMessageContent";
import { MessengerContent } from "../../types";
import Avatar from "../Avatar";
import MessageContentView from "./MessageContentView";

export function timerFormat(datetime:string){
    return _timerFormat(dayjs(datetime), dayjs())
}

function _timerFormat(m:dayjs.Dayjs, now:dayjs.Dayjs){
    if (m.year() != now.year()){
        return m.format('YYYY.MM')
    }
    if(m.month()!= now.month() || m.date() != now.date()){
        return m.format('MM.DD')
    }
    return m.format('HH:mm')
  }

export function timerToString(timer:string){
    return dayjs(timer).format('YYYY.MM.DD HH:mm')
}

const TimerTag = (props:{data:MessengerContent, now:dayjs.Dayjs, isExpand:boolean, setExpand:(id?:number)=>void})=>{
    const start = dayjs(props.data.created)
    const end = dayjs(props.data.timer)
    const ratio = (start.diff(props.now)/start.diff(end))
    const message = props.data.message_set[0]
    return <TouchableOpacity onPress={()=>props.setExpand(props.isExpand?undefined:props.data.id)}>
        <View style={{backgroundColor:'lightgray', borderRadius:20, overflow:'hidden', margin:5}}>
            <View style={{backgroundColor:'darkgray', position:'absolute', width:`${ratio*100}%`, height:'100%'}}/>
            {props.isExpand?
            <View style={{paddingVertical:5, paddingHorizontal:5, maxWidth:270}}>
                <View style={{flexDirection:'row'}}>
                    <Avatar name={props.data.name} userId={props.data.user} size={20}/>
                    <View style={{paddingHorizontal:5}}><Text>{props.data.name}</Text></View>
                </View>
                {props.data.timer &&
                <View style={{flexDirection:'row', alignItems:'stretch'}}>
                    <Text>⌚</Text>
                    <Text selectable>{timerToString(props.data.timer)}</Text>
                </View>}
                {/* @ts-ignore */}
                <MessageContentView selectable content={message.preview_content || message.content}/>
            </View>:    
            <View style={{paddingVertical:5, paddingHorizontal:5, flexDirection:'row'}}>
                <Avatar name={props.data.name} userId={props.data.user} size={20}/>
                <View style={{paddingHorizontal:5}}><Text>{_timerFormat(end, props.now)}</Text></View>
            </View>}
        </View>
    </TouchableOpacity>
}


export default (props:{channel_id:number})=>{
    const timerMessages = useTimerMessageContentList(props.channel_id)
    const [now, setNow] = useState(dayjs())
    const [expand, setExpand] = useState<number>()
    useEffect(()=>{
        const timeout = setTimeout(()=>{
            setNow(dayjs())
        }, 2000)
        return ()=>clearTimeout(timeout)
    }, [now])
    return <View style={{flexDirection:'row', paddingTop:5, paddingHorizontal:20}}>
        {timerMessages?.map((v,i)=><TimerTag key={i} data={v} now={now} isExpand={v.id==expand} setExpand={setExpand}/>)}
    </View>
}