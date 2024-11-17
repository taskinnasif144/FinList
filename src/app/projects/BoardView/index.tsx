import { useGetProjectsQuery, useGetTasksQuery, useUpdateTaskMutation } from '@/State/api';
import { Priority, Task as TaskType } from '@/State/types';
import { EclipseIcon, EllipsisVertical, MessageSquareMore, Plus } from 'lucide-react';
import React, { Dispatch, SetStateAction } from 'react'
import { format } from "date-fns";
import Image from 'next/image';
import { Span } from 'next/dist/trace';
import { DndProvider, useDrag, useDragLayer, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

type BoardProps = {
  id: string;
  setIsModalNewTaskOpen: Dispatch<SetStateAction<boolean>>;
}

const taskStatus = ["ToDo", "WorkInProgress", "UnderReview", "Completed"]

function BoardView({ id, setIsModalNewTaskOpen }: BoardProps) {
  const { data: tasks, isLoading, error } = useGetTasksQuery({ projectId: id });

  const [updateTaskStatus] = useUpdateTaskMutation();

  const moveTask = (taskId: string, toStatus: string) => {
    updateTaskStatus({ taskId: taskId, status: toStatus })
  }
  if (isLoading) return <div>Loading....</div>
  if (error || !tasks) return <div>An error occured while fetching tasks list</div>


  return (

    <DndProvider backend={HTML5Backend}>
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-4 '>
        {taskStatus.map((status) => {
          return <TaskColumn moveTask={moveTask} setIsModalNewTaskOpen={setIsModalNewTaskOpen} status={status} tasks={tasks} />
        })}
      </div>
    </DndProvider>
  )
}

type TaskColumnProps = {
  status: string;
  tasks: TaskType[];
  moveTask: (taskId: string, status: string) => void;
  setIsModalNewTaskOpen: Dispatch<SetStateAction<boolean>>
}

const TaskColumn = ({ status, moveTask, setIsModalNewTaskOpen, tasks }: TaskColumnProps) => {
  const tasksCount = tasks.filter((f) => f.status === status).length;
  const statusColor: any = {
    "To-Do": "#2563EB",
    "Work-In-Progress": "#059669",
    "Under-Review": "#D97706",
    Completed: "#000000",
  };

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: 'task',
      drop: (item: { id: string }) => moveTask(item.id, status),
      collect: (monitor: any) => ({
        isOver: !!monitor.isOver()
      })
    })
  )

  return <div ref={(instance) => { drop(instance) }} className={`sl:py-4 rounded-lg py-2 xl:px-2 ${false ? "bg-blue-100 dark:bg-neutral-950" : ""}`}>
    <div className="mb-3 flex w-full">
      <div
        className={`w-2 !bg-[${statusColor[status]}] rounded-s-lg`}
        style={{ backgroundColor: statusColor[status] }}
      />
      <div className="flex w-full items-center justify-between rounded-e-lg bg-white px-5 py-4 dark:bg-dark-secondary">
        <h3 className="flex items-center text-lg font-semibold dark:text-white">
          {status}{" "}
          <span
            className="ml-2 inline-block rounded-full bg-gray-200 p-1 text-center text-sm leading-none dark:bg-dark-tertiary"
            style={{ width: "1.5rem", height: "1.5rem" }}
          >
            {tasksCount}
          </span>
        </h3>
        <div className="flex items-center gap-1">
          <button className="flex h-6 w-5 items-center justify-center dark:text-neutral-500">
            <EllipsisVertical size={26} />
          </button>
          <button
            className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 dark:bg-dark-tertiary dark:text-white"
            onClick={() => setIsModalNewTaskOpen(true)}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
    <div>
      {
        tasks.filter((f) => f.status === status).map((task) => {
          return <Task key={task.id} task={task} />
        })
      }
    </div>
  </div>
}


type TaskProps = {
  task: TaskType;
}

const Task = ({ task }: TaskProps) => {
  const taskTagsSplit = task.tags ? task.tags.split(",") : []
  const formattedStartDate = task.startDate ? format(new Date(task.startDate), "d MMM y") : "";
  const formattedDueDate = task.dueDate ? format(new Date(task.dueDate), "d MMM y") : "";

  const PriorityTags = ({ priority }: { priority: TaskType['priority'] }) => {
    return <div
      className={`rounded-full px-2 py-1 text-xs font-semibold ${priority === "Urgent"
        ? "bg-red-200 text-red-700"
        : priority === "High"
          ? "bg-yellow-200 text-yellow-700"
          : priority === "Medium"
            ? "bg-green-200 text-green-700"
            : priority === "Low"
              ? "bg-blue-200 text-blue-700"
              : "bg-gray-200 text-gray-700"
        }`}
    >
      {priority}
    </div>
  };

  const [{ isDraging }, drag] = useDrag(() => ({
    type: 'task',
    item: { id: task.id },
    collect: (monitor) => ({
      isDraging: !!monitor.isDragging()
    })
  }));

  return <div ref={(instance) => { drag(instance) }} className={`mb-4 rounded-md bg-white shadow dark:bg-dark-secondary ${false ? "opacity-50" : "opacity-100"
    }`}>

    <div className='p-4 md:p-6'>
      <div className='flex items-start justify-between'>
        <div className='flex flex-1 flex-wrap items-center gap-2'>
          {task.priority && <PriorityTags priority={task.priority} />}
          <div className='flex gap-2'>
            {
              taskTagsSplit.map(tag => <div key={tag} className='rounded-full bg-blue-100 px-2 py-1 text-xs'> {tag}</div>)
            }
          </div>
        </div>
        <button className='h-6 w-4 dark:text-neutral-500'><EllipsisVertical /></button>
      </div>
      <div className='my-3 flex justify-between'>
        <h4 className='text-md font-bold dark:text-white'>{task.title}</h4>
      </div>

      <div className='text-xs text-gray-500 dark:text-neutral-500'>
        {formattedStartDate && <span>{formattedStartDate} - </span>}
        {formattedDueDate && <span>{formattedDueDate}</span>}
      </div>
      <p className='text-sm text-gray-600 dark:text-neutral-500'>
        {task.description}
      </p>
      <div className="mt-4 border-t border-gray-200 dark:border-stroke-dark" />

      {/* Users */}

      <div className='mt-3 flex items-center justify-between'>
        <div className='flex -space-x-[6px]'>
          {
            task.assignee && (
              <Image
                key={task.assignee.userId}
                src={`/${task.assignee.profilePictureUrl!}`}
                alt={task.assignee.username}
                width={30}
                height={30}
                className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
              />
            )
          }
          {
            task.author && (
              <Image
                key={task.author.userId}
                src={`/${task.author.profilePictureUrl!}`}
                alt={task.author.username}
                width={30}
                height={30}
                className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
              />
            )
          }
        </div>
        <div className="flex items-center text-gray-500 dark:text-neutral-500">
          <MessageSquareMore size={20} />
          <span className="ml-1 text-sm dark:text-neutral-400">
            2
          </span>
        </div>
      </div>


    </div>

  </div>
}

export default BoardView;