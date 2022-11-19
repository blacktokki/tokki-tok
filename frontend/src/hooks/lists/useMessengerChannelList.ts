
import React from "react";
import { getMessengerChannelList } from "../../apis";
import { Channel, UserMembership } from "../../types";

let _cache:Channel[];
export default function useMessengerChannelList(user?:UserMembership|null, deps?:React.DependencyList){
    const [channelList, setChannelList] = React.useState<Channel[]>()
    const _deps = [user, ...(deps||[])]
    React.useEffect(()=>{
      if (deps==undefined && _cache !=undefined)
        setChannelList(_cache)
      else{
        user && getMessengerChannelList(user.id).then((m)=>{
            setChannelList(m);_cache = m
        });
      }
    }, _deps)
    return channelList
}