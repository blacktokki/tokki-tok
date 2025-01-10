import React, { MutableRefObject } from 'react'
import { TouchableOpacity } from "react-native-gesture-handler"
import CommonSection from "../CommonSection"
import { MaterialCommunityIcons } from '../../lib/@expo/vector-icons'; 
import { View, Text } from "../Themed"
import { EditorContent } from "../../types"
import { navigate } from '../../navigation';
import { regexForStripHTML } from '../EditorHtml'
import useColorScheme from '../../hooks/useColorScheme';
import Colors from '../../constants/Colors';


export default ({editor, touchableRef}:{editor:EditorContent, touchableRef:MutableRefObject<()=>boolean>})=>{
    const theme = useColorScheme()
    return <CommonSection containerStyle={{marginHorizontal:0}} bodyStyle={{padding:0}}>
    <TouchableOpacity 
        onPress={()=>touchableRef.current() && navigate("NoteScreen", {id:editor.url})}
        onLongPress={()=>{}}
        style={{width:'100%', flexDirection:'row'}}
    >
        <MaterialCommunityIcons size={20} name='card-text' color={Colors[theme].iconColor}/>
        <View style={{flex:1, marginHorizontal:20}}>
            <Text style={{fontSize:18}}>{editor.title}</Text>
            <Text style={{fontSize:14}}>{editor.description.replaceAll(regexForStripHTML, '')}</Text>
        </View>
    </TouchableOpacity>
    </CommonSection>
}