import type { Request, Response } from "express";
import multer from "multer";
import fs from "fs";
import csv from "csv-parser";
import * as XLSX from "xlsx";
import path from "path";

// Multer setup
const upload = multer({ dest: "uploads/" });

// Ensure uploads folder exists
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

// Interface for extracted data
export interface Person {
  name: string;
  age: string | number;
  gender: string;
  contact: string;
}

// ======= CSV Handler =======
export const extractCSV = [
  upload.single("file"),
  async (req: Request, res: Response) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filePath = path.resolve(req.file.path);
    const results: Person[] = [];

    try {
      await new Promise<void>((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on("data", (row: Record<string, any>) => {
            try {
              results.push({
                name: row["name"] || "",
                age: row["age"] || "",
                gender: row["gender"] || "",
                contact: row["contact number"] || "",
              });
            } catch (err) {
              console.error("Error parsing CSV row:", err);
            }
          })
          .on("end", () => resolve())
          .on("error", (err: Error) => reject(err));
      });

      fs.unlink(filePath, () => {}); // cleanup temp file
      res.json(results);
    } catch (err) {
      console.error("Error processing CSV file:", err);
      fs.unlink(filePath, () => {});
      res.status(500).json({ error: "Error processing CSV file" });
    }
  },
];

// ======= Excel Handler =======
export const extractExcel = [
  upload.single("file"),
  (req: Request, res: Response) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filePath = path.resolve(req.file.path);

    try {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      //@ts-ignore
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json<Record<string, any>>(sheet);

      const results: Person[] = [];
      data.forEach((row) => {
        try {
          results.push({
            name: row["name"] || "",
            age: row["age"] || "",
            gender: row["gender"] || "",
            contact: row["contact number"] || "",
          });
        } catch (err) {
          console.error("Error parsing Excel row:", err);
        }
      });

      fs.unlink(filePath, () => {}); // cleanup temp file
      res.json(results);
    } catch (err) {
      console.error("Error processing Excel file:", err);
      fs.unlink(filePath, () => {});
      res.status(500).json({ error: "Error processing Excel file" });
    }
  },
];
