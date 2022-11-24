import { MaterialIcons } from "@expo/vector-icons"
import React from "react"
import { Text, View } from "react-native"
import CommonItem from "../components/CommonItem"
import useAuthContext from "../hooks/useAuthContext"
import useUserMembershipList from "../hooks/lists/useUserMembershipList"

export default ()=>{
    const {auth} = useAuthContext()
    const userList = useUserMembershipList(auth)
    return <View style={{flex:1, backgroundColor:'white'}}>
        {userList && userList.map(item=><CommonItem key={item.id} bodyStyle={{flexDirection:'row', justifyContent:'flex-start'}}>
            <MaterialIcons size={38} style={{ marginBottom: -3, marginRight:10 }} name='account-circle'/>
            <Text style={{fontSize:20, fontWeight:'400'}}>{item.name}</Text>
        </CommonItem>)}
    </View>
}