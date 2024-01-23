const fs = require('fs');
const path = require('path');
const pathToDir = path.join(__dirname, 'styles');

fs.readdir(pathToDir, (err, files) => {
  const output = fs.createWriteStream(
    path.join(__dirname, 'project-dist', 'bundle.css'),
  );

  files.forEach((file) => {
    const pathToFile = path.join(pathToDir, file);
    fs.stat(pathToFile, (err, stats) => {
      if (!stats.isDirectory()) {
        const [, ext] = file.split('.');
        if (ext === 'css') {
          const readStream = fs.createReadStream(pathToFile, 'utf-8');
          readStream.on('data', (chunk) => {
            output.write(chunk);
          });
        }
      }
    });
  });
});
