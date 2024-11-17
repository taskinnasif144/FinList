import { useAppSelector } from '@/app/redux'
import { useGetTasksQuery } from '@/State/api'
import React, { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { Gantt, Task, EventOption, StylingOption, ViewMode, DisplayOption } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";


type TimelineViewProps = {
    id: string,
    setIsModalNewTaskOpen: Dispatch<SetStateAction<boolean>>
}

const TimelineView = ({ id, setIsModalNewTaskOpen }: TimelineViewProps) => {
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
    const { data: tasks, isLoading, error } = useGetTasksQuery({ projectId: String(id) });

    const ganttTask = useMemo(() => {
        return tasks ? tasks.map(task => {
            return {
                start: new Date(task.startDate as string),
                end: new Date(task.dueDate as string),
                name: task.title,
                id: `Task ${task.id}`,
                type: 'task',
                progress: task.points ? (task.points / 10) * 100 : 0,
                isDisabled: false,
                styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
            }
        }) : []
    }, [tasks]);

    const [displayOption, setDisplayOption] = useState(
        {
            viewMode: ViewMode.Month,
            locale: "en-US",
        }
    )

    const changeDisplayOption = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setDisplayOption((prev) => ({
            ...prev,
            viewMode: event.target.value as ViewMode,
        }))
    }

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
                        columnWidth={displayOption.viewMode === ViewMode.Month ? 150 : 100}
                        barBackgroundColor={isDarkMode ? "#101214" : "#aeb8c2"}
                        barBackgroundSelectedColor={isDarkMode ? "#000" : "#9ba1a6"}
                    />
                </div>
                <div className="px-4 pb-5 pt-1">
                    <button
                        className="flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
                        onClick={() => setIsModalNewTaskOpen(true)}
                    >
                        Add New Task
                    </button>
                </div>
            </div>
            <div>

            </div>
        </div>
    )
}

export default TimelineView