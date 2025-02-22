import { useQuery } from "react-query";
import { getExternalUserList, getExternalUser } from "../../services";

export default function useExternalUserList(keyword?:string){
  const { data } = useQuery(["UserList", keyword] , async()=>keyword?(await getExternalUserList(keyword)):[])
  return data
}

export function useExternalUser(id:number){
  const { data } = useQuery(["UserList", id] , async()=>await getExternalUser(id))
  return data
}