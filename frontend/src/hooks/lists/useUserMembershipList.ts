
import React from "react";
import { getUserMembershipList } from "../../apis";
import {UserMembership } from "../../types";

let _cache:UserMembership[];
export default function useUserMembershipList(user?:UserMembership|null, deps?:React.DependencyList){
    const [userList, setUserList] = React.useState<UserMembership[]>()
    const _deps = [user, ...(deps||[])]
    React.useEffect(()=>{
      if (deps==undefined && _cache !=undefined)
        setUserList(_cache)
      else{
        const rootMembership = user?.membership_set.find(g=>g.root_group_id==null);
        rootMembership?.group && getUserMembershipList(rootMembership.group).then((m)=>{
            setUserList(m);_cache = m
        });
      }
    }, _deps)
    return userList
}