import React, { useState } from 'react';
import CommonButton from '../components/CommonButton';
import useModalsContext from '../hooks/useModalsContext';
import {Picker} from '@react-native-picker/picker';
import { Text, View } from '../components/Themed';
import useLangContext from '../hooks/useLangContext';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import { BottomSheet } from '../components/ModalSection';
import Calendar from '../components/Calendar';
import moment from 'moment';

const dayTypes = ['AM', 'PM'].map(value=>({label:value, value}))
const hours = [...Array(12).keys()].map((value, index)=>(index + 1).toString().padStart(2, '0')).map(value=>({label:value, value}))
const minutes = [...Array(12).keys()].map((value, index)=>(index * 5).toString().padStart(2, '0')).map(value=>({label:value, value}))


const getDisableDays=(date:moment.Moment)=>{
  const startDate = date.clone().startOf('month').add(-1, 'month')
  const endDate = date.clone().endOf('month').add(1, 'month')
  const today = moment().startOf('day')
  const result = []
  while(startDate<=endDate && startDate<today){
    result.push(startDate.format(moment.HTML5_FMT.DATE))
    startDate.add(1, 'day')
  }
  return result
}

const defaultMoment = ()=>{
  const m = moment()
  const restMinute = parseInt(m.format('mm')) % 5
  m.add(5-restMinute, 'minute')
  return m
}

export default function DateTimePickerModal({datetime, callback}:{datetime?:string, callback:(datetime?:string)=>void}) {
  const _moment = datetime?moment(datetime):defaultMoment()
  const { lang } = useLangContext()
  const theme = useColorScheme()
  const [date, setDate] = useState(_moment.format(moment.HTML5_FMT.DATE));
  const [dayType, setDayType] = useState(_moment.locale('en').format('A'))
  const [hour, setHour] = useState(_moment.format('hh'))
  const [minute, setMinute] = useState(_moment.format('mm'))
  const [disableDays, setDisableDays] = useState<string[]>(getDisableDays(_moment))
  const { setModal } = useModalsContext()
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
    <Calendar 
      style={undefined} 
      setDate={setDate}
      disableAllTouchEventsForDisabledDays={true}
      onMonthChange={(v)=>setDisableDays(getDisableDays(moment(v.dateString)))}
      markedDates={{
        ...disableDays.reduce((p, c)=>{p[c]={disabled:true};return p}, {} as Record<string, any>),
        ...(date?[date]:[]).reduce((p, c)=>{p[c]={selected:true};return p}, {} as Record<string, any>)
      }}
    
    />
    <View style={{flexDirection:'row', padding:5}}>
      <Picker
        selectedValue={dayType}
        onValueChange={setDayType}>
        {dayTypes.map(v=><Picker.Item key={v.value} label={v.label} value={v.value} />)}
      </Picker>
      <Text> </Text>
      <Picker
        selectedValue={hour}
        onValueChange={setHour}>
        {hours.map(v=><Picker.Item key={v.value} label={v.label} value={v.value} />)}
      </Picker>
      <Text> : </Text>
      <Picker
        selectedValue={minute}
        onValueChange={setMinute}>
        {minutes.map(v=><Picker.Item key={v.value} label={v.label} value={v.value} />)}
      </Picker>
    </View>
    <View style={{flexDirection:'row'}}>
      <CommonButton title={lang('save')} onPress={()=>{
        callback?.(moment(`${date} ${hour}:${minute} ${dayType}`).format(moment.HTML5_FMT.DATETIME_LOCAL))
        back()
      }}/>
      <CommonButton title={lang('cancel')} onPress={()=>{
        callback?.(undefined)
        back()
      }}/>
      
    </View>
  </BottomSheet>
}
