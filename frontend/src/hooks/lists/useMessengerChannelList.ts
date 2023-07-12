import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getMessengerChannelList, postChannel, postDirectChannel, putChannel } from "../../apis";
import { MessengerChannel, MessengerContent } from "../../types";
import { Auth } from "../useAuthContext";
import useWebsocketContext from "../useWebsocketContext";

export default function useMessengerChannelList(auth?:Auth){
  const queryClient = useQueryClient()
  const {lastJsonMessage} = useWebsocketContext()
  const { data } = useQuery("MessengerChannelList" , async()=>await getMessengerChannelList(auth?.user?.id))

  useEffect(()=>{
    if(lastJsonMessage !=null){
      if(lastJsonMessage['type']=='enter'){
        queryClient.setQueryData<MessengerChannel[]>("MessengerChannelList", (_data)=>{
          return (_data?.find(v=>v.id==lastJsonMessage['data']['id'])?_data:[lastJsonMessage['data'] , ...(_data|| [])]).sort((a, b)=>a.id - b.id)
        })
      }
      if (lastJsonMessage['type']=='next_message'){
        const data:MessengerContent = lastJsonMessage['data']
        queryClient.setQueryData<MessengerChannel[]>("MessengerChannelList", (_data)=>(_data || []).map(v=>{
          if (v.id == data.channel){
            return {...v, last_message:{content:data.message_set[0]?.content, created:data.created}}
          }
          return v
        }))
      }
      // if(lastJsonMessage['type']=='leave'){
      //   queryClient.setQueryData<Channel[]>("MessengerChannelList", (_data)=>_data?.filter(v=>v.id!=lastJsonMessage['data']['channel_id']) || [])
      // }
    }
  }, [lastJsonMessage])
  return data
}

export function useMessengerChannelSorted(auth?:Auth){
  const channelList = useMessengerChannelList(auth);
  return channelList?.sort((a, b)=>(a.last_message?.created || '') < (b.last_message?.created || '')?1:-1)
}
export function useMessengerChannelMutation(){
  const queryClient = useQueryClient()

  const create = useMutation(postChannel, {
    onSuccess: ()=>queryClient.invalidateQueries("MessengerChannelList")
  });

  const update = useMutation(putChannel, {
    onSuccess: () => queryClient.invalidateQueries("MessengerChannelList")
  })

  const direct = useMutation(postDirectChannel, {
    onSuccess: () => queryClient.invalidateQueries("MessengerChannelList")
  })

  return { create:create.mutateAsync, update:update.mutateAsync, direct:direct.mutateAsync}
}