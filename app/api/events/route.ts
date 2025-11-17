import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import Event from '@/database/event.model';
import connectDB from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();

    let event;
    try {
      event = Object.fromEntries(formData.entries());
    } catch (e) {
      return NextResponse.json(
        { message: "Invalid form data" },
        { status: 400 }
      );
    }

    // IMAGE
    const file = formData.get("image") as File;
    if (!file)
      return NextResponse.json(
        { message: "Image file is required" },
        { status: 400 }
      );

    // TAGS
    const rawTags = formData.get("tags");
    const tags =
      typeof rawTags === "string"
        ? rawTags.startsWith("[")
          ? JSON.parse(rawTags)
          : rawTags.split(",").map((i) => i.trim())
        : [];

    // AGENDA
    const rawAgenda = formData.get("agenda");
    const agenda =
      typeof rawAgenda === "string"
        ? rawAgenda.startsWith("[")
          ? JSON.parse(rawAgenda)
          : rawAgenda.split(",").map((i) => i.trim())
        : [];

    // ✅ MODE — 100% typesafe fix (no more TS2339)
    const modeValue = formData.get("mode");
    const rawMode =
      typeof modeValue === "string"
        ? modeValue.toLowerCase().trim()
        : "";

    if (rawMode.includes("hybrid")) {
      event.mode = "hybrid";
    } else if (rawMode.includes("online") && !rawMode.includes("in-person")) {
      event.mode = "online";
    } else if (rawMode.includes("offline") || rawMode.includes("in-person")) {
      event.mode = "offline";
    } else {
      return NextResponse.json(
        { message: "Invalid mode. Use online, offline, or hybrid" },
        { status: 400 }
      );
    }

    // IMAGE UPLOAD
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "image", folder: "DevEvent" },
          (error, results) => {
            if (error) return reject(error);
            resolve(results);
          }
        )
        .end(buffer);
    });

    event.image = (uploadResult as { secure_url: string }).secure_url;

    // CREATE EVENT
    const createdEvent = await Event.create({
      ...event,
      tags,
      agenda,
    });

    return NextResponse.json(
      { message: "Event created successfully", event: createdEvent },
      { status: 201 }
    );
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json(
      { message: "Event Creation Failed", error: e || "Unknown" },
      { status: 500 }
    );
  }
}


export async function GET() {
    try {
        await connectDB();

        const events = await Event.find().sort({ createdAt: -1 });

        return NextResponse.json({ message: 'Events fetched successfully', events }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ message: 'Event fetching failed', error: e }, { status: 500 });
    }
}