'use client'

import Header from '@/components/Header';
import { dataGridClassNames, dataGridSxStyles } from '@/lib/utils';
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId } from '@mui/x-data-grid';
import { format } from 'date-fns';
import React, { useState } from 'react'
import { useAppSelector } from '../redux';
import { useAssignProjectToTeamMutation, useDeleteProjectMutation, useDeleteTaskMutation, useGetProjectsQuery, useGetProjectsTasksQuery, useGetTasksQuery, useGetTeamsQuery, useRemoveProjectFromTeamMutation } from '@/State/api';
import { Project } from '@/State/types';
import { Delete, DeleteIcon, Minus, Pencil, Plus, PlusSquare, Trash2 } from 'lucide-react';
import ModalNewProject from '../projects/ModalNewProject';
import toast, { Toaster } from 'react-hot-toast';

type Props = {}



function page({ }: Props) {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const { data: projects, isLoading: projectsLoading, isError: projectError } = useGetProjectsQuery();
  const [deleteProject, { isLoading }] = useDeleteProjectMutation()
  const [modalNewProject, setModalNewTask] = useState(false);
  const { data: teams, isLoading: teamLoading, isError: teamError } = useGetTeamsQuery()
  const [teamID, setTeamID] = useState<string>("")
  const [addToTeam] = useAssignProjectToTeamMutation();
  const [removeFromTeam] = useRemoveProjectFromTeamMutation();

  if (projectsLoading) return <div>Loading..</div>;
  if (projectError || !projects) return <div>Error fetching data</div>;

  const handleDeleteTask = (id: GridRowId) => {
    deleteProject({ projectId: String(id) });
  }

  const handleAddToTeam = async (id: GridRowId) => {
    const projectId = id;

    const team = await addToTeam({
      projectId: String(projectId),
      teamId: teamID
    });

    if (team.data?.suc) {
      toast.success('Successfully Added to team!')
    } else {
      toast.error("Something went wrong.")
    }

  }

  const handleRemoveFromTeam = async (id: GridRowId) => {
    const projectId = id;

    const team = await removeFromTeam({
      projectId: String(projectId),
    });
    if (team.data?.suc) {
      toast.success('Successfully Removed From Team!')
    } else {
      toast.error("Something went wrong.")
    }

  }

  const projectColumn: GridColDef[] = [
    { field: "id", headerName: "Project ID", width: 200 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "description", headerName: "Description", width: 300 },
    { field: "teamName", headerName: "Team Name", width: 150 },
    {
      field: "startDate", headerName: "Due Date", width: 150,
      renderCell: (params) => (format(new Date(params.value), "y MMM d"))
    },
    {
      field: "endDate", headerName: "Due Date", width: 150,
      renderCell: (params) => (format(new Date(params.value), "y MMM d"))
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
      cellClassName: 'actions',
      getActions: ({ id }) => (
        [
          <GridActionsCellItem
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
    <div> <div className='bg-white dark:bg-dark-tertiary p-6 rounded-lg'>
      {modalNewProject && <ModalNewProject isOpen={modalNewProject} onClose={() => { setModalNewTask(false) }} />}
      <Header name='Your Tasks' isSmallText buttonComponent={
        <select className='appearance-none border dark:bg-dark-tertiary dark:text-white px-3 py-1 focus:outline-none'
          onChange={e => setTeamID(e.target.value)}
        >
          <option>-- select team --</option>
          {teams ? teams.map(team => <option value={team.id}>{team.teamName}</option>) : <div>Loading...</div>}
        </select>
      } />
      <DataGrid
        rows={projects}
        columns={projectColumn}
        loading={projectsLoading}
        getRowClassName={() => "data-grid-row"}
        getCellClassName={() => "data-grid-cell"}
        className={dataGridClassNames}
        sx={dataGridSxStyles(isDarkMode)}
      />
      <button className='flex items-center gap-1 bg-blue-primary text-white px-3 py-2 rounded-lg mt-5'
        onClick={() => { setModalNewTask(true) }}
      ><PlusSquare className='h-5 w-5' /> <span>New Project</span> </button>
    </div>
      <Toaster /></div>
  )
}

export default page