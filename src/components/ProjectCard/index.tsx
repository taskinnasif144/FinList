import { Project } from '@/State/types'
import React from 'react'
import { format } from 'date-fns'
import Image from 'next/image'

type Props = {
  project: Project
}

const ProjectCard = ({ project }: Props) => {
  const startDateFormat = project.startDate ? format(new Date(project.startDate), "y MMM d") : "Not Set";
  const dueDateFormat = project.endDate ? format(new Date(project.endDate), 'y MMM d') : "Not Set";
  return (
    <div className='dark:text-white p-5 bg-white dark:bg-dark-tertiary rounded-lg'>
      <h4><span className='font-bold'>ID:</span> {project.id}</h4>
      <h4><span className='font-bold'>Title:</span> {project.name}</h4>
      <h4><span className='font-bold'>Description:</span> {project.description}</h4>
      <h4><span className='font-bold'>Start Date:</span> {startDateFormat}</h4>
      <h4><span className='font-bold'>Due Date:</span> {dueDateFormat}</h4>
    </div>
  )
}

export default ProjectCard