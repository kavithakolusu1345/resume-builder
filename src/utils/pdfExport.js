/**
 * Client-side PDF Export Utility
 * Uses browser's native print dialog with print-specific CSS to produce A4 PDFs.
 * This is the fallback when the Puppeteer backend is unavailable.
 */

/**
 * Triggers browser print dialog targeting only the resume preview area.
 * Creates a temporary iframe, injects the resume HTML + stylesheets,
 * and calls window.print() so the browser renders an A4 document.
 *
 * @param {string} resumeHtml - The outer HTML of the resume DOM element
 * @param {string} filename - Suggested filename (e.g. "John_Doe_Resume")
 */
export const clientPrintResume = (resumeHtml, filename = 'resume') => {
  // Collect all relevant CSS from loaded stylesheets
  const cssText = Array.from(document.styleSheets)
    .map((sheet) => {
      try {
        return Array.from(sheet.cssRules || [])
          .map((rule) => rule.cssText)
          .join('\n');
      } catch (e) {
        return '';
      }
    })
    .join('\n');

  // Build a complete HTML document for printing
  const printDocument = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${filename}</title>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Source+Sans+3:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <style>
        ${cssText}

        /* Force A4 print output */
        @page {
          size: A4 portrait;
          margin: 0;
        }

        @media print {
          html, body {
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 0;
            background: white !important;
          }

          /* Hide everything except the print area */
          body > *:not(#print-root) {
            display: none !important;
          }

          #print-root {
            display: block !important;
            width: 210mm;
            min-height: 297mm;
            background: white;
            color: #000;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }

        body {
          margin: 0;
          padding: 0;
          background: white;
        }

        #print-root {
          width: 210mm;
          min-height: 297mm;
          background: white;
        }
      </style>
    </head>
    <body>
      <div id="print-root">
        ${resumeHtml}
      </div>
      <script>
        window.onload = function () {
          window.print();
          // Close the tab after printing (optional)
          setTimeout(() => window.close(), 500);
        };
      </script>
    </body>
    </html>
  `;

  // Open a new blank window and write the print document
  const printWindow = window.open('', '_blank', 'width=900,height=1200');
  if (!printWindow) {
    alert('Print window was blocked by your browser. Please allow pop-ups for this site.');
    return;
  }

  printWindow.document.open();
  printWindow.document.write(printDocument);
  printWindow.document.close();
};

/**
 * Quick in-page print — triggers window.print() directly.
 * Works best when @media print CSS is properly configured.
 */
export const quickPrint = () => {
  window.print();
};
