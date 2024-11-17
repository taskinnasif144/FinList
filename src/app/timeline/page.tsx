'use client'

import { useAppSelector } from '@/app/redux'
import { useGetProjectsQuery, useGetTasksQuery } from '@/State/api'
import React, { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { Gantt, Task, EventOption, StylingOption, ViewMode, DisplayOption } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";

const page = () => {
    const isDarkMode = useAppSelector((state)=> state.global.isDarkMode);
    const { data: projects, isLoading, isError } = useGetProjectsQuery();
    
    const ganttTask = useMemo(() => {
        return (
          projects?.map((project) => ({
            start: new Date(project.startDate as string),
            end: new Date(project.endDate as string),
            name: project.name,
            id: `Project-${project.id}`,
            type: "project",
            progress: 50,
            isDisabled: false,
          })) || []
        );
      }, [projects]);

    const [displayOption, setDisplayOption] = useState(
        {
            viewMode: ViewMode.Month,
            locale: "en-US",
        }
    )

    const changeDisplayOption = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setDisplayOption((prev) =>({
            ...prev,
            viewMode: event.target.value as ViewMode,
        }))
    }
    if (isLoading) return <div>Loading...</div>;
    if (isError || !projects)
      return <div>An error occurred while fetching projects</div>;
  return (
    <div className='px-4 xl:px-6'>
        <div className='flex flex-wrap items-center justify-between gap-2  py-5'>
            <h1 className='me-2 text-lg font-bold dark:text-white'>Project Task Timeline</h1>
            <div className='w-64'>
                <select className='appearance-none w-full rounded focus:outline-none border border-gray-400 bg-white px-4 py-2 shadow hover:border-gray-500 dark:border-dark-secondary dark:bg-dark-secondary dark:text-white'
                onChange={changeDisplayOption}
                >
                    <option value={ViewMode.Month}>Month</option>
                    <option value={ViewMode.Week}>Week</option>
                    <option value={ViewMode.Day}>Day</option>
                </select>
            </div>
        </div>
        <div className="overflow-hidden rounded-md bg-white shadow dark:bg-dark-secondary dark:text-white">
        <div className="timeline">
        <Gantt 
            tasks={ganttTask}
            {...displayOption}
            columnWidth={displayOption.viewMode === ViewMode.Month? 150: 100}
            projectBackgroundColor={isDarkMode ? "#101214" : "#1f2937"}
            projectProgressColor={isDarkMode ? "#1f2937" : "#aeb8c2"}
            projectProgressSelectedColor={isDarkMode ? "#000" : "#9ba1a6"}
        />
        </div>
      </div>
      
    </div>
  )
}

export default page