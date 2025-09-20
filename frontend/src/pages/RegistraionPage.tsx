import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function RegistrationPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const form = e.currentTarget;

    const officerId = (form.elements.namedItem("officerId") as HTMLInputElement).value;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const gender = (form.elements.namedItem("gender") as HTMLInputElement).value;
    const age = Number((form.elements.namedItem("age") as HTMLInputElement).value);
    const phoneNumber = (form.elements.namedItem("phoneNumber") as HTMLInputElement).value;
    const stationName = (form.elements.namedItem("stationName") as HTMLInputElement).value;

    if (!officerId || !name || !email || !password || !gender || !age || !phoneNumber || !stationName) {
      alert("All fields are mandatory");
      setIsLoading(false);
      return;
    }

    const data = { officerId, name, email, password, gender, age, phoneNumber, stationName };

    try {
      const res = await fetch("http://localhost:3000/api/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data)
      });

      if (res.ok) {
        alert("Your Registration is Successful");
      } else {
        alert("User is already Registered");
      }
      navigate("/login-Id");

      form.reset();
    } catch (err) {
      alert("Something went wrong");
      console.error("Error from frontend: ", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="h-full w-full bg-green-800">
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-2xl">
        
        {/* Header */}
        <div className="bg-yellow-500 py-4 px-6">
          <h1 className="text-2xl font-bold text-white">Officer Registration</h1>
          <p className="text-yellow-100">Create your account to access the system</p>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="officerId" className="block text-sm font-medium text-gray-700 mb-1">
                Officer ID *
              </label>
              <input
                id="officerId"
                name="officerId"
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your officer ID"
              />
            </div>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your email"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Create a password"
              />
            </div>
            
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                Gender *
              </label>
              <select
                id="gender"
                name="gender"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                Age *
              </label>
              <input
                id="age"
                name="age"
                type="number"
                min="18"
                max="65"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your age"
              />
            </div>
            
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your phone number"
              />
            </div>
            
            <div>
              <label htmlFor="stationName" className="block text-sm font-medium text-gray-700 mb-1">
                Station Name *
              </label>
              <input
                id="stationName"
                name="stationName"
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your station name"
              />
            </div>
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
                isLoading
                  ? "bg-green-300 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              } focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2`}
            >
              {isLoading ? "Processing..." : "Register"}
            </button>
          </div>
        </form>
        
        {/* Footer */}
        <div className="bg-gray-50 py-4 px-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login-email")}
              className="font-medium text-green-600 hover:text-green-500 focus:outline-none focus:underline transition ease-in-out duration-150"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}
