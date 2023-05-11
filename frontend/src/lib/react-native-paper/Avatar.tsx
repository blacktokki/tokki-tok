import * as React from 'react';
import { Avatar } from 'react-native-paper';
import { AvatarProps } from '../../types';

const normalizeHash = (hash: number, min: number, max: number) => {
    return Math.floor((hash % (max - min)) + min);
};

const stringToHSL = (str: string, initHash?:number) => {
    let hash = initHash || 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    hash = Math.abs(hash);
    return `hsl(${normalizeHash(hash, 0, 360)}, ${normalizeHash(hash, 0, 100)}%, ${normalizeHash(hash, 25, 75)}%)`;
};

export default (props:AvatarProps) => {
    const backgroundColor = stringToHSL(props.name, props.userId)
    return <Avatar.Text style={{backgroundColor}} size={props.size} label={props.name.split(' ').map(v=>v[0]).join().toUpperCase()} />
};