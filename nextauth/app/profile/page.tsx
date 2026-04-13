'use client'

import axios from "axios";
import { useRouter } from "next/navigation";
import {toast} from "react-toastify";

export default function ProfilePage(){

    const router = useRouter();

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