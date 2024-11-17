'use client'

import { useGetProjectsQuery } from '@/State/api';
import { navbarToogle } from '@/State/slices';
import { useAppDispatch, useAppSelector } from '@/app/redux';
import { AlertCircle, AlertOctagon, AlertTriangle, Briefcase, ChevronDown, ChevronUp, ClipboardCheck, Home, HomeIcon, Icon, Layers3, Lock, LucideIcon, Search, Settings, ShieldAlert, User, User2, Users, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react'

const Sidebar = () => {
  const [showProject, setShowProject] = useState(false);
  const [showPriority, setShowPriority] = useState(false);
  const sidebarState = useAppSelector((state) => state.global.sidebarToggle);

  const { isLoading, error, data: projects } = useGetProjectsQuery();



  const dispatch = useAppDispatch();
  const sidebarToggle = () => {
    dispatch(navbarToogle(!sidebarState));
  }

  const sidebarClassNames = `fixed flex flex-col h-full justify-between shadow-xl transition-all duration-300 z-40 dark:bg-black overflow-y-auto bg-white ${sidebarState ? "w-64" : "w-0"}`
  return (
    <div className={sidebarClassNames}>
      <div>
        <div className='flex justify-between'>
          <h1 className='text-start p-4 font-bold text-xl text-gray-800 dark:text-white' >FinList</h1>
          <button onClick={sidebarToggle} className='p-2 m-2 rounded-2xl hover:bg-gray-300 dark:hover:bg-gray-700 dark:text-white'>
            <X />
          </button>
        </div>
        <div className='flex items-center border-y-2 border-gray-300 dark:border-gray-700'>
          <Image height={70} width={70} alt='logo image' src={`/logo.png`} className='h-[50px] w-[60px]' />
          <div className=''>
            <h4 className='font-bold text-md tracking-wide dark:text-gray-200'>stardust Crusaders</h4>
            <p className=' text-gray-500 dark:text-gray-300 text-xs flex items-center gap-1'><Lock className='h-3 w-3' /> <span>private</span> </p>
          </div>
        </div>
        <nav>
          <SidebarLinks href='/' label='Home' icon={HomeIcon} />
          <SidebarLinks href='/timeline' label='Timeline' icon={Briefcase} />
          <SidebarLinks href='/search' label='Search' icon={Search} />
          <SidebarLinks href='/users' label='Users' icon={User2} />
          <SidebarLinks href='/settings' label='Settings' icon={Settings} />
          <SidebarLinks href='/teams' label='Teams' icon={Users} />
          <SidebarLinks href='/manage-tasks' label='Manage Tasks' icon={ClipboardCheck} />
          <SidebarLinks href='/manage-projects' label='Manage Projects' icon={ClipboardCheck} />
          <SidebarLinks href='/manage-team' label='Manage Teams' icon={ClipboardCheck} />
        </nav>
        {/* PRoject links */}
        <button
          onClick={
            () => {
              setShowProject(prev => !prev)
            }
          }
          className='dark:text-gray-300 flex items-center justify-between w-full p-3'>
          <span className='font-bold'>projects</span>
          {showProject ? <ChevronUp className='h-5 w-5' /> : <ChevronDown className='h-5 w-5' />}
        </button>
        {
          showProject && projects?.map((project) => <SidebarLinks href={`/projects/${project.id}`} label={project.name} icon={Briefcase} key={project.id} />)
        }
        {/* Priority Links */}
        <button
          onClick={
            () => {
              setShowPriority(prev => !prev)
            }
          }
          className='dark:text-gray-300 flex items-center justify-between w-full p-3'>
          <span className='font-bold'>Priority</span>
          {showPriority ? <ChevronUp className='h-5 w-5' /> : <ChevronDown className='h-5 w-5' />}
        </button>

        {
          showPriority && (
            <>
              <SidebarLinks href='/priority/urgent' label='Urgent' icon={AlertCircle} />
              <SidebarLinks href='/priority/high' label='High' icon={ShieldAlert} />
              <SidebarLinks href='/priority/medium' label='Medium' icon={AlertTriangle} />
              <SidebarLinks href='/priority/low' label='Low' icon={AlertOctagon} />
              <SidebarLinks href='/priority/backlog' label='Backlog' icon={Layers3} />
            </>

          )
        }
      </div>
    </div>
  )
}


interface sidebarProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

const SidebarLinks = ({ href, icon: Icon, label }: sidebarProps) => {
  const pathName = usePathname();
  const activeTab = pathName === href || (pathName === "/" && href === "/dashboard");


  return (
    <Link href={href} className={`flex items-center gap-2 p-2 px-3 ${activeTab && "bg-gray-200 dark:bg-gray-800"} hover:bg-gray-300 dark:text-gray-300 dark:hover:bg-gray-700 `}>
      <Icon className='w-5 h-5' />
      <h4 className='text-base'>{label}</h4>
    </Link>
  )
}








export default Sidebar
