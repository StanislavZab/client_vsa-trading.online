import React, { FC } from 'react'
import './modal.css'

type propsType = {
    children: React.ReactNode,
    setActiv: React.Dispatch<React.SetStateAction<boolean>>,
    active: boolean,
    setRegistration: React.Dispatch<React.SetStateAction<boolean>>
}

const Modal: FC<propsType> = ({children, setActiv, active, setRegistration}) => {
    
    return(
        <div className={active ? 'modal active' : 'modal'} onClick={() => {setActiv(false); setRegistration(false)}}>
            <div className={active ? 'modal__content active' : 'modal__content'} onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    )
}

export default Modal;