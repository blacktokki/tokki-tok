
import React, {useState} from 'react';
import { StyleProp, TextStyle, View } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import useLangContext from '../hooks/useLangContext';
import { CustomTextInputProps } from '../types';
import CommonButton from './CommonButton';
import RowField from './RowField';
import { Text } from './Themed';
import useResizeContext from '../hooks/useResizeContext';

export default function CopyField(props:CustomTextInputProps & {name: string, width?:any, textStyle?:StyleProp<TextStyle>}) {
  const { lang } = useLangContext()
  const windowType = useResizeContext()
  const [copied, setCopied] = useState(false)
  return (
    <RowField name={props.name} width={props.width} textStyle={props.textStyle}>
      <View style={{flexDirection:windowType=='landscape'?'row':'column', justifyContent:'space-between'}}>
        <View style={{justifyContent:'center'}}>
          <Text style={{fontSize:16}}>{props.value}</Text>
        </View>
        <View>
          <CommonButton title={lang('copy')} onPress={()=>{Clipboard.setString(props.value);setCopied(true)}}/>
          {copied && <Text style={{fontSize:12, alignSelf:'center', color:'red'}}>{lang("copied")}</Text>}
        </View>
      </View>
   </RowField>
  )
}