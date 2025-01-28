#!/usr/bin/env node

const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data'); // Για την αποστολή αρχείων
const readline = require('readline');
const { program } = require('commander');

// Βασικό URL του API
const BASE_URL = 'http://localhost:9115/api';

// Helper function για αιτήματα HTTP
async function makeRequest(method, endpoint, data = {}) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
    };

    if (method === 'post' && data instanceof FormData) {
      config.headers = data.getHeaders();
      config.data = data;
    } else if (method === 'post') {
      config.data = data;
    }

    const response = await axios(config);
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    if (error.response) {
      console.error('API Error:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Request Failed:', error.message);
    }
    process.exit(1);
  }
}

// Helper function για επιβεβαίωση
async function confirmAction(message) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`${message} (yes/no): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes');
    });
  });
}

// Εντολή healthcheck
program
  .command('healthcheck')
  .description('Check the health of the API')
  .action(async () => {
    await makeRequest('get', '/admin/healthcheck');
  });

// Εντολή resetstations
program
  .command('resetstations')
  .description('Reset toll station data with a CSV file')
  .requiredOption('--file <file>', 'Path to the CSV file with station data')
  .option('--dry-run', 'Preview the action without executing it')
  .action(async (options) => {
    if (options.dryRun) {
      console.log(`This will reset toll station data using file: ${options.file}. No changes will be made.`);
      process.exit(0);
    }

    const confirmed = await confirmAction('Are you sure you want to reset all toll station data?');
    if (!confirmed) {
      console.log('Action cancelled.');
      process.exit(0);
    }

    try {
      const form = new FormData();
      form.append('file', fs.createReadStream(options.file));
      await makeRequest('post', '/admin/resetstations', form);
    } catch (error) {
      console.error('Failed to reset stations:', error.message);
      process.exit(1);
    }
  });

// Εντολή resetpasses
program
  .command('resetpasses')
  .description('Reset all pass data')
  .option('--dry-run', 'Preview the action without executing it')
  .action(async (options) => {
    if (options.dryRun) {
      console.log('This will reset all pass data. No changes will be made.');
      process.exit(0);
    }

    const confirmed = await confirmAction('Are you sure you want to reset all pass data?');
    if (!confirmed) {
      console.log('Action cancelled.');
      process.exit(0);
    }

    await makeRequest('post', '/admin/resetpasses');
  });

// Εντολή addpasses
program
  .command('addpasses')
  .description('Add pass data from a CSV file')
  .requiredOption('--file <file>', 'Path to the CSV file with pass data')
  .action(async (options) => {
    try {
      const form = new FormData();
      form.append('file', fs.createReadStream(options.file));
      await makeRequest('post', '/admin/addpasses', form);
    } catch (error) {
      console.error('Failed to add passes:', error.message);
      process.exit(1);
    }
  });

// Εντολή getpasses
program
  .command('getpasses')
  .description('Get passes data for a specific toll station and date range')
  .requiredOption('--tollID <tollID>', 'Toll Station ID')
  .requiredOption('--date_from <date_from>', 'Start date (YYYYMMDD)')
  .requiredOption('--date_to <date_to>', 'End date (YYYYMMDD)')
  .action(async (options) => {
    const endpoint = `/tollStationPasses/${options.tollID}/${options.date_from}/${options.date_to}`;
    await makeRequest('get', endpoint);
  });

// Εντολή passanalysis
program
  .command('passanalysis')
  .description('Analyze passes between operators')
  .requiredOption('--stationOpID <stationOpID>', 'Station Operator ID')
  .requiredOption('--tagOpID <tagOpID>', 'Tag Operator ID')
  .requiredOption('--date_from <date_from>', 'Start date (YYYYMMDD)')
  .requiredOption('--date_to <date_to>', 'End date (YYYYMMDD)')
  .action(async (options) => {
    const endpoint = `/passAnalysis/${options.stationOpID}/${options.tagOpID}/${options.date_from}/${options.date_to}`;
    await makeRequest('get', endpoint);
  });

// Εντολή passescost
program
  .command('passescost')
  .description('Calculate the cost of passes for a specific operator and date range')
  .requiredOption('--tollOpID <tollOpID>', 'Toll Operator ID')
  .requiredOption('--tagOpID <tagOpID>', 'Tag Operator ID')
  .requiredOption('--date_from <date_from>', 'Start date (YYYYMMDD)')
  .requiredOption('--date_to <date_to>', 'End date (YYYYMMDD)')
  .action(async (options) => {
    const endpoint = `/passesCost/${options.tollOpID}/${options.tagOpID}/${options.date_from}/${options.date_to}`;
    await makeRequest('get', endpoint);
  });

// Εντολή chargesby
program
  .command('chargesby')
  .description('Get charges by a specific operator for a date range')
  .requiredOption('--tollOpID <tollOpID>', 'Toll Operator ID')
  .requiredOption('--date_from <date_from>', 'Start date (YYYYMMDD)')
  .requiredOption('--date_to <date_to>', 'End date (YYYYMMDD)')
  .action(async (options) => {
    const endpoint = `/chargesBy/${options.tollOpID}/${options.date_from}/${options.date_to}`;
    await makeRequest('get', endpoint);
  });


// Επεξεργασία των εντολών
program.parse(process.argv);
