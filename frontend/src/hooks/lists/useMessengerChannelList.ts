import { useMutation, useQuery, useQueryClient } from "react-query";
import { deleteMessengerMember, getMessengerChannelList, postChannel, postMessengerMember, putChannel } from "../../apis";
import { Auth } from "../useAuthContext";

export default function useMessengerChannelList(auth?:Auth){
  const { data } = useQuery(["MessengerChannelList", auth?.user?.id] , async()=>auth?.user?.id?(await getMessengerChannelList(auth.user.id)):[])
  return data
}

export function useMessengerChannelMutation(){
  const queryClient = useQueryClient()
  const memberCreate = useMutation(postMessengerMember,{
    onSuccess: () => queryClient.invalidateQueries("MessengerChannelList")
  })

  const create = useMutation(postChannel, {
    onSuccess: (data) => {data.id && memberCreate.mutate({
      user:data.owner, channel:data.id
    })}
  });

  const update = useMutation(putChannel, {
    onSuccess: () => queryClient.invalidateQueries("MessengerChannelList")
  })

  const leave = useMutation(deleteMessengerMember, {
    onSuccess: () => queryClient.invalidateQueries("MessengerChannelList")
  })

  return { create:create.mutate, update:update.mutate, leave: leave.mutate}
}