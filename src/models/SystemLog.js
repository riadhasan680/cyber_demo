import mongoose from 'mongoose';

const SystemLogSchema = new mongoose.Schema({
  level: {
    type: String,
    enum: ['info', 'warn', 'error', 'success'],
    default: 'info',
  },
  message: {
    type: String,
    required: true,
  },
  source: {
    type: String, // e.g., "Firewall", "Auth System", "Kernel"
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.SystemLog || mongoose.model('SystemLog', SystemLogSchema);
