import prisma from "./client.js";

export async function insertUser(officerId: string, name: string, email: string, password: string, 
    gender: string, age: number, phoneNumber: string, stationName: string){
        const newOfficer = await prisma.officer.create({
            data: {
                officerId,
                name,
                email,
                password,
                gender,
                age,
                phoneNumber,
                stationName
            }
        });

        return newOfficer;
}

export async function getUserById(officerId: string) {
    const existingUser = await prisma.officer.findUnique({ where: {officerId}});
    
    return existingUser;
}

export async function getUserByEmail(email: string) {
    const existingUser = await prisma.officer.findUnique({ where: {email}});
    
    return existingUser;
}