// @ts-ignore
import {API_URL, FCM_PUBLIC_VAPID_KEY as fcm1, FCM_API_KEY as fcm2, TURN_SERVER as turn1 } from "@env"
export const accountURL =  `${API_URL}/account/`
export const baseURL =  `${API_URL}/messenger/`
const [SCHEMA, DOMAIN] = `${API_URL}`.split('://')
export const websockerURL = `${SCHEMA=='https'?'wss':'ws'}://${DOMAIN}`
export const FCM_PUBLIC_VAPID_KEY = fcm1
export const FCM_API_KEY = fcm2
export const TURN_SERVER = turn1