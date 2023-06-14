import React from 'react'
import { Picker } from "@react-native-picker/picker"


export default ({value, setValue, values}:{value:any, setValue:(v:any)=>void, values:{label:string, value:any}[]})=>{
    return <Picker
        style={{flex:1}}
        itemStyle={{fontSize:20}}
        selectedValue={value}
        onValueChange={setValue}>
        {values.map((v, i)=><Picker.Item key={i} label={v.label} value={v.value} />)}
    </Picker>
}