import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react"
import firebase from "firebase/app";
import "firebase/messaging";
//@ts-ignore
import {FCM_PUBLIC_VAPID_KEY} from "@env"
import { Auth } from "./useAuthContext";
import { Notification as NotificationType, UserMembership } from "../types";
import { getNotification, postNotification, putNotification } from "../apis/notification";
import useWebsocketContext from "./useWebsocketContext";

const firebaseConfig = require("../../web/firebase-config.js")
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const messaging = firebase.messaging(app);

messaging.onMessage((payload) => {
  console.log('Message received. ', payload);
  // ...
});

const FirebaseContext = createContext<{enable:boolean, setEnable:(enable:boolean)=>void}>({enable:false, setEnable:()=>{}});

const requestToken = async()=>{
  console.log('Requesting permission...');
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    console.log('Notification permission granted.');   
    const currentToken = await messaging.getToken({ vapidKey: FCM_PUBLIC_VAPID_KEY })
    if (currentToken) {
      console.log('currentToken: ', currentToken)
      return currentToken
      // Send the token to your server and update the UI if necessary
      // ...
    } else {
      // Show permission request UI
      console.log('No registration token available. Request permission to generate one.');
      // ...
    }
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
