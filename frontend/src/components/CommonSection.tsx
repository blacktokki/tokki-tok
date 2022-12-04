import * as React from 'react';
import { View, Text } from './Themed';
import { StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import Colors from '../constants/Colors';

export type SectionParamList = {
    title?: string,
    titleStyle?:StyleProp<TextStyle>
    outerContainerStyle?:StyleProp<TextStyle>
    containerStyle?:StyleProp<ViewStyle>
    bodyStyle?:StyleProp<ViewStyle>
    subtitle?: string
    withSeparator?: boolean
    children?: React.ReactNode
}

export default function CommonSection(props:SectionParamList){
  return (
    <View style={[styles.outerContainer, props.outerContainerStyle]}>
        <View style={[styles.container, props.containerStyle]}>
            {props.withSeparator?<View style={styles.separator} lightColor="#ddd" darkColor="rgba(255,255,255, 0.3)" />:undefined}
            {props.title?<View style={styles.titleView}>
              <Text style={[styles.title, props.titleStyle]}>{props.title}</Text>
              <Text style={styles.subtitle}>{props.subtitle}</Text>
            </View>:undefined}
            <View style={[styles.bodyView, props.bodyStyle]}>
            {props.children}
            </View>
          </View>
        </View>
    )
}

const styles = StyleSheet.create({
  outerContainer:{
    width:'100%',
    maxWidth:1080,
    alignItems:'stretch',
    backgroundColor:'transparent'
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
      marginBottom: 20,
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
  