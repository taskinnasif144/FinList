'use client'

import Header from '@/components/Header'
import React, { useState } from 'react'
import { debounce } from "lodash";
import { useSearchQuery } from '@/State/api';
import { Span } from 'next/dist/trace';
import TaskCard from '@/components/TaskCard';
import ProjectCard from '@/components/ProjectCard';
import UserCard from '@/components/UserCard';



const page = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: searchResult, isLoading, isError } = useSearchQuery(searchTerm, { skip: searchTerm.length < 3 })

  const handleSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value)
    }, 500);

  return (
    <div className='p-8 w-full'>
      <Header name='Search' />
      <div className='w-full'>
        <input type="text" placeholder='search...' onChange={handleSearch} className='w-full border shadow p-3 dark:border-dark-tertiary dark:text-white dark:bg-dark-tertiary focus:outline-none' />
      </div>

      <div className='grid gird-cols-1 md:grid-cols-3 dark:text-white gap-6'>
        {searchResult?.tasks && searchResult.tasks.length > 0 && (
          <div className='space-y-6 py-3'>
            <h2 className='font-bold text-lg'>Tasks</h2>
            {searchResult.tasks.map(task => <TaskCard key={task.id} task={task} />)}</div>
        )}
        {searchResult?.projects && searchResult.projects.length > 0 && (
          <div className='space-y-6 py-3'>
            <h2 className='font-bold text-lg'>Projects</h2>
            {searchResult.projects.map(project => <ProjectCard key={project.id} project={project} />)}</div>
        )}
        {searchResult?.users && searchResult.users.length > 0 && (
          <div className='space-y-6 py-3'>
            <h2 className='font-bold text-lg'>Users</h2>
            {searchResult.users.map(user => <UserCard key={user.userId} users={user} />)}</div>
        )}
      </div>

    </div>
  )
}

export default page