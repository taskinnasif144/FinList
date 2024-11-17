'use client'

import Header from '@/components/Header';
import { useAssignUserToTeamMutation, useGetTeamsQuery, useGetUsersQuery, useRemoveUserFromTeamMutation } from '@/State/api'
import { Avatar, Select } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';
import React, { useState } from 'react'
import { useAppSelector } from '../redux';
import { dataGridClassNames, dataGridSxStyles } from '@/lib/utils';
import { Minus, Plus, Users } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';


const page = () => {
  const { data: users, isLoading, error } = useGetUsersQuery();
  const [addToTeam] = useAssignUserToTeamMutation();
  const [removeFromTeam] = useRemoveUserFromTeamMutation();
  const { data: teams, isLoading: teamLoading, isError: teamError } = useGetTeamsQuery()
  const [teamID, setTeamID] = useState<string>("")
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const CustomToolbar = () => (
    <GridToolbarContainer className="toolbar flex gap-2">
      <GridToolbarFilterButton />
      <GridToolbarExport />
    </GridToolbarContainer>
  );

  const handleAddToTeam = async (id: GridRowId) => {
    const userID = id;

    const team = await addToTeam({
      userId: String(userID),
      teamId: teamID
    });


    if (team.data?.suc) {
      toast.success('Successfully Added to team!')
    } else {
      toast.error("Something went wrong.")
    }
  }
  const handleRemoveFromTeam = async (id: GridRowId) => {
    const userID = id;

    const team = await removeFromTeam({
      userId: String(userID),
    });
    if (team.data?.suc) {
      toast.success('Successfully Removed From Team!')
    } else {
      toast.error("Something went wrong.")
    }
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: "User ID", width: 100 },
    { field: "username", headerName: "Username", width: 150 },
    {
      field: "profilePictureUrl",
      headerName: "Profile Picture",
      headerAlign: 'center',
      width: 150,
      renderCell: (params) => (
        <div className='p-1 flex items-center justify-center'><Avatar sx={{ height: 31, width: 31 }} src={params.value} /></div>
      )
    },
    { field: 'teamName', headerName: "Team Name", width: 150 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => (
        [
          <GridActionsCellItem
            icon={<Plus />}
            label="Delete"
            onClick={() => handleAddToTeam(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<Minus />}
            label="Delete"
            onClick={() => handleRemoveFromTeam(id)}
            color="inherit"
          />
        ]
      )
    }
  ]
  if (isLoading || teamLoading) return <div>Loading...</div>
  if (error || teamError || !users || !teams) return <div> Error Fetching users</div>
  return (
    <div className='p-6'>
      <Header name='Users' buttonComponent={
        <select className='appearance-none border dark:bg-dark-tertiary dark:text-white px-3 py-1 focus:outline-none'
          onChange={e => setTeamID(e.target.value)}
        >
          <option>-- select team --</option>
          {teams.map(team => <option value={team.id}>{team.teamName}</option>)}
        </select>
      } />
      <div className=''>
        <DataGrid rows={users || []}
          columns={columns}
          getRowId={(row) => row.id}
          slots={{
            toolbar: CustomToolbar,
          }}
          className={dataGridClassNames}
          sx={dataGridSxStyles(isDarkMode)} />
      </div>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </div>
  )
}

export default page