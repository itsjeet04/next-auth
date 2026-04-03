'use client'
import React, { useEffect } from "react"
import { User } from "@/models/user.model"
import axios from "axios"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"


export default  function LoginPage(){

    const router = useRouter();

    const[user,setUser] = React.useState({
    email: '',
    password: ''
    })

    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    useEffect(()=>{
        if(user.email.length > 0 && user.password.length > 0){
            setButtonDisabled(false) ;
        }else{
            setButtonDisabled(true) ;
        }
    }, [user])

    const onLogin = async() => {
    try {
        const response = await axios.post('/api/users/login', user);
        toast.success(response.data.message) ;
        router.push('/profile') 
    } catch (error) {
        toast.error('Login failed');
    }
    }

    return(
    <div className="flex items-center justify-center min-h-screen bg-black-20">
        
        <div className="bg-black p-8 rounded-2xl shadow-lg w-full max-w-md">
            <h1 className="text-2xl font-bold text-center mb-6">
                Login to Account
            </h1>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                    Email
                </label>
                <input
                    type="email"
                    value={user.email}
                    placeholder="Enter email"
                    onChange={(e) =>
                        setUser({ ...user, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium mb-1">
                    Password
                </label>
                <input
                    type="password"
                    value={user.password}
                    placeholder="Enter password"
                    onChange={(e) =>
                        setUser({ ...user, password: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
            </div>

            <button
                onClick={onLogin}
                className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition duration-200"
                disabled={buttonDisabled}
            >
                {buttonDisabled ? "Fill all fields" : "Login"}
            </button>

        </div>
    </div>
    )
    }