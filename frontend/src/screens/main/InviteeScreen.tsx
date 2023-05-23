import React, {useEffect, useLayoutEffect, useState} from 'react';

import { StackScreenProps } from '@react-navigation/stack';
import useAuthContext from '../../hooks/useAuthContext';
import useMessengerChannelList from '../../hooks/lists/useMessengerChannelList';
import { Text } from '../../components/Themed';
import { useMessengerMemberMutation } from '../../hooks/lists/useMessengerMemberList';

export default function InviteeScreen({navigation, route}: StackScreenProps<any, 'Invitee'>) {
    const id = route?.params?.id
    const {auth, dispatch} = useAuthContext()
    const [enterGuest, setEnterGuest] = useState(false)
    const channelList = useMessengerChannelList(auth)
    const messengerMemberMutation = useMessengerMemberMutation()
    useLayoutEffect(() => {
        navigation.setOptions({headerRight: undefined});
    }, []);
    useEffect(()=>{
        if(auth.user==null && enterGuest==false){
            dispatch({type:"LOGIN_GUEST"})
            setEnterGuest(true)
        }
        else if(auth.user && channelList!==undefined){
            if(channelList.find(v=>v.id==id) === undefined){
                console.log(`invite processing (channel:${id})`)
                messengerMemberMutation.invite({
                    channel_id:id,
                    user_ids:[auth.user.id]
                }).then(()=>navigation.replace("ChatScreen", {id}))
            }
            else{
                console.log('already invite')
                navigation.replace("ChatScreen", {id})
            }
        }
    }, [auth, channelList, enterGuest])
  return <Text>{'초대중'}</Text>
};
