#!/usr/bin/env node

const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data'); // Για την αποστολή αρχείων
const readline = require('readline');
const { program } = require('commander');

// Βασικό URL του API
const BASE_URL = 'http://localhost:9115/api';

// Helper function για αιτήματα HTTP
async function makeRequest(method, endpoint, data = {}, format = 'json') {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      // Αυτό μάλλον θα χρειαστεί στο μέλλον για επιβεβαίωση χρήστη
      // headers: { 'X-OBSERVATORY-AUTH': authToken }, // Add auth header if needed
      responseType: format === 'csv' ? 'text' : 'json' // Critical for CSV handling
    };

    if (method === 'post' && data instanceof FormData) {
      config.headers = data.getHeaders();
      config.data = data;
    } else if (method === 'post') {
      config.data = data;
    }

    const response = await axios(config);
    if (format === 'csv') {
      console.log(response.data);
    } else {
      console.log('Response:', JSON.stringify(response.data, null, 2));
    }
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

program
  .version('1.0.0')
  .name('se3403');

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

// Εντολή tollstationpasses
program
  .command('tollstationpasses')
  .description('Get passes data for a specific toll station and date range')
  .requiredOption('--station <station>', 'Toll Station ID')
  .requiredOption('--from <from>', 'Start date (YYYYMMDD)')
  .requiredOption('--to <to>', 'End date (YYYYMMDD)')
  .option('--format <format>', 'Output format (csv/json)', 'csv')
  .action(async (options) => {
    const endpoint = `/tollStationPasses/${options.station}/${options.from}/${options.to}`;
    const params = `?format=${options.format}`;
    await makeRequest('get', endpoint + params, {}, options.format);
  });

// Εντολή passanalysis
program
  .command('passanalysis')
  .description('Analyze passes between operators')
  .requiredOption('--station <station>', 'Station Operator ID')
  .requiredOption('--tagop <tagop>', 'Tag Operator ID')
  .requiredOption('--from <from>', 'Start date (YYYYMMDD)')
  .requiredOption('--to <to>', 'End date (YYYYMMDD)')
  .option('--format <format>', 'Output format (csv/json)', 'csv')
  .action(async (options) => {
    const endpoint = `/passAnalysis/${options.station}/${options.tagop}/${options.from}/${options.to}`;
    const params = `?format=${options.format}`;
    await makeRequest('get', endpoint + params, {}, options.format);
  });

// Εντολή passescost
program
  .command('passescost')
  .description('Calculate the cost of passes for a specific operator and date range')
  .requiredOption('--stationop <stationop>', 'Toll Operator ID')
  .requiredOption('--tagop <tagop>', 'Tag Operator ID')
  .requiredOption('--from <from>', 'Start date (YYYYMMDD)')
  .requiredOption('--to <to>', 'End date (YYYYMMDD)')
  .option('--format <format>', 'Output format (csv/json)', 'csv')
  .action(async (options) => {
    const endpoint = `/passesCost/${options.stationop}/${options.tagop}/${options.from}/${options.to}`;
    const params = `?format=${options.format}`;
    await makeRequest('get', endpoint + params, {}, options.format);
  });

// Εντολή chargesby
program
  .command('chargesby')
  .description('Get charges by a specific operator for a date range')
  .requiredOption('--opid <opid>', 'Toll Operator ID')
  .requiredOption('--from <from>', 'Start date (YYYYMMDD)')
  .requiredOption('--to <to>', 'End date (YYYYMMDD)')
  .option('--format <format>', 'Output format (csv/json)', 'csv')
  .action(async (options) => {
    const endpoint = `/chargesBy/${options.opid}/${options.from}/${options.to}`;
    const params = `?format=${options.format}`;
    await makeRequest('get', endpoint + params, {}, options.format);
  });


// Επεξεργασία των εντολών
program.parse(process.argv);
