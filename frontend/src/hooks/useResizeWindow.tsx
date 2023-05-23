import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';
import { Dimensions, ScaledSize, useWindowDimensions } from 'react-native';
//@ts-ignore
import useMobileDetect from 'use-mobile-detect-hook';

type WindowType = 'portrait' | 'landscape'

const getWindowType = (window:{width:number, height:number})=> window.height >= window.width?'portrait':'landscape' as WindowType;

const ResizeWindowContext = createContext<WindowType>(getWindowType(Dimensions.get('window')));

export const ResizeWindowProvider = ({children}:{children:React.ReactNode})=>{
  const detectMobile = useMobileDetect();
  const {width, height} = useWindowDimensions()
  const [windowType, setWindowType] = useState(getWindowType({width, height}))
  useEffect(()=>{
    setWindowType(getWindowType({width, height}))
  }, [width, height])
  return <ResizeWindowContext.Provider value={detectMobile.isMobile()?'portrait':windowType}>
    {children}
  </ResizeWindowContext.Provider>
}

export default function useResizeWindow() {
  const windowType = useContext(ResizeWindowContext)
  return windowType
}