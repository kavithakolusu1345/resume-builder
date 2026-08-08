import { generatePDF } from '../services/pdfService.js';

// @desc    Render HTML to PDF
// @route   POST /api/resumes/render-pdf
// @access  Private (or Public, but protected is better)
export const renderPdf = async (req, res) => {
  try {
    const { html } = req.body;

    if (!html) {
      return res.status(400).json({ message: 'No HTML content provided' });
    }

    // Call Puppeteer PDF service
    const pdfBuffer = await generatePDF(html);

    // Set headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
    res.setHeader('Content-Length', pdfBuffer.length);

    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF Render Controller Error:', error);
    res.status(500).json({ message: `PDF Generation failed: ${error.message}` });
  }
};
