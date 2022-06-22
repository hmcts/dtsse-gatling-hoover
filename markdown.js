
const getAdditionsOrRemovals = (diff, title) => {
  if (diff.length === 0) {
    return '';
  }

  const keys = Object.keys(diff[0] || []);
  const rows = diff.map(row => '|' + Object.values(row).join('|')).join('|\n');

  return `
#### ${diff.length} ${title}
|${keys.join('|')}|
|${keys.map(() => '---').join('|')}|
${rows}|
`;
};

const getChanges = diff => {
  if (diff.length === 0) {
    return '';
  }

  const keys = Object.keys(diff[0]?.oldValue || []);
  const rows = diff.map(row => keys.map(key => {
    const content = row.oldValue[key] === row.newValue[key]
      ? row.oldValue[key]
      : '```diff \n-' + row.oldValue[key] + ' \n+' + row.newValue[key] + '\n```';

    return `<td>\n\n${content}\n\n</td>`;
  }).join(''));

  return `
#### ${diff.length} changed
<table>
<thead>
  <tr>
    ${keys.map(key => `<th>${key}</th>`).join('')}
  </tr>
</thead>
${rows.map(row => `<tr>${row}</tr>`).join('')}
</table>
`;
};

const generateFileReport = ({ file, additions, removals, changes }) => {
  if (additions.length + removals.length + changes.length === 0) {
    return '';
  }
  return `
### ${file}
${getAdditionsOrRemovals(additions, 'added')}
${getAdditionsOrRemovals(removals, 'removed')}
${getChanges(changes)}`;
};

module.exports = { generateFileReport };
