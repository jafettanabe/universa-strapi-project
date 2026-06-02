import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const htmlPath = process.argv[2];
const outPath = process.argv[3];
if (!htmlPath || !outPath) {
  console.error("Usage: node extract-canva-text.mjs <html-file> <out-txt>");
  process.exit(1);
}

const html = readFileSync(htmlPath, "utf8");
const re = /\{"A\?":"A","A":"((?:\\.|[^"\\])*)"\}/g;
const parts = [];
let m;
while ((m = re.exec(html)) !== null) {
  const decoded = m[1]
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\");
  if (decoded.trim()) parts.push(decoded);
}

const body = parts
  .join("")
  .replace(/\\(\r?\n|$)/g, "\n")
  .replace(/\?\?/g, "")
  .replace(/\?\n/g, "\n")
  .replace(/\uFFFD/g, "")
  .replace(/\u200b/g, "")
  .replace(/\n{3,}/g, "\n\n")
  .trim();

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, body, "utf8");
console.log(`Wrote ${parts.length} chunks, ${body.length} chars to ${outPath}`);
