import mongoose from "mongoose";

const TelemetrySchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      index: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    battery: {
      level: Number,
      charging: Boolean,
      chargingTime: Number,
      dischargingTime: Number,
    },
    location: {
      latitude: Number,
      longitude: Number,
      accuracy: Number,
      timestamp: Number,
    },
    deviceInfo: {
      userAgent: String,
      platform: String,
      language: String,
      memory: Number,
      cores: Number,
      screenResolution: String,
    },
    images: [
      {
        url: String, // Base64 or URL
        capturedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Telemetry ||
  mongoose.model("Telemetry", TelemetrySchema);
