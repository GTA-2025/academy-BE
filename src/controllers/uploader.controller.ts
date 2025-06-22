import { Request, Response } from "express";

export const uploadFile = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  return res.status(200).json({
    message: "File uploaded successfully",
    url: (req.file as any).path,
  });
};
