import React, { useState, createContext, useContext } from "react";
import { Modal } from "react-native";
import useResizeWindow from "./useResizeWindow";

type ModalProps = any

type ModalState = {
  Component:React.ComponentType<ModalProps>,
  props:ModalProps|null,
}
type SetModal = (Component:ModalState["Component"], props:ModalState["props"])=>void

const ModalsContext = createContext<{setModal: SetModal}>({
    setModal: () => {}
});

export const ModalsProvider = ({children, modals:allModals}:{children:React.ReactNode, modals:React.ComponentType<ModalProps>[]}) => {
    const [modals, setModals] = useState<ModalState[]>(allModals.map((v)=>({
        Component:v,
        props:null
    })));
    const windowType = useResizeWindow();
    const setModal:SetModal = (Component, props) => {
        setModals(modals.map(m=>{
            if(m.Component == Component){
                return {...m, Component, props}
            }
            return m        
        }));
    }
    return (
        <ModalsContext.Provider value={{setModal}}>
            {children}
            {modals.map((modal, index)=>{
                const { Component, props } = modal;
                return <Modal key={index} animationType={windowType == 'landscape'?'fade':'slide'} visible={props != null}>
                    <Component {...props}/>
                </Modal>
            })}
        </ModalsContext.Provider>
    );
}

export default ()=>{
    const modalsContext = useContext(ModalsContext)
    return modalsContext
}

