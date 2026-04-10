const fs = require('fs');
const path = require('path');

const root = process.cwd();
const dist = path.join(root, 'dist');

function rmrf(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = fs.lstatSync(full);
    if (stat.isDirectory()) rmrf(full);
    else fs.unlinkSync(full);
  }
  fs.rmdirSync(dir);
}

function copyRecursive(src, dest) {
  const stat = fs.lstatSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest);
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

try {
  console.log('Cleaning dist...');
  rmrf(dist);
  fs.mkdirSync(dist);
  console.log('Copying HTML...');
  fs.copyFileSync(path.join(root, 'systec-redesenhado.html'), path.join(dist, 'index.html'));
  const assetsSrc = path.join(root, 'assets');
  if (fs.existsSync(assetsSrc)) {
    console.log('Copying assets...');
    copyRecursive(assetsSrc, path.join(dist, 'assets'));
  }
  console.log('Build complete. Files in dist/');
} catch (err) {
  console.error('Build failed:', err);
  process.exit(1);
}
