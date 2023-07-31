import { useMutation, useQuery, useQueryClient } from "react-query";
import { deleteUser, getUserMembershipList, patchUser, postUser } from "../../services";
import useAuthContext, { Auth } from "../useAuthContext";

export default function useUserMembershipList(auth?:Auth){
  const { data } = useQuery(["UserMembershipList", auth?.groupId] , async()=>auth?.groupId?(await getUserMembershipList(auth?.groupId)):[])
  return data
}

export function useUserMembershipMutation(){
  const queryClient = useQueryClient()
  const { auth, dispatch } = useAuthContext()
  const _create = useMutation(postUser, {
    onSuccess: ()=>{
      queryClient.invalidateQueries("UserMembershipList")
    }
  })
  const _update = useMutation(patchUser, {
    onSuccess: (data, user)=>{
      queryClient.invalidateQueries("UserMembershipList")
      if (user.id == auth.user?.id)
        dispatch({type:"REFRESH"})
      
    }
  })
  const _delete = useMutation(deleteUser, {
    onSuccess: (data, id)=>{
      queryClient.invalidateQueries("UserMembershipList")
      if (id == auth.user?.id)
        dispatch({type:"LOGOUT_REQUEST"})
    }
  })
  return {create:_create.mutateAsync, update:_update.mutateAsync, delete:_delete.mutateAsync}
}