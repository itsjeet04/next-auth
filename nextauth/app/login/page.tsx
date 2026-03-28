   'use client'

   import React from "react"

    export default  function LoginPage(){
    

    const onLogin = async() => {}

    const[user,setUser] = React.useState({
        email: '',
        password: ''
    })
 
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
                >
                    Login
                </button>

            </div>
        </div>
     )
}