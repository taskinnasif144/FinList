'use client'

import Header from '@/components/Header';
import { dataGridClassNames, dataGridSxStyles } from '@/lib/utils';
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId } from '@mui/x-data-grid';
import { format } from 'date-fns';
import React, { useState } from 'react'
import { useAppSelector } from '../redux';
import { useCreateTeamMutation, useDeleteProjectMutation, useDeleteTaskMutation, useDeleteTeamMutation, useGetProjectsTasksQuery, useGetTasksQuery, useGetTeamsQuery } from '@/State/api';
import { Project, Team } from '@/State/types';
import { Delete, DeleteIcon, Pencil, PlusSquare, Trash2 } from 'lucide-react';
import ModalNewProject from '../projects/ModalNewProject';
import ModalNewTeam from './ModalNewTeam';

type Props = {}



function page({ }: Props) {
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
    const { data: teams, isLoading: teamLoading, isError: teamError } = useGetTeamsQuery();
    const [deleteTeam, { isLoading }] = useDeleteTeamMutation()
    const [modalNewTeam, setModalNewTeam] = useState(false);


    if (teamLoading) return <div>Loading..</div>;
    if (teamError || !teams) return <div>Error fetching data</div>;

    const handleDeleteTask = (id: GridRowId) => {
        deleteTeam({ teamId: String(id) });
    }

    const projectSelector = teams.reduce(
        (acc: Record<string, any>, team: Team) => {
            const { teamName, id } = team;
            acc.push({ teamName, id })
            return acc
        },
        []);

    const teamColumn: GridColDef[] = [
        { field: "id", headerName: "Team ID", width: 200 },
        { field: "teamName", headerName: "Team Name", width: 150 },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => (
                [
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
            {modalNewTeam && <ModalNewTeam isOpen={modalNewTeam} onClose={() => { setModalNewTeam(false) }} />}
            <Header name='Your Tasks' isSmallText buttonComponent={
                <button className='flex items-center gap-1 bg-blue-primary text-white px-3 py-2 rounded-lg'
                    onClick={() => { setModalNewTeam(true) }}
                ><PlusSquare className='h-5 w-5' /> <span>New Team</span></button>
            } />
            <DataGrid
                rows={teams}
                columns={teamColumn}
                loading={teamLoading}
                getRowClassName={() => "data-grid-row"}
                getCellClassName={() => "data-grid-cell"}
                className={dataGridClassNames}
                sx={dataGridSxStyles(isDarkMode)}
            />
        </div></div>
    )
}

export default page