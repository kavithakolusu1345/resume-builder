import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  fieldOfStudy: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  gpa: { type: String, default: '' },
  description: { type: String, default: '' },
});

const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  jobTitle: { type: String, required: true },
  location: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  current: { type: Boolean, default: false },
  responsibilities: { type: String, default: '' },
  achievements: { type: String, default: '' },
});

const projectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  description: { type: String, default: '' },
  technologies: { type: String, default: '' }, // comma separated or text
  github: { type: String, default: '' },
  liveDemo: { type: String, default: '' },
  achievements: { type: String, default: '' },
});

const certificationSchema = new mongoose.Schema({
  certificationName: { type: String, required: true },
  issuer: { type: String, default: '' },
  date: { type: String, default: '' },
  credentialUrl: { type: String, default: '' },
});

const achievementSchema = new mongoose.Schema({
  achievement: { type: String, required: true },
  organization: { type: String, default: '' },
  date: { type: String, default: '' },
  description: { type: String, default: '' },
});

const languageSchema = new mongoose.Schema({
  language: { type: String, required: true },
  proficiency: { type: String, default: 'Conversational' }, // e.g. Native, Fluent, Conversational
});

const customSectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, default: '' },
});

const skillSchema = new mongoose.Schema({
  category: { type: String, required: true }, // e.g. 'Programming Languages'
  items: { type: [String], default: [] },     // e.g. ['Java', 'Python']
});

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      default: 'My Resume',
    },
    template: {
      type: String,
      required: true,
      default: 'ATS Classic', // ATS Classic, Modern Professional, Software Engineer, Minimal, Fresh Graduate, Executive
    },
    customization: {
      fontFamily: { type: String, default: 'Inter' },
      fontSize: { type: String, default: '14px' },
      headingSize: { type: String, default: '18px' },
      lineSpacing: { type: String, default: '1.5' },
      margins: { type: String, default: '1in' }, // e.g. '0.5in', '0.75in', '1in'
      sectionSpacing: { type: String, default: '20px' },
      accentColor: { type: String, default: '#6366f1' },
      pageSize: { type: String, default: 'A4' }, // A4, Letter
    },
    sectionOrder: {
      type: [String],
      default: ['personalInfo', 'summary', 'experience', 'projects', 'skills', 'education', 'certifications', 'achievements', 'languages', 'customSections'],
    },
    personalInfo: {
      fullName: { type: String, default: '' },
      professionalTitle: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      portfolio: { type: String, default: '' },
      photoUrl: { type: String, default: '' },
    },
    summary: {
      type: String,
      default: '',
    },
    education: [educationSchema],
    experience: [experienceSchema],
    projects: [projectSchema],
    skills: [skillSchema],
    certifications: [certificationSchema],
    achievements: [achievementSchema],
    languages: [languageSchema],
    customSections: [customSectionSchema],
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
