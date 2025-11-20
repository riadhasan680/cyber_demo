"use client";
import React from "react";
import CyberCard from "@/components/ui/CyberCard";
import WorldMap from "@/components/ui/WorldMap";

export default function ThreatsPage() {
  return (
    <div className="h-full flex flex-col gap-6">
      <h2 className="text-3xl font-bold text-glow">GLOBAL_THREAT_MONITORING</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Full Screen Map */}
        <CyberCard
          className="lg:col-span-2 flex flex-col"
          title="LIVE_GEO_TRACKING"
        >
          <WorldMap />
        </CyberCard>

        {/* Side Panel Info */}
        <CyberCard title="THREAT_INTELLIGENCE" className="flex flex-col gap-4">
          <div className="bg-cyber-gray/30 p-4 rounded border border-cyber-green/20">
            <h3 className="text-sm font-bold text-cyber-red mb-2 animate-pulse">
              CRITICAL ALERT
            </h3>
            <p className="text-xs text-gray-400">
              Massive DDoS attack detected originating from Eastern Europe.
              Targeting Port 443. Mitigation protocols active.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs text-cyber-green/70 uppercase tracking-wider">
              Top Attack Vectors
            </h4>
            <div className="flex justify-between text-xs border-b border-cyber-green/10 pb-1">
              <span>SQL Injection</span>
              <span className="text-cyber-red">45%</span>
            </div>
            <div className="flex justify-between text-xs border-b border-cyber-green/10 pb-1">
              <span>XSS</span>
              <span className="text-yellow-500">22%</span>
            </div>
            <div className="flex justify-between text-xs border-b border-cyber-green/10 pb-1">
              <span>Brute Force</span>
              <span className="text-cyber-blue">15%</span>
            </div>
          </div>

          <div className="mt-auto">
            <div className="text-xs text-center text-cyber-green/30">
              SCANNING NETWORK...
            </div>
            <div className="h-1 w-full bg-gray-800 mt-2 rounded-full overflow-hidden">
              <div className="h-full bg-cyber-green w-1/3 animate-[scanline_2s_linear_infinite]"></div>
            </div>
          </div>
        </CyberCard>
      </div>
    </div>
  );
}
