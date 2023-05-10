import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';
//@ts-ignore
import useMobileDetect from 'use-mobile-detect-hook';

type WindowType = 'portrait' | 'landscape'

const getWindowType = (window:ScaledSize)=> window.height >= window.width?'portrait':'landscape' as WindowType;

export default function useResizeWindow() {
  const detectMobile = useMobileDetect();
  const [windowType, setWindowType] = useState(getWindowType(Dimensions.get('window')))
  const onChange = () => setWindowType(getWindowType(Dimensions.get('window')))

  useEffect(() => {
    Dimensions.addEventListener("change", onChange);
    return () => {
      Dimensions.removeEventListener("change", onChange);
    };
  });
  if (detectMobile.isMobile())
    return 'portrait'
  return windowType
}