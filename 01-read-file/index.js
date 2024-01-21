const fs = require('fs');
const path = require('path');
const pathToFile = path.join(__dirname, 'text.txt');
const readStream = new fs.ReadStream(pathToFile);
let data = '';
readStream.on('data', (chunk) => (data += chunk));
readStream.on('end', () => console.log(data));
readStream.on('error', (error) => console.log(error.message));
