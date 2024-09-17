"use client"

import { darkModeToggle, navbarToogle } from '@/State/slices'
import { useAppDispatch, useAppSelector } from '@/app/redux'
import { Menu, Moon, Search, Settings, Sun,  } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Navbar = () => {

 const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
 const sidebarState = useAppSelector(state=> state.global.sidebarToggle)

  const dispatch = useAppDispatch();

 const darkModeToggleFunc = () => {
  dispatch(darkModeToggle(!isDarkMode));
 }
 
 const sidebarToggle = () => {
  dispatch(navbarToogle(!sidebarState))
 }
  
  return (
    <div className= 'flex items-center justify-between px-4 py-3 bg-white dark:bg-black '>
      {/* Searchbar */}
      <div className='flex items-center gap-8'>
        <button className={`${sidebarState && "hidden"} hover:bg-gray-300 dark:hover:bg-gray-700 dark:text-white p-2 rounded-xl`} onClick={sidebarToggle}> <Menu /> </button>
        <div className='flex gap-1 w-[200px]  bg-gray-100 dark:bg-gray-700 dark:text-white p-1 px-2 rounded'>
            <Search className=' dark:text-white'/>
            <input type="search" className='w-full rounded border-none bg-transparent placeholder-gray-500 focus:border-transparent focus:outline-none  dark:placeholder-white' placeholder='search...' />
        </div>
      </div>

      {/* Icons */}
      <div className='flex items-center '>
       <button className='rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700' onClick={darkModeToggleFunc}>
        {isDarkMode? <Moon className='h-6 w-6 cursor-pointer dark:text-white' /> : <Sun className='h-6 w-6 cursor-pointer dark:text-white'  />}
       </button>
        <Link href={"/settings"} className='h-min w-min rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700'>
        <Settings className='h-6 w-6 cursor-pointer dark:text-white' />
        </Link>
        <div className='ml-2 mr-5 hidden min-h-[2em] w-[0.1rem] bg-gray-200 md:inline-block'></div>
      </div>
    </div>
  )
}

export default Navbar
