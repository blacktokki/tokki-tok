import { useWindowDimensions } from 'react-native';

type ScaleType = 'small' | 'medium' | 'large'

export default ()=>{
    const {width} = useWindowDimensions()
    return width<400?'small':(width<1080?'medium':'large') as ScaleType
}