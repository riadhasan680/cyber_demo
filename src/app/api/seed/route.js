import dbConnect from '@/lib/db';
import Threat from '@/models/Threat';
import SystemLog from '@/models/SystemLog';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    await dbConnect();

    // Clear existing data
    await Threat.deleteMany({});
    await SystemLog.deleteMany({});
    await User.deleteMany({});

    // Create Admin User
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
    });

    const threats = [
      { ip: '192.168.1.105', type: 'Brute Force', severity: 'high', location: 'Russia', status: 'blocked' },
      { ip: '10.0.0.45', type: 'SQL Injection', severity: 'critical', location: 'China', status: 'blocked' },
      { ip: '172.16.0.23', type: 'Port Scan', severity: 'medium', location: 'USA', status: 'detected' },
      { ip: '45.33.22.11', type: 'DDoS', severity: 'high', location: 'Brazil', status: 'mitigated' },
      { ip: '203.0.113.5', type: 'Malware Upload', severity: 'critical', location: 'Unknown', status: 'blocked' },
    ];

    const logs = [
      { level: 'info', message: 'System boot sequence initiated', source: 'Kernel' },
      { level: 'success', message: 'Firewall rules updated successfully', source: 'Firewall' },
      { level: 'warn', message: 'High memory usage detected on node-01', source: 'Monitor' },
      { level: 'error', message: 'Failed login attempt from admin user', source: 'Auth' },
      { level: 'info', message: 'Daily backup completed', source: 'Backup' },
    ];

    await Threat.insertMany(threats);
    await SystemLog.insertMany(logs);

    return NextResponse.json({ message: 'Database seeded successfully. Admin user created (admin/admin123).' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
