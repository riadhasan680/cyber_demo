'use client';
import React, { useEffect, useRef } from 'react';

const Terminal = ({ logs = [] }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="bg-black border border-cyber-green/50 p-4 font-mono text-xs h-64 overflow-y-auto rounded-sm shadow-[inset_0_0_20px_rgba(0,255,65,0.1)]">
      <div className="space-y-1">
        {logs.map((log, i) => (
          <div key={i} className="flex gap-2">
            <span className="text-cyber-green/50">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
            <span className={`
              ${log.level === 'error' ? 'text-cyber-red' : ''}
              ${log.level === 'warn' ? 'text-yellow-500' : ''}
              ${log.level === 'success' ? 'text-cyber-blue' : ''}
              ${log.level === 'info' ? 'text-cyber-green' : ''}
            `}>
              {log.source}: {log.message}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default Terminal;
