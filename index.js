#!/usr/bin/env node

const CosmosClient = require('@azure/cosmos').CosmosClient;
const { statSync, readdirSync, existsSync } = require('fs');

const client = new CosmosClient({ endpoint: 'https://pipeline-metrics.documents.azure.com:443/', key: process.env.COSMOS_KEY });
const database = client.database('jenkins');
const container = database.container('performance-metrics');
const baseDir = process.argv[2]
  ? process.argv[2].startsWith('/')
    ? process.argv[2]
    : `${process.cwd()}/${process.argv[2]}`
  : process.cwd();

const run = async () => {
  const dirName = baseDir.split('/').reverse().find(dir => dir !== '');
  const [product, ...rest] = dirName.split('-');
  const reportDirectory = getMostRecentReportDirectory(`${baseDir}/build/reports/gatling/`);
  const reportId = reportDirectory.split('/').reverse().find(dir => dir !== '');
  const stats = require(`${baseDir}/build/reports/gatling/${reportDirectory}/js/stats.json`);

  const response = await container.items.create({
    'product': product,
    'stage_timestamp': new Date().toISOString(),
    'node_name': '@hmcts/gatling-hoover',
    'build_tag': '',
    'component': rest.join('-'),
    'environment': 'perftest',
    'job_name': `hmcts/${dirName}/master`,
    'build_id': reportId,
    'branch_name': 'N/A',
    'build_number': reportId,
    'job_base_name': 'N/A',
    'build_display_name': 'N/A',
    'stats.json': stats
  });
  console.log('Upload successful: ' + response.resource.id);
};

const getMostRecentReportDirectory = reportDir => {
  return readdirSync(reportDir)
    .filter(dir => existsSync(`${reportDir}${dir}/js/stats.json`))
    .sort((a, b) => statSync(reportDir + b).ctime - statSync(reportDir + a).ctime)[0];
};

run().catch(err => console.error(err));
