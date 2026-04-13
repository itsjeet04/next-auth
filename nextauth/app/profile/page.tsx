'use client'

import axios from "axios";
import { useRouter } from "next/navigation";
import {toast} from "react-toastify";
import { useState , useEffect } from "react";
import Link from "next/link"

export default function ProfilePage(){

    const router = useRouter();
    const [data , setData] = useState(null);

    const logout = async() => {
        try {
            const response = await axios.get('/api/users/logout');
            toast.success(response.data.message);
            router.push('/login');
        } catch (error: any) {
            console.log(error.message);
            toast.error(error.message || "Logout failed");
        }
    }

    const getUserDetails = async() => {
        try {
            const res = await axios.get('/api/users/me');
            console.log(res.data);

            setData(res.data.data.username);

        } catch (error: any) {
            console.log(error.message);
            toast.error(error.message || "Failed to fetch user details");
        }
    }
    useEffect(() => {
        getUserDetails();
    }, [])

    return(
        <div className="flex items-center justify-center min-h-screen bg-black-20">

            <div className="bg-black p-8 rounded-2xl shadow-lg w-full max-w-md">

                <h1 className="text-2xl font-bold text-center mb-6">
                    User Profile
                </h1>

                <div className="mb-4">
                    <p className="text-sm text-gray-400 text-center">
                        Welcome to your account 
                    </p>
                </div>

                <div className="mt-4 flex flex-col items-center gap-2">

                
                
                {data ? (
                    <Link
                        href={`/profile/${data}`}
                        className="text-lg font-medium text-blue-400 hover:underline"
                    >
                        @{data}
                    </Link>
                ) : (
                    <p className="text-gray-500 text-sm">user not found</p>
                )}

                </div>

                <button
                    onClick={logout}
                    className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition duration-200 border border-gray-600"
                >
                    Logout
                </button>

            </div>
        </div>
    )
}