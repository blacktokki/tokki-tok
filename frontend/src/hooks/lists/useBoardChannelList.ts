import { useMutation, useQuery } from "react-query";
import { getBoardChannelList, postChannel } from "../../apis";
import { invalidateQueries } from "../../navigation";
import { Auth } from "../useAuthContext";

export default function useBoardChannelList(auth?:Auth){
  const { data } = useQuery(["BoardChannelList", auth?.groupId] , async()=>auth?.groupId?(await getBoardChannelList(auth?.groupId)):[])
  return data
}

export function useBoardChannelMutation(){
  const create = useMutation(postChannel, {
    onSuccess: () => invalidateQueries("BoardChannelList")    
  });
  return { create:create.mutate }
}