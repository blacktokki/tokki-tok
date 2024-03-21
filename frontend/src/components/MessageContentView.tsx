import React, { useState } from "react"
import { StyleProp, TextStyle, TouchableOpacity } from "react-native";
import Hyperlink from "react-native-hyperlink";
import { View, Text } from "./Themed";

type MessageContentProps = {textStyle?:StyleProp<TextStyle>, selectable?:boolean, onPressLink?:any}

const accordionRegex = /> .*(\n([ ]+.*\n?)*)?/
const accordionHeaderRegex = /> .*\n?/


const  MessageContentText = (props:MessageContentProps & {children:React.ReactNode})=>{
    /* @ts-ignore */
    return <Hyperlink linkDefault={ true } style={{wordBreak:"break-word"}} linkStyle={{color: '#12b886'}} onPress={props.onPressLink}>
        <Text selectable={props.selectable} style={props.textStyle}>{props.children}</Text>
    </Hyperlink>
}

const  Accordion = (props:MessageContentProps & {title:string, body:string})=>{
    const [open, setOpen] = useState(false)
    return <View style={{flexDirection:'row'}}>
        <TouchableOpacity onPress={()=>setOpen(!open)}>
            <Text>{open?"▼  ":"▶  "}</Text>
        </TouchableOpacity>
        <View>
            <MessageContentText {...props}>{props.title}</MessageContentText>
            {open && <MessageContentView {...props} content={props.body}/>}
        </View>
    </View>
}


const MessageContentView = (props:MessageContentProps  & {content?:string})=>{
    let content = `${props.content}`
    const children:React.ReactNode[] = []
    while (content.length > 0){
        const match = content.match(accordionRegex)
        if (match == null){
            children.push(<MessageContentText key={children.length} {...props}>{content}</MessageContentText>)
            content = ''
        }
        else {
            children.push(<MessageContentText key={children.length} {...props}>{content.slice(0, match.index)}</MessageContentText>)
            const titleMatch = match[0].match(accordionHeaderRegex)
            const subContentSplit = match[0].slice(titleMatch?.[0].length).split('\n')
            const depth = subContentSplit[0].length - subContentSplit[0].trimStart().length
            const subContent = subContentSplit.map(t=>{
                const d = t.length - t.trimStart().length
                return ''.repeat(Math.max(0, d - depth)) + t.trimStart()
            }).join('\n')
            children.push(<Accordion  key={children.length} {...props} title={titleMatch?.[0].slice(2) || ''} body={subContent}/>)
            content = content.slice((match.index || 0) + match[0].length)
        }
    }
    return <>{children}</>
}


export default MessageContentView