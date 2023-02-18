import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react"
import firebase from "firebase/app";
import "firebase/messaging";
//@ts-ignore
import {FCM_PUBLIC_VAPID_KEY, FCM_API_KEY} from "@env"
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

const FirebaseContext = createContext<{enable:boolean, setEnable:(enable:boolean)=>void}>({enable:false, setEnable:()=>{}});

const requestToken = async()=>{
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    const serviceWorkerRegistration = await navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/firebase-messaging-sw.js?${apiKeyEncrypted}`)
    console.log('[SW]: SCOPE: ', serviceWorkerRegistration.scope);
    const currentToken = await messaging.getToken({serviceWorkerRegistration, vapidKey: FCM_PUBLIC_VAPID_KEY })
    if (currentToken)
      return currentToken
  }
  return undefined
}

export const FirebaseProvider = ({children, user}:{user?:UserMembership|null, children:React.ReactNode})=>{
  const tokenRef = useRef<string>()
  const [notification, setNotification] = useState<NotificationType>()
  const enable = useMemo(()=>!(notification?.token), [notification])
  const setEnable = (enable:boolean)=>{
    if(user && notification){
      putNotification({...notification, token:enable||tokenRef.current==undefined?null:tokenRef.current}).then((noti)=>{
        setNotification(noti)
      })
    }
  }
  
  useEffect(()=>{
    let isMount = true;
    if(user){
      requestToken().then((t)=>{
        tokenRef.current = t
        getNotification(user.id).then(noti=>{
          const setNotificationInternal = (n:NotificationType)=>{
            if (isMount)setNotification(n)
          }
          const token = t==undefined?null:t
          if (noti == undefined)
            postNotification({user:user.id, type:'WEB', token}).then(setNotificationInternal)
          else
            putNotification({...noti, token}).then(setNotificationInternal)
        })
      })
    }
    return ()=>{isMount=false}
  },[])
  return !user?<>{children}</>:<FirebaseContext.Provider value={{enable, setEnable}}>
    {children}
  </FirebaseContext.Provider>
}

export default ()=>{
  const firebaseContext = useContext(FirebaseContext)
  return firebaseContext
}
