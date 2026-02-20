// lib/pdf.ts
import PDFDocument from "pdfkit";
import { PassThrough } from "stream";

export function generatePDF(content: string): PassThrough {
    const doc = new PDFDocument();
    const stream = new PassThrough();

    // Pipe FIRST
    doc.pipe(stream);

    // Write content
    doc.text(content);

    //Finalize PDF
    doc.end();

    return stream;
};