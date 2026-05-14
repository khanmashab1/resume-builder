import { readdirSync, statSync, writeFileSync } from "fs";
import { join } from "path";

const assetsDir = join(import.meta.dirname, "..", "dist", "client", "assets");

let files;
try {
  files = readdirSync(assetsDir);
} catch {
  console.error("dist/client/assets not found — skipping HTML generation");
  process.exit(0);
}

const jsFiles = files
  .filter((f) => f.startsWith("index-") && f.endsWith(".js"))
  .map((f) => ({ name: f, size: statSync(join(assetsDir, f)).size }))
  .sort((a, b) => b.size - a.size);

const cssFiles = files.filter((f) => f.startsWith("styles-") && f.endsWith(".css"));

if (!jsFiles.length || !cssFiles.length) {
  console.error("Could not find entry JS or CSS in dist/client/assets");
  process.exit(1);
}

const mainJs = jsFiles[0].name;
const mainCss = cssFiles[0];

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Resume Builder</title>
    <link rel="icon" href="favicon.png" />
    <link rel="stylesheet" href="assets/${mainCss}" />
  </head>
  <body>
    <div id="root"></div>
    <script src="assets/${mainJs}"></script>
  </body>
</html>`;

writeFileSync(join(import.meta.dirname, "..", "dist", "client", "index.html"), html);
console.log(`Generated dist/client/index.html with ${mainJs} and ${mainCss}`);
