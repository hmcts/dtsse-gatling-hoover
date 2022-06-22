const { generateFileReport } = require('./markdown');
const { getDiff } = require('./diff');
const { resolveFiles } = require('./fs');

const [_, __, arg1, arg2] = process.argv;
const masterDir = __dirname + '/' + arg1 + '/';
const branchDir = __dirname + '/' + arg2 + '/';

const fileFieldId = {
  '**/AuthorisationCaseState.json': field => `${field.CaseStateID}:${field.UserRole}`,
  '**/AuthorisationCaseType.json': field => field.UserRole,
  '**/CaseField.json': field => field.ID,
  '**/CaseRoles.json': field => field.ID,
  '**/SearchInputFields.json': field => field.CaseFieldID,
  '**/SearchResultFields.json': field => field.CaseFieldID,
  'State.json': field => field.ID,
  'State/State.json': field => field.ID,
  '**/WorkBasketInputFields.json': field => field.CaseFieldID,
  '**/WorkBasketResultFields.json': field => field.CaseFieldID,
  '**/AuthorisationCaseEvent.json': field => `${field.CaseEventID}:${field.UserRole}`
};

const output = Object
  .entries(fileFieldId)
  .flatMap(resolveFiles(masterDir, branchDir))
  .map(getDiff)
  .map(generateFileReport)
  .join('');

console.log(output);

