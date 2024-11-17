import Modal from '@/components/Modal'
import { useAssignUserToTeamMutation, useCreateProjectMutation, useCreateTeamMutation, useGetUsersQuery } from '@/State/api'
import React, { useState } from 'react'
import { formatISO } from 'date-fns'
import { options } from 'numeral'
import { User } from '@/State/types'
import UserCard from '../UserCard'


type Props = {
    isOpen: boolean,
    onClose: () => void,
}

const ModalNewTeam = ({ isOpen, onClose }: Props) => {
    const [createTeam, { isLoading }] = useCreateTeamMutation()
    const [addTeam, { isLoading: teamLoading }] = useAssignUserToTeamMutation()
    const { data: users, isLoading: userLoading, isError: userError } = useGetUsersQuery()
    const [teamName, setTeamName] = useState("");
    const [assignedUsers, setAssignedUsers] = useState<string[]>([]);
    if (userLoading) return <div>Loading ...</div>
    if (!users) return <div>Error Fetching users</div>

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!teamName) return;
        await createTeam({
            teamName: teamName,
        });
    }

    const handleOnChange = (event: any) => {
        const userID = event.target.value;
        const hasID = assignedUsers.includes(userID);

        if (!hasID) {
            setAssignedUsers([...assignedUsers, userID])
        }
    }
    const handleRemoveSelection = (val: string) => {

        setAssignedUsers(assignedUsers.filter(id => id != val))

    }

    const isFormValid = () => {
        return teamName;
    }

    const inputStyles =
        "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none focus:outline-none";
    return (

        <Modal isOpen={isOpen} onClose={onClose} name='Create New Project'>
            <form className='space-y-6 text-center' onSubmit={handleSubmit}>
                <input type="text" className={inputStyles} placeholder='Team Name' value={teamName} onChange={(e) => setTeamName(e.target.value)} />
                <button type='submit' className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${!isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
                    }`}>{isLoading ? "Loading..." : "Create Proejct"}</button>
            </form>
        </Modal>
    )
}

export default ModalNewTeam