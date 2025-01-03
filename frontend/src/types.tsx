/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { PathConfig } from "@react-navigation/native"
import { ButtonProps, KeyboardTypeOptions, StyleProp, TextStyle, ViewStyle } from "react-native"

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
  placeholder?:string
  style?:StyleProp<TextStyle>
  keyboardType?:KeyboardTypeOptions,
  secureTextEntry?:boolean
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

export type EditorProps = {
  theme: 'light'| 'dark',
  value:string, 
  setValue:(v:string)=>void, 
  onReady?:()=>void
}

export type TabViewRecord = Record<string, {title:string, component:React.ComponentType<any>, icon:JSX.Element}>

type BaseUser = {
  is_staff:boolean,
  is_guest:boolean,
  name:string,
  username:string,
  imageUrl?:string
}

export type User = BaseUser & {
  id:number,
}

export type CreateUser = BaseUser & {
  password:string,
  inviteGroupId: number
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

type BaseChannel = {
  id?: number,
  name: string,
  type: string,
  description?: string,
  is_archive?: boolean,
  group: number
}

export type Channel = BaseChannel & {
  owner: number,
  subowner?:number
}

export type MessengerChannel = BaseChannel & {
  member_count: number,
  unread_count: number,
  last_message?: {
    created: string,
    content: string,
    preview_content?: string
  }
  owner: User
  subowner: User
}

export type Message = {
  id?: number,
  content: string
  preview_content?: string
}

export type EditMessage = Message & {
  channel:number
  user?:number
  timer?:string
  file?:Blob
  editor?:{
    title:string,
    content:string
  }
}

export type File = {
  thumbnail?: string
  type: 'file'
  file: string
  filename: string
  filesize: number
}

export type Link = {
  type: 'link',
  url:string,
  title:string,
  description:string|null,
  image_url:string|null,
}


export type MessengerContent = {
  id: number,
  message_set:Message[]
  attatchment_set:(File | Link)[],
  user: number,
  channel: number
  timer?: string|null,
  is_archive:boolean,
  created: string,
  updated: string,
  name: string,
  channel_name: string
}

export type EditMessengerContent = {
  id:number,
  is_archive?:boolean,
  timer?: string|null
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