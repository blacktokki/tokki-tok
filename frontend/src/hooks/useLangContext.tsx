import React, { createContext, useContext, useState, useEffect } from "react";
import { IntlShape } from "@formatjs/intl";
import AsyncStorage from '@react-native-async-storage/async-storage';
import intl, { translations } from "../lang";

const IntlContext = createContext<{locale?:string, setLocale:(locale:string|undefined)=>void}>({setLocale:()=>{}});

export const IntlProvider = ({children}:{children:React.ReactNode})=>{
  const [complete, setComplete] = useState(false)
  const [locale, setLocale] = useState<string>()
  useEffect(()=>{
    AsyncStorage.getItem("locale").then(v=>{
      setLocale(v || undefined)
      setComplete(true)
    })
  }, [])
  return complete?<IntlContext.Provider value={{locale, setLocale}}>
      {children}
    </IntlContext.Provider>:<></>
}



type TranslationParams = Parameters<IntlShape<string>["formatMessage"]>[1];

export default ()=>{
  const { locale, setLocale } = useContext(IntlContext)
  return {
    lang:(key: string, params?: TranslationParams) => {
      if (locale == 'en' || key.length==0)
        return key
      if (locale != undefined && locale !='auto')
        return translations[locale as 'ko'][key]
      return intl
        .formatMessage({ id: key, defaultMessage: key }, params)
        .toString()
    },
    locale,
    setLocale: (locale:string)=>{AsyncStorage.setItem('locale', locale).then(()=>setLocale(locale))}
  }
}
