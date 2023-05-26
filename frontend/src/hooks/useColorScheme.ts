import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@react-navigation/native';
import { useMemo, useEffect, useState } from 'react';
import { ColorSchemeName } from 'react-native';
import { Appearance, ColorSchemeName as UserColorSchemeName } from 'react-native-appearance';

// The useColorScheme value is always either light or dark, but the built-in
// type suggests that it can be null. This will not happen in practice, so this
// makes it a bit easier to work with.

export function useInitColorScheme(){
  const [complete, setComplete] = useState(false)
  useEffect(()=>{
    if (!complete){
      AsyncStorage.getItem("color").then(v=>{
        Appearance.set({colorScheme:(v==null)?'no-preference':(v as any)})
        setComplete(true)
      })
    }
  }, [complete])
  return complete
}

export function setColorScheme(colorScheme:UserColorSchemeName){
  AsyncStorage.setItem('color',colorScheme as string).then(()=>Appearance.set({colorScheme}))
}

export default function useColorScheme(): NonNullable<ColorSchemeName> {
  const { dark } = useTheme()
  const colorScheme = useMemo(()=> dark?'dark':'light', [dark]) as NonNullable<ColorSchemeName>;
  return colorScheme
}
