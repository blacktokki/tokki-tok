import * as React from 'react';
import { Button } from 'react-native-paper';
import { CustomButtonProps } from '../../types';

export default (props:CustomButtonProps & {mode?:"text" | "outlined" | "contained"}) => (
  <Button style={props.style} uppercase={false} labelStyle={[{fontSize:14, fontFamily:undefined}, props.textStyle]} mode={props.mode} onPress={props.onPress} color={props.color as string}>
    {props.title}
  </Button>
);