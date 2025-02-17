import { useMutation, useQuery, useQueryClient } from "react-query";
import { deleteUser, getUserList, patchUser, postUser } from "../../services";
import useAuthContext, { Auth } from "../useAuthContext";

export default function useUserList(auth?:Auth){
  const { data } = useQuery(["UserList", auth?.groupId] , async()=>auth?.groupId?(await getUserList()):[])
  return data
}

export function useUserMutation(){
  const queryClient = useQueryClient()
  const { auth, dispatch } = useAuthContext()
  const _create = useMutation(postUser, {
    onSuccess: ()=>{
      queryClient.invalidateQueries("UserList")
    }
  })
  const _update = useMutation(patchUser, {
    onSuccess: (data, user)=>{
      if (user.id == auth.user?.id)
        if(user.username && user.password){
          dispatch({type:'LOGIN_REQUEST', username:user.username, password:user.password})
        }
        else{
          dispatch({type:"REFRESH"})
        }
      else{
        queryClient.invalidateQueries("UserList")
      }
    }
  })
  const _delete = useMutation(deleteUser, {
    onSuccess: (data, id)=>{
      queryClient.invalidateQueries("UserList")
      if (id == auth.user?.id)
        dispatch({type:"LOGOUT_REQUEST"})
    }
  })
  return {create:_create.mutateAsync, update:_update.mutateAsync, delete:_delete.mutateAsync}
}