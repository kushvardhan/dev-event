'use server';

import Event, { IEvent } from '@/database/event.model';
import connectDB from "@/lib/mongodb";

export const getSimilarEventsBySlug = async (slug: string): Promise<IEvent[]> => {
  try {
    await connectDB();

    const event = await Event.findOne({ slug }).lean<IEvent>();

    if (!event) return [];

    const similarEvents = await Event.find({
      _id: { $ne: event._id },
      tags: { $in: event.tags }
    }).lean<IEvent[]>();

    return similarEvents;
  } catch (error) {
    console.error("Similar events error:", error);
    return [];
  }
};

export const getAllEvents = async (): Promise<IEvent[]> => {
  try {
    await connectDB();
    const events = await Event.find().lean<IEvent[]>();
    return events;
  } catch (err) {
    console.log("Get events error:", err);
    return [];
  }
};