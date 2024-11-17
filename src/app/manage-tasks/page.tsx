'use client'

import Header from '@/components/Header';
import { dataGridClassNames, dataGridSxStyles } from '@/lib/utils';
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId } from '@mui/x-data-grid';
import { format } from 'date-fns';
import React, { useState } from 'react'
import { useAppSelector } from '../redux';
import { useAssignTaskToProjectMutation, useDeleteTaskMutation, useGetAllTasksQuery, useGetProjectsTasksQuery, useGetTasksQuery, useRemoveTaskFromProjectMutation } from '@/State/api';
import { Project } from '@/State/types';
import { Delete, DeleteIcon, Minus, Pencil, Plus, Trash2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

type Props = {}



function page({ }: Props) {
    const [selectProject, setSelectProject] = useState("none")

    const { data: tasks, isLoading: tasksLoading, isError: tasksError } = useGetAllTasksQuery()
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
    const { data: projects, isLoading: projectsLoading, isError: projectError } = useGetProjectsTasksQuery();
    const [deleteTask, { isLoading }] = useDeleteTaskMutation()
    const [addToTask] = useAssignTaskToProjectMutation();
    const [removeFromTask] = useRemoveTaskFromProjectMutation()


    if (tasksLoading || projectsLoading) return <div>Loading..</div>;
    if (tasksError || !projects) return <div>Error fetching data</div>;

    const handleDeleteTask = (id: GridRowId) => {

        deleteTask({ taskId: String(id) });
    }


    const projectSelector = projects.reduce(
        (acc: Record<string, any>, projects: Project) => {
            const { name, id } = projects;
            acc.push({ name, id })
            return acc
        },
        []);

    const handleAddToTeam = async (id: GridRowId) => {
        const taskId = id;

        const team = await addToTask({
            taskId: String(taskId),
            projectId: selectProject
        });
        if (team.data?.suc) {
            toast.success('Successfully Added to team!')
        } else {
            toast.error("Something went wrong.")
        }
    }

    const handleRemoveFromTeam = async (id: GridRowId) => {
        const taskId = id;
        const team = await removeFromTask({
            taskId: String(taskId),
        });
        if (team.data?.suc) {
            toast.success('Successfully Removed From Team!')
        } else {
            toast.error("Something went wrong.")
        }
    }

    const taskColumns: GridColDef[] = [
        { field: "id", headerName: "Task ID", width: 200 },
        { field: "title", headerName: "Title", width: 200 },
        { field: "status", headerName: "Status", width: 150 },
        { field: "priority", headerName: "Priority", width: 150 },
        { field: "projectName", headerName: "Project Name", width: 150 },
        {
            field: "dueDate", headerName: "Due Date", width: 150,
            renderCell: (params) => (format(new Date(params.value), "y MMM d"))
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => (
                [<GridActionsCellItem
                    icon={<Plus />}
                    label="Add"
                    onClick={() => handleAddToTeam(id)}
                    color="inherit"
                />,
                <GridActionsCellItem
                    icon={<Minus />}
                    label="Remove"
                    onClick={() => handleRemoveFromTeam(id)}
                    color="inherit"
                />,
                <GridActionsCellItem
                    icon={<Trash2 />}
                    label="Delete"
                    onClick={() => handleDeleteTask(id)}
                    color="inherit"
                />
                ]
            )
        }
    ];

    return (
        <div className='p-6'>
            <div className='bg-white dark:bg-dark-tertiary p-6 rounded-lg'>
                <Header name='Your Tasks' isSmallText buttonComponent={
                    <div>
                        <select className='appearance-none focus:outline-none px-4 py-1 border text-center dark:bg-dark-tertiary dark:text-white' onChange={(e) => setSelectProject(e.target.value)}>
                            <option value="none">--select project--</option>
                            {
                                projectSelector.map((project: Project) => (
                                    <option value={project.id}>{project.name}</option>
                                ))
                            }
                        </select>
                    </div>
                } />
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
            <Toaster />
        </div>
    )
}

export default page