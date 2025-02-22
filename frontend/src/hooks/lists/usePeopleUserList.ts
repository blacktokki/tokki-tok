import { useMutation, useQuery, useQueryClient } from "react-query";
import { getChannelList, getPeopleList, postBulkMessengerMember, deleteMessengerMember, postChannel } from "../../services";
import useAuthContext, { Auth } from "../useAuthContext";

function usePeopleChannelId(auth?:Auth){
  const { data } = useQuery(["People", auth?.user?.id], async()=>{
    if(auth?.user?.id){
      const peopleChannel = await getChannelList("people", auth.user.id)
      if (peopleChannel === null)
        return undefined;
      if (peopleChannel.length === 0){
        const newChannel = await postChannel({type:'people', owner:auth.user.id, name: ''})
        return newChannel.id
      }
      return peopleChannel[0].id
    }
  })
  return data
}

function usePeopleList(auth?:Auth){
  const peopleId = usePeopleChannelId(auth)
  const { data } = useQuery(["PeopleList", peopleId] , async()=>peopleId?await getPeopleList(peopleId):[])
  return {peopleId, peopleList:data}
}

export default function useUserList(auth?:Auth){
  const { peopleList } = usePeopleList(auth)
  return peopleList?.map(v=>v.user)
}

export function usePeopleMutation(){
  const { auth } = useAuthContext()
  const {peopleId, peopleList} = usePeopleList(auth)
  const queryClient = useQueryClient()

  const _create = useMutation(async ({user_ids}:{user_ids:number[]})=>{peopleId && await postBulkMessengerMember({channel_id:peopleId, user_ids})}, {
    onSuccess: (data, id)=>{
      queryClient.invalidateQueries("PeopleList")
    }
  })
  const _delete = useMutation(async(userId:number)=>{
    const id = peopleList?.find(v=>v.user.id===userId)?.id
    id && await deleteMessengerMember(id)
  }, {
      onSuccess: () => {
        queryClient.invalidateQueries("PeopleList")
      }
    })
  return {create:_create.mutateAsync, delete:_delete.mutateAsync}
}