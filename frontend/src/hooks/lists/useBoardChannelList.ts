import { useMutation, useQuery, useQueryClient } from "react-query";
import { getBoardChannelList, postChannel } from "../../apis";
import { Auth } from "../useAuthContext";

export default function useBoardChannelList(auth?:Auth){
  const { data } = useQuery(["BoardChannelList", auth?.groupId] , async()=>auth?.groupId?(await getBoardChannelList(auth?.groupId)):[])
  return data
}

export function useBoardChannelMutation(){
  const queryClient = useQueryClient()
  const create = useMutation(postChannel, {
    onSuccess: () => queryClient.invalidateQueries("BoardChannelList")    
  });
  return { create:create.mutate }
}