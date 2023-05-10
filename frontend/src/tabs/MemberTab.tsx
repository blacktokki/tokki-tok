import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"
import React from "react"
import { Text, View } from "react-native"
import CommonItem from "../components/CommonItem"
import useAuthContext from "../hooks/useAuthContext"
import useUserMembershipList from "../hooks/lists/useUserMembershipList"
import { UserMembership } from "../types"
import { navigate } from "../navigation"

export const renderMemberItem = (item:UserMembership, onPress?:(item:UserMembership)=>void)=> (
    <CommonItem key={item.id} bodyStyle={{backgroundColor:'white', flexDirection:'row', justifyContent:'flex-start'}} onPress={onPress?()=>onPress(item):undefined}>
        <MaterialIcons size={38} style={{ marginBottom: -3, marginRight:10 }} name='account-circle'/>
        <Text style={{fontSize:20, fontWeight:'400'}}>{item.name}</Text>
    </CommonItem>
)

export default ()=>{
    const {auth} = useAuthContext()
    const userList = useUserMembershipList(auth)
    return <View style={{flex:1, backgroundColor:'white'}}>
        {userList && userList.map(item=>renderMemberItem(item, (item)=>navigate("ProfileScreen", {id:item.id})))}
    </View>
}

export const MemberIcon = <MaterialCommunityIcons size={32} style={{ marginBottom: -3 }} name='account'/>