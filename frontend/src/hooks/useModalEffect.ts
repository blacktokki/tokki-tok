import { DependencyList, useEffect } from "react";
import { EventArg, useNavigation } from "@react-navigation/core";


export default (callback:()=>void, deps?:DependencyList)=>{
    const navigation = useNavigation()
    useEffect(()=>{
        const event = (e:EventArg<any, true, any>)=> {
            e.preventDefault();
            callback()
        }
        navigation.addListener('beforeRemove', event)
        return () => {
            navigation.removeListener('beforeRemove', event)
        }
  }, deps)
}