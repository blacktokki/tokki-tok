import { useMutation, useQuery, useQueryClient } from "react-query";
import { postBulkMessengerMember, deleteMessengerMember, getMessengerMemberList } from "../../apis";

export default function useMessengerMemberList(channel_id:number){
  const { data } = useQuery(["MessengerMemberList", channel_id] , async()=>await getMessengerMemberList(channel_id))
  return data
}


export function useMessengerMemberMutation(){
  const queryClient = useQueryClient()
  const invite = useMutation(postBulkMessengerMember, {
    onSuccess: ()=>{
      queryClient.invalidateQueries("MessengerMemberList")
    }
  })

  const leave = useMutation(deleteMessengerMember, {
    onSuccess: () => {
      queryClient.invalidateQueries("MessengerChannelList")
      queryClient.invalidateQueries("MessengerMemberList")
    }
  })
  return {invite:invite.mutate, leave:leave.mutate}
}