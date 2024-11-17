'use client'

import { useUserLoginMutation, useUserSignUpMutation } from '@/State/api'
import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

type Props = {
    children: React.ReactNode
}


const AuthPanel = () => {
    const [signUp, setSignUp] = useState<boolean>(false)
    const [username, setUserName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [email, setEmail] = useState<string>("");

    const [createUser] = useUserSignUpMutation();
    const [loginUser] = useUserLoginMutation();

    const handleSignUp = async (event: React.FormEvent) => {
        event.preventDefault();
        let res;
        if (signUp) {
            res = await createUser({ username, email, password })
        } else {
            res = await loginUser({ email, password })
        }
        console.log(res);

        if (res) {
            if (res.data!.status) {
                if (signUp) {
                    setUserName("");
                    setEmail("");
                    setPassword("")
                }
                toast.success(res.data?.message || (signUp ? "Succesfully User Created" : "Login Successfull"))
            } else {
                toast.error(res.data?.message || (signUp ? "Errror creating User" : "Login Failed"))
            }
        } else {
            toast.error(signUp ? "Errror creating User" : "Login Failed")
        }
    }

    return <div className='w-[500px]  bg-white shadow-md absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-7 rounded-md'>
        <h2 className='text-center mb-4 text-xl'>{signUp ? "Sign Up" : "Sign In"}</h2>
        <form className="flex flex-col items-center gap-5 h-full" onSubmit={handleSignUp}>
            <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email" placeholder='example@example.com' className='w-full border px-4 py-2 focus:outline-none rounded ' />
            {signUp && <input
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                type="text" placeholder='username' className='w-full border px-4 py-2 focus:outline-none rounded ' />}
            <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password" placeholder='password' className='w-full border px-4 py-2 focus:outline-none rounded ' />
            <button type='submit' className='bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-700'>{signUp ? "Sign Up" : "Sign In"}</button>
        </form>
        <button onClick={() => setSignUp(!signUp)} className='text-center w-full mt-3'> {signUp ? <p>Already Have an account? <span className='font-bold'>Sign In</span></p> : <p>Dont have an account? <span className='font-bold'>Sign up</span></p>} </button>

    </div>
}

const AuthWrapper = ({ children }: Props) => {

    return (
        <div
            className='w-full h-full bg-slate-100 dark:bg-dark-bg' >
            <AuthPanel />
            <Toaster />
        </div>
    )
}

export default AuthWrapper