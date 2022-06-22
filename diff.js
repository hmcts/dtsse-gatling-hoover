
const blacklistedKeys = ['LiveFrom', 'SecurityClassification', 'CaseTypeID'];

const removeBlacklistedKeys = field => {
  return Object.fromEntries(
    Object.entries(field).filter(([key]) => !blacklistedKeys.includes(key))
  );
};

const groupBy = (values, getId) => values.reduce((result, value) => {
  result[getId(value)] = value;

  return result;
}, {});

const hasFieldChanged = (obj1, obj2) => Object
  .keys(obj1)
  .some(key => obj1[key] !== obj2[key]);

const getDiff = ([filename, masterFile, branchFile, getFieldId]) => {
  const masterContent = masterFile.map(removeBlacklistedKeys);
  const branchContent = branchFile.map(removeBlacklistedKeys);
  const masterFields = groupBy(masterContent, getFieldId);
  const branchFields = groupBy(branchContent, getFieldId);
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
