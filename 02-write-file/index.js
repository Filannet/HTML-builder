const fs = require('fs');
const readline = require('readline');
const pathToFile = `${__dirname}/text.txt`;
const output = fs.createWriteStream(pathToFile);

let rl = readline.createInterface(process.stdin, process.stdout);
rl.setPrompt('Greetings! Please, write your text\n');
rl.prompt();

rl.on('line', (line) => {
  if (line === 'exit') {
    exit();
  } else {
    output.write(line + '\n');
  }
});

rl.on('SIGINT', () => {
  exit();
});

const exit = () => {
  rl.write('Good bye!');
  process.exit(0);
};
