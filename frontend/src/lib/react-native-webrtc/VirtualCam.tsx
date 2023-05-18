import React, { useEffect, useRef, useState } from "react";
import {Button, Platform, View, Text} from "react-native";
import WebView from "react-native-webview";
import useAuthContext from "../../hooks/useAuthContext";
import useWebsocketContext from "./useWebsocketContext";
import {useLocalCam, camStyle} from "./webrtc";
import {MediaStream, RTCPeerConnection, RTCSessionDescription, peerConstraints, sessionConstraints} from "./webrtc/p2p"

const useViatualCam = ()=>{
  const webViewRef = useRef(null)
  const pcRef = useRef<{pc?:RTCPeerConnection}>({})
  const [stream, setStream] = useState<MediaStream>()
  const send = (data:any)=>{
    if (Platform.OS == 'web')
      (webViewRef.current as any).contentWindow.postMessage(JSON.stringify(data), undefined/*'http://localhost:3001/'*/)
    else
      (webViewRef.current as any).postMessage(JSON.stringify(data))
  }
  const receive = async(sendData:{type:string, data:any})=>{
    const {type, data} = sendData
    if (type == "call"){
      console.log('(virtual)2 call_received')
      const peerConnection = new RTCPeerConnection( peerConstraints );
      pcRef.current.pc = peerConnection
      peerConnection.addEventListener( 'icecandidate', (event:any) => {
        if ( !event.candidate ) { return; };
        send({type:'ICEcandidate', data:{rtcMessage:event.candidate}})
      });
      const offerDescription = new RTCSessionDescription(data.rtcMessage);
      await peerConnection.setRemoteDescription( offerDescription );
      const answerDescription = await peerConnection.createAnswer( sessionConstraints );
      await peerConnection.setLocalDescription( answerDescription );
      send({type:'answer_call', data:{rtcMessage:peerConnection.localDescription}})
      const streams = pcRef.current.pc.getRemoteStreams()
      setStream(new MediaStream(streams[streams.length - 1]))
    }
    if (type == "ICEcandidate"){
      const candidate = new RTCIceCandidate(data.rtcMessage);
        console.log("ICE candidate Added");
        pcRef.current.pc.addIceCandidate(candidate);
    }
    if (type == "console"){
      console.log("(virtual)", data)
    }
  }
  const listener = (event:any)=>{
    if(Platform.OS == 'web'){
      try{
        // console.log('parent receive', event.data)
        receive(JSON.parse(event.data))
      }
      catch(e){
      }
    }
    else{
      receive(JSON.parse(event.nativeEvent.data))
    }
  }
  const virtualStop = ()=>{
    if(pcRef.current.pc){
      pcRef.current.pc.close();
      pcRef.current.pc = undefined
    }
    setStream(undefined)
  }
  return {webViewRef, stream, listener, virtualStop}
}

const PATH = `${process.env.PUBLIC_URL}/virtual.html`

export default (props:{mode?:'virtual'|null})=>{
  const {webViewRef, stream, listener, virtualStop} = useViatualCam()
  const [active, setActive] = useState(props.mode == 'virtual')
  //localCam code
  const {auth} = useAuthContext()
  const {lastJsonMessage, sendJsonMessage} = useWebsocketContext()
  const {start, stop, websocketOnMessage, isPlay} = useLocalCam(sendJsonMessage)
  const _stop = ()=>{
    stop()
    virtualStop()
    setActive(false)
  }
  useEffect(()=>{
    auth.user && lastJsonMessage && websocketOnMessage(lastJsonMessage, auth.user)
  }, [lastJsonMessage, auth])
  useEffect(()=>{
    if(props.mode && !isPlay){
      auth.user && stream && start(auth.user, stream)
    }
    else if(props.mode===null && isPlay){
      _stop()
    }
  }, [isPlay, auth, props.mode, stream])
  //localCam code end
  useEffect(()=>{
    if(Platform.OS == 'web'){
      window.addEventListener('message', listener)
      return ()=>window.removeEventListener('message', listener)
    }
  }, [])
  return <View style={camStyle.container}>
    <View style={[camStyle.cam, {width:'100%'}]}>
      {active?(
        Platform.OS == 'web'?
          <iframe ref={webViewRef} src={PATH} allow='camera *;microphone *' height="100%" width="100%"/>:
          <WebView
                  ref={webViewRef}
                  source={{ uri: PATH}}
                  originWhitelist={['*']}
                  allowsInlineMediaPlayback
                  javaScriptEnabled
                  mediaPlaybackRequiresUserAction={false}
                  javaScriptEnabledAndroid
                  useWebkit
                  startInLoadingState={true}
                  style={{flex:1}}
                  onMessage={listener}
              />):
        undefined}
    </View>
    <View style={camStyle.bottonContainer}>
      <View style={camStyle.buttonBar}>  
      </View>
      {(props.mode === undefined || isPlay) &&<View style={{flexDirection:'row'}}><Text style={camStyle.label}>{auth.user?.name}</Text></View>}
      <View style={camStyle.buttonBar}>
        {props.mode === undefined && !isPlay && <Button title="Start" onPress={()=>auth.user && start(auth.user)} />}
        {props.mode === undefined && isPlay && <Button title="Stop" onPress={stop} />}
      </View>
    </View>
  </View>
}
