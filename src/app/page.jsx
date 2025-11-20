"use client";
import React, { useEffect, useState } from "react";
import CyberCard from "@/components/ui/CyberCard";
import Terminal from "@/components/ui/Terminal";
import WorldMap from "@/components/ui/WorldMap";
import ResourceGauge from "@/components/ui/ResourceGauge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Shield, AlertTriangle, Server, Globe } from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cpuUsage, setCpuUsage] = useState(45);
  const [ramUsage, setRamUsage] = useState(60);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/stats");
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Simulate resource usage changes
    const interval = setInterval(() => {
      setCpuUsage((prev) =>
        Math.min(100, Math.max(0, prev + (Math.random() * 10 - 5)))
      );
      setRamUsage((prev) =>
        Math.min(100, Math.max(0, prev + (Math.random() * 10 - 5)))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Dummy chart data
  const chartData = [
    { name: "00:00", traffic: 4000, threats: 240 },
    { name: "04:00", traffic: 3000, threats: 139 },
    { name: "08:00", traffic: 2000, threats: 980 },
    { name: "12:00", traffic: 2780, threats: 390 },
    { name: "16:00", traffic: 1890, threats: 480 },
    { name: "20:00", traffic: 2390, threats: 380 },
    { name: "24:00", traffic: 3490, threats: 430 },
  ];

  if (loading)
    return (
      <div className="flex items-center justify-center h-full text-cyber-green animate-pulse">
        INITIALIZING SYSTEM...
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b border-cyber-green/20 pb-4">
        <div>
          <h2 className="text-3xl font-bold text-glow">DASHBOARD_OVERVIEW</h2>
          <p className="text-cyber-green/60 text-sm">
            SYSTEM STATUS:{" "}
            <span className="text-cyber-blue">
              {stats?.stats?.systemStatus || "ONLINE"}
            </span>
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() =>
              fetch("/api/seed", { method: "POST" }).then(() =>
                window.location.reload()
              )
            }
            className="px-4 py-2 bg-cyber-green/10 border border-cyber-green text-xs hover:bg-cyber-green hover:text-black transition-colors"
          >
            RESET_SIMULATION
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CyberCard title="TOTAL THREATS">
          <div className="flex items-center justify-between">
            <span className="text-4xl font-bold text-cyber-red text-glow-red">
              {stats?.stats?.totalThreats || 0}
            </span>
            <Shield className="w-8 h-8 text-cyber-red opacity-50" />
          </div>
        </CyberCard>

        <CyberCard title="CRITICAL ALERTS">
          <div className="flex items-center justify-between">
            <span className="text-4xl font-bold text-yellow-500">
              {stats?.stats?.highSeverityThreats || 0}
            </span>
            <AlertTriangle className="w-8 h-8 text-yellow-500 opacity-50" />
          </div>
        </CyberCard>

        <CyberCard title="ACTIVE NODES">
          <div className="flex items-center justify-between">
            <span className="text-4xl font-bold text-cyber-blue text-glow-blue">
              142
            </span>
            <Server className="w-8 h-8 text-cyber-blue opacity-50" />
          </div>
        </CyberCard>

        <CyberCard title="GLOBAL TRAFFIC">
          <div className="flex items-center justify-between">
            <span className="text-4xl font-bold text-cyber-green">1.2TB</span>
            <Globe className="w-8 h-8 text-cyber-green opacity-50" />
          </div>
        </CyberCard>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <CyberCard
          title="NETWORK_TRAFFIC_ANALYSIS"
          className="lg:col-span-2 h-[400px] flex flex-col"
        >
          <div className="flex-1 w-full h-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis
                  dataKey="name"
                  stroke="#00ff41"
                  tick={{ fill: "#00ff41" }}
                />
                <YAxis stroke="#00ff41" tick={{ fill: "#00ff41" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#000",
                    border: "1px solid #00ff41",
                  }}
                  itemStyle={{ color: "#00ff41" }}
                />
                <Line
                  type="monotone"
                  dataKey="traffic"
                  stroke="#00f0ff"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="threats"
                  stroke="#ff003c"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CyberCard>

        {/* System Resources */}
        <CyberCard
          title="SYSTEM_RESOURCES"
          className="h-[400px] flex flex-col justify-center gap-8"
        >
          <div className="flex justify-around">
            <ResourceGauge
              label="CPU LOAD"
              value={Math.round(cpuUsage)}
              color="text-cyber-red"
            />
            <ResourceGauge
              label="RAM USAGE"
              value={Math.round(ramUsage)}
              color="text-cyber-blue"
            />
          </div>
          <div className="px-4">
            <div className="text-xs text-cyber-green/50 mb-1">
              STORAGE_CAPACITY
            </div>
            <div className="w-full bg-cyber-gray h-2 rounded-full overflow-hidden">
              <div className="bg-cyber-green h-full w-[75%]"></div>
            </div>
            <div className="flex justify-between text-[10px] mt-1 text-gray-500">
              <span>USED: 750GB</span>
              <span>FREE: 250GB</span>
            </div>
          </div>
        </CyberCard>
      </div>

      {/* Map and Logs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
        <CyberCard title="GLOBAL_THREAT_MAP" className="lg:col-span-2">
          <WorldMap />
        </CyberCard>

        <CyberCard title="LIVE_SYSTEM_LOGS" className="flex flex-col">
          <Terminal logs={stats?.recentLogs || []} />
        </CyberCard>
      </div>

      {/* Recent Threats Table */}
      <CyberCard title="RECENT_INTERCEPTIONS">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-cyber-green/20 text-cyber-green/50">
                <th className="pb-2">TIMESTAMP</th>
                <th className="pb-2">IP ADDRESS</th>
                <th className="pb-2">TYPE</th>
                <th className="pb-2">SEVERITY</th>
                <th className="pb-2">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-green/10">
              {stats?.recentThreats?.map((threat) => (
                <tr
                  key={threat._id}
                  className="hover:bg-cyber-green/5 transition-colors"
                >
                  <td className="py-2 font-mono text-xs opacity-70">
                    {new Date(threat.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-2 font-mono">{threat.ip}</td>
                  <td className="py-2">{threat.type}</td>
                  <td className="py-2">
                    <span
                      className={`
                      px-2 py-0.5 rounded text-[10px] uppercase font-bold
                      ${
                        threat.severity === "critical"
                          ? "bg-red-900/50 text-red-400 border border-red-500"
                          : ""
                      }
                      ${
                        threat.severity === "high"
                          ? "bg-orange-900/50 text-orange-400 border border-orange-500"
                          : ""
                      }
                      ${
                        threat.severity === "medium"
                          ? "bg-yellow-900/50 text-yellow-400 border border-yellow-500"
                          : ""
                      }
                    `}
                    >
                      {threat.severity}
                    </span>
                  </td>
                  <td className="py-2 text-cyber-green">{threat.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CyberCard>
    </div>
  );
}
