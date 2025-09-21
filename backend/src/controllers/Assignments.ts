import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function assignLocation(req: Request, res: Response) {
  try {
    const { userId, geofenceId } = req.body;
    if (!userId || !geofenceId) {
      return res.status(400).json({ error: "userId and geofenceId required" });
    }

    const assignment = await prisma.assignment.create({
      data: { userId, geofenceId },
    });

    return res.json({ ok: true, assignment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to assign location" });
  }
}

export async function pendingAssignments(req: Request, res: Response) {
  try {
    const userId = parseInt(req.query.userId as string);
    if (!userId) {
      return res.status(400).json({ error: "userId required" });
    }

    const assignments = await prisma.assignment.findMany({
      where: { userId, isNotified: false },
    });

    return res.json(assignments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch assignments" });
  }
}

export async function markNotified(req: Request, res: Response) {
  try {
    const { assignmentIds } = req.body;
    if (!assignmentIds || !Array.isArray(assignmentIds)) {
      return res.status(400).json({ error: "assignmentIds array required" });
    }

    await prisma.assignment.updateMany({
      where: { id: { in: assignmentIds } },
      data: { isNotified: true },
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update assignments" });
  }
}
