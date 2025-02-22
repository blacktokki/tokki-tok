import * as React from 'react';
import { View, Text } from './Themed';
import { StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import Colors from '../constants/Colors';
import { TouchableOpacity } from 'react-native-gesture-handler';

export type SectionParamList = {
    title?: string,
    titleStyle?:StyleProp<TextStyle>
    titleOnPress?:()=>void,
    outerContainerStyle?:StyleProp<TextStyle>
    containerStyle?:StyleProp<ViewStyle>
    bodyStyle?:StyleProp<ViewStyle>
    subtitle?: string
    withSeparator?: boolean
    autoScale?:boolean
    children?: React.ReactNode
}

export default function CommonSection(props:SectionParamList){
  const titleText = <>
    <Text style={[styles.title, props.titleStyle]}>{props.title}</Text>
    <Text style={styles.subtitle}>{props.subtitle}</Text>
  </>
  return (
    <View style={[styles.outerContainer, props.autoScale?{}:styles.outerContainerFill, props.outerContainerStyle]}>
        <View style={[styles.container, props.containerStyle]}>
            {props.withSeparator?<View style={styles.separator} lightColor="#ddd" darkColor="rgba(255,255,255, 0.3)" />:undefined}
            {props.title?
              (props.titleOnPress?
                <TouchableOpacity onPress={props.titleOnPress} style={styles.titleView}>{titleText}</TouchableOpacity >:
                <View style={styles.titleView}>{titleText}</View>):
              undefined}
            <View style={[styles.bodyView, props.bodyStyle]}>
            {props.children}
            </View>
          </View>
        </View>
    )
}

const styles = StyleSheet.create({
  outerContainer:{
    alignItems:'stretch',
    backgroundColor:'transparent'
  },
  outerContainerFill:{
    width:'100%',
    maxWidth:1080,
  },
  container: {
      marginHorizontal:20,
      marginVertical: 10,
      backgroundColor:'transparent',
    },
    titleView:{
      width: '100%',
      flexDirection:'row',
      backgroundColor:'transparent',
      marginBottom:5,
    },
    title: {
      flex:1,
      fontSize: 16,
    },
    subtitle: {
      flex:1,
      fontSize: 12,
      textAlign: 'right',
      marginTop:4
    },
    separator: {
      marginBottom: 0,
      height: 1,
      width: '100%',
    },
    bodyView:{
      width: '100%',
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth:1,
      borderColor:Colors.borderColor,
      borderRadius:6
    }
  });
  