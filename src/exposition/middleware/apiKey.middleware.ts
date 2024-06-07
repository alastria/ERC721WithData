import { NextFunction, Request, Response } from "express";

// Format is 'key': enabled
const apiKeys: { [key: string]: boolean } = {
  "4c6f127a-df95-472e-ba18-05a22d7ff405": true,
};

// Super basic API Key authentication middleware.
export function apiKeyMiddleware(req: Request, res: Response, next: NextFunction) {
  const apiKey: string | string[] | undefined = req.headers['x-api-key'];

  if (!apiKey || Array.isArray(apiKey) || !apiKeys[apiKey]) {
    res.status(403).send("Forbidden");
    return;
  }

  next();
};