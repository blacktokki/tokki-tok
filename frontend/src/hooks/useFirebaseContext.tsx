import React, { useState,  useEffect, createContext, useMemo, useRef, useContext } from "react"
import firebase from "firebase/app";
import "firebase/messaging";
import {FCM_PUBLIC_VAPID_KEY, FCM_API_KEY} from "../constants/Envs"
import { Notification as NotificationType, UserMembership } from "../types";
import { getNotification, postNotification, putNotification } from "../apis/notification";

const firebaseConfig = require("../../web/firebase-config.js")
// Initialize Firebase
const key = firebaseConfig.messagingSenderId
const apiKeyEncrypted = (FCM_API_KEY as string).split('').map((v, i)=> (v.charCodeAt(0) ^ key.charCodeAt(i)).toString(16).padStart(2, '0')).join('')
const app = firebase.initializeApp({...firebaseConfig, apiKey:FCM_API_KEY});
// const analytics = getAnalytics(app);
const messaging = firebase.messaging(app);

messaging.onMessage((payload) => {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }
  else if (Notification.permission === "granted") {
    const message_set = JSON.parse(payload.data['message_set'])[0]
    new Notification(payload.data.channel_name, { body: `${payload.data.name}: ${message_set.content}` });
  }
});

const requestToken = async()=>{
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    const serviceWorkerRegistration = await navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/firebase-messaging-sw.js?${apiKeyEncrypted}`)
    console.log('[SW]: SCOPE: ', serviceWorkerRegistration.scope);
    const currentToken = await messaging.getToken({serviceWorkerRegistration, vapidKey: FCM_PUBLIC_VAPID_KEY }).catch(
      async()=>await messaging.getToken({serviceWorkerRegistration, vapidKey: FCM_PUBLIC_VAPID_KEY })
    )
    window.addEventListener('beforeunload', (event:any) => {
      event.preventDefault();
      serviceWorkerRegistration.unregister()
    });
    if (currentToken)
      return currentToken
  }
  return null
}

const FirebaseContext = createContext<{enable?:boolean, setEnable:(enable:boolean)=>void}>({setEnable:()=>{}});

export const FirebaseProvider = ({user, children}:{user?:UserMembership|null, children:React.ReactNode})=>{
  const tokenRef = useRef<string|null>()
  const [notification, setNotification] = useState<NotificationType>()
  const enable = useMemo(()=>notification==undefined?undefined:(notification.token?true:false), [notification])
  const setEnable = (enable:boolean)=>{
    if(user && notification){
      putNotification({...notification, token:enable?(tokenRef.current==undefined?null:tokenRef.current):null}).then((noti)=>{
        setNotification(noti)
      })
    }
  }
  useEffect(()=>{
    let isMount = true;
    if(user){
      requestToken().then((t)=>{
        tokenRef.current = t
        if (notification){
          putNotification({...notification, token:tokenRef.current}).then((noti)=>{
            if(isMount)setNotification(noti)
          })
        }
      });
      (async ()=>{
        let noti = await getNotification(user.id)
        if(noti==undefined){
          noti = await postNotification({user:user.id, type:'WEB', token:null})
        }
        else if (noti.token && tokenRef.current){
          noti = await putNotification({...noti, token:tokenRef.current})
        }
        if(isMount)setNotification(noti)
      })()
    }
    return ()=>{isMount=false}
  }, [user])
  return enable!=undefined?
  <FirebaseContext.Provider value={{enable, setEnable}}>
    {children}
  </FirebaseContext.Provider>:
  <></>
}

export default ()=>{
  const {enable, setEnable} = useContext(FirebaseContext)
  return {enable, setEnable}
}
