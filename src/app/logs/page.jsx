'use client';
import React, { useEffect, useState } from 'react';
import CyberCard from '@/components/ui/CyberCard';
import Terminal from '@/components/ui/Terminal';

export default function LogsPage() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await fetch('/api/stats');
      const data = await res.json();
      if (data.recentLogs) {
        setLogs(data.recentLogs);
      }
    };
    
    fetchLogs();
    // Simulate live stream
    const interval = setInterval(() => {
      const newLog = {
        timestamp: new Date(),
        source: ['Firewall', 'Kernel', 'Auth', 'Network'][Math.floor(Math.random() * 4)],
        level: ['info', 'success', 'warn'][Math.floor(Math.random() * 3)],
        message: `Packet trace #${Math.floor(Math.random() * 9999)} analyzed. Status: CLEAN`
      };
      setLogs(prev => [...prev.slice(-50), newLog]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col gap-6">
      <h2 className="text-3xl font-bold text-glow">LIVE_SYSTEM_LOGS</h2>
      <CyberCard className="flex-1 flex flex-col" title="REAL-TIME STREAM">
        <div className="flex-1 bg-black p-4 font-mono text-xs overflow-y-auto rounded border border-cyber-green/20">
          {logs.map((log, i) => (
            <div key={i} className="mb-1 border-b border-cyber-green/5 pb-1">
              <span className="text-gray-500 mr-4">{new Date(log.timestamp).toLocaleTimeString()}</span>
              <span className="text-cyber-blue mr-4 w-20 inline-block">[{log.source}]</span>
              <span className={log.level === 'warn' ? 'text-yellow-500' : 'text-cyber-green'}>
                {log.message}
              </span>
            </div>
          ))}
        </div>
      </CyberCard>
    </div>
  );
}
