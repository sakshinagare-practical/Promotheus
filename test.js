const fs = require('fs');

const tests = [
    'index.html',
    'style.css',
    'script.js',
    'Dockerfile',
    'deployment.yaml',
    'service.yaml',
    'package.json',
    'build.js'
];

console.log('======================================');
console.log(' Student Task Manager Automated Tests');
console.log('======================================');

let failed = false;

for (const file of tests) {
    if (fs.existsSync(file)) {
        console.log(`TEST PASSED: ${file} exists`);
    } else {
        console.error(`TEST FAILED: ${file} not found`);
        failed = true;
    }
}

if (failed) {
    console.error('\nSome automated tests failed.');
    process.exit(1);
}

console.log('\nAll automated tests passed.');
process.exit(0);
