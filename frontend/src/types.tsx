/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { PathConfig } from "@react-navigation/native"
import { ButtonProps, StyleProp, TextStyle, ViewStyle } from "react-native"

export type Screens = Record<string, PathConfig & {title:string, component:React.ComponentType<any>}>

export type CustomButtonProps = ButtonProps & {
  style?:StyleProp<ViewStyle>,
  textStyle?:StyleProp<TextStyle>
  onPress:()=>void
  children?:React.ReactNode
}

export type CustomTextInputProps = {
  value: any,
  setValue?: (value:any)=>void
  disabled?:boolean
  multiline?:boolean
  minHeight?:number
  style?:StyleProp<TextStyle>
  onEndEditing?:(value:string)=>void,
  onBlur?:(value:string)=>void
}

export type ProfileProps = {
  userId:number,
  name:string,
  username:string
}

export type AvatarProps = {
  userId:number,
  name:string,
  size:number
}

export type TabViewRecord = Record<string, {title:string, component:React.ComponentType<any>, icon:JSX.Element}>

export type User = {
  id:number,
  is_staff:boolean,
  name:string,
  username:string,
  imageUrl?:string
}

export type Membership = {
  id?:number
  root_group_id?:number,
  image_url?:string
  groupname:string,
  group:number
}

export type UserMembership =  User & {
  membership_set:Membership[]
}

export type Channel = {
  id?: number,
  name: string,
  type: string,
  description?: string,
  is_archive?: boolean,
  owner: number,
  group: number
}

export type MessengerChannel = Channel & {
  member_count: number,
  unread_count: number,
  last_message?: {
    created: string,
    content: string
  }
}

export type DirectChannel = Channel & {
  counterpart: number
}

export type Message = {
  id?: number,
  content: string,
}

export type EditMessage = Message & {
  channel:number
  user?:number
  timer?:string
  file?:Blob
}

export type File = {
  file: string
  filename: string
  filesize: number
}

export type Link = {
  url:string,
  title:string,
  description:string|null,
  image:string|null,
}

export type MessengerContent = {
  id: number,
  message_set:Message[]
  link_set:Link[],
  file_set:File[],
  user: number,
  channel: number
  timer: string,
  created: string,
  updated: string,
  name: string,
  channel_name: string
}

export type MessengerMember = {
  id?:number,
  notification?: boolean,
  mobile_notification?: boolean,
  user: number,
  channel: number,
  last_message?: number
}

export type Notification = {
  id?:number,
  user: number,
  type: string,
  token: string|null
}