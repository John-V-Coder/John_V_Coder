import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  app.get("/api/events", async (_req, res) => {
    const events = await storage.getEvents();
    res.json(events);
  });

  app.get("/api/events/:id", async (req, res) => {
    const event = await storage.getEvent(parseInt(req.params.id));
    if (!event) {
      return res.status(404).send("Event not found");
    }
    res.json(event);
  });

  app.post("/api/bookings", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Unauthorized");
    }

    const event = await storage.getEvent(req.body.eventId);
    if (!event) {
      return res.status(404).send("Event not found");
    }

    const booking = await storage.createBooking({
      ...req.body,
      userId: req.user!.id,
      status: "confirmed",
      createdAt: new Date(),
    });

    res.status(201).json(booking);
  });

  app.get("/api/bookings", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Unauthorized");
    }

    const bookings = await storage.getBookingsByUser(req.user!.id);
    res.json(bookings);
  });

  const httpServer = createServer(app);
  return httpServer;
}
