import mongoose from 'mongoose';

const ThreatSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true, // e.g., "DDoS", "SQL Injection", "Brute Force"
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  },
  location: {
    type: String,
    default: 'Unknown',
  },
  status: {
    type: String,
    enum: ['detected', 'blocked', 'mitigated'],
    default: 'detected',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Threat || mongoose.model('Threat', ThreatSchema);
