import { MaterialIcons } from "@expo/vector-icons"
import React from "react"
import { Text, View } from "react-native"
import CommonItem from "../components/CommonItem"
import useLoginContext from "../hooks/useLoginContext"
import useUserMembershipList from "../hooks/lists/useUserMembershipList"

export default ()=>{
    const {user} = useLoginContext()
    const userList = useUserMembershipList(user)
    return <View style={{flex:1, backgroundColor:'white'}}>
        {userList && userList.map(item=><CommonItem key={item.id} bodyStyle={{flexDirection:'row', justifyContent:'flex-start'}}>
            <MaterialIcons size={38} style={{ marginBottom: -3, marginRight:10 }} name='account-circle'/>
            <Text style={{fontSize:20, fontWeight:'400'}}>{item.name}</Text>
        </CommonItem>)}
    </View>
}