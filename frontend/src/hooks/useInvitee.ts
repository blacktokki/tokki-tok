import { useEffect } from "react"
import { navigate } from "../navigation"
import useMessengerChannelList from "./lists/useMessengerChannelList"
import { useMessengerMemberMutation } from "./lists/useMessengerMemberList"
import useAuthContext from "./useAuthContext"

let invitee_id:number|undefined
let invitee_state:0|1|2=0

export const replaceInviteeState = (l:Location)=>{
    if(l !==undefined && l.pathname.endsWith('/invitee')){
        var params = l.search.slice(1).split('&').filter(v=>v.startsWith('id='))
        if (params.length>0)
            invitee_id = parseInt(params[0].split('=')[1])
        window.history.replaceState(null, '', l.href.split('invitee')[0]
        );
    }
}

export default ()=>{
    const {auth} = useAuthContext()
    const channelList = useMessengerChannelList(auth)
    const messengerMemberMutation = useMessengerMemberMutation()
    useEffect(()=>{
        if (auth.user){
            if (invitee_id && channelList!==undefined){
                var id = invitee_id;
                var redirect = ()=>navigate("Main", {screen:"ChatScreen", params: {id}})
                invitee_id = undefined;
                invitee_state = 1;
                if(channelList.find(v=>v.id==id) === undefined){
                    console.log(`invite processing (channel:${id})`)
                    messengerMemberMutation.invite({
                        channel_id:id,
                        user_ids:[auth.user.id]
                    }).then(redirect)
                }
                else{
                    console.log('already invite')
                    redirect()
                }
            }
        }
        else{
            if (invitee_state == 1){
                invitee_state=2
            }
        }
    }, [auth, channelList])
    useEffect(()=>{
        if(auth.user && invitee_state==2){
            navigate("Main", {screen:"HomeScreen"})
        }
    }, [auth.user])
}