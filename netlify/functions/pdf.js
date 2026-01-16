import PDFDocument from 'pdfkit';

export const handler = async event => {
  if (event.httpMethod !== 'POST')
    return { statusCode: 405, body: 'Method Not Allowed' };

  try {
    const { sections } = JSON.parse(event.body);
    const doc = new PDFDocument({ size: 'A4', margin: 40 });

    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));

    return new Promise(resolve => {
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve({
          statusCode: 200,
          body: pdfData.toString('base64'),
          isBase64Encoded: true,
        });
      });

      // HEADER
      doc
        .font('Helvetica-Bold')
        .fontSize(18)
        .text(sections.NAME.toUpperCase(), { align: 'center' });
      doc.moveDown(0.2);

      doc
        .font('Helvetica')
        .fontSize(10)
        .text(sections.CONTACT, { align: 'center' });
      doc.moveDown(0.5);

      doc
        .font('Helvetica-Bold')
        .fontSize(11)
        .text(sections.HEADLINE.toUpperCase(), { align: 'center' });

      doc
        .font('Helvetica')
        .fontSize(9)
        .text('Authorized to work in the United States without sponsorship', {
          align: 'center',
        });
      doc.moveDown(1);

      // SECTIONS
      const drawSection = (title, content) => {
        if (!content || content.length < 2) return;

        doc.font('Helvetica-Bold').fontSize(11).text(title.toUpperCase());
        doc.moveTo(40, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(0.3);

        doc.font('Helvetica').fontSize(10).text(content, {
          align: 'justify',
          lineGap: 2,
        });
        doc.moveDown(0.8);
      };

      drawSection('Professional Summary', sections.SUMMARY);
      drawSection('Technical Skills', sections.SKILLS);
      drawSection('Professional Experience', sections.EXPERIENCE);
      drawSection('Technical Projects', sections.PROJECTS);
      drawSection('Education', sections.EDUCATION);
      drawSection('Languages', sections.LANGUAGES);

      doc.end();
    });
  } catch (error) {
    return { statusCode: 500, body: 'PDF Error' };
  }
};
