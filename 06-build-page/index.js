const fs = require('fs');
const path = require('path');
const pathToDistDir = path.join(__dirname, 'project-dist');
const pathToStylesDir = path.join(__dirname, 'styles');
const pathToComponentsDir = path.join(__dirname, 'components');
const pathToAssetsDir = path.join(__dirname, 'assets');

const copyAssets = () => {
  const newPathToAssets = path.join(pathToDistDir, 'assets');
  fs.mkdir(newPathToAssets, { recursive: true }, (err) => {
    if (!err) {
      fs.readdir(pathToAssetsDir, (err, files) => {
        files.forEach((file) => {
          const pathToOriginFile = path.join(pathToAssetsDir, file);
          const pathToCopiedFile = path.join(newPathToAssets, file);
          fs.cp(
            pathToOriginFile,
            pathToCopiedFile,
            { recursive: true },
            () => {},
          );
        });
      });
    }
  });
};

const mergeStyles = () => {
  fs.readdir(pathToStylesDir, (_, files) => {
    const output = fs.createWriteStream(path.join(pathToDistDir, 'style.css'));
    files.forEach((file) => {
      const pathToFile = path.join(pathToStylesDir, file);
      fs.stat(pathToFile, (_, stats) => {
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
};

const handleTemplate = () => {
  let templateData = '';
  let headerData = '';
  let articlesData = '';
  let footerData = '';
  let aboutData = '';
  const template = new fs.ReadStream(path.join(__dirname, 'template.html'));
  template.on('data', (chunk) => (templateData += chunk));
  template.on('end', () => {
    const header = new fs.ReadStream(
      path.join(pathToComponentsDir, 'header.html'),
    );
    header.on('data', (chunk) => (headerData += chunk));
    header.on('end', () => {
      const articles = new fs.ReadStream(
        path.join(pathToComponentsDir, 'articles.html'),
      );
      articles.on('data', (chunk) => (articlesData += chunk));
      articles.on('end', () => {
        const footer = new fs.ReadStream(
          path.join(pathToComponentsDir, 'footer.html'),
        );
        footer.on('data', (chunk) => (footerData += chunk));
        footer.on('end', () => {
          templateData = templateData.replace('{{header}}', headerData);
          templateData = templateData.replace('{{articles}}', articlesData);
          templateData = templateData.replace('{{footer}}', footerData);

          const writeToFile = () => {
            const output = fs.createWriteStream(
              path.join(pathToDistDir, 'index.html'),
            );
            output.write(templateData);
          };

          fs.stat(path.join(pathToComponentsDir, 'about.html'), (err) => {
            if (!err && templateData.includes('{{about}}')) {
              const about = new fs.ReadStream(
                path.join(pathToComponentsDir, 'about.html'),
              );
              about.on('data', (chunk) => (aboutData += chunk));
              about.on('end', () => {
                templateData = templateData.replace('{{about}}', aboutData);
                writeToFile();
              });
            } else writeToFile();
          });
        });
      });
    });
  });
};

fs.rm(pathToDistDir, { recursive: true }, () => {
  fs.mkdir(pathToDistDir, { recursive: true }, () => {
    copyAssets();
    mergeStyles();
    handleTemplate();
  });
});
