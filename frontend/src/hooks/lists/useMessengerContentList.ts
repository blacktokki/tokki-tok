import { useEffect } from "react"
import { InfiniteData, useInfiniteQuery, useMutation, useQueryClient } from "react-query"
import { getMessengerContentList, postMessage, deleteMessengerContent, patchMessengerContent } from "../../apis"
import { MessengerContent } from "../../types"
import useWebsocketContext from "../useWebsocketContext"

export type MessengerContentPage = {
  next?:MessengerContentPage
  current:MessengerContent[]
}

export default function useMessengerContentList(channel_id:number){  
  const queryClient = useQueryClient()
  const { data, fetchNextPage } = useInfiniteQuery<MessengerContentPage>(
    ["MessengerContentList", channel_id], 
    async({pageParam})=>getMessengerContentList(channel_id, pageParam).then(current=>({current})), 
    {
      select:data=>{
        if(data.pages.length > 1)
          data.pages[data.pages.length - 2].next = data.pages[data.pages.length - 1]
        return data;
      },
      getNextPageParam:(lastPage)=>lastPage?.current.length?lastPage.current[lastPage.current.length - 1].id:undefined,
      refetchOnReconnect:false,
      refetchOnWindowFocus:true
    }
  )
  const { lastJsonMessage } = useWebsocketContext()
  useEffect(()=>{
    if(lastJsonMessage !=null && lastJsonMessage['data']['channel'] == channel_id){
      if(lastJsonMessage['type']=='next_message'){
        queryClient.setQueryData<InfiniteData<MessengerContentPage>>(["MessengerContentList", channel_id], (_data)=>{
          if(_data?.pages[0].current && _data?.pages[0].current[0].id != lastJsonMessage['data'].id)
            _data.pages[0].current = [lastJsonMessage['data'], ..._data?.pages[0].current]
          return {...(_data || {pages:[], pageParams:[]})}
        })
      }
      if(lastJsonMessage['type']=='update_message'){
        queryClient.setQueryData<InfiniteData<MessengerContentPage>>(["MessengerContentList", channel_id], (_data)=>{
          _data?.pages.forEach(page=>{
            page.current.forEach(v=>{
              if (v.id==lastJsonMessage['data'].id){
                v.timer = lastJsonMessage['data'].timer
              }
            })
          })
          return {...(_data || {pages:[], pageParams:[]})}
        })
      }
      if(lastJsonMessage['type']=='delete_message'){
        queryClient.setQueryData<InfiniteData<MessengerContentPage>>(["MessengerContentList", channel_id], (_data)=>{
          _data?.pages.forEach(page=>{
            const len = page.current.length
            const newCurrent = page.current.filter(v=>v.id!=lastJsonMessage['data'].id)
            if (len != newCurrent.length){
              page.current = newCurrent
            }
          })
          return {...(_data || {pages:[], pageParams:[]})}
        })
      }
    }
  }, [lastJsonMessage])
  return { data, fetchNextPage }
}

export function useMessengerContentMutation(channelId?:number){
  // const queryClient = useQueryClient()
  const create = useMutation(postMessage, {
    onSuccess: () => {
      // queryClient.setQueryData(['MessengerContentList'], (data:any) => ({
      //   pages: data.pages.slice(0, 1),
      //   pageParams: data.pageParams.slice(0, 1),
      // }))
      // queryClient.invalidateQueries("MessengerContentList")
    }
  });
  const _patch = useMutation(patchMessengerContent);
  const _delete = useMutation(deleteMessengerContent, {
    onSuccess: (d, variables) => {
      // queryClient.setQueryData(['MessengerContentList'], (data:any) => ({
      //   pages: (data.pages as MessengerContent[][]).map(v=>v.filter(v2=>v2.id != variables)),
      //   pageParams: data.pageParams,
      // }))
    }
  })
  return { create:create.mutate, patch:_patch.mutate, delete:_delete.mutate }
}