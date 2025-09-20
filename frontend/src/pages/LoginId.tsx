import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function LoginId(){
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e: FormEvent<HTMLFormElement>){
        e.preventDefault();
        setIsLoading(true);
        const form = e.currentTarget;

        const officerId = (form.elements.namedItem("officerId") as HTMLInputElement).value;
        const password = (form.elements.namedItem("password") as HTMLInputElement).value;

        if(!officerId || !password){
            alert("All fields are mandatory");
            setIsLoading(false);
            return;
        }

        const data = { officerId, password };

        try{
            const res = await fetch("http://localhost:3000/api/login-id", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: "include",
                body: JSON.stringify(data)
            });

            const backendData = await res.json();

            if(res.ok){
                localStorage.setItem("token", backendData.token);
                localStorage.setItem("userId", backendData.userId);
                alert("You have logged in successfully");
                navigate("/main");
            }
            else{
                alert("Login Failed");
            }

            form.reset();
        }
        catch(err){
            alert("Something went wrong");
            console.error("Error from frontend: ", err);
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 flex flex-col items-center justify-center p-4">
            {/* Header Section */}
            <div className="w-full max-w-md mb-6 text-center">
                <div className="bg-blue-900 text-white py-3 px-4 rounded-t-lg border-b-4 border-yellow-400">
                    <h1 className="text-xl font-bold">Personnel Deployment Tool</h1>
                    <p className="text-sm text-blue-100">Goa Police Department</p>
                </div>
                <div className="bg-white py-2 px-4 rounded-b-lg shadow-sm">
                    <p className="text-xs text-gray-600">Streamlined resource management and personnel allocation system</p>
                </div>
            </div>

            {/* Login Form */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden w-full max-w-md border border-gray-200">
                <div className="bg-blue-800 py-3 px-4">
                    <h2 className="text-lg font-semibold text-white text-center">Officer Login</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="officerId" className="block text-sm font-medium text-gray-700 mb-1">
                            Officer ID *
                        </label>
                        <input
                            id="officerId"
                            name="officerId"
                            type="text"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your officer ID"
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password *
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your password"
                        />
                    </div>
                    
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                                isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors`}
                        >
                            {isLoading ? 'Authenticating...' : 'Access System'}
                        </button>
                    </div>
                </form>
                
                <div className="bg-gray-50 py-3 px-6 border-t border-gray-200">
                    <p className="text-center text-xs text-gray-600">
                        Secure access to police personnel deployment system
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="w-full max-w-md mt-6 text-center">
                <div className="bg-white py-2 px-4 rounded-lg shadow-sm">
                    <p className="text-xs text-gray-600">Government of Goa • Police Department</p>
                </div>
            </div>
        </div>
    );
}