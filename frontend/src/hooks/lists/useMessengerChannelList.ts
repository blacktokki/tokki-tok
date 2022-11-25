import { useMutation, useQuery } from "react-query";
import { getMessengerChannelList, postChannel, postMessengerMember } from "../../apis";
import { invalidateQueries } from "../../navigation";
import { Auth } from "../useAuthContext";

export default function useMessengerChannelList(auth?:Auth){
  const { data } = useQuery(["MessengerChannelList", auth?.user?.id] , async()=>auth?.user?.id?(await getMessengerChannelList(auth.user.id)):[])
  return data
}

export function useMessengerChannelMutation(){
  const memberCreate = useMutation(postMessengerMember,{
    onSuccess: () => invalidateQueries("MessengerChannelList")
  })

  const create = useMutation(postChannel, {
    onSuccess: (data) => {data.id && memberCreate.mutate({
      user:data.owner, channel:data.id
    })}
  });
  return { create:create.mutate }
}