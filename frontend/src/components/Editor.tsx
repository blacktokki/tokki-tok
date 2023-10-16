import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import Editor from '../lib/tinymce/Editor';
// import Editor from '../lib/tinymce/EditorView';
import { EditorProps } from '../types';

export default (props:EditorProps & {active:boolean, children?:React.ReactNode}) => {
	const [ready, setReady] = useState<boolean>(false)
  useEffect(()=>{
    if(!props.active)
      setReady(false)
  }, [props.active])
  return props.active?(
        <View style={{flex:1, height:'100%'}}>
        {!ready && props.children}
    	  <Editor
          theme={props.theme}
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
