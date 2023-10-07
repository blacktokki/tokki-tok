import { useInfiniteQuery } from "react-query"
import { getMessengerContentList } from "../../services"
import { MessengerContentPage } from "./useMessengerContentList"


export default function useViewerContentList(channel_id:number){  
  const { data, fetchNextPage } = useInfiniteQuery<MessengerContentPage>(
    ["ViewerContentList", channel_id], 
    async({pageParam})=>getMessengerContentList(channel_id, pageParam, true).then(current=>({current})), 
    {
      select:data=>{
        if(data.pages.length > 1)
          data.pages[data.pages.length - 2].next = data.pages[data.pages.length - 1]
        return data;
      },
      getNextPageParam:(lastPage)=>lastPage?.current.length?lastPage.current[lastPage.current.length - 1].id:undefined,
      refetchOnReconnect:false,
      refetchOnWindowFocus:false,
    }
  )
  return { data, fetchNextPage }
}
