/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { PathConfig } from "@react-navigation/native"

export type Screens = Record<string, PathConfig & {title:string, component:React.ComponentType<any>}>

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
  type: "board"| "messenger",
  description?: string,
  is_archive?: boolean,
  owner: number,
  group: number
}
export type Board = {
  id?: number,
  title:string,
  content: string,
}

export type EditBoard = Board & {
  channel:number
  user?:number
}

export type BoardContent = {
  id: number,
  board_set:Board[]
  user: number,
  channel: number
  created: string,
  updated: string,
  name: string
}

export type MessengerContent = any

export type MessengerMember = {
  notification?: boolean,
  mobile_notification?: boolean,
  user: number,
  channel: number,
  last_message?: number
}