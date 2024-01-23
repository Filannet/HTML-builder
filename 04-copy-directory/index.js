const fs = require('fs');
const path = require('path');
const pathToOriginDir = path.join(__dirname, 'files');
const pathToCopiedDir = path.join(__dirname, 'files-copy');

fs.mkdir(pathToCopiedDir, { recursive: true }, (err) => {
  if (err) console.log(err);
  else {
    fs.readdir(pathToCopiedDir, (err, files) => {
      files.forEach((file) => {
        fs.unlink(path.join(pathToCopiedDir, file), () => {});
      });

      fs.readdir(pathToOriginDir, (err, files) => {
        files.forEach((file) => {
          const pathToOriginFile = path.join(pathToOriginDir, file);
          const pathToCopiedFile = path.join(pathToCopiedDir, file);
          fs.copyFile(pathToOriginFile, pathToCopiedFile, (err) => {
            if (err) console.error(err);
          });
        });
      });
    });
  }
});
