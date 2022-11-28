import { useMutation, useQuery, useQueryClient } from "react-query";
import { deleteChannel, getBoardChannelList, postChannel, putChannel } from "../../apis";
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
  const update = useMutation(putChannel, {
    onSuccess: () => queryClient.invalidateQueries("BoardChannelList")
  })
  const _delete = useMutation(deleteChannel, {
    onSuccess: () => queryClient.invalidateQueries("BoardChannelList")
  })

  return { create:create.mutate, update:update.mutate, delete:_delete.mutate}
}