import { useQuery } from "react-query";
import { getUserMembershipList } from "../../apis";
import { Auth } from "../useAuthContext";

export default function useUserMembershipList(auth?:Auth){
  const { data } = useQuery(["UserMembershipList", auth?.groupId] , async()=>auth?.groupId?(await getUserMembershipList(auth?.groupId)):[])
  return data
}