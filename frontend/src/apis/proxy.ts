// @ts-ignore
import {API_URL as API_URL_ORIGIN, USE_PROXY as USE_PROXY} from "@env"
if (USE_PROXY){
    navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/proxy-sw.js?api_url=${API_URL_ORIGIN}`)
}
export const API_URL = USE_PROXY?"":API_URL_ORIGIN
