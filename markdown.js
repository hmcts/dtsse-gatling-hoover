
const getCell = (value, prefix) =>
  '<td>\n\n```diff\n' + prefix + value + '\n```\n\n</td>';

const getRow = (row, prefix) =>
  Object
    .values(row)
    .map(value => getCell(value, prefix))
    .join('');

const getAdditionsOrRemovals = (diff, prefix) =>
  diff
    .map(row => getRow(row, prefix))
    .map(tableRow => `<tr>${tableRow}</tr>`)
    .join('');

const getChanges = diff => {
  const keys = Object.keys(diff[0]?.oldValue || []);
  const rows = diff.map(row => keys.map(key => {
    const content = row.oldValue[key] === row.newValue[key]
      ? row.oldValue[key]
      : '```diff \n-' + row.oldValue[key] + ' \n+' + row.newValue[key] + '\n```';

    return `<td>\n\n${content}\n\n</td>`;
  }).join(''));

  return rows.map(row => `<tr>${row}</tr>`).join('');
};

const generateFileReport = ({ file, additions, removals, changes }) => {
  const keys = Object.keys(additions[0] || removals[0] || changes[0].oldValue);

  return `
### ${file}
<table>
<thead>
  <tr>
    ${keys.map(key => `<th>${key}</th>`).join('')}
  </tr>
</thead>
${getAdditionsOrRemovals(additions, '+')}
${getAdditionsOrRemovals(removals, '-')}
${getChanges(changes)}
</table>
`;
};

module.exports = { generateFileReport };
