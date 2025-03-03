import { User, Event, Booking, InsertUser, InsertEvent, InsertBooking } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

const MOCK_EVENTS: Event[] = [
  {
    id: 1,
    title: "Coachella Valley Music and Arts Festival 2024",
    description: "One of the world's most prestigious music festivals featuring top artists, art installations, and cultural experiences.",
    venue: "Empire Polo Club, Indio, California",
    date: new Date("2024-04-12"),
    imageUrl: "https://images.unsplash.com/photo-1541704328070-20bf4601ae3e",
    ticketTypes: {
      membership: 15000,
      regular: 25000,
      vip: 45000,
      vvip: 85000
    }
  },
  {
    id: 2,
    title: "Tomorrowland 2024",
    description: "The world's largest electronic dance music festival, featuring spectacular stages and international DJs.",
    venue: "Boom, Belgium",
    date: new Date("2024-07-19"),
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745",
    ticketTypes: {
      membership: 20000,
      regular: 35000,
      vip: 55000,
      vvip: 95000
    }
  },
  {
    id: 3,
    title: "Ultra Music Festival Miami 2024",
    description: "Premier electronic music festival featuring the world's top DJs and incredible production.",
    venue: "Bayfront Park, Miami",
    date: new Date("2024-03-22"),
    imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea",
    ticketTypes: {
      membership: 18000,
      regular: 30000,
      vip: 50000,
      vvip: 90000
    }
  },
  {
    id: 4,
    title: "Glastonbury Festival 2024",
    description: "The largest greenfield music and performing arts festival in the world.",
    venue: "Worthy Farm, Somerset, UK",
    date: new Date("2024-06-26"),
    imageUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063",
    ticketTypes: {
      membership: 22000,
      regular: 38000,
      vip: 60000,
      vvip: 100000
    }
  },
  {
    id: 5,
    title: "EDC Las Vegas 2024",
    description: "Electric Daisy Carnival - America's largest dance music festival with spectacular production.",
    venue: "Las Vegas Motor Speedway",
    date: new Date("2024-05-17"),
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7",
    ticketTypes: {
      membership: 19000,
      regular: 32000,
      vip: 52000,
      vvip: 92000
    }
  }
];

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;

  createBooking(booking: InsertBooking): Promise<Booking>;
  getBookingsByUser(userId: number): Promise<Booking[]>;

  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private events: Map<number, Event>;
  private bookings: Map<number, Booking>;
  private currentId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.events = new Map(MOCK_EVENTS.map(event => [event.id, event]));
    this.bookings = new Map();
    this.currentId = Math.max(...MOCK_EVENTS.map(e => e.id), 0) + 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = this.currentId++;
    const booking = { ...insertBooking, id };
    this.bookings.set(id, booking);
    return booking;
  }

  async getBookingsByUser(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.userId === userId,
    );
  }
}

export const storage = new MemStorage();