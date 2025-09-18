import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

export default function RegistrationPage(){
    const navigate = useNavigate();

    async function handleSubmit(e: FormEvent<HTMLFormElement>){
        e.preventDefault();
        const form = e.currentTarget;

        const officerId = (form.elements.namedItem("officerId") as HTMLInputElement).value;
        const name = (form.elements.namedItem("name") as HTMLInputElement).value;
        const email = (form.elements.namedItem("email") as HTMLInputElement).value;
        const password = (form.elements.namedItem("password") as HTMLInputElement).value;
        const gender = (form.elements.namedItem("gender") as HTMLInputElement).value;
        const age = (form.elements.namedItem("age") as HTMLInputElement).value;
        const phoneNumber = (form.elements.namedItem("phoneNumber") as HTMLInputElement).value;
        const stationName = (form.elements.namedItem("stationName") as HTMLInputElement).value;

        if(!officerId || !name || !email || !password || !gender || !age || !phoneNumber || !stationName){
            alert("All fields are mandatory");
            return;
        } 

        const data = {officerId, name, email, password, gender, age, phoneNumber, stationName};

        try{
            const res = await fetch("http://localhost:3000/api/registration", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: "include",
                body: JSON.stringify(data)
            });

            if(res.ok){
                alert("Your Registration is Successfull");
            }
            else{
                alert("User is already Register");
            }
            navigate("/login-Id");

            form.officerId.value = "";
            //@ts-ignore
            form.name.value = "";
            form.email.value = "";
            form.password.value = "";
            form.gender.value = "";
            form.age.value = "";
            form.phoneNumber.value = "";
            form.stationName.value = "";
        }
        catch(err){
            alert("Something went wrong");
            console.error("Error from fronten: ", err);
        }
    }

    return(
        <div>
            
        </div>
    )
};  