import { User } from '@/State/types'
import React from 'react'
import {format} from 'date-fns'
import Image from 'next/image'
import { Avatar } from '@mui/material'

type Props = {
    users: User
}

const UserCard = ({users}: Props) => {

  return (
    <div className=''>
        <div className='flex items-center gap-3'>
           {users.profilePictureUrl && <Avatar src={`/${users.profilePictureUrl}`}/>}
           <div className=''>
            <h2 className='font-bold text-lg'>{users.username}</h2>
            <p className='text-xs '>TeamID: {users.teamId}</p>
           </div>
        </div>
    </div>
  )
}

export default UserCard