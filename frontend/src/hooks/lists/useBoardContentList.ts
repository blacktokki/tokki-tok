import { useMutation, useQuery } from "react-query"
import { deleteBoardContent, getBoardContentList, patchBoard, postBoard } from "../../apis"
import { queryClient } from "../../navigation";


export default function useBoardContentList(channel_id:number){
  const { data } = useQuery(["BoardContentList", channel_id] , async()=>await getBoardContentList(channel_id))
  return data
}

export function useBoardContentMutation(){
  const create = useMutation(postBoard, {
    onSuccess: () => queryClient.invalidateQueries("BoardContentList")
  });
  const update = useMutation(patchBoard, {
    onSuccess: () => queryClient.invalidateQueries("BoardContentList")
  })
  const remove = useMutation(deleteBoardContent, {
    onSuccess: () => queryClient.invalidateQueries("BoardContentList")
  })
  return { create:create.mutate, update:update.mutate, remove:remove.mutate }
}