// build.js
const fs = require('fs');
const path = require('path');

const publicDir = 'public';
const srcDirs = ['src', 'includes'];
const indexFile = path.join(publicDir, 'index.html');

// Helper: recursively copy files from src to dest
function copyDir(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  entries.forEach(entry => {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      if (!fs.existsSync(destPath)) fs.mkdirSync(destPath);
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

// Step 1: Copy all src/includes files into public
srcDirs.forEach(dir => copyDir(dir, publicDir));
console.log('Files copied to public/');

// Step 2: Update paths in index.html to relative
if (fs.existsSync(indexFile)) {
  let html = fs.readFileSync(indexFile, 'utf-8');

  // Replace absolute src paths like /src/... or /includes/... to relative
  html = html.replace(/src="\/(src|includes)\/(.*?)"/g, 'src="./$2"');
  html = html.replace(/href="\/(src|includes)\/(.*?)"/g, 'href="./$2"');

  fs.writeFileSync(indexFile, html, 'utf-8');
  console.log('index.html paths updated to relative');
} else {
  console.log('index.html not found in public/, skipping path update');
}

console.log('Build complete! You can now open public/index.html directly.');
