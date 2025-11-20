"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldAlert,
  Activity,
  Terminal,
  Lock,
  LayoutDashboard,
} from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/logs", label: "Live Logs", icon: Terminal },
    { href: "/threats", label: "Threat Map", icon: ShieldAlert },
    { href: "/login", label: "Access Control", icon: Lock },
  ];

  return (
    <aside className="w-64 bg-cyber-dark border-r border-cyber-border h-screen fixed left-0 top-0 flex flex-col z-50">
      <div className="p-6 border-b border-cyber-border">
        <h1 className="text-2xl font-bold text-cyber-green tracking-tighter flex items-center gap-2">
          <ShieldAlert className="w-8 h-8" />
          SEC_OPS
        </h1>
        <p className="text-xs text-cyber-green/50 mt-1">
          v2.0.4 // SYSTEM ONLINE
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-200 group
                ${
                  isActive
                    ? "bg-cyber-green/10 text-cyber-green border-l-2 border-cyber-green"
                    : "text-gray-400 hover:text-cyber-green hover:bg-cyber-green/5"
                }
              `}
            >
              <Icon className={`w-5 h-5 ${isActive ? "animate-pulse" : ""}`} />
              <span className="tracking-wide">{link.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 bg-cyber-green rounded-full shadow-[0_0_5px_#00ff41]" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-cyber-border space-y-2">
        <div className="bg-cyber-black p-3 rounded border border-cyber-green/20">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-cyber-green animate-pulse" />
            <span className="text-xs text-cyber-green">Network Status</span>
          </div>
          <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-cyber-green w-[85%] animate-pulse"></div>
          </div>
          <div className="flex justify-between text-[10px] text-gray-500 mt-1">
            <span>UPTIME</span>
            <span>99.9%</span>
          </div>
        </div>

        <button
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.href = "/login";
          }}
          className="w-full text-xs text-red-500 border border-red-900/50 p-2 rounded hover:bg-red-900/20 transition-colors uppercase tracking-wider"
        >
          Terminate Session
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
