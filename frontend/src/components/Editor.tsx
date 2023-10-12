import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import Editor from '../lib/tinymce/Editor';
import { EditorProps } from '../types';

export default (props:EditorProps & {active:boolean, children?:React.ReactNode}) => {
	const [ready, setReady] = useState<boolean>(false)
  useEffect(()=>{
    if(!props.active)
      setReady(false)
  }, [props.active])
  return props.active?(
        <View style={{flex:1}}>
        {!ready && props.children}
    	  <Editor
          value={props.value}
          setValue={props.setValue}
          onReady={()=>{
            if(!ready){
              setReady(true); props.onReady?.()
            }
          }}/>
      </View>
    ):<>{props.children}</>;
};
