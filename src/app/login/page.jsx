"use client";
import React, { useState } from "react";
import { Lock, Fingerprint, Scan } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        setError(data.error || "Authentication failed");
      }
    } catch (err) {
      setError("System error. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-full max-w-md p-8 bg-black border border-cyber-green/30 relative rounded-lg shadow-[0_0_50px_rgba(0,255,65,0.1)]">
        {/* Decorative Elements */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 border border-cyber-green/50 rounded-full flex items-center justify-center bg-black animate-pulse">
          <Lock className="w-8 h-8 text-cyber-green" />
        </div>

        <h2 className="text-2xl font-bold text-center mt-8 mb-2 text-glow">
          SECURE_LOGIN
        </h2>
        <p className="text-center text-cyber-green/50 text-xs mb-8 tracking-widest">
          BIOMETRIC AUTHENTICATION REQUIRED
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-cyber-green/70">
              Operator ID
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-cyber-gray/50 border border-cyber-green/30 p-3 pl-10 rounded text-cyber-green focus:outline-none focus:border-cyber-green focus:ring-1 focus:ring-cyber-green transition-all"
                placeholder="admin"
              />
              <Fingerprint className="absolute left-3 top-3 w-5 h-5 text-cyber-green/50" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-cyber-green/70">
              Access Key
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-cyber-gray/50 border border-cyber-green/30 p-3 pl-10 rounded text-cyber-green focus:outline-none focus:border-cyber-green focus:ring-1 focus:ring-cyber-green transition-all"
                placeholder="admin123"
              />
              <Scan className="absolute left-3 top-3 w-5 h-5 text-cyber-green/50" />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-xs text-center border border-red-500/50 bg-red-900/20 p-2 rounded">
              ACCESS DENIED: {error}
            </div>
          )}

          <button
            disabled={loading}
            className="w-full bg-cyber-green/10 border border-cyber-green text-cyber-green py-3 rounded font-bold hover:bg-cyber-green hover:text-black transition-all duration-300 uppercase tracking-widest text-sm flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="group-hover:animate-pulse">
              {loading ? "VERIFYING..." : "Authenticate"}
            </span>
          </button>
        </form>

        <div className="mt-6 text-center space-y-4">
          <p className="text-[10px] text-red-500 animate-pulse">
            WARNING: UNAUTHORIZED ACCESS ATTEMPTS WILL BE LOGGED AND REPORTED.
          </p>

          <button
            onClick={async () => {
              if (confirm("Initialize System? This will reset the database.")) {
                await fetch("/api/seed", { method: "POST" });
                alert("System Initialized. Default User: admin / admin123");
              }
            }}
            className="text-[10px] text-cyber-green/30 hover:text-cyber-green underline cursor-pointer"
          >
            [ INITIALIZE_SYSTEM_DB ]
          </button>
        </div>
      </div>
    </div>
  );
}
