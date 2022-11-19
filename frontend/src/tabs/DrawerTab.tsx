import React from "react"
import { View, Text } from "react-native"
import CommonItem from "../components/CommonItem"
import useBoardChannelList from "../hooks/lists/useBoardChannelList"
import useMessengerChannelList from "../hooks/lists/useMessengerChannelList"
import useLoginContext from "../hooks/useLoginContext"
import useUserMembershipList from "../hooks/lists/useUserMembershipList"
import { navigate } from "../navigation"

const DrawerTab = (props:{data:{name:string, onPress?:()=>void}[]})=><View style={{flex:1, backgroundColor:'white'}}>
    {props.data.map((item, index)=><CommonItem key={index} containerStyle={{marginHorizontal:0}} bodyStyle={{alignItems:'flex-start'}} onPress={item.onPress}>
        <Text style={{marginLeft:20}}>{item.name}</Text>
    </CommonItem>
    )}
</View>

export default {
    Member:()=>{
        const {user} = useLoginContext()
        const userList = useUserMembershipList(user);
        return <DrawerTab data={userList || []}/>
    },
    Messenger:()=>{
        const {user} = useLoginContext()
        const channelList = useMessengerChannelList(user);
        return <DrawerTab data={(channelList || []).map(item=>({...item, onPress:()=>navigate("ChatScreen", {id:item.id})}))}/>
    },
    Board:()=>{
        const {user} = useLoginContext()
        const channelList = useBoardChannelList(user);
        return <DrawerTab data={(channelList || []).map(item=>({...item, onPress:()=>navigate("BoardScreen", {id:item.id})}))}/>
    },
}