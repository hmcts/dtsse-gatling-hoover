const { glob } = require('glob');
const { existsSync } = require('fs');

const [_, __, arg1, arg2] = process.argv;
const masterDir = process.cwd() + '/' + arg1 + '/';
const branchDir = process.cwd() + '/' + arg2 + '/';

const loadFile = path => existsSync(path) ? require(path) : [];

const getFilename = path => path.replace(masterDir, '').replace(branchDir, '');

const resolveFiles = ([file, getFieldId]) => {
  const masterFiles = glob.sync(masterDir + file);
  const branchFiles = glob.sync(branchDir + file);
  const branchOnlyFiles = branchFiles.filter(bf => !masterFiles.some(mf => getFilename(bf) === getFilename(mf)));
  const allFiles = [...masterFiles, ...branchOnlyFiles].map(getFilename);

  return allFiles
    .map(file => [file, loadFile(masterDir + file), loadFile(branchDir + file), getFieldId]);
};

module.exports = { resolveFiles };
