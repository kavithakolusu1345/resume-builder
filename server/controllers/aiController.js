import * as aiService from '../services/aiService.js';

// @desc    Generate professional profile summary
// @route   POST /api/ai/summary
// @access  Private
export const generateSummary = async (req, res) => {
  try {
    const { skills, experience, targetRole } = req.body;
    
    // Quick validation
    if (!skills && !experience) {
      return res.status(400).json({ message: 'Please provide either skills or experience details.' });
    }

    const summary = await aiService.generateSummary(skills, experience, targetRole);
    res.json({ summary });
  } catch (error) {
    console.error('AI Summary Generation Controller Error:', error);
    res.status(500).json({ message: 'Failed to generate summary' });
  }
};

// @desc    Improve a resume bullet point
// @route   POST /api/ai/improve-bullet
// @access  Private
export const improveBullet = async (req, res) => {
  try {
    const { bulletText, targetRole } = req.body;

    if (!bulletText) {
      return res.status(400).json({ message: 'Please provide a bullet point text to improve.' });
    }

    const improved = await aiService.improveBulletPoint(bulletText, targetRole);
    res.json({ improved });
  } catch (error) {
    console.error('AI Improve Bullet Controller Error:', error);
    res.status(500).json({ message: 'Failed to improve bullet point' });
  }
};

// @desc    Rewrite professional experience
// @route   POST /api/ai/rewrite-experience
// @access  Private
export const rewriteExperience = async (req, res) => {
  try {
    const { experienceText, style } = req.body;

    if (!experienceText) {
      return res.status(400).json({ message: 'Please provide experience text to rewrite.' });
    }

    const rewritten = await aiService.rewriteExperience(experienceText, style);
    res.json({ rewritten });
  } catch (error) {
    console.error('AI Rewrite Experience Controller Error:', error);
    res.status(500).json({ message: 'Failed to rewrite experience description' });
  }
};

// @desc    Generate project descriptions
// @route   POST /api/ai/project-description
// @access  Private
export const generateProjectDesc = async (req, res) => {
  try {
    const { projectName, techStack, features } = req.body;

    if (!projectName) {
      return res.status(400).json({ message: 'Please provide a project name.' });
    }

    const description = await aiService.generateProjectDescription(projectName, techStack, features);
    res.json({ description });
  } catch (error) {
    console.error('AI Project Description Controller Error:', error);
    res.status(500).json({ message: 'Failed to generate project description' });
  }
};
