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

export async function insertNewGeofence(
  name: string,
  type: string,
  center_lat: number | null = null,
  center_long: number | null = null,
  radius: number | null = null,
  polygon: any = null
) {
  const newGeofence = await prisma.geofencing.create({
    data: {
      name,
      type,
      center_lat,
      center_long,
      radius,
      polygon,
    },
  });

  return newGeofence;
}