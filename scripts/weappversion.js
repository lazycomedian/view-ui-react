const fs = require('fs');
const program = require('commander');

program.version('1.0.0').option('-R, --replace <string>', 'folder to replace').parse(process.argv);

const options = program.opts();

const r = options.replace;

if (!r) {
  // eslint-disable-next-line no-console
  console.log('need replace file');
  process.exit(1);
}
const arg = process.argv.splice(2);

const c = fs.readFileSync(r);
const json = JSON.parse(c);

if (arg[0] !== '--replace') {
  json.version = arg[0];
  fs.writeFileSync(r, JSON.stringify(json, null, 2));
} else {
  const versionParts = json.version.split('.').map(str => parseInt(str, 10));
  versionParts[versionParts.length - 1]++;
  json.version = versionParts.map(n => `${n}`).join('.');
  fs.writeFileSync(r, JSON.stringify(json, null, 2));
}
