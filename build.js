const fs = require('fs');

console.log('Starting build...');

if (!fs.existsSync('index.html')) {
    console.error('BUILD FAILED: index.html not found');
    process.exit(1);
}

console.log('index.html found');
console.log('Build completed successfully.');
