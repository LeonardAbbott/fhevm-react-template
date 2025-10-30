#!/usr/bin/env node

/**
 * Setup Verification Script
 * Checks that the FHEVM SDK project is properly configured
 */

const fs = require('fs');
const path = require('path');

const REQUIRED_FILES = [
  'README.md',
  'QUICKSTART.md',
  'DEPLOYMENT.md',
  'package.json',
  'hardhat.config.js',
  'demo.mp4',
  'packages/fhevm-sdk/package.json',
  'packages/fhevm-sdk/README.md',
  'packages/fhevm-sdk/src/index.ts',
  'packages/fhevm-sdk/src/core/FhevmClient.ts',
  'packages/fhevm-sdk/src/react/FhevmProvider.tsx',
  'examples/nextjs/package.json',
  'examples/nextjs/README.md',
  'examples/react/package.json',
  'examples/nodejs/package.json',
  'contracts/PrivateVoting.sol',
  'scripts/deploy.js',
];

const REQUIRED_DIRS = [
  'packages',
  'packages/fhevm-sdk',
  'packages/fhevm-sdk/src',
  'examples',
  'examples/nextjs',
  'examples/react',
  'examples/nodejs',
  'contracts',
  'scripts',
];

console.log('🔍 Verifying FHEVM SDK Project Setup\n');

let hasErrors = false;

// Check directories
console.log('📁 Checking directories...');
REQUIRED_DIRS.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (fs.existsSync(dirPath)) {
    console.log(`  ✅ ${dir}`);
  } else {
    console.log(`  ❌ ${dir} - MISSING`);
    hasErrors = true;
  }
});

console.log('\n📄 Checking required files...');
REQUIRED_FILES.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - MISSING`);
    hasErrors = true;
  }
});

// Check package.json contents
console.log('\n📦 Checking package.json configurations...');

try {
  const rootPkg = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8')
  );

  if (rootPkg.workspaces) {
    console.log('  ✅ Workspaces configured');
  } else {
    console.log('  ⚠️  Workspaces not configured');
  }

  const sdkPkg = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'packages/fhevm-sdk/package.json'), 'utf8')
  );

  if (sdkPkg.name === 'fhevm-sdk') {
    console.log('  ✅ SDK package name correct');
  } else {
    console.log('  ❌ SDK package name incorrect');
    hasErrors = true;
  }

  if (sdkPkg.dependencies && sdkPkg.dependencies.fhevmjs) {
    console.log('  ✅ fhevmjs dependency present');
  } else {
    console.log('  ❌ fhevmjs dependency missing');
    hasErrors = true;
  }
} catch (error) {
  console.log('  ❌ Error reading package.json:', error.message);
  hasErrors = true;
}

// Check for sensitive content
console.log('\n🔒 Checking for sensitive patterns...');

function checkFileContent(filePath, pattern, description) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (pattern.test(content)) {
      console.log(`  ⚠️  ${description} found in ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

const readmeContent = fs.readFileSync(path.join(__dirname, 'README.md'), 'utf8');
if (readmeContent.includes('template-specific-id') || readmeContent.includes('placeholder-org')) {
  console.log('  ⚠️  Project-specific names found in README');
  hasErrors = true;
} else {
  console.log('  ✅ No project-specific names in README');
}

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ Setup verification FAILED');
  console.log('Please fix the issues above before proceeding.');
  process.exit(1);
} else {
  console.log('✅ Setup verification PASSED');
  console.log('Your FHEVM SDK project is properly configured!');
  console.log('\nNext steps:');
  console.log('  1. npm install');
  console.log('  2. npm run build:sdk');
  console.log('  3. npm run compile');
  console.log('  4. npm run deploy:localhost');
  console.log('  5. npm run dev:nextjs');
}
console.log('='.repeat(50));
