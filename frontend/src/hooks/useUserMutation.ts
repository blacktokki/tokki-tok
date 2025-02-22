import { useMutation } from "react-query";
import { deleteUser, patchUser, postUser } from "../services";
import useAuthContext from "./useAuthContext";

export default function useUserMutation(){
  const { auth, dispatch } = useAuthContext()
  const _create = useMutation(postUser, {
    onSuccess: ()=>{
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
      }
    }
  })
  const _delete = useMutation(deleteUser, {
    onSuccess: (data, id)=>{
      if (id == auth.user?.id)
        dispatch({type:"LOGOUT_REQUEST"})
    }
  })
  return {create:_create.mutateAsync, update:_update.mutateAsync, delete:_delete.mutateAsync}
}