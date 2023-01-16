import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/address/provinces", async (req: Request, res: Response) => {
  try {
    const provinces = await prisma.provinces.findMany({});
    return res.json(provinces);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

router.get(
  "/address/amphures/:province_id",
  async (req: Request, res: Response) => {
    try {
      const params = req.params as { province_id: string };
      const amphures = await prisma.amphures.findMany({
        where: {
          province_id: Number(params.province_id),
        },
      });
      return res.json(amphures);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  }
);

router.get(
  "/address/districts/:amphure_id",
  async (req: Request, res: Response) => {
    try {
      const params = req.params as { amphure_id: string };
      const districts = await prisma.districts.findMany({
        where: {
          amphure_id: Number(params.amphure_id),
        },
      });
      return res.json(districts);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  }
);

export default router;
