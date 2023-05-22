import React, { createContext, useContext, useEffect } from "react"
import firebase from "firebase/app";
import "firebase/messaging";
//@ts-ignore
import {FCM_PUBLIC_VAPID_KEY, FCM_API_KEY} from "@env"
import { Notification as NotificationType, UserMembership } from "../types";
import { getNotification, postNotification, putNotification } from "../apis/notification";
import { Auth } from "./useAuthContext";
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
    const currentToken = await messaging.getToken({serviceWorkerRegistration, vapidKey: FCM_PUBLIC_VAPID_KEY })
    window.addEventListener('beforeunload', (event:any) => {
      event.preventDefault();
      serviceWorkerRegistration.unregister()
    });
    if (currentToken)
      return currentToken
  }
  return undefined
}


let noti:NotificationType|undefined

const setEnable = async(enable:boolean, user?:UserMembership|null)=>{
  context.enable = enable
  if(user && enable){
    const token = await requestToken() || null
    noti = await getNotification(user.id)
    if (noti == undefined)
      noti = await postNotification({user:user.id, type:'WEB', token})
    else
      noti = await putNotification({...noti, token})
  }
  else if (noti){
    await putNotification({...noti, token:null})
  }
}

const context:{enable:boolean, setEnable:(enable:boolean, user?:UserMembership|null)=>void} = {enable:false, setEnable}
const FirebaseContext = createContext(context);

export default (auth:Auth)=>{
  useEffect(()=>{
    setEnable(true, auth.user)
  }, [auth.user])
  const firebaseContext = useContext(FirebaseContext)
  return firebaseContext
}
