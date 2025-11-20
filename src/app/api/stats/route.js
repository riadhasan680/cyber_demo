import dbConnect from '@/lib/db';
import Threat from '@/models/Threat';
import SystemLog from '@/models/SystemLog';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();

    const totalThreats = await Threat.countDocuments();
    const highSeverityThreats = await Threat.countDocuments({ severity: { $in: ['high', 'critical'] } });
    const recentThreats = await Threat.find().sort({ timestamp: -1 }).limit(5);
    const recentLogs = await SystemLog.find().sort({ timestamp: -1 }).limit(10);

    return NextResponse.json({
      stats: {
        totalThreats,
        highSeverityThreats,
        systemStatus: highSeverityThreats > 5 ? 'CRITICAL' : 'ONLINE',
      },
      recentThreats,
      recentLogs,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
