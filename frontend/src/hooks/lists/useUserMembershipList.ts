import { useMutation, useQuery, useQueryClient } from "react-query";
import { getUserMembershipList, postUser } from "../../apis";
import { Auth } from "../useAuthContext";

export default function useUserMembershipList(auth?:Auth){
  const { data } = useQuery(["UserMembershipList", auth?.groupId] , async()=>auth?.groupId?(await getUserMembershipList(auth?.groupId)):[])
  return data
}

export function useUserMembershipMutation(){
  const queryClient = useQueryClient()
  const create = useMutation(postUser, {
    onSuccess: ()=>{
      queryClient.invalidateQueries("UserMembershipList")
    }
  })
  return {create:create.mutateAsync}
}