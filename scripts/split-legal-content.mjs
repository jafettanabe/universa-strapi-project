import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "src/bootstrap/content");
const combined = readFileSync(join(dir, "terminos-y-condiciones.txt"), "utf8");

function normalize(raw) {
  return raw
    .replace(/\\(\r?\n|$)/g, "\n")
    .replace(/\u200b/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const text = normalize(combined);
const privacyMarker = "\nPolítica de Privacidad y Protección de datos personales\n";
const splitAt = text.indexOf("Política de Privacidad y Protección de datos personales");

let terminos = text;
let privacidad = "";

if (splitAt !== -1) {
  terminos = text.slice(0, splitAt).trim();
  privacidad = text.slice(splitAt).trim();
}

writeFileSync(join(dir, "terminos-y-condiciones.txt"), terminos, "utf8");
writeFileSync(join(dir, "politica-privacidad.txt"), privacidad, "utf8");

console.log("terminos:", terminos.length);
console.log("privacidad:", privacidad.length);
