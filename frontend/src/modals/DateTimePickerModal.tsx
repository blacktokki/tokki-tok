import React, { Suspense, useState } from 'react';
import CommonButton from '../components/CommonButton';
import useModalsContext from '../hooks/useModalsContext';
import { Text, View } from '../components/Themed';
import useLangContext from '../hooks/useLangContext';
import { Ionicons } from '../lib/@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { BottomSheet } from '../components/ModalSection';
import dayjs from 'dayjs';

const dayTypes = ['AM', 'PM'].map(value=>({label:value, value}))
const hours = [...Array(12).keys()].map((value, index)=>(index + 1).toString().padStart(2, '0')).map(value=>({label:value, value}))
const minutes = [...Array(12).keys()].map((value, index)=>(index * 5).toString().padStart(2, '0')).map(value=>({label:value, value}))


const getDisableDays=(date:dayjs.Dayjs)=>{
  let startDate = date.clone().startOf('month').add(-1, 'month')
  const endDate = date.clone().endOf('month').add(1, 'month')
  const today = dayjs().startOf('day')
  const result = []
  while(startDate<=endDate && startDate<today){
    result.push(startDate.format('YYYY-MM-DD'))
    startDate = startDate.add(1, 'day')
  }
  return result
}

const defaultDayjs = ()=>{
  const m = dayjs()
  const restMinute = parseInt(m.format('mm')) % 5
  return m.add(5-restMinute, 'minute')
}

export default function DateTimePickerModal({datetime, callback}:{datetime?:string, callback:(datetime?:string)=>void}) {
  const _dayjs = datetime?dayjs(datetime):defaultDayjs()
  const { lang, locale } = useLangContext()
  const theme = useColorScheme()
  const [date, setDate] = useState(_dayjs.format('YYYY-MM-DD'));
  const [dayType, setDayType] = useState(_dayjs.locale('en').format('A'))
  const [hour, setHour] = useState(_dayjs.format('hh'))
  const [minute, setMinute] = useState(_dayjs.format('mm'))
  const [disableDays, setDisableDays] = useState<string[]>(getDisableDays(_dayjs))
  const { setModal } = useModalsContext()
  const Calendar = React.lazy(()=> import('../components/Calendar'))
  const CommonPicker = React.lazy(()=>import('../components/CommonPicker'))
  const back = ()=>{
    setModal(DateTimePickerModal, null)
  }
  return <BottomSheet>
    <View style={{flexDirection:'row', width:'100%'}}>
      <View style={{flex:1, flexDirection:'row'}}>
        <TouchableOpacity onPress={back}>
          <Ionicons size={20} name="arrow-back" color={Colors[theme].text}/>
        </TouchableOpacity>
      </View>
      <View style={{flex:1}}>
        <Text style={{fontSize:20, textAlign:'center'}}>{lang('Date & Time')}</Text>
      </View>
      <View style={{flex:1}}/>
    </View>
    <View style={{marginBottom: 20, height: 1, width: '100%'}} lightColor="#ddd" darkColor="rgba(255,255,255, 0.3)" />
    <Suspense fallback={<></>}>
      <Calendar
        locale={locale}
        style={undefined} 
        setDate={setDate}
        disableAllTouchEventsForDisabledDays={true}
        onMonthChange={(v)=>setDisableDays(getDisableDays(dayjs(v.dateString)))}
        markedDates={{
          ...disableDays.reduce((p, c)=>{p[c]={disabled:true};return p}, {} as Record<string, any>),
          ...(date?[date]:[]).reduce((p, c)=>{p[c]={selected:true};return p}, {} as Record<string, any>)
        }}
      />
      <View style={{flexDirection:'row', paddingVertical:10, width:400, height:50}}>
        <CommonPicker value={dayType} setValue={setDayType} values={dayTypes}/>
        <Text style={{fontSize:20}}> </Text>
        <CommonPicker value={hour} setValue={setHour} values={hours}/>
        <Text style={{fontSize:20}}> : </Text>
        <CommonPicker value={minute} setValue={setMinute} values={minutes}/>
      </View>
    </Suspense>
    <View style={{flexDirection:'row'}}>
      <CommonButton title={lang('save')} onPress={()=>{
        callback?.(dayjs(`${date} ${hour}:${minute} ${dayType}`).toISOString())
        back()
      }}/>
      <CommonButton title={lang('cancel')} onPress={()=>{
        callback?.(undefined)
        back()
      }}/>
      
    </View>
  </BottomSheet>
}
