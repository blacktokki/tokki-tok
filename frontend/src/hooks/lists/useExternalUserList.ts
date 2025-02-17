import { useQuery } from "react-query";
import { getExternalUserList } from "../../services";

export default function useExternalUserList(keyword?:string){
  const { data } = useQuery(["UserList", keyword] , async()=>keyword?(await getExternalUserList(keyword)):[])
  return data
}