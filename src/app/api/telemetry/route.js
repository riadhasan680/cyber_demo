import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Telemetry from "@/models/Telemetry";

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();

    // Validate basic requirements
    if (!data.deviceId) {
      return NextResponse.json(
        { error: "Device ID is required" },
        { status: 400 }
      );
    }

    // Update or Create entry for this device
    // We want to keep a history, but for the dashboard "current state", we might want the latest.
    // Let's just save a new log entry every time for now to track history.
    const telemetry = await Telemetry.create(data);

    return NextResponse.json(
      { success: true, data: telemetry },
      { status: 201 }
    );
  } catch (error) {
    console.error("Telemetry Error:", error);
    return NextResponse.json(
      { error: "Failed to save telemetry" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const deviceId = searchParams.get("deviceId");

    if (deviceId) {
      // Get history for specific device
      const history = await Telemetry.find({ deviceId })
        .sort({ timestamp: -1 })
        .limit(50);
      return NextResponse.json({ success: true, data: history });
    } else {
      // Get latest status for all unique devices
      // This aggregation groups by deviceId and gets the latest document for each
      const devices = await Telemetry.aggregate([
        { $sort: { timestamp: -1 } },
        {
          $group: {
            _id: "$deviceId",
            latest: { $first: "$$ROOT" },
          },
        },
        { $replaceRoot: { newRoot: "$latest" } },
      ]);
      return NextResponse.json({ success: true, data: devices });
    }
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch telemetry" },
      { status: 500 }
    );
  }
}
