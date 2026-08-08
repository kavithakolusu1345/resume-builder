import Resume from '../models/Resume.js';

// @desc    Get all resumes for logged-in user
// @route   GET /api/resumes
// @access  Private
export const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json(resumes);
  } catch (error) {
    console.error('Get Resumes Error:', error);
    res.status(500).json({ message: 'Server error retrieving resumes' });
  }
};

// @desc    Create a new resume
// @route   POST /api/resumes
// @access  Private
export const createResume = async (req, res) => {
  try {
    const { title, template } = req.body;

    const newResume = await Resume.create({
      userId: req.user._id,
      title: title || 'Untitled Resume',
      template: template || 'ATS Classic',
      personalInfo: {
        fullName: req.user.name,
        email: req.user.email,
        phone: req.user.profile.phone || '',
        location: req.user.profile.location || '',
        linkedin: req.user.profile.linkedin || '',
        github: req.user.profile.github || '',
      },
    });

    res.status(201).json(newResume);
  } catch (error) {
    console.error('Create Resume Error:', error);
    res.status(500).json({ message: 'Server error creating resume' });
  }
};

// @desc    Get resume by ID
// @route   GET /api/resumes/:id
// @access  Private
export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Verify ownership
    if (resume.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this resume' });
    }

    res.json(resume);
  } catch (error) {
    console.error('Get Resume By ID Error:', error);
    res.status(500).json({ message: 'Server error fetching resume details' });
  }
};

// @desc    Update resume by ID
// @route   PUT /api/resumes/:id
// @access  Private
export const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Verify ownership
    if (resume.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this resume' });
    }

    // Update fields dynamically
    const fieldsToUpdate = [
      'title',
      'template',
      'customization',
      'sectionOrder',
      'personalInfo',
      'summary',
      'education',
      'experience',
      'projects',
      'skills',
      'certifications',
      'achievements',
      'languages',
      'customSections',
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        resume[field] = req.body[field];
      }
    });

    const updatedResume = await resume.save();
    res.json(updatedResume);
  } catch (error) {
    console.error('Update Resume Error:', error);
    res.status(500).json({ message: 'Server error updating resume' });
  }
};

// @desc    Delete resume
// @route   DELETE /api/resumes/:id
// @access  Private
export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Verify ownership
    if (resume.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this resume' });
    }

    await resume.deleteOne();
    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Delete Resume Error:', error);
    res.status(500).json({ message: 'Server error deleting resume' });
  }
};

// @desc    Duplicate resume
// @route   POST /api/resumes/:id/duplicate
// @access  Private
export const duplicateResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Verify ownership
    if (resume.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to duplicate this resume' });
    }

    // Create a plain object copy and clear _id
    const copyData = resume.toObject();
    delete copyData._id;
    delete copyData.createdAt;
    delete copyData.updatedAt;

    copyData.title = `${copyData.title} Copy`;

    const duplicatedResume = await Resume.create(copyData);
    res.status(201).json(duplicatedResume);
  } catch (error) {
    console.error('Duplicate Resume Error:', error);
    res.status(500).json({ message: 'Server error duplicating resume' });
  }
};
