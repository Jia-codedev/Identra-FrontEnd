// Simple startup script to help debug IIS issues
console.log('=== IIS Node.js Startup Debug ===');
console.log('Node.js version:', process.version);
console.log('Current working directory:', process.cwd());
console.log('Script location:', __filename);
console.log('PORT environment variable:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Available files in current directory:');

try {
  const fs = require('fs');
  const files = fs.readdirSync(process.cwd());
  files.forEach(file => console.log('  -', file));
} catch (error) {
  console.error('Error reading directory:', error.message);
}

console.log('=== Starting main application ===');

// Load the main application
try {
  require('./dist/index.js');
} catch (error) {
  console.error('Error starting application:', error);
  console.error('Stack:', error.stack);
}