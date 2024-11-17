import { useGetTasksQuery } from '@/State/api';
import { Task as TaskType } from '@/State/types';
import React, { Dispatch, SetStateAction } from 'react'
import { format } from 'date-fns';
import Image from 'next/image';

type ListViewProps = {
  id: string,
  setIsModalNewTaskOpen: Dispatch<SetStateAction<boolean>>;
}

const ListView = ({ id, setIsModalNewTaskOpen }: ListViewProps) => {
  const { data: tasks, isLoading, error } = useGetTasksQuery({ projectId: String(id) })
  if (isLoading) return <div>Loading ...</div>
  if (error) return <div>Error Fetching Tasks</div>
  return (
    <div className='px-4 py-2'>
      <div className='flex justify-between items-center'>
        <h4 className='dark:text-white font-bold text-lg md:text-xl' >List</h4>
        <button
          onClick={() => setIsModalNewTaskOpen(true)}
          className='bg-blue-primary text-white p-1 px-2 rounded md:p-2 md:px-3'>
          Add Task
        </button>
      </div>
      <div className='flex flex-wrap gap-4'>
        {tasks ? tasks.map(task => <TaskListItem task={task} key={task.id} />) : ""}
      </div>
    </div>
  )
}

type TaskProps = {
  task: TaskType
}
const TaskListItem = ({ task }: TaskProps) => {
  const startDateFormat = task.startDate ? format(new Date(task.startDate), "d MMM y") : "";
  const dueDateFormat = task.dueDate ? format(new Date(task.dueDate), "y MMM d") : "";
  return <div className='p-4 bg-white shadow-lg rounded-lg dark:bg-dark-secondary dark:text-white w-[400px]'>
    <div>
      {(task.attachments && task.attachments.length > 0) && <Image alt={task.attachments[0].fileName} src={`/${task.attachments[0].fileURL}`} height={200} width={400} className='rounded-lg' />
      }
    </div>
    <h4><span className='font-bold'>ID:</span> {task.id}</h4>
    <h4><span className='font-bold'>Title:</span> {task.title}</h4>
    <h4><span className='font-bold'>Description:</span> {task.description}</h4>
    <h4><span className='font-bold'>Status:</span> {task.status}</h4>
    <h4><span className='font-bold'>Priority:</span> {task.priority}</h4>
    <h4><span className='font-bold'>Tags:</span> {task.tags}</h4>
    <h4><span className='font-bold'>Start Date:</span> {startDateFormat}</h4>
    <h4><span className='font-bold'>Due Date:</span> {dueDateFormat}</h4>
    <h4><span className='font-bold'>Author:</span> {task.authorUserId}</h4>
    <h4><span className='font-bold'>Assignee:</span> {task.assignedUserId}</h4>
  </div>

}

export default ListView