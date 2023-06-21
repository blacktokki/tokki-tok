import { useEffect, useMemo } from "react"
import { useQuery, useQueryClient } from "react-query"
import { getTimerMessageContentList } from "../../apis"
import { MessengerContent } from "../../types"
import useWebsocketContext from "../useWebsocketContext"
import dayjs from "dayjs"

export default function useTimerMessageContentList(channel_id:number){  
  const queryClient = useQueryClient()
  const { data } = useQuery<MessengerContent[]>(
    ["TimerMessageContentList", channel_id], 
    async()=>await getTimerMessageContentList(channel_id, dayjs().toISOString()), 
  )
  const { lastJsonMessage } = useWebsocketContext()
  useEffect(()=>{
    if(lastJsonMessage !=null && lastJsonMessage['data']['channel'] == channel_id){
      if(lastJsonMessage['type']=='next_message'){
        if(lastJsonMessage['data']['timer'] && dayjs() < dayjs(lastJsonMessage['data']['timer']))
          queryClient.setQueryData<MessengerContent[]>(["TimerMessageContentList", channel_id], (_data)=>{
            return [...(_data || []), lastJsonMessage['data']]
          })
      }
      if(lastJsonMessage['type']=='update_message'){
        queryClient.setQueryData<MessengerContent[]>(["TimerMessageContentList", channel_id], (_data)=>{
          return [...(_data?.filter(v=>v.id!=lastJsonMessage['data'].id || lastJsonMessage['data']['timer']!=null) || [])]
        })
      }
      if(lastJsonMessage['type']=='delete_message'){
        queryClient.setQueryData<MessengerContent[]>(["TimerMessageContentList", channel_id], (_data)=>{
          return [...(_data?.filter(v=>v.id!=lastJsonMessage['data'].id) || [])]
        })
      }
    }
  }, [lastJsonMessage])
  const sorted = useMemo(()=>data?.sort((a, b)=>(a.timer || '') > (b.timer || '')?1:-1), [data])
  useEffect(()=>{
    if (sorted?.[0]?.timer){
      const id = sorted[0].id
      const ms = Math.min(dayjs(sorted[0].timer).diff(dayjs()), Number.MAX_VALUE)
      let timeout = setTimeout(()=>{
        queryClient.setQueryData<MessengerContent[]>(["TimerMessageContentList", channel_id], (_data)=>{
          return (_data || []).filter(v=>v.id!=id || dayjs(v.timer).diff(dayjs()) > 0)
        })
      }, ms)
      return ()=>clearTimeout(timeout)
    }
  },[sorted])
  return sorted
}
