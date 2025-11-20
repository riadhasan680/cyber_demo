"use client";
import React from "react";

const ResourceGauge = ({ label, value, color = "text-cyber-green" }) => {
  // Calculate circle properties
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-32 h-32">
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-cyber-gray/50"
          />
          {/* Progress Circle */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`${color} transition-all duration-1000 ease-out`}
          />
        </svg>

        {/* Value Text */}
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className={`text-2xl font-bold ${color} text-glow`}>
            {value}%
          </span>
        </div>
      </div>
      <span className="mt-2 text-xs uppercase tracking-widest text-cyber-green/70">
        {label}
      </span>
    </div>
  );
};

export default ResourceGauge;
