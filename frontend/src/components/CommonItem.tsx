import * as React from 'react';
import { View } from './Themed';
import { StyleSheet, StyleProp, ViewStyle, TextStyle, Pressable } from 'react-native';
import Colors from '../constants/Colors';

export type ItemParamList = {
    outerContainerStyle?:StyleProp<TextStyle>
    containerStyle?:StyleProp<ViewStyle>
    bodyStyle?:StyleProp<ViewStyle>
    children?: React.ReactNode
    onPress?: ()=>void
}

export default function CommonItem(props:ItemParamList){
  // const [hover, setHover] = React.useState(false)
  const [press, setPress] = React.useState(false)
  return (
    <Pressable
      style={[styles.outerContainer ,props.outerContainerStyle, (press)?{backgroundColor:'rgb(242,242,242)'}:{}]}
      onPressIn={()=>setPress(true)}
      onPress={()=>props.onPress?.()}
      onPressOut={()=>setPress(false)}
      //  //@ts-ignore
      //  onHoverIn={()=>setHover(true)}
      //  onHoverOut={()=>setHover(false)}
    >
        <View style={[styles.container ,props.containerStyle]}>
            <View style={[styles.bodyView, props.bodyStyle]}>
                <>{props.children}</>
            </View>
      </View>
    </Pressable>
    )
}

const styles = StyleSheet.create({
  outerContainer:{
    width:'100%',
    maxWidth:1080,
    alignItems:'stretch',
  },  
  container: {
      marginHorizontal:20,
      backgroundColor:'transparent'
    },
    bodyView:{
      width: '100%',
      padding: 10,
      minHeight: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomWidth:1,
      borderColor:Colors.borderColor,
      backgroundColor:'transparent'
    }
  });
  