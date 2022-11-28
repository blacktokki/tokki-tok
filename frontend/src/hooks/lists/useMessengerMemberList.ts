import { useQuery } from "react-query";
import { getMessengerMemberList } from "../../apis";

export default function useMessengerMemberList(channel_id:number){
  const { data } = useQuery(["MessengerMemberList", channel_id] , async()=>await getMessengerMemberList(channel_id))
  return data
}