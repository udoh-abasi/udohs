import express, { Request, Response } from "express";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Done");
});

app.listen(8000, () => {
  console.log("Server is listening on port 8000");
});
