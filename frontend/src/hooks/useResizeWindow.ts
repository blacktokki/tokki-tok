import { useState, useEffect } from 'react';
import { Dimensions, Keyboard } from 'react-native';

type WindowType = 'portrait' | 'landscape'

export default function useResizeWindow() {
  const [window, setWindow] = useState(Dimensions.get('window'));
  const [keyboard, setKeyboard] = useState(false)
  const onChange = () => setWindow(Dimensions.get('window'))
  const onKeyboardShow = ()=>setKeyboard(true)
  const onKeyboardHide = ()=>setKeyboard(false)

  useEffect(() => {
    Keyboard.addListener("keyboardDidShow", onKeyboardShow)
    Keyboard.addListener("keyboardDidHide", onKeyboardHide)
    Dimensions.addEventListener("change", onChange);
    return () => {
      Keyboard.removeListener("keyboardDidShow", onKeyboardShow)
      Keyboard.removeListener("keyboardDidHide", onKeyboardHide)
      Dimensions.removeEventListener("change", onChange);
    };
  });
  if (keyboard)
    return 'portrait'
  return window.height >= window.width?'portrait':'landscape' as WindowType;
}