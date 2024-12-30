#!/usr/bin/env node
const { Command } = require('commander');
const axios = require('axios');

const program = new Command();

// Base URL for the REST API
const BASE_URL = 'http://localhost:9115/api';

// Helper function to handle API requests (updated for POST requests)
async function makeRequest(method, endpoint, params = {}, data = {}) {
  try {
    const config = {
      method,
      url: `${BASE_URL}/${endpoint}`,
      params: params,
      data: data,
    };
    const response = await axios(config);
    console.log(JSON.stringify(response.data, null, 2)); // Pretty print JSON
  } catch (error) {
    if (error.response) {
      console.error('Error:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Healthcheck command
program
  .command('healthcheck')
  .description('Check the health of the system')
  .action(() => {
    makeRequest('get', 'admin/healthcheck');
  });

// Reset stations command
program
  .command('resetstations')
  .description('Reset the toll stations data')
  .action(async () => {
    await makeRequest('post', 'admin/resetstations');
  });

// Reset passes command
program
  .command('resetpasses')
  .description('Reset the passes data')
  .action(async () => {
    await makeRequest('post', 'admin/resetpasses');
  });

// Get toll station passes command
program
  .command('getTollStationPasses <stationID> <date_from> <date_to>')
  .description('Get passes for a specific toll station')
  .option('--format <format>', 'Output format (json or csv)', 'json')
  .action((stationID, date_from, date_to, options) => {
    makeRequest(
      'get',
      `tollStationPasses/${stationID}/${date_from}/${date_to}`,
      { format: options.format }
    );
  });
// Pass analysis command
program
  .command('passAnalysis <stationOpID> <tagOpID> <date_from> <date_to>')
  .description('Analyze passes between two operators')
  .option('--format <format>', 'Output format (json or csv)', 'json')
  .action((stationOpID, tagOpID, date_from, date_to, options) => {
    makeRequest(
      'get',
      `passAnalysis/${stationOpID}/${tagOpID}/${date_from}/${date_to}`,
      { format: options.format }
    );
  });
// Passes cost command
program
  .command('passesCost <tollOpID> <tagOpID> <date_from> <date_to>')
  .description('Get the cost of passes between two operators')
  .option('--format <format>', 'Output format (json or csv)', 'json')
  .action((tollOpID, tagOpID, date_from, date_to, options) => {
    makeRequest(
      'get',
      `passesCost/${tollOpID}/${tagOpID}/${date_from}/${date_to}`,
      { format: options.format }
    );
  });
// Charges by command
program
  .command('chargesBy <tollOpID> <date_from> <date_to>')
  .description('Get charges by a specific operator')
  .option('--format <format>', 'Output format (json or csv)', 'json')
  .action((tollOpID, date_from, date_to, options) => {
    makeRequest(
      'get',
      `chargesBy/${tollOpID}/${date_from}/${date_to}`,
      { format: options.format }
    );
  });

// Parse command-line arguments
program.parse(process.argv);
