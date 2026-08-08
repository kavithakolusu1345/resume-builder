import puppeteer from 'puppeteer';

/**
 * Renders HTML content into a high-quality A4 PDF buffer using Puppeteer.
 * @param {string} htmlContent - Full HTML string with styled resume markup
 * @returns {Promise<Buffer>} - Resolves to PDF Buffer
 */
export const generatePDF = async (htmlContent) => {
  let browser;
  try {
    // Launch headless Chromium with recommended flags for container compatibility (e.g. Render/Railway)
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });

    const page = await browser.newPage();

    // Set viewport for standard A4 aspect ratio (optional but helps rendering)
    await page.setViewport({
      width: 794, // A4 pixels at 96 DPI
      height: 1123,
      deviceScaleFactor: 2,
    });

    // Load HTML content
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0', // Wait for external styles, web fonts, or images to load
    });

    // Inject print stylesheet override to ensure A4 rendering is perfect
    await page.addStyleTag({
      content: `
        @page {
          size: A4;
          margin: 0;
        }
        body {
          margin: 0;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      `,
    });

    // Generate PDF buffer
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true, // Crucial for background colors and gradients
      margin: {
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
    });

    return pdfBuffer;
  } catch (error) {
    console.error('Puppeteer PDF Generation Error:', error);
    throw new Error(`PDF generation failed: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
