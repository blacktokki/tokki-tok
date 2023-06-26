import { useEffect } from "react"
import { InfiniteData, Query, QueryKey, useInfiniteQuery, useMutation, useQueryClient } from "react-query"
import { getMessengerContentList, postMessage, patchMessengerContent, getNewMessengerContentList } from "../../apis"
import { MessengerContent } from "../../types"
import useWebsocketContext from "../useWebsocketContext"

export type MessengerContentPage = {
  next?:MessengerContentPage
  current:MessengerContent[]
}

const updateContnetPage = (pages:MessengerContentPage[], updateMessages:MessengerContent[])=>{
  let update_i = 0
  pages.forEach(page=>{
    if (update_i == updateMessages.length)
      return
    page.current.forEach(v=>{
      if (update_i == updateMessages.length)
        return
      if (v.id==updateMessages[update_i].id){
        v.timer = updateMessages[update_i].timer
        v.is_archive = updateMessages[update_i].is_archive
        update_i += 1
      }
    })
    page.current = page.current.filter(v=>!v.is_archive)
  })
}

export default function useMessengerContentList(channel_id:number){  
  const queryClient = useQueryClient()
  const refetch = (query:Query<MessengerContentPage, unknown, InfiniteData<MessengerContentPage>, QueryKey>)=>{
    const updated_gte = new Date(query.state.dataUpdatedAt).toISOString()
    const newData = {...query.state.data}
    getNewMessengerContentList(channel_id, updated_gte).then(contents=>{
      if(newData.pages){
        const lastMessageId = newData.pages[0].current[0].id || 0
        const nextMessages = contents.filter(v=>v.id>lastMessageId && v.is_archive==false)
        const updateMessages = contents.filter(v=>v.id<=lastMessageId)
        newData.pages[0].current = [...nextMessages, ...newData.pages[0].current]
        updateContnetPage(newData.pages, updateMessages)
      }
    })
    return false
  }
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
      refetchOnWindowFocus:refetch
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
          _data?.pages && updateContnetPage(_data.pages, [lastJsonMessage['data']])
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
  return { create:create.mutate, patch:_patch.mutate }
}