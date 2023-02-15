import { useState, useEffect } from 'react';
import { Dimensions, Keyboard } from 'react-native';
//@ts-ignore
import useMobileDetect from 'use-mobile-detect-hook';

type WindowType = 'portrait' | 'landscape'

export default function useResizeWindow() {
  const detectMobile = useMobileDetect();
  const [window, setWindow] = useState(Dimensions.get('window'));
  const onChange = () => setWindow(Dimensions.get('window'))

  useEffect(() => {
    Dimensions.addEventListener("change", onChange);
    return () => {
      Dimensions.removeEventListener("change", onChange);
    };
  });
  if (detectMobile.isMobile())
    return 'portrait'
  return window.height >= window.width?'portrait':'landscape' as WindowType;
}