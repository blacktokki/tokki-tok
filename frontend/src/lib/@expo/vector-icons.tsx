



import React, { Suspense } from "react";

const lazyIcon = <T extends keyof typeof import("@expo/vector-icons"),>(key:T)=>{
    const Icon = React.lazy(
        () => import("@expo/vector-icons").then(module => {
            return { default: module[key] }
        })
    ) as typeof import("@expo/vector-icons")[T]
    return (props:React.ComponentProps<typeof Icon>)=>{
        return <Suspense fallback={<></>}>
            <Icon {...props}/>
        </Suspense>
    }
}

export const AntDesign = lazyIcon('AntDesign');
export const Ionicons = lazyIcon('Ionicons');
export const FontAwesome = lazyIcon('FontAwesome');
export const MaterialIcons = lazyIcon('MaterialIcons');
export const FontAwesome5 = lazyIcon('FontAwesome5');
export const Entypo = lazyIcon('Entypo');
export const SimpleLineIcons = lazyIcon('SimpleLineIcons');
export const MaterialCommunityIcons = lazyIcon('MaterialCommunityIcons');