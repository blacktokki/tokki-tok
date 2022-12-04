import React, { useState } from 'react';
import { StyleSheet} from 'react-native';
import { CustomButtonProps } from '../types';
import CommonButton from './CommonButton';

export default (props:CustomButtonProps)=>{
    return <CommonButton {...props} style={styles.style}/>
}

const styles = StyleSheet.create({
    style:{
        borderRadius:6, 
        backgroundColor: 'transparent',
        borderWidth:0
    },
});
