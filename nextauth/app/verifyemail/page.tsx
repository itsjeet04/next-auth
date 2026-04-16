'use client'

import axios from "axios"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

export default function VerifyEmailPage() {

    const [token, setToken] = useState('')
    const [verified, setVerified] = useState(false)
    const [error, setError] = useState(false)

    

    const verifyUserEmail = async () => {
        try {
            await axios.post('/api/users/verifyemail', { token })
            setVerified(true)
        } catch (error: any) {
            setError(true)
            toast.error("Verification failed")
        }
    }

    useEffect(() => {
        const urlToken = window.location.search.split("=")[1]
        setToken(urlToken || "")
    }, [])

    useEffect(() => {
        if (token.length > 0) {
            verifyUserEmail()
        }
    }, [token])

    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <div className="bg-black p-8 rounded-2xl shadow-lg w-full max-w-md text-white">

                <h1 className="text-2xl font-bold text-center mb-6">
                    Verify Your Email
                </h1>

                {!verified && !error && (
                    <p className="text-center text-gray-400">
                        Verifying...
                    </p>
                )}

                {verified && (
                    <div className="text-center">
                        <h2 className="text-green-400 mb-4">
                            Email Verified 
                        </h2>
                        <Link href="/login">Go to Login</Link>
                    </div>
                )}

                {error && (
                    <div className="text-center">
                        <h2 className="text-red-400 mb-4">
                            Verification Failed 
                        </h2>
                    </div>
                )}
            </div>
        </div>
    )
}