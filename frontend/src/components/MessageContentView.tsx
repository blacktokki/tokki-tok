import React from "react"
import { StyleProp, TextStyle } from "react-native";
import Hyperlink from "react-native-hyperlink";
import { View, Text } from "./Themed";

type MessageContentProps = {textStyle?:StyleProp<TextStyle>, selectable?:boolean, onPressLink?:any}

const MessageContentView = (props:MessageContentProps  & {content?:string})=>{
    /* @ts-ignore */
    return <Hyperlink linkDefault={ true } style={{wordBreak:"break-word"}} linkStyle={{color: '#12b886'}} onPress={props.onPressLink}>
        <Text selectable={props.selectable} style={props.textStyle}>{props.content}</Text>
    </Hyperlink>
}

export default MessageContentView