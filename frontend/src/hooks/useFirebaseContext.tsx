import { useState,  useEffect } from "react"
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
let notiListener:((enable:boolean)=>void)[] = []

const initEnable = async(user:UserMembership, callback:(enable:boolean)=>void)=>{
  notiListener.push(callback)
  if (notiListener.length == 1){  
    noti = await getNotification(user.id)
    if (noti === undefined){
      noti = await postNotification({user:user.id, type:'WEB', token:null})
    }
    else if(noti.token){
      requestToken().then(async token=>{
        if(noti)
          noti = await putNotification({...noti, token:(token||null)})
        notiListener.map(c=>c(noti?.token?true:false))
      })
    }
    notiListener.map(c=>c(noti?.token?true:false))
  }
}

const changeEnable = async(enable:boolean)=>{
  if (noti){
    if(enable){
      const token = await requestToken() || null
      noti = await putNotification({...noti, token})
    }
    else{
      noti = await putNotification({...noti, token:null})
    }
  }
  return noti?.token?true:false
}

export default (auth:Auth)=>{
  const [enable, setEnable] = useState<boolean|null>(null)
  useEffect(()=>{
    if (auth.user){
      if(noti === undefined)
        initEnable(auth.user, setEnable)
      else{
        setEnable(noti.token?true:false)
      }
    }
  }, [auth.user])
  return {
    enable,
    setEnable:(_enable:boolean)=>changeEnable(_enable).then(setEnable)
  }
}
