"use client";
import React, { useEffect, useState } from "react";

const WorldMap = ({ className }) => {
  const [pings, setPings] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newPing = {
        id: Date.now(),
        x: Math.random() * 100, // Percentage
        y: Math.random() * 100, // Percentage
      };
      setPings((prev) => [...prev, newPing]);

      // Remove old pings
      setTimeout(() => {
        setPings((prev) => prev.filter((p) => p.id !== newPing.id));
      }, 2000);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`relative w-full h-full bg-cyber-black overflow-hidden rounded border border-cyber-green/20 ${className}`}
    >
      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(#00ff41 1px, transparent 1px), linear-gradient(90deg, #00ff41 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>

      {/* Simplified World Map SVG Placeholder */}
      <svg
        viewBox="0 0 1000 500"
        className="w-full h-full opacity-30 fill-cyber-green"
      >
        <path
          d="M50,250 Q250,50 500,250 T950,250"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          fill="currentColor"
          fontSize="20"
        >
          GLOBAL_THREAT_MONITORING_SYSTEM
        </text>
        {/* Abstract Continents */}
        <rect x="100" y="100" width="200" height="150" rx="20" />
        <rect x="600" y="100" width="300" height="200" rx="50" />
        <rect x="400" y="350" width="150" height="100" rx="10" />
      </svg>

      {/* Pings */}
      {pings.map((ping) => (
        <div
          key={ping.id}
          className="absolute w-4 h-4 -ml-2 -mt-2 rounded-full border-2 border-cyber-red animate-ping"
          style={{ left: `${ping.x}%`, top: `${ping.y}%` }}
        >
          <div className="absolute inset-0 bg-cyber-red opacity-50 rounded-full animate-pulse"></div>
        </div>
      ))}

      <div className="absolute bottom-4 left-4 text-xs text-cyber-green bg-black/80 p-2 border border-cyber-green/50">
        LIVE_ATTACK_FEED // MONITORING
      </div>
    </div>
  );
};

export default WorldMap;
