import React from 'react'
import { View, StyleSheet, Linking, Platform } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { AntDesign } from '../lib/@expo/vector-icons'; 
import useColorScheme from '../hooks/useColorScheme';
import Colors from '../constants/Colors';

const openURL = Platform.OS=='web'?(url:string)=>{location.href=url}:Linking.openURL

export default (props:{theme:'light'|'dark'})=>{
    return<View style={Styles.footer_buttons}>
        <TouchableOpacity style={Styles.footer_button} onPress={()=>openURL("https://github.com/blacktokki/tokki-tok")}>
            <AntDesign name="github" size={24} color={Colors[props.theme].iconColor} />
        </TouchableOpacity>
        <TouchableOpacity style={Styles.footer_button} onPress={()=>Linking.openURL("mailto:ydh051541@naver.com")}>
            <AntDesign name="mail" size={24} color={Colors[props.theme].iconColor} />
        </TouchableOpacity>
    </View>
}

const Styles = StyleSheet.create({
      footer_buttons: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingBottom: 20,
        paddingRight: 20,
      },
      footer_button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 38,
        height: 38,
        marginHorizontal: 12,
        borderWidth: 1,
        borderColor: '#E7E7E7',
        borderRadius: 60,
      },
})