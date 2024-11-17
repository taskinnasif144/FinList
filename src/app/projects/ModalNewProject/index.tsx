import Modal from '@/components/Modal'
import { useCreateProjectMutation, useGetTeamsQuery } from '@/State/api'
import React, { useState } from 'react'
import { formatISO } from 'date-fns'


type Props = {
    isOpen: boolean,
    onClose: () => void,
}

const ModalNewProject = ({ isOpen, onClose }: Props) => {
    const [createProject, { isLoading }] = useCreateProjectMutation();
    const [projectName, setProjectName] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const { data: teams, isLoading: teamLoading, isError: teamError } = useGetTeamsQuery()
    const [teamID, setTeamID] = useState<string>("")

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!projectName || !description || !startDate || !endDate) return;
        const formattedStartDate = formatISO(new Date(startDate), { representation: "complete" });
        const formattedEndDate = formatISO(new Date(endDate), { representation: "complete" });
        await createProject({
            name: projectName,
            description,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            teamId: teamID
        });
    }

    const isFormValid = () => {
        return projectName && description && startDate && endDate;
    }

    const inputStyles =
        "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none focus:outline-none";
    return (

        <Modal isOpen={isOpen} onClose={onClose} name='Create New Project'>
            <form className='space-y-6 text-center' onSubmit={handleSubmit}>
                <input type="text" className={inputStyles} placeholder='Project Name' value={projectName} onChange={(e) => setProjectName(e.target.value)} />
                <textarea className={inputStyles} placeholder='Description' value={description} onChange={e => setDescription(e.target.value)} />
                <div className='grid grid-cols-1 space-y-3 sm:space-y-0 sm:grid-cols-2 sm:gap-2'>
                    <input type="date" className={inputStyles} value={startDate} onChange={e => setStartDate(e.target.value)} />
                    <input type="date" className={inputStyles} value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
                {
                    !teams ? <div>Loading...</div> : (
                        <select className='appearance-none border w-full text-center dark:bg-dark-tertiary dark:text-white px-3 py-1 focus:outline-none'
                            onChange={e => setTeamID(e.target.value)}
                        >
                            <option>-- select team --</option>
                            {teams.map(team => <option value={team.id}>{team.teamName}</option>)}
                        </select>
                    )
                }
                <button type='submit' className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${!isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
                    }`}>{isLoading ? "Loading..." : "Create Proejct"}</button>
            </form>
        </Modal>
    )
}

export default ModalNewProject