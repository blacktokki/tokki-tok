import { useQuery } from "react-query";
import { getExternalMembershipList } from "../../services";

export default function useExternalMembershipList(keyword?:string){
  const { data } = useQuery(["UserMembershipList", keyword] , async()=>keyword?(await getExternalMembershipList(keyword)):[])
  return data
}