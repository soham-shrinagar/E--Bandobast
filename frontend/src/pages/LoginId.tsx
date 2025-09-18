import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginEmail(){
    const navigate = useNavigate();

    async function handleSubmit(e: FormEvent<HTMLFormElement>){
        e.preventDefault();
        const form = e.currentTarget;

        const email = form.email.value;
        const password = form.password.value;

        if(!email || !password){
            alert("All fields are mandatory");
            return;
        }

        const data = { email, password };

        try{
            const res = await fetch("http://localhost:3000/api/login-email", {
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

            form.email.value = "";
            form.password.value = "";
        }
        catch(err){
            alert("Something went wrong");
            console.error("Error from frontend: ", err);
        }
    }

    return (
        <div>

        </div>
    )
}