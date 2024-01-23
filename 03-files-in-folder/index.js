const fs = require('fs');
const path = require('path');
const pathToDir = path.join(__dirname, 'secret-folder');

fs.readdir(pathToDir, (err, files) => {
  files.forEach((file) => {
    const pathToFile = path.join(pathToDir, file);
    fs.stat(pathToFile, (err, stats) => {
      if (!stats.isDirectory()) {
        const [name, ext] = file.split('.');
        console.log(`${name} - ${ext} - ${stats.size} bytes`);
      }
    });
  });
});
