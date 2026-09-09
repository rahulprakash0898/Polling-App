const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('📦 1. Building Frontend...');execSync('cd frontend && npm install --include=dev && npm run build', {
    stdio: 'inherit'
});
console.log('📦 2. Installing Backend dependencies...');
execSync('cd backend && npm install', { stdio: 'inherit' });

console.log('🚀 3. Preparing public assets for Vercel...');
const src = path.join(__dirname, 'frontend', 'dist');
const dest = path.join(__dirname, 'public');

if (fs.existsSync(dest)) {
  fs.rmSync(dest, { recursive: true, force: true });
}

fs.cpSync(src, dest, { recursive: true });
console.log('✅ Full-Stack Build Completed Successfully!');
