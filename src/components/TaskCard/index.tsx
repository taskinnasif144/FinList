import { Task } from '@/State/types'
import React from 'react'
import { format } from 'date-fns'
import Image from 'next/image'

type Props = {
  task: Task
}

const TaskCard = ({ task }: Props) => {
  const startDateFormat = task.startDate ? format(new Date(task.startDate), "y MMM d") : "Not Set";
  const dueDateFormat = task.dueDate ? format(new Date(task.dueDate), 'y MMM d') : "Not Set";
  return (
    <div className='dark:text-white p-5 bg-white dark:bg-dark-tertiary rounded-lg'>
      <div className='mb-4'>
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
  )
}

export default TaskCard