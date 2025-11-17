 
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return NextResponse.json(
        { message: "Invalid form data" },
        { status: 400 }
      );
    }

    const file = formData.get("image") as File;
    if (!file)
      return NextResponse.json(
        { message: "Image file is required" },
        { status: 400 }
      );

    // SAFE TAGS + AGENDA PARSING
    const rawTags = formData.get("tags");
    const rawAgenda = formData.get("agenda");

    const tags =
      typeof rawTags === "string"
        ? rawTags.startsWith("[")
          ? JSON.parse(rawTags)
          : rawTags.split(",").map((i) => i.trim())
        : [];

    const agenda =
      typeof rawAgenda === "string"
        ? rawAgenda.startsWith("[")
          ? JSON.parse(rawAgenda)
          : rawAgenda.split(",").map((i) => i.trim())
        : [];

    // Convert File → Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
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

    // Create event in DB
    const createdEvent = await Event.create({
      ...event,
      tags,
      agenda,
    });

    return NextResponse.json(
      { message: "Event created successfully", event: createdEvent },
      { status: 201 }
    );
  } catch (e:unknown) {
    console.error(e);
    return NextResponse.json(
      {
        message: "Event Creation Failed",
        error: e || "Unknown",
      },
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