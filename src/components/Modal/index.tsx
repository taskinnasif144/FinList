import React from 'react'
import ReactDOM from "react-dom";
import Header from '../Header';
import { X } from 'lucide-react';

type Props = {
    children: React.ReactNode,
    isOpen: boolean,
    onClose: () => void,
    name: string
}

const Modal = ({children, onClose, isOpen, name}: Props) => {
    if (!isOpen) return null;
  return (
    ReactDOM.createPortal(
        <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-dark-secondary p-3 md:p-5 h-auto w-full max-w-2xl'>
            <Header name={name} isSmallText buttonComponent={
              <button className='bg-blue-primary p-1 rounded-full hover:bg-blue-600'
              onClick={onClose}
              >  <X className='h-5 w-5 text-white dark:text-dark-bg'/> </button>
            }/>
         {children}
        </div>,
        document.body
    )
  )
}

export default Modal