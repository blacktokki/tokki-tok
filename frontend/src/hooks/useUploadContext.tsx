import React, { createContext, useContext, Dispatch, useReducer } from 'react';

type UploadState = Record<number, {
  filename: string,
  progress?: number,
}[]>

type UploadAction = {
  channel:number,
  filename:string,
  progress?:number
}

type UploadContextType = {
  upload:UploadState,
  dispatch:Dispatch<UploadAction>
}

const UploadContext = createContext<UploadContextType>({upload:{} as UploadState, dispatch:()=>{}});

const uploadReducer =(initialState:UploadState, action:UploadAction)=>{
  const files = [...(initialState[action.channel] || [])]
  const index = files.findIndex(f=>f.filename==action.filename)
  if (index >= 0){
    files[index] = {filename:action.filename, progress:action.progress} 
  }
  else{
    files.push({filename:action.filename, progress:action.progress})
  }
  return {
    ...initialState,
    [action.channel] : files.filter(f=>(f.progress || 0)<1)
  }
}

export const UploadContextProvider = ({children}:{children:React.ReactNode})=>{
  const [upload, dispatch] = useReducer(uploadReducer, {})
  return <UploadContext.Provider value={{upload, dispatch}}>
    {children}
  </UploadContext.Provider>
}

export default function useUploadContext() {
  const upload = useContext(UploadContext)
  return upload
}