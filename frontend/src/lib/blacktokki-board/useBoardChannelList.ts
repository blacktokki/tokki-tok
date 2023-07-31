import { useMutation, useQuery, useQueryClient } from "react-query";
import { deleteChannel, postChannel, putChannel } from "../../services";
import { Auth } from "../../hooks/useAuthContext";
import { getBoardChannelList } from "./services"


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

  return { create:create.mutateAsync, update:update.mutateAsync, delete:_delete.mutate}
}