import prisma from "./client.js";

export async function insertMobileUser(phoneNumber: string, password: string) {
  const newPersonnelMobile = await prisma.personnelMobile.create({
    data: {
      phoneNumber,
      password,
    },
  });

  return newPersonnelMobile;
}

export async function getMobileUserByPhoneNumber(phoneNumber: string) {
  const existingUser = await prisma.personnelMobile.findUnique({
    where: { phoneNumber },
  });

  return existingUser;
}
