#!/usr/bin/env node

const axios = require('axios');
const { program } = require('commander');

// Βασικό URL του API
const BASE_URL = 'http://localhost:9115/api';

// Helper function για αιτήματα HTTP
async function makeRequest(method, endpoint) {
  try {
    const response = await axios({
      method,
      url: `${BASE_URL}${endpoint}`,
    });
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
  .description('Reset toll station data')
  .requiredOption('--file <file>', 'Path to the CSV file with station data')
  .action(async (options) => {
    console.log('This functionality requires backend support for file uploads.');
    process.exit(1); // Προσωρινά χωρίς υλοποίηση
  });

// Εντολή resetpasses
program
  .command('resetpasses')
  .description('Reset pass data')
  .action(async () => {
    await makeRequest('post', '/admin/resetpasses');
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
