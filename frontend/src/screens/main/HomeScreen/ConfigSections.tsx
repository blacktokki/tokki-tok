import React from "react"
import CommonSection from "../../../components/CommonSection"
import Colors from "../../../constants/Colors"
import useColorScheme, { setColorScheme } from "../../../hooks/useColorScheme"
import { StyleSheet, Text, View} from 'react-native';
import useLangContext from "../../../hooks/useLangContext";
import { useColorScheme as useConfigColorScheme} from 'react-native-appearance';
import useFirebaseContext from "../../../hooks/useFirebaseContext";
import TextButton from "../../../components/TextButton";
import useModalsContext from "../../../hooks/useModalsContext";
import RegistrationModal from "../../../modals/RegistrationModal";
import useAuthContext from "../../../hooks/useAuthContext";


const ConfigSection = ({title, children}:{title:string, children?: React.ReactNode})=>{
  const theme = useColorScheme()
  const color = Colors[theme].text
  return <CommonSection bodyStyle={{alignItems:'flex-start', backgroundColor:theme=='light'?'transparent':"black"}}>
    <Text style={{fontSize:20, color, fontWeight:'600'}}>{title}</Text>
    {children}
  </CommonSection>
}

export default ()=>{
  const { lang, locale, setLocale } = useLangContext()
  const { setModal } = useModalsContext()
  const {auth} = useAuthContext()
  const theme = useColorScheme()
  const configTheme = useConfigColorScheme()
  const {enable:noti, setEnable:setNoti} = useFirebaseContext()
  const color = Colors[theme].text
  return <>
    <ConfigSection title={lang('* Notification Settings')}>
      <View style={{flexDirection:'row'}}>
        {[[lang('On'), true], [lang('Off'), false]].map(([title, n])=><TextButton
          key={title} title={title || ''} textStyle={{fontSize:16, color, textDecorationLine:noti==n?'underline':'none'}} style={{borderRadius:20}} onPress={()=>{setNoti(n)}}/>)}
      </View>
    </ConfigSection>
    <ConfigSection title={lang('* Language Settings')}>
    <View style={{flexDirection:'row'}}>
        {[[lang('Auto'), 'auto'], ['한국어', 'ko'], ['English', 'en']].map(([title, l])=><TextButton 
          key={title} title={title || ''} textStyle={{fontSize:16, color, textDecorationLine:locale==l?'underline':'none'}} style={{borderRadius:20}} onPress={()=>setLocale(l)}/>)}
      </View>
    </ConfigSection>
    <ConfigSection title={lang('* Skin Settings')}>
      <View style={{flexDirection:'row'}}>
        {[[lang('Auto'), 'no-preference'], [lang('Light'), 'light'], [lang('Dark'), 'dark']].map(([title, colorScheme])=><TextButton 
          key={title} title={title} textStyle={{fontSize:16, color, textDecorationLine:configTheme==colorScheme?'underline':'none'}} style={{borderRadius:20}} onPress={(
            )=>setColorScheme(colorScheme)}/>)}
      </View>
    </ConfigSection>
    {!auth.user?.is_guest && <CommonSection bodyStyle={{alignItems:'flex-start', backgroundColor:theme=='light'?'transparent':"black"}}>
      <TextButton title={lang('> Account Settings')} textStyle={{fontSize:20, color}} style={{paddingLeft:0, borderRadius:20}} onPress={()=>setModal(RegistrationModal, {id:auth.user?.id})}/>
    </CommonSection>}
  </>
}