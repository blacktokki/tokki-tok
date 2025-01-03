import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getChannelList, postChannel, postDirectChannel, patchChannel } from "../../services";
import { MessengerChannel, MessengerContent } from "../../types";
import { Auth } from "../useAuthContext";
import useWebsocketContext from "../useWebsocketContext";

export default function useMessengerChannelList(type:string, auth?:Auth){
  const queryClient = useQueryClient()
  const {lastJsonMessage} = useWebsocketContext()
  const { data } = useQuery(["ChannelList", type] , async()=>await getChannelList(type, auth?.user?.id))

  useEffect(()=>{
    if(lastJsonMessage !=null){
      if(lastJsonMessage['type']=='enter'){
        queryClient.setQueryData<MessengerChannel[]>(["ChannelList", type], (_data)=>{
          return (_data?.find(v=>v.id==lastJsonMessage['data']['id'])?_data:[lastJsonMessage['data'] , ...(_data|| [])]).sort((a, b)=>a.id - b.id)
        })
      }
      if (lastJsonMessage['type']=='next_message'){
        const data:MessengerContent = lastJsonMessage['data']
        queryClient.setQueryData<MessengerChannel[]>(["ChannelList", type], (_data)=>(_data || []).map(v=>{
          if (v.id == data.channel){
            return {...v, last_message:{content:data.message_set[0]?.content, created:data.created}}
          }
          return v
        }))
      }
      // if(lastJsonMessage['type']=='leave'){
      //   queryClient.setQueryData<Channel[]>(["MessengerChannelList", type], (_data)=>_data?.filter(v=>v.id!=lastJsonMessage['data']['channel_id']) || [])
      // }
    }
  }, [lastJsonMessage])
  return data
}

export function useMessengerChannelSorted(type:string, auth?:Auth){
  const channelList = useMessengerChannelList(type, auth);
  return channelList?.sort((a, b)=>(a.last_message?.created || '') < (b.last_message?.created || '')?1:-1)
}
export function useMessengerChannelMutation(type:string){
  const queryClient = useQueryClient()

  const create = useMutation(postChannel, {
    onSuccess: ()=>queryClient.invalidateQueries(["ChannelList", type])
  });

  const update = useMutation(patchChannel, {
    onSuccess: () => queryClient.invalidateQueries(["ChannelList", type])
  })

  const direct = useMutation(postDirectChannel, {
    onSuccess: () => queryClient.invalidateQueries(["ChannelList", type])
  })

  return { create:create.mutateAsync, update:update.mutateAsync, direct:direct.mutateAsync}
}