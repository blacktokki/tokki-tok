import React, {useState, useEffect} from "react"
import moment from "moment";
import {View, TouchableOpacity} from 'react-native'
import { Text } from "../../../components/Themed";
import useTimerMessageContentList from "../../../hooks/lists/useTimerMessageContent";
import { MessengerContent } from "../../../types";
import Avatar from "../../../components/Avatar";
import Hyperlink from "react-native-hyperlink";

export function timerFormat(datetime:string){
    return _timerFormat(moment(datetime), moment())
}

function _timerFormat(m:moment.Moment, now:moment.Moment){
    if (m.year() != now.year()){
        return m.format('YYYY.MM')
    }
    if(m.month()!= now.month() || m.day() != now.day()){
        return m.format('MM.DD')
    }
    return m.format('HH:mm')
  }

const TimerTag = (props:{data:MessengerContent, now:moment.Moment, isExpand:boolean, setExpand:(id?:number)=>void})=>{
    const start = moment(props.data.created)
    const end = moment(props.data.timer)
    const ratio = (start.diff(props.now)/start.diff(end))
    return <TouchableOpacity onPress={()=>props.setExpand(props.isExpand?undefined:props.data.id)}>
        <View style={{backgroundColor:'lightgray', borderRadius:20, overflow:'hidden', margin:5}}>
            <View style={{backgroundColor:'darkgray', position:'absolute', width:`${ratio*100}%`, height:'100%'}}/>
            {props.isExpand?
            <View style={{paddingVertical:5, paddingHorizontal:5, maxWidth:270}}>
                <View style={{flexDirection:'row'}}>
                    <Avatar name={props.data.name} userId={props.data.user} size={20}/>
                    <View style={{paddingHorizontal:5}}><Text>{props.data.name}</Text></View>
                </View>
                <View style={{flexDirection:'row', alignItems:'stretch'}}>
                    <Text>⌚</Text>
                    <Text selectable>{moment(props.data.timer).format('L HH:mm')}</Text>
                </View>
                {/* @ts-ignore */}
                <Hyperlink linkDefault={ true } style={{wordBreak:"break-word"}} linkStyle={{color: '#12b886'}}>
                    <Text selectable>{props.data.message_set[0].content}</Text>
                </Hyperlink>
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
    const [now, setNow] = useState(moment())
    const [expand, setExpand] = useState<number>()
    useEffect(()=>{
        const timeout = setTimeout(()=>{
            setNow(moment())
        }, 2000)
        return ()=>clearTimeout(timeout)
    }, [now])
    return <View style={{flexDirection:'row', paddingTop:5, paddingHorizontal:20}}>
        {timerMessages?.map((v,i)=><TimerTag key={i} data={v} now={now} isExpand={v.id==expand} setExpand={setExpand}/>)}
    </View>
}