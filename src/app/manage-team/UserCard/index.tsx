import { useGetUserByIdQuery } from '@/State/api'
import { Avatar } from '@mui/material'
import { X } from 'lucide-react'
import React, { MouseEventHandler } from 'react'

type Props = {
    id: string;
    onClose: (val: string) => void
}

const UserCard = ({ id, onClose }: Props) => {
    const { data: user, isLoading, isError } = useGetUserByIdQuery({ id })
    if (isLoading) return <div>laoding ...</div>
    if (!user) return <div>User Data Error</div>

    return (
        <div className='flex items-center justify-between gap-2 bg-white dark:bg-dark-tertiary px-3 py-2 rounded-md'>
            <div className='flex items-center gap-2'>
                <Avatar sx={{ width: 30, height: 30 }} />
                <h3 className='text-base mb-2 dark:text-white'>{user?.username}</h3>
            </div>
            <button onClick={() => onClose(user?.id || "")}> <X className='dark:text-white h-6 w-6' /></button>
        </div>
    )
}

export default UserCard