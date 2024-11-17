import Header from '@/components/Header'
import React, { Dispatch, SetStateAction } from 'react'
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { useGetTasksQuery } from '@/State/api';
import { format } from 'date-fns';
import { dataGridClassNames, dataGridSxStyles } from '@/lib/utils';
import { useAppSelector } from '@/app/redux';

type Props = {
  id: string,
  setIsModalNewTaskOpen: Dispatch<SetStateAction<boolean>>
}

const TableView = ({ id, setIsModalNewTaskOpen }: Props) => {
  const { data: tasks, isLoading, error } = useGetTasksQuery({ projectId: String(id) });
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const columns: GridColDef[] = [
    {
      field: 'title',
      headerName: "Title",
      width: 130
    },
    {
      field: 'description',
      headerName: "Description",
      width: 300
    },
    {
      field: 'priority',
      headerName: "Priority",
      width: 120,
      renderCell: (params) => (<span className={`${params.value === "Urgent"
          ? "bg-red-200 text-red-700"
          : params.value === "High"
            ? "bg-yellow-200 text-yellow-700"
            : params.value === "Medium"
              ? "bg-green-200 text-green-700"
              : params.value === "Low"
                ? "bg-blue-200 text-blue-700"
                : "bg-gray-200 text-gray-700"
        } px-2 py-1 rounded-lg`}>{params.value}</span>)
    },
    {
      field: 'tags',
      headerName: "tags",
      width: 130
    },
    {
      field: 'status',
      headerName: "Status",
      width: 140,
      renderCell: (params) => (<span className={`${params.value === "Under Review"
          ? "bg-red-200 text-red-700"
          : params.value === "Completed"
            ? "bg-dark-tertiary text-white"
            : params.value === "To Do"
              ? " bg-blue-200 text-blue-700"
              : params.value === "Work In Progress"
                ? "bg-green-200 text-green-700"
                : "bg-gray-200 text-gray-700"
        } px-2 py-1 rounded-lg`}>{params.value}</span>)
    },

    {
      field: 'startDate',
      headerName: 'Start Date',
      width: 130,
      renderCell: (param) => (
        format(param.value, "d MMM y")
      )
    },
    {
      field: 'dueDate',
      headerName: 'Due Date',
      width: 130,
      renderCell: (param) => (
        format(param.value, "d MMM y")
      )
    },
    {
      field: "author",
      headerName: "Author",
      width: 150,
      renderCell: (params) => params.value?.author || "Unknown",
    },
    {
      field: "assignee",
      headerName: "Assignee",
      width: 150,
      renderCell: (params) => params.value?.assignee || "Unassigned",
    },

  ]

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error Fetching Tasks</div>
  return (
    <div className=' w-full px-4 pb-8 xl:px-6 my-4'>
      <div>
        <Header name='Table' isSmallText buttonComponent={
          <button className='bg-blue-primary text-white px-4 py-2 rounded-lg' onClick={() => setIsModalNewTaskOpen(true)}> Add Task</button>
        } />
      </div>
      <div>
        <DataGrid rows={tasks || []} columns={columns} className={dataGridClassNames} sx={dataGridSxStyles(isDarkMode)} />
      </div>
    </div>
  )
}

export default TableView