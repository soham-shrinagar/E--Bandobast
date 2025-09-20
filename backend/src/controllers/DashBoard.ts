import type { Request, Response } from "express";
import multer from "multer";
import fs from "fs";
import csv from "csv-parser";
import XLSX from "xlsx";
import path from "path";
import prisma from "../db/client.js";

const upload = multer({ dest: "uploads/" });
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

export interface Person {
  name: string;
  age: string | number;
  gender: string;
  contact: string;
}

function findField(row: Record<string, any>, candidates: string[]) {
  for (const cand of candidates) {
    if (row[cand] !== undefined) return String(row[cand]);
  }
  const keys = Object.keys(row);
  for (const key of keys) {
    const lower = key.toLowerCase();
    for (const cand of candidates) {
      if (lower.includes(cand.toLowerCase())) return String(row[key]);
    }
  }
  return "";
}

function normalizePhone(phoneRaw: string) {
  if (!phoneRaw) return "";
  let s = String(phoneRaw).trim().replace(/[^0-9+]/g, "");
  let digits = s.startsWith("+") ? s.slice(1) : s;
  if (digits.length === 12 && digits.startsWith("91")) return "+" + digits;
  if (digits.length === 10) return "+91" + digits;
  if (digits.length === 11 && digits.startsWith("0")) return "+91" + digits.slice(1);
  if (digits.length >= 10) return "+" + digits;
  return "";
}

async function parseCSV(filePath: string): Promise<Person[]> {
  const results: Person[] = [];
  await new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        results.push({
          name: findField(row, ["name", "full name", "fullname"]),
          age: findField(row, ["age", "Age"]),
          gender: findField(row, ["gender"]),
          contact: findField(row, ["contact number", "contact", "phone", "phoneNumber", "mobile"]),
        });
      })
      .on("end", () => resolve())
      .on("error", (err: Error) => reject(err));
  });
  return results;
}

function parseExcel(filePath: string): Person[] {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  // @ts-ignore
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json<Record<string, any>>(sheet);
  const results: Person[] = [];
  data.forEach((row) => {
    results.push({
      name: findField(row, ["name", "full name", "fullname"]),
      age: findField(row, ["age", "Age"]),
      gender: findField(row, ["gender"]),
      contact: findField(row, ["contact number", "contact", "phone", "phoneNumber", "mobile"]),
    });
  });
  return results;
}

async function insertPersonnelRows(persons: Person[]) {
  const mapped = persons
    .map((p) => ({
      name: (p.name || "").trim(),
      age: Number((p.age ?? 0) as any) || 0,
      gender: (p.gender || "").trim(),
      phoneNumber: normalizePhone(p.contact || ""),
    }))
    .filter((p) => p.phoneNumber !== "" && p.name !== "");

  if (mapped.length === 0) return { count: 0, inserted: [] };

  // Deduplicate inside uploaded file
  const uniqueByPhone: Record<string, typeof mapped[number]> = {};
  for (const p of mapped) {
    if (!uniqueByPhone[p.phoneNumber]) {
      uniqueByPhone[p.phoneNumber] = p;
    }
  }
  const uniqueList = Object.values(uniqueByPhone);

  // Check DB existing
  const existing = await prisma.personnel.findMany({
    where: { phoneNumber: { in: uniqueList.map((p) => p.phoneNumber) } },
    select: { phoneNumber: true },
  });
  const existingPhones = new Set(existing.map((e) => e.phoneNumber));

  const toInsert = uniqueList.filter((p) => !existingPhones.has(p.phoneNumber));

  if (toInsert.length === 0) return { count: 0, inserted: [] };

  const createManyResult = await prisma.personnel.createMany({
    data: toInsert,
    skipDuplicates: true,
  });

  const phoneList = uniqueList.map((p) => p.phoneNumber);
  const stored = await prisma.personnel.findMany({
    where: { phoneNumber: { in: phoneList } },
  });

  return { count: createManyResult.count, inserted: stored };
}


export const extractCSV = [
  upload.single("file"),
  async (req: Request, res: Response) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const filePath = path.resolve(req.file.path);

    try {
      const parsed = await parseCSV(filePath);
      const result = await insertPersonnelRows(parsed);
      fs.unlink(filePath, () => {});
      return res.json({ message: "CSV processed", insertedCount: result.count, data: result.inserted });
    } catch (err) {
      console.error("Error processing CSV:", err);
      fs.unlink(filePath, () => {});
      return res.status(500).json({ error: "Error processing CSV file" });
    }
  },
];

export const extractExcel = [
  upload.single("file"),
  async (req: Request, res: Response) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const filePath = path.resolve(req.file.path);

    try {
      const parsed = parseExcel(filePath);
      const result = await insertPersonnelRows(parsed);
      fs.unlink(filePath, () => {});
      return res.json({ message: "Excel processed", insertedCount: result.count, data: result.inserted });
    } catch (err) {
      console.error("Error processing Excel:", err);
      fs.unlink(filePath, () => {});
      return res.status(500).json({ error: "Error processing Excel file" });
    }
  },
];

// Get all personnel
export const getAllPersonnel = async (req: Request, res: Response) => {
  try {
    const all = await prisma.personnel.findMany();
    res.json(all);
  } catch (err) {
    console.error("Error fetching personnel:", err);
    res.status(500).json({ error: "Error fetching personnel data" });
  }
};

// Deploy OTPs
export const deployOtp = async (req: Request, res: Response) => {
  try {
    const { phoneNumbers } = req.body as { phoneNumbers: string[] };
    if (!phoneNumbers || phoneNumbers.length === 0) {
      return res.status(400).json({ error: "No phone numbers provided" });
    }

    const results: any[] = [];

    for (const phone of phoneNumbers) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

      // Upsert into DB (replace old if exists)
      const saved = await prisma.otp.upsert({
        //@ts-ignore
        where: { phoneNumber: phone },
        update: { otp },
        create: { phoneNumber: phone, otp },
      });

      // Stub: Replace with real SMS sending
      console.log(`Sending OTP ${otp} to ${phone}`);

      results.push(saved);
    }

    return res.json({ message: "OTPs deployed", results });
  } catch (err) {
    console.error("Error deploying OTPs:", err);
    return res.status(500).json({ error: "Error deploying OTPs" });
  }
};

// Delete selected personnel
export const deletePersonnel = async (req: Request, res: Response) => {
  try {
    const { phoneNumbers } = req.body as { phoneNumbers: string[] };
    if (!phoneNumbers || phoneNumbers.length === 0) {
      return res.status(400).json({ error: "No phone numbers provided" });
    }

    const result = await prisma.personnel.deleteMany({
      where: { phoneNumber: { in: phoneNumbers } },
    });

    return res.json({ message: "Personnel deleted", count: result.count });
  } catch (err) {
    console.error("Error deleting personnel:", err);
    return res.status(500).json({ error: "Error deleting personnel" });
  }
};
