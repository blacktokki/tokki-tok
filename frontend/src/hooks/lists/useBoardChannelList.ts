
import React from "react";
import { getBoardChannelList } from "../../apis";
import { Channel, UserMembership } from "../../types";

let _cache:Channel[];
export default function useBoardChannelList(user?:UserMembership|null, deps?:React.DependencyList){
    const [channelList, setChannelList] = React.useState<Channel[]>()
    const _deps = [user, ...(deps||[])]
    React.useEffect(()=>{
      if (deps==undefined && _cache !=undefined)
        setChannelList(_cache)
      else{
        const rootMembership = user?.membership_set.find(g=>g.root_group_id==null);
        rootMembership?.group && getBoardChannelList(rootMembership.group).then((m)=>{
            setChannelList(m);_cache = m
        });
      }
    }, _deps)
    return channelList
}