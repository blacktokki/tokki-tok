import React, {useEffect, useLayoutEffect, useState} from 'react';

import { StackScreenProps } from '@react-navigation/stack';
import useAuthContext from '../../hooks/useAuthContext';
import { Text } from '../../components/Themed';
import { useMessengerMemberMutation } from '../../hooks/lists/useMessengerMemberList';

export default function GroupInviteeScreen({navigation, route}: StackScreenProps<any, 'GroupInvitee'>) {
    const id = route?.params?.id
    const {auth, dispatch} = useAuthContext()
    const [enterGuest, setEnterGuest] = useState(false)
    const messengerMemberMutation = useMessengerMemberMutation()
    useLayoutEffect(() => {
        navigation.setOptions({headerRight: undefined});
    }, []);
    useEffect(()=>{
        if(auth.user==null && enterGuest==false){
            dispatch({type:"LOGIN_GUEST"})
            setEnterGuest(true)
        }
        else if(auth.user){
            if(auth.user.membership_set.find(v=>v.group==id) === undefined){
                console.log(`invite processing (group:${id})`)
                messengerMemberMutation.invite({
                    channel_id:id,
                    user_ids:[auth.user.id]
                }).then(()=>navigation.replace("HomeScreen"))
            }
            else{
                console.log('already invite')
                navigation.replace("HomeScreen", {})
            }
        }
    }, [auth, enterGuest])
  return <Text>{'초대중'}</Text>
};
