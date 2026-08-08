import Resume from '../models/Resume.js';
import ATSReport from '../models/ATSReport.js';
import * as aiService from '../services/aiService.js';

// Helper to serialize resume data to plain text for AI reading
const serializeResumeToText = (resume) => {
  const info = resume.personalInfo || {};
  const skillsList = (resume.skills || [])
    .map((s) => `${s.category}: ${s.items.join(', ')}`)
    .join(' | ');

  const expList = (resume.experience || [])
    .map(
      (e) =>
        `- ${e.jobTitle} at ${e.company} (${e.startDate} - ${e.endDate || 'Present'}): Responsibilities: ${e.responsibilities}. Achievements: ${e.achievements}`
    )
    .join('\n');

  const projList = (resume.projects || [])
    .map(
      (p) =>
        `- Project: ${p.projectName} (Tech: ${p.technologies}). Description: ${p.description}. Achievements: ${p.achievements}`
    )
    .join('\n');

  const eduList = (resume.education || [])
    .map(
      (ed) =>
        `- ${ed.degree} in ${ed.fieldOfStudy} from ${ed.institution} (${ed.startDate} - ${ed.endDate || 'N/A'}), GPA: ${ed.gpa}`
    )
    .join('\n');

  const certList = (resume.certifications || [])
    .map((c) => `- Certification: ${c.certificationName} from ${c.issuer} (${c.date})`)
    .join('\n');

  return `
TITLE: ${resume.title}
FULL NAME: ${info.fullName}
TARGET ROLE: ${info.professionalTitle}
SUMMARY: ${resume.summary || ''}
TECHNICAL SKILLS: ${skillsList}
WORK EXPERIENCE:
${expList}
PROJECTS:
${projList}
EDUCATION:
${eduList}
CERTIFICATIONS:
${certList}
`;
};

// @desc    Analyze resume against a job description
// @route   POST /api/ats/analyze
// @access  Private
export const analyzeResume = async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;

    if (!resumeId || !jobDescription) {
      return res.status(400).json({ message: 'Please provide both resumeId and jobDescription' });
    }

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Verify ownership
    if (resume.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to analyze this resume' });
    }

    // Convert resume to clean text format
    const resumeText = serializeResumeToText(resume);

    // Call Gemini AI analysis
    const analysisResult = await aiService.analyzeJobMatch(resumeText, jobDescription);

    // Save ATS report in Database
    const report = await ATSReport.create({
      userId: req.user._id,
      resumeId,
      jobDescription,
      score: analysisResult.score || 0,
      breakdown: {
        keywords: analysisResult.breakdown?.keywords || 0,
        skills: analysisResult.breakdown?.skills || 0,
        experience: analysisResult.breakdown?.experience || 0,
        formatting: analysisResult.breakdown?.formatting || 0,
        structure: analysisResult.breakdown?.structure || 0,
      },
      matchedKeywords: analysisResult.matchedKeywords || [],
      missingKeywords: analysisResult.missingKeywords || [],
      recommendations: analysisResult.recommendations || [],
    });

    res.status(201).json(report);
  } catch (error) {
    console.error('ATS Analysis Controller Error:', error);
    res.status(500).json({ message: 'Failed to run ATS scanner' });
  }
};

// @desc    Get latest ATS analysis report for a resume
// @route   GET /api/ats/:resumeId
// @access  Private
export const getAtsReportForResume = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Verify ownership
    if (resume.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Find the latest report
    const report = await ATSReport.findOne({ resumeId }).sort({ createdAt: -1 });
    
    if (!report) {
      return res.status(404).json({ message: 'No ATS reports found for this resume' });
    }

    res.json(report);
  } catch (error) {
    console.error('Get ATS Report Error:', error);
    res.status(500).json({ message: 'Server error retrieving ATS report' });
  }
};
