import { useMutation, useQuery, useQueryClient } from "react-query";
import { getUserMembershipList, patchUserGroup } from "../../apis";
import { Auth } from "../useAuthContext";

export default function useUserMembershipList(auth?:Auth){
  const { data } = useQuery(["UserMembershipList", auth?.groupId] , async()=>auth?.groupId?(await getUserMembershipList(auth?.groupId)):[])
  return data
}

export function useUserMembershipMutation(){
  const queryClient = useQueryClient()
  const setUserGroup = useMutation(patchUserGroup, {
    onSuccess: ()=>{
      queryClient.invalidateQueries("UserMembershipList")
    }
  })
  return {setUserGroup:setUserGroup.mutateAsync}
}