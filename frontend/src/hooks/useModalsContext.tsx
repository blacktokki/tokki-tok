import React, { useState, createContext, useContext, useEffect } from "react";
import { Modal } from "react-native";
import useResizeWindow from "./useResizeWindow";

type ModalProps = any

type ModalState = {
  Component:React.ComponentType<ModalProps>,
  ExactComponent?:React.ComponentType<ModalProps>
}
type SetModal = (Component:ModalState["Component"], props:ModalProps|null)=>void

const ModalsContext = createContext<{setModal: SetModal}>({
    setModal: () => {}
});

export const ModalsProvider = ({children, modals:allModals}:{children:React.ReactNode, modals:React.ComponentType<ModalProps>[]}) => {
    const [modals, setModals] = useState<ModalState[]>(allModals.map((Component)=>({Component})));
    const windowType = useResizeWindow();
    const [animationType, setAnimationType] = useState('none')
    const setModal:SetModal = (Component, props) => {
        const newModals = modals.map(m=>{
            if(m.Component == Component){
                return {
                    Component, 
                    ExactComponent:props != null?React.memo(()=><Component {...props}/>):undefined
                }
            }
            return m        
        })
        setModals(newModals);
    }
    useEffect(()=>{
        modals.filter(v=>v.ExactComponent!==undefined).length == 0 && setAnimationType(windowType == 'landscape'?'fade':'slide')
    }, [windowType, modals])
    return <ModalsContext.Provider value={{setModal}}>
        {children}
        {modals.map((modal, index)=>{
            const { ExactComponent } = modal;
            return <Modal key={index} animationType={animationType as any} visible={ExactComponent!==undefined}>
                {ExactComponent?<ExactComponent/>:<></>}
            </Modal>
        })}
    </ModalsContext.Provider>
}

export default ()=>{
    const modalsContext = useContext(ModalsContext)
    return modalsContext
}

