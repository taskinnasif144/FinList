'use client'

import Header from '@/components/Header'
import TaskCard from '@/components/TaskCard'
import { useGetProjectsQuery, useGetProjectsTasksQuery, useGetTasksQuery } from '@/State/api'
import { Priority, Project, ProjectTasks, Task } from '@/State/types'
import React, { useMemo, useState, PureComponent } from 'react'
import { BarChart, Bar, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Legend, PieChart, Pie } from 'recharts';
import { useAppSelector } from '../redux'
import { Tooltip } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { dataGridClassNames, dataGridSxStyles } from '@/lib/utils'
import { format } from 'date-fns'


type Props = {}

const HomePage = (props: Props) => {
    const [selectProject, setSelectProject] = useState("none")
    const { data: tasks, isLoading: tasksLoading, isError: tasksError } = useGetTasksQuery({ projectId: String(selectProject) });
    const { data: projects, isLoading: projectsLoading, isError: projectError } = useGetProjectsTasksQuery();
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);


    if (tasksLoading || projectsLoading) return <div>Loading..</div>;
    if (tasksError || !tasks || !projects) return <div>Error fetching data</div>;

    const priorityCounts = tasks.reduce((acc: Record<string, number>, tasks: Task) => {
        const { priority } = tasks;
        acc[priority as Priority] = (acc[priority as Priority] || 0) + 1
        return acc
    }, {})

    const taskDistribution = Object.keys(priorityCounts).map(key => ({ name: key, count: priorityCounts[key] }));

    const projectTaskCounts = projects.reduce(
        (acc: Record<string, number>, project: ProjectTasks) => {
            const taskCount = project.tasks ? project.tasks.length : 0;
            const projectName = project.name;
            acc[projectName] = taskCount
            return acc;
        }, {})


    const projectTaskDistribution = Object.keys(projectTaskCounts).map((key) => ({
        name: key,
        count: projectTaskCounts[key],
    }));


    const projectSelector = projects.reduce(
        (acc: Record<string, any>, projects: Project) => {
            const { name, id } = projects;
            acc.push({ name, id })
            return acc
        },
        []);

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
    const chartColors = isDarkMode
        ? {
            bar: "#8884d8",
            barGrid: "#303030",
            pieFill: "#4A90E2",
            text: "#FFFFFF",
        }
        : {
            bar: "#8884d8",
            barGrid: "#E0E0E0",
            pieFill: "#82ca9d",
            text: "#000000",
        };


    return (
        <div className='p-6'>
            <Header name="Project Management Dashboard" buttonComponent={
                <div>
                    <select className='appearance-none focus:outline-none px-2 py-1 border dark:bg-dark-tertiary dark:text-white' onChange={(e) => setSelectProject(e.target.value)}>
                        <option value="none">---select project---</option>
                        {
                            projectSelector.map((project: Project) => (
                                <option value={project.id}>{project.name}</option>
                            ))
                        }
                    </select>
                </div>
            } />

            <div className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 rounded-lg'>
                    <div className='p-6 bg-white dark:bg-dark-tertiary' >
                        <Header name='Task Priority Distribution' isSmallText />
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={taskDistribution}>
                                <Bar dataKey="count" fill="#8884d8" />
                                <CartesianGrid stroke="#ccc" />
                                <XAxis dataKey="name" stroke={chartColors.text} />
                                <YAxis stroke={chartColors.text} />
                                <Legend />
                            </BarChart>
                        </ResponsiveContainer>

                    </div>
                    <div className='p-6 bg-white dark:bg-dark-tertiary rounded-lg'>
                        <Header name='Tasks in Projects' isSmallText />
                        <ResponsiveContainer width="100%" height={400}>
                            <PieChart width={400} height={400}>
                                <Pie
                                    dataKey="count"
                                    startAngle={360}
                                    endAngle={0}
                                    data={projectTaskDistribution}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill={"#8884d8"}
                                    label
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className='bg-white dark:bg-dark-tertiary p-6 rounded-lg'>
                    <Header name='Your Tasks' isSmallText />
                    <DataGrid
                        rows={tasks}
                        columns={taskColumns}
                        loading={tasksLoading}
                        getRowClassName={() => "data-grid-row"}
                        getCellClassName={() => "data-grid-cell"}
                        className={dataGridClassNames}
                        sx={dataGridSxStyles(isDarkMode)}
                    />
                </div>
            </div>


        </div>
    )
}

export default HomePage






const taskColumns: GridColDef[] = [
    { field: "title", headerName: "Title", width: 200 },
    { field: "status", headerName: "Status", width: 150 },
    { field: "priority", headerName: "Priority", width: 150 },
    {
        field: "dueDate", headerName: "Due Date", width: 150,
        renderCell: (params) => (format(new Date(params.value), "y MMM d"))
    },
];