#!/usr/bin/env node
// Extracts plain text from a PDF, page markers included, for chapter-boundary detection.
//
// One-time setup (creates node_modules next to this script, so it resolves regardless of cwd):
//   cd <this-skill-dir>/scripts && npm init -y && npm install pdf-parse
//
// Usage:
//   node extract_pdf.js <input.pdf> <output.txt>

const fs = require('fs');

async function main() {
  const [, , inputPath, outputPath] = process.argv;
  if (!inputPath || !outputPath) {
    console.error('Usage: node extract_pdf.js <input.pdf> <output.txt>');
    process.exit(1);
  }

  const { PDFParse } = require('pdf-parse');
  const buf = fs.readFileSync(inputPath);
  const parser = new PDFParse({ data: buf });
  const res = await parser.getText();
  const text = res.text || (res.pages ? res.pages.map((p) => p.text).join('\n\n---PAGE---\n\n') : '');

  fs.writeFileSync(outputPath, text);
  console.log('PAGES:', res.total || (res.pages && res.pages.length));
  console.log('CHARS:', text.length);
  console.log('WRITTEN:', outputPath);
}

main().catch((e) => {
  console.error('ERROR', e);
  process.exit(1);
});
