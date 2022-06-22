
const blacklistedKeys = ['LiveFrom', 'SecurityClassification', 'CaseTypeID'];

const removeBlacklistedKeys = field => {
  return Object.fromEntries(
    Object.entries(field).filter(([key]) => !blacklistedKeys.includes(key))
  );
};

const ensureKeys = keys => row =>
  keys.reduce((row, key) => ({ [key]: '', ...row }), row);

const groupBy = (values, getId) => values.reduce((result, value) => {
  result[getId(value)] = value;

  return result;
}, {});

const hasFieldChanged = (obj1, obj2) => Object
  .keys(obj1)
  .some(key => obj1[key] !== obj2[key]);

const getDiff = ([filename, masterDef, branchDef, getFieldId]) => {
  const masterWithoutBlacklistedKeys = masterDef.map(removeBlacklistedKeys);
  const branchWithoutBlacklistedKeys = branchDef.map(removeBlacklistedKeys);
  const masterKeys = masterWithoutBlacklistedKeys.reduce((keys, item) => ({ ...keys, ...item }), {});
  const masterAndBranchKeys = masterWithoutBlacklistedKeys.reduce((keys, item) => ({ ...keys, ...item }), masterKeys);
  const keys = Object.keys(masterAndBranchKeys);
  const masterWithConsistentKeys = masterWithoutBlacklistedKeys.map(ensureKeys(keys));
  const branchWithConsistentKeys = branchWithoutBlacklistedKeys.map(ensureKeys(keys));
  const masterFields = groupBy(masterWithConsistentKeys, getFieldId);
  const branchFields = groupBy(branchWithConsistentKeys, getFieldId);
  const masterFieldKeys = Object.keys(masterFields);
  const branchFieldKeys = Object.keys(branchFields);

  const additions = branchFieldKeys.filter(key => !masterFields[key]).map(key => branchFields[key]);
  const removals = masterFieldKeys.filter(key => !branchFields[key]).map(key => masterFields[key]);
  const changes = masterFieldKeys
    .filter(key => branchFields[key] && hasFieldChanged(masterFields[key], branchFields[key]))
    .map(key => ({ oldValue: masterFields[key], newValue: branchFields[key]}));

  return { file: filename, additions, removals, changes };
};

module.exports = { getDiff };
