import { Schema, model, models } from "mongoose";

import { Document } from "mongoose";

export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: "online" | "offline" | "hybrid";
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
}


const EventSchema = new Schema(
  {
    title: String,
    slug: { type: String, unique: true },
    description: String,
    overview: String,
    image: String,
    venue: String,
    location: String,
    date: String,
    time: String,
    mode: {
      type: String,
      enum: ["online", "offline", "hybrid"],
    },
    audience: String,
    agenda: [String],
    organizer: String,
    tags: [String],
  },
  { timestamps: true }
);

// ⚠️ REMOVE duplicate index
// EventSchema.index({ slug: 1 }, { unique: true });

const Event = models.Event || model<IEvent>("Event", EventSchema);
export default Event;
