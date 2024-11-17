"use client";

import ModalNewTask from "@/app/projects/ModalNewTask";
import { useAppSelector } from "@/app/redux";
import Header from "@/components/Header";

import TaskCard from "@/components/TaskCard";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";
import { useGetProjectsQuery, useGetTasksQuery } from "@/State/api";
import { Priority, Project, Task } from "@/State/types";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useState } from "react";

type Props = {
  priority: Priority;
};

const columns: GridColDef[] = [
  {
    field: "title",
    headerName: "Title",
    width: 100,
  },
  {
    field: "description",
    headerName: "Description",
    width: 200,
  },
  {
    field: "status",
    headerName: "Status",
    width: 130,
    renderCell: (params) => (
      <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
        {params.value}
      </span>
    ),
  },
  {
    field: "priority",
    headerName: "Priority",
    width: 75,
  },
  {
    field: "tags",
    headerName: "Tags",
    width: 130,
  },
  {
    field: "startDate",
    headerName: "Start Date",
    width: 130,
  },
  {
    field: "dueDate",
    headerName: "Due Date",
    width: 130,
  },
  {
    field: "author",
    headerName: "Author",
    width: 150,
    renderCell: (params) => params.value.username || "Unknown",
  },
  {
    field: "assignee",
    headerName: "Assignee",
    width: 150,
    renderCell: (params) => params.value.username || "Unassigned",
  },
];

const ReusablePriorityPage = ({ priority }: Props) => {
  const [view, setView] = useState("list");
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);
  const [selectProject, setSelectProject] = useState("none")


  const {
    data: tasks,
    isLoading: taskLoading,
    isError: isTasksError,
  } = useGetTasksQuery({ projectId: String(selectProject) })
  const {
    data: projects,
    isLoading: projectLoading,
    isError: isProjectError,
  } = useGetProjectsQuery()

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const filteredTasks = tasks?.filter(
    (task: Task) => task.priority === priority,
  );

  if (isTasksError || !tasks || isProjectError || !projects) return <div>Error fetching tasks</div>;

  const projectSelector = projects.reduce(
    (acc: Record<string, any>, projects: Project) => {
      const { name, id } = projects;
      acc.push({ name, id })
      return acc
    },
    []);
  return (
    <div className="m-5 p-4 grid ">
      <ModalNewTask
        projects={projectSelector}
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModalNewTaskOpen(false)}
      />
      <Header
        name="Priority Page"
        buttonComponent={
          <div>
            <select className='appearance-none focus:outline-none px-2 py-1 border dark:bg-dark-tertiary dark:text-white' onChange={(e) => setSelectProject(e.target.value)}>
              <option value="none">--select project--</option>
              {
                projectSelector.map((project: Project) => (
                  <option value={project.id}>{project.name}</option>
                ))
              }
            </select>
          </div>
        }
      />
      <div className="flex items-start justify-between ">
        <div className="mb-4 flex justify-start">
          <button
            className={`px-4 py-2 ${view === "list" ? "bg-gray-300" : "bg-white"
              } rounded-l`}
            onClick={() => setView("list")}
          >
            List
          </button>
          <button
            className={`px-4 py-2 ${view === "table" ? "bg-gray-300" : "bg-white"
              } rounded-l`}
            onClick={() => setView("table")}
          >
            Table
          </button>
        </div>
        <div>
          <button
            className="mr-3 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            onClick={() => setIsModalNewTaskOpen(true)}
          >
            Add Task
          </button>
        </div>
      </div>
      {taskLoading ? (
        <div>Loading tasks...</div>
      ) : view === "list" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredTasks?.map((task: Task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        view === "table" &&
        filteredTasks && (
          <div className="z-0 w-full">
            <DataGrid
              rows={filteredTasks}
              columns={columns}
              checkboxSelection
              getRowId={(row) => row.id}
              className={dataGridClassNames}
              sx={dataGridSxStyles(isDarkMode)}
            />
          </div>
        )
      )}
    </div>
  );
};

export default ReusablePriorityPage;
