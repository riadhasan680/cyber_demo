"use client";
import { useState, useEffect, useRef } from "react";
import {
  Camera,
  Battery,
  MapPin,
  Smartphone,
  Shield,
  AlertTriangle,
  Wifi,
} from "lucide-react";

export default function DeviceMonitor() {
  const [status, setStatus] = useState("Initializing...");
  const [deviceId, setDeviceId] = useState("");
  const [battery, setBattery] = useState(null);
  const [location, setLocation] = useState(null);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

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

  const updateBattery = (batt) => {
    setBattery({
      level: batt.level * 100,
      charging: batt.charging,
      chargingTime: batt.chargingTime,
      dischargingTime: batt.dischargingTime,
    });
  };

  const sendTelemetry = async (imageData = null) => {
    if (!deviceId) return;

    const payload = {
      deviceId,
      battery,
      location,
      deviceInfo,
      images: imageData ? [{ url: imageData }] : [],
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

  // Auto-send heartbeat every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (status === "Monitoring Active") {
        sendTelemetry();
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [status, battery, location, deviceInfo]);

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

      // Stop stream to save battery/privacy
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      setIsCapturing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-4 flex flex-col items-center">
      <div className="w-full max-w-md border border-green-800 bg-gray-900/50 p-6 rounded-lg shadow-[0_0_20px_rgba(0,255,0,0.2)]">
        <div className="flex justify-between items-center mb-6 border-b border-green-800 pb-2">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6" /> SYSTEM MONITOR
          </h1>
          <span className="text-xs animate-pulse text-red-500">● LIVE</span>
        </div>

        <div className="space-y-4">
          {/* Device ID */}
          <div className="bg-black/50 p-3 rounded border border-green-900">
            <div className="text-xs text-green-700 mb-1">DEVICE ID</div>
            <div className="text-lg font-bold tracking-widest">{deviceId}</div>
          </div>

          {/* Battery Status */}
          <div className="bg-black/50 p-3 rounded border border-green-900 flex items-center justify-between">
            <div>
              <div className="text-xs text-green-700 mb-1">POWER SOURCE</div>
              <div className="text-xl font-bold">
                {battery ? `${Math.round(battery.level)}%` : "Scanning..."}
              </div>
              <div className="text-xs text-gray-400">
                {battery?.charging ? "CHARGING" : "DISCHARGING"}
              </div>
            </div>
            <Battery
              className={`w-8 h-8 ${
                battery?.charging ? "text-yellow-400" : "text-green-500"
              }`}
            />
          </div>

          {/* Location Status */}
          <div className="bg-black/50 p-3 rounded border border-green-900">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs text-green-700 mb-1">GEOLOCATION</div>
                <div className="text-sm">
                  {location ? (
                    <>
                      LAT: {location.latitude.toFixed(4)}
                      <br />
                      LNG: {location.longitude.toFixed(4)}
                    </>
                  ) : (
                    <span className="animate-pulse">Triangulating...</span>
                  )}
                </div>
              </div>
              <MapPin className="w-6 h-6 text-blue-500" />
            </div>
          </div>

          {/* Device Info */}
          <div className="bg-black/50 p-3 rounded border border-green-900">
            <div className="text-xs text-green-700 mb-1">HARDWARE INFO</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>MEM: {deviceInfo?.memory} GB</div>
              <div>CORES: {deviceInfo?.cores}</div>
              <div className="col-span-2 truncate">
                OS: {deviceInfo?.platform}
              </div>
            </div>
          </div>

          {/* Camera Module */}
          <div className="border-t border-green-800 pt-4 mt-4">
            <div className="text-xs text-center text-green-700 mb-2">
              OPTICAL SENSOR
            </div>

            {!isCapturing ? (
              <button
                onClick={startCamera}
                className="w-full py-3 bg-green-900/30 hover:bg-green-900/50 border border-green-600 rounded flex items-center justify-center gap-2 transition-all"
              >
                <Camera className="w-5 h-5" /> ACTIVATE SENSOR
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
                  CAPTURE EVIDENCE
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

        <div className="mt-6 text-[10px] text-center text-green-900">
          SECURE CONNECTION ESTABLISHED via{" "}
          {deviceInfo?.userAgent ? "HTTPS" : "UNSECURED"}
        </div>
      </div>
    </div>
  );
}
