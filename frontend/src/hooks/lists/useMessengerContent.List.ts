import { useEffect, useState } from "react"
import { useInfiniteQuery, useMutation, useQueryClient } from "react-query"
import { getMessengerContentList, postMessage, deleteMessengerContent } from "../../apis"
import { MessengerContent } from "../../types"
import useWebsocketContext from "../useWebsocketContext"


export default function useMessengerContentList(channel_id:number){
  const [extraData, setExtraData] = useState<MessengerContent[]>([])
  const { data, fetchNextPage } = useInfiniteQuery("MessengerContentList", async({pageParam})=>getMessengerContentList(channel_id, pageParam), {
    getNextPageParam:(lastPage)=>lastPage.length?lastPage[lastPage.length - 1].id:undefined
  })
  const { lastJsonMessage } = useWebsocketContext()
  useEffect(()=>{
    if(lastJsonMessage !=null && lastJsonMessage['type']=='nextMessage'){
      console.log(lastJsonMessage)
    }
  }, [lastJsonMessage])

  return { data, extraData , fetchNextPage }
}

export function useMessengerContentMutation(){
  const queryClient = useQueryClient()
  const create = useMutation(postMessage, {
    onSuccess: () => {
      // queryClient.setQueryData(['MessengerContentList'], (data:any) => ({
      //   pages: data.pages.slice(0, 1),
      //   pageParams: data.pageParams.slice(0, 1),
      // }))
      // queryClient.invalidateQueries("MessengerContentList")
    }
  });
  const remove = useMutation(deleteMessengerContent, {
    onSuccess: (d, variables) => {
      // queryClient.setQueryData(['MessengerContentList'], (data:any) => ({
      //   pages: (data.pages as MessengerContent[][]).map(v=>v.filter(v2=>v2.id != variables)),
      //   pageParams: data.pageParams,
      // }))
    }
  })
  return { create:create.mutate, remove:remove.mutate }
}