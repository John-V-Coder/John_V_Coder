import { User, Event, Booking, InsertUser, InsertEvent, InsertBooking } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

const MOCK_EVENTS: Event[] = [
  {
    id: 1,
    title: "Nairobi Music Festival",
    description: "The biggest music festival in East Africa featuring top local and international artists.",
    venue: "KICC, Nairobi",
    date: new Date("2024-07-15"),
    imageUrl: "https://images.unsplash.com/photo-1472653816316-3ad6f10a6592",
    ticketTypes: {
      membership: 2000,
      regular: 3000,
      vip: 5000,
      vvip: 10000
    }
  },
  {
    id: 2,
    title: "Kenya Cultural Festival",
    description: "Experience the rich cultural heritage of Kenya through music, dance, and food.",
    venue: "Bomas of Kenya",
    date: new Date("2024-08-20"),
    imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
    ticketTypes: {
      membership: 1500,
      regular: 2500,
      vip: 4000,
      vvip: 8000
    }
  },
  {
    id: 3,
    title: "Mombasa Food Festival",
    description: "A celebration of coastal cuisine featuring local chefs, cooking demonstrations, and food tasting.",
    venue: "Fort Jesus, Mombasa",
    date: new Date("2024-09-10"),
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1",
    ticketTypes: {
      membership: 1000,
      regular: 2000,
      vip: 3500,
      vvip: 7000
    }
  },
  {
    id: 4,
    title: "Maasai Mara Wildlife Festival",
    description: "Annual wildlife photography and conservation event during the great migration.",
    venue: "Maasai Mara National Reserve",
    date: new Date("2024-08-05"),
    imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801",
    ticketTypes: {
      membership: 3000,
      regular: 5000,
      vip: 8000,
      vvip: 15000
    }
  },
  {
    id: 5,
    title: "Nairobi Tech Week",
    description: "Kenya's largest tech event featuring workshops, keynotes, and networking opportunities.",
    venue: "Sarit Centre, Nairobi",
    date: new Date("2024-10-15"),
    imageUrl: "https://images.unsplash.com/photo-1591115765373-5207764f72e7",
    ticketTypes: {
      membership: 2500,
      regular: 4000,
      vip: 6000,
      vvip: 12000
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