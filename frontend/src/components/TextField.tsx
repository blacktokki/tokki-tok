import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { CustomTextInputProps } from '../types';
import CommonTextInput from './CommonTextInput';
import RowField from './RowField';

export default function TextField(props:CustomTextInputProps & {name: string, width?:any, textStyle?:StyleProp<TextStyle>}) {
  return (
    <RowField name={props.name} width={props.width} textStyle={props.textStyle}>
      <CommonTextInput {...props} />
   </RowField>
  )
}