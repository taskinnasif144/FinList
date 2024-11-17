import Modal from '@/components/Modal'
import { Priority, Project, Status } from '@/State/types';
import React, { Dispatch, SetStateAction, useState } from 'react'
import { formatISO } from "date-fns";
import { Sailboat } from 'lucide-react';
import { useCreateTaskMutation } from '@/State/api';
import { divide } from 'lodash';


type Props = {
  isOpen: boolean,
  onClose: () => void;
  id?: string | null;
  projects?: any
}

const ModalNewTask = ({ isOpen, onClose, id = null, projects }: Props) => {
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Status>(Status.ToDo);
  const [priority, setPriority] = useState<Priority>(Priority.Backlog);
  const [startDate, setStartDate] = useState('');
  const [tags, setTags] = useState('')
  const [dueDate, setDueDate] = useState('');
  const [authorID, setAuthorID] = useState('');
  const [assignee, setAssignee] = useState('');
  const [projectId, setProjectId] = useState('1');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title || !(id !== null || projectId)) return;

    const formattedStartDate = formatISO(new Date(startDate), {
      representation: "complete",
    });
    const formattedDueDate = formatISO(new Date(dueDate), {
      representation: "complete",
    });

    await createTask({
      title,
      description,
      status,
      priority,
      tags,
      startDate: formattedStartDate,
      dueDate: formattedDueDate,
      projectId: id ? String(id) : String(projectId)
    })


  }
  const isFormValid = () => {
    return title && (id !== null || projectId) && status && priority;
  };


  const inputStyles = 'w-full border border-gray-300 px-3 py-2 dark:bg-dark-tertiary shadow-sm dark:border-dark-tertiary dark:text-white focus:outline-none'
  return (
    <Modal isOpen={isOpen} onClose={onClose} name='Create New Task'>
      <form className='space-y-6' onSubmit={handleSubmit}>
        <input type="text" placeholder='Title' className={inputStyles} value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea placeholder='Description' className={inputStyles} value={description} onChange={e => setDescription(e.target.value)}></textarea>
        <div className='grid grid-cols-1 space-y-4 sm:space-y-0 sm:grid-cols-2 sm:gap-3'>
          <select className={inputStyles} value={status} onChange={e => setStatus(Status[e.target.value as keyof typeof Status])}>
            <option value={Status.ToDo}>To Do</option>
            <option value={Status.WorkInProgress}>Work in Progress</option>
            <option value={Status.UnderReview}>Under Review</option>
            <option value={Status.Completed}>Completed</option>
          </select>

          <select className={inputStyles} value={priority} onChange={e => setPriority(Priority[e.target.value as keyof typeof Priority])}>
            <option value={Priority.Backlog}>Back Log</option>
            <option value={Priority.Low}>Low</option>
            <option value={Priority.Medium}>Medium</option>
            <option value={Priority.High}>High</option>
            <option value={Priority.Urgent}>Urgent</option>
          </select>
        </div>
        <input type="text" className={inputStyles} placeholder='Tags (comma seperated)' value={tags} onChange={e => setTags(e.target.value)} />
        <div className='grid grid-cols-1 space-y-4 sm:space-y-0 sm:grid-cols-2 sm:gap-3'>
          <input type="date" className={inputStyles} value={startDate} onChange={e => setStartDate(e.target.value)} />
          <input type="date" className={inputStyles} value={dueDate} onChange={e => setDueDate(e.target.value)} />
        </div>

        {id === null && (
          <div className='flex items-center'>
            <label className='w-32'>Select Project: </label>
            <select className='focus:outline-none px-2 py-1 border dark:bg-dark-tertiary dark:text-white appearance-none w-full ' onChange={(e) => setProjectId(e.target.value)}>
              {
                projects.map((project: Project) => (
                  <option value={project.id}>{project.name}</option>
                ))
              }
            </select>
          </div>
        )}
        <button
          type="submit"
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${!isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
            }`}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "Creating..." : "Create Task"}
        </button>
      </form>
    </Modal>
  )
}

export default ModalNewTask