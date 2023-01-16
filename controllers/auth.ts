import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/auth/register", async (req: Request, res: Response) => {
  try {
    const body = req.body as {
      username: string;
      password: string;
      email: string;
    };

    const newUser = await prisma.users.create({
      data: {
        username: body.username,
        password: body.password,
        email: body.email,
      },
    });

    return res.json(newUser);
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

router.post("/auth/login", async (req: Request, res: Response) => {
  try {
    const body = req.body as {
      email: string;
      password: string;
    };

    const user = await prisma.users.findFirst({
      where: {
        email: body.email,
        password: body.password,
      },
    });

    if (user) {
      return res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        created_date: dayjs(user.created_at).format("DD/MM/YYYY"),
        created_time: dayjs(user.created_at).format("HH:mm:ss"),
      });
    } else {
      res.status(404).json({
        msg: "user does not exits",
      });
    }
  } catch (error: any) {
    return res.status(500).json(error.message);
  }
});

export default router;
