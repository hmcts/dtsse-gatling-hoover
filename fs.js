const { glob } = require('glob');

const getFilename = path => path.substring(path.lastIndexOf('/') + 1);

const resolveFiles = (masterDir, branchDir) => ([file, getFieldId]) => {
  const masterFiles = glob.sync(masterDir + file);
  const branchFiles = glob.sync(branchDir + file);

  return masterFiles.map(f => [f, branchFiles.find(bf => getFilename(bf) === getFilename(f)), getFieldId]);
};

module.exports = { getFilename, resolveFiles };
