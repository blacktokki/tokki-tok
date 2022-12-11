import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getMessengerChannelList, postChannel, putChannel } from "../../apis";
import { MessengerChannel } from "../../types";
import { Auth } from "../useAuthContext";
import useWebsocketContext from "../useWebsocketContext";

export default function useMessengerChannelList(auth?:Auth){
  const queryClient = useQueryClient()
  const {lastJsonMessage} = useWebsocketContext()
  const { data } = useQuery("MessengerChannelList" , async()=>auth?.user?.id?(await getMessengerChannelList(auth.user.id)):[])

  useEffect(()=>{
    if(lastJsonMessage !=null){
      if(lastJsonMessage['type']=='enter'){
        queryClient.setQueryData<MessengerChannel[]>("MessengerChannelList", (_data)=>{
          return (_data?.find(v=>v.id==lastJsonMessage['data']['id'])?_data:[lastJsonMessage['data'] , ...(_data|| [])]).sort((a, b)=>a.id - b.id)
        })
      }
      // if(lastJsonMessage['type']=='leave'){
      //   queryClient.setQueryData<Channel[]>("MessengerChannelList", (_data)=>_data?.filter(v=>v.id!=lastJsonMessage['data']['channel_id']) || [])
      // }
    }
  }, [lastJsonMessage])
  return data
}

export function useMessengerChannelMutation(){
  const queryClient = useQueryClient()

  const create = useMutation(postChannel, {
    onSuccess: ()=>queryClient.invalidateQueries("MessengerChannelList")
  });

  const update = useMutation(putChannel, {
    onSuccess: () => queryClient.invalidateQueries("MessengerChannelList")
  })


  return { create:create.mutate, update:update.mutate}
}