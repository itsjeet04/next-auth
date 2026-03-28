"use client"
import React from "react";
import Link from "next/link";

export default function SignupPage() {

    const [user, setUser] = React.useState({
        username: "",
        email: "",
        password: "",
    });

    const onSignup = async () => {}

    return (
        <div className="flex items-center justify-center min-h-screen bg-black-20">
            
            <div className="bg-black p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6">
                    Create Account
                </h1>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                        Username
                    </label>
                    <input
                        type="text"
                        value={user.username}
                        placeholder="Enter username"
                        onChange={(e) =>
                            setUser({ ...user, username: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                </div>

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

                <Link href="/login">
                    <button
                        onClick={onSignup}
                        className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition duration-200"
                    >
                        Sign Up
                    </button>
                </Link>


            </div>
        </div>
    );
}