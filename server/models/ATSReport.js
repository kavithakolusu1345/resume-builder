import mongoose from 'mongoose';

const atsReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    breakdown: {
      keywords: { type: Number, default: 0 },
      skills: { type: Number, default: 0 },
      experience: { type: Number, default: 0 },
      formatting: { type: Number, default: 0 },
      structure: { type: Number, default: 0 },
    },
    matchedKeywords: {
      type: [String],
      default: [],
    },
    missingKeywords: {
      type: [String],
      default: [],
    },
    recommendations: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const ATSReport = mongoose.model('ATSReport', atsReportSchema);
export default ATSReport;
