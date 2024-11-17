'use client'

import Header from '@/components/Header';
import { useGetTeamsQuery } from '@/State/api'
import { Avatar } from '@mui/material';
import { DataGrid, GridColDef, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from '@mui/x-data-grid';
import React from 'react'
import { useAppSelector } from '../redux';
import { dataGridClassNames, dataGridSxStyles } from '@/lib/utils';


const page = () => {
  const { data: teams, isLoading, error } = useGetTeamsQuery();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const CustomToolbar = () => (
    <GridToolbarContainer className="toolbar flex gap-2">
      <GridToolbarFilterButton />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
  const columns: GridColDef[] = [
    { field: 'id', headerName: "Team ID", width: 250 },
    { field: 'teamName', headerName: "Team Name", width: 250 },



  ]
  if (isLoading) return <div>Loading...</div>
  if (error || !teams) return <div> Error Fetching teams</div>
  return (
    <div className='p-6'>
      <Header name='Teams' />
      <div className=''>
        <DataGrid rows={teams || []}
          columns={columns}
          getRowId={(row) => row.id}
          slots={{
            toolbar: CustomToolbar,
          }}
          className={dataGridClassNames}
          sx={dataGridSxStyles(isDarkMode)} />
      </div>
    </div>
  )
}

export default page