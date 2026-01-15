import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

async function seedScores() {
  const existing = await storage.getScores();
  if (existing.length === 0) {
    await storage.createScore({ playerName: "Mozart", score: 10 });
    await storage.createScore({ playerName: "Beethoven", score: 8 });
    await storage.createScore({ playerName: "Bach", score: 5 });
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await seedScores();

  app.get(api.scores.list.path, async (req, res) => {
    const scores = await storage.getScores();
    res.json(scores);
  });

  app.post(api.scores.create.path, async (req, res) => {
    try {
      const input = api.scores.create.input.parse(req.body);
      const score = await storage.createScore(input);
      res.status(201).json(score);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  return httpServer;
}
