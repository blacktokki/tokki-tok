import React, { useState } from "react";
import { StyleSheet, TextInput } from "react-native";
import useLangContext from "../hooks/useLangContext";
import useUserMembershipList, { useUserMembershipMutation } from "../hooks/lists/useUserMembershipList";
import useAuthContext from "../hooks/useAuthContext";
import ModalSection from "../components/ModalSection";
import useModalsContext from "../hooks/useModalsContext";
import { View, Text } from "../components/Themed";
import RowField from "../components/RowField";
import CommonButton from "../components/CommonButton";

type ErrorMessages = {
    username?:string,
    name?:string,
    password?:string,
    checkPassword?:string
}

const ErrorView = (props:{message?:string})=>{
  const { lang } = useLangContext()
  return <View style={styles.form_error}>
  <Text style={styles.form_error_text}>{lang(props.message || "")}</Text>
</View>
}

export default function RegistrationModal() {
  const { lang } = useLangContext()
  const {auth} = useAuthContext()
  const { setModal } = useModalsContext()
  const [username, setUsername] = useState("");
  const [name, setName] = useState("")
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("")
  const [error, setError] = useState<ErrorMessages>({})
  const userList = useUserMembershipList(auth)
  const userMembershipMutation = useUserMembershipMutation()
  const _register = ()=>{
    let newError:ErrorMessages = {};
    if (userList?.find(v=>v.username == username)) newError.username = "The username is already in use."
    if (username.length > 64) newError.username = "Write in 64 characters or less."
    if (name.length > 64) newError.name = "Write in 64 characters or less."
    if (password.length > 64) newError.password = "Write in 64 characters or less."
    if (password.length < 10 || !password.match('^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\W_])[a-zA-Z0-9\W_]+$')) newError.password = "Set over 10 characters with a combination of letters/numbers/valid special characters."
    if (password != checkPassword) newError.checkPassword = "Incorrect between password and check password."
    if (Object.keys(newError).length > 0){
        setError(newError)
        return
    }
    auth?.groupId && userMembershipMutation.create({
        username,
        name,
        password,
        inviteGroupId:auth.groupId,
        is_staff:false,

    }).then(back)
  }
  const back = ()=>{
    setModal(RegistrationModal, null)
  }

  return <ModalSection>
    <View style={{justifyContent:'space-between', flex:1, width:'100%'}}>
      <View style={{flex:1, width:'100%'}}>
        <Text style={{fontSize:20}}>{lang('Create User')}</Text>
        <View style={styles.separator} lightColor="#ddd" darkColor="rgba(255,255,255, 0.3)" />
        <RowField name={lang('Username')} width={'60%'}>
          <TextInput
              style={styles.input}
              value={username}
              onChangeText={(text) => setUsername(text)}
              autoCapitalize={"none"}
              keyboardType={'email-address'}
          />
          <ErrorView message={error.username}/>
        </RowField>
        <RowField name={lang('Name')} width={'60%'}>
          <TextInput
              style={styles.input}
              value={name}
              onChangeText={(text) => setName(text)}
              autoCapitalize={"none"}
          />
          <ErrorView message={error.name}/>
        </RowField>
        <RowField name={lang('Password')} width={'60%'}>
          <TextInput
              style={styles.input}
              value={password}
              secureTextEntry
              onChangeText={(text) => setPassword(text)}
          />
          <ErrorView message={error.password}/>
        </RowField>
        <RowField name={lang('Check Password')} width={'60%'}>
          <TextInput
              style={styles.input}
              value={checkPassword}
              secureTextEntry
              onChangeText={(text) => setCheckPassword(text)}
          />
          <ErrorView message={error.checkPassword}/>
        </RowField>
      </View>
      <View style={{flexDirection:'row', justifyContent:'flex-end'}}>
        <CommonButton title={lang('save')} onPress={_register}/>
        <CommonButton title={lang('cancel')} style={{marginHorizontal:5}} onPress={back}/>
      </View>
    </View>
  </ModalSection>
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
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