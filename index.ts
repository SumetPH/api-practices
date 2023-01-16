import express, { Request, Response } from "express";
import address from "./controllers/address";
import auth from "./controllers/auth";
import pdf from "./controllers/pdf";

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", address);
app.use("/api", auth);
app.use("/api", pdf);

app.get("/", (req: Request, res: Response) => {
  return res.json("index");
});

const port = 8000;
app.listen(port, () => console.log(`host: http://localhost:${port}`));
