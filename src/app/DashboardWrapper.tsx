"use client"

import React, { useEffect } from 'react'
import Navbar from './(components)/Navbar'
import Sidebar from './(components)/SIdebar'
import StoreProvider, { useAppSelector } from './redux'




const DashboardLayout = ({children}: {children: React.ReactNode}) => {
  const sidebarState = useAppSelector((state)=> state.global.sidebarToggle);
  const dakrModeState = useAppSelector((state)=> state.global.isDarkMode);

  useEffect(() => {
    if (dakrModeState) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  });


  return (
    <div className='flex min-h-screen w-full bg-gray-50 text-gray-900'>
      <Sidebar/>

      <main className={`dark:bg-dark-bg flex w-full flex-col bg-gray-50 ${sidebarState && "md:pl-64"}`}>
        <Navbar/>
        {children}
      </main>
    </div>
  )
}

const DashboardWrapper = ({children}: {children: React.ReactNode}) => {
  return (
    <StoreProvider>
      <DashboardLayout> {children}</DashboardLayout>
    </StoreProvider>
  )
}


export default DashboardWrapper
