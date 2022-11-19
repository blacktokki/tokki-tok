
import React from "react";
import { getBoardContentList } from "../../apis";
import { BoardContent } from "../../types";

let _cache:BoardContent[];
export default function useBoardContentList(channel_id:number, deps?:React.DependencyList){
    const [contentList, setContentList] = React.useState<BoardContent[]>()
    const _deps = [channel_id, ...(deps||[])]
    React.useEffect(()=>{
      if (deps==undefined && _cache !=undefined)
        setContentList(_cache)
      else{
        getBoardContentList(channel_id).then((m)=>{
            setContentList(m);_cache = m
        });
      }
    }, _deps)
    return contentList
}