import React, { useLayoutEffect } from 'react';

import { StackScreenProps } from '@react-navigation/stack';
import useAuthContext from '../../hooks/useAuthContext';

export default function DemoScreen({navigation}: StackScreenProps<any, 'Demo'>) {
    const {dispatch} = useAuthContext()
    useLayoutEffect(() => {
        navigation.setOptions({headerRight: undefined});
        dispatch({type:"LOGIN_GUEST"})
    }, []);
  return <></>
};