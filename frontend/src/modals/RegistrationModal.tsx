import React, { useState, useEffect } from "react";
import { StyleSheet, TextInput } from "react-native";
import useLangContext from "../hooks/useLangContext";
import useUserMembershipList, { useUserMembershipMutation } from "../hooks/lists/useUserMembershipList";
import useAuthContext from "../hooks/useAuthContext";
import ModalSection from "../components/ModalSection";
import useModalsContext from "../hooks/useModalsContext";
import { View, Text } from "../components/Themed";
import RowField from "../components/RowField";
import CommonButton from "../components/CommonButton";
import CommonTextInput from "../components/CommonTextInput";
// import TextButton from "../components/TextButton";
// import Colors from "../constants/Colors";
// import useColorScheme from "../hooks/useColorScheme";

type ErrorMessages = {
    username?:string,
    name?:string,
    password?:string,
    checkPassword?:string
}

const ErrorView = (props:{message?:string})=>{
  const { lang } = useLangContext()
  return props.message?<View style={styles.form_error}>
  <Text style={styles.form_error_text}>{lang(props.message)}</Text>
</View>:<></>
}

export default function RegistrationModal({id}:{id?:number}) {
  const { lang } = useLangContext()
  const {auth} = useAuthContext()
  // const theme = useColorScheme()
  // const color = Colors[theme].text
  const { setModal } = useModalsContext()
  const [username, setUsername] = useState("");
  const [name, setName] = useState("")
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("")
  const [isStaff, setIsStaff] = useState(false)
  const [error, setError] = useState<ErrorMessages>({})
  const userList = useUserMembershipList(auth)
  const userMembershipMutation = useUserMembershipMutation()
  const user = userList?.find(v=>v.id==id)
  const usernameDisable = user && user.is_guest===false
  useEffect(()=>{
    if (user){
      setUsername(user.username)
      setName(user.name)
    }
  }, [user])
  const _register = ()=>{
    let newError:ErrorMessages = {};
    if (userList?.find(v=>v.username == username) && !id) newError.username = "The username is already in use."
    if (username.length < 10 || username.length > 64) newError.username = "Set 10-64 characters."
    if (name.length < 1 || name.length > 64) newError.name = "Set 1-64 characters."
    if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{10,64}$/.test(password) && !(usernameDisable && password.length==0)) newError.password = "Set 10-64 characters with a combination of letters/numbers/valid special characters."
    if (password != checkPassword) newError.checkPassword = "Incorrect between password and check password."
    if (Object.keys(newError).length > 0){
        setError(newError)
        return
    }
    if (id){
      userMembershipMutation.update({
        id,
        name,
        username:usernameDisable?undefined:username,
        is_guest:false,
        password:password.length>0?password:undefined,
      }).then(()=>{(id!=auth.user?.id || user?.is_guest) && back()})
    }
    else{
      auth?.groupId && userMembershipMutation.create({
          username,
          name,
          password,
          is_guest:false,
          is_staff:isStaff,
          inviteGroupId:auth.groupId,

      }).then(back)
    }
  }
  const back = ()=>{
    setModal(RegistrationModal, null)
  }
  return <ModalSection>
    <View style={{justifyContent:'space-between', flex:1, width:'100%'}}>
      <View style={{flex:1, width:'100%'}}>
        <Text style={{fontSize:20}}>{usernameDisable?lang('Edit User'):lang('Create User')}</Text>
        <View style={styles.separator} lightColor="#ddd" darkColor="rgba(255,255,255, 0.3)" />
        <RowField name={lang('Username')} width={'60%'}>
          {usernameDisable?<Text style={{fontSize:16}}>{username}</Text>:<CommonTextInput
              value={username}
              setValue={(text) => setUsername(text)}
              keyboardType={'email-address'}
          />}
          <ErrorView message={error.username}/>
        </RowField>
        <RowField name={lang('Name')} width={'60%'}>
          <CommonTextInput
              value={name}
              setValue={(text) => setName(text)}
          />
          <ErrorView message={error.name}/>
        </RowField>
        <RowField name={lang('Password')} width={'60%'}>
          <CommonTextInput
              value={password}
              secureTextEntry
              setValue={(text) => setPassword(text)}
          />
          <ErrorView message={error.password}/>
        </RowField>
        <RowField name={lang('Check Password')} width={'60%'}>
          <CommonTextInput
              value={checkPassword}
              secureTextEntry
              setValue={(text) => setCheckPassword(text)}
          />
          <ErrorView message={error.checkPassword}/>
        </RowField>
        {/* <RowField name={lang('Manager Permission')} width={'60%'}>
          <View style={{flexDirection:'row'}}>
            {[[lang('Yes'), true], [lang('No'), false]].map(([title, value])=><TextButton 
              key={title} title={title} textStyle={{fontSize:16, color, textDecorationLine:isStaff==value?'underline':'none'}} style={{borderRadius:20}} onPress={(
              )=>setIsStaff(value)}/>)}
          </View>
        </RowField> */}
      </View>
      <View style={{width:'100%', flexDirection:'row'}}>
        {id && <View style={{flexDirection:'row', justifyContent:'flex-start'}}>
          <CommonButton title={lang('delete account')} style={{marginHorizontal:5}} textStyle={{color:'red'}} onPress={()=>userMembershipMutation.delete(id).then(back)}/>
        </View>}
        <View style={{flex:1, flexDirection:'row', justifyContent:'flex-end'}}>
          <CommonButton title={lang('save')} onPress={_register}/>
          <CommonButton title={lang('cancel')} style={{marginHorizontal:5}} onPress={back}/>
        </View>
      </View>
    </View>
  </ModalSection>
};

const styles = StyleSheet.create({
  form_error: {
    height: 22,
    width:'100%',
  },
  form_error_text:{
    textAlignVertical:'center',
    color:'red',
    fontSize:13,
  },
  separator: {
    marginBottom: 20,
    height: 1,
    width: '100%',
  },
});