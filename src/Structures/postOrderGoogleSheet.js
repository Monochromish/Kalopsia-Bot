const Config = require('../Config');
const { google } = require('googleapis');
const sheets = google.sheets({ version: 'v4' });
const spreadSheetId = Config.google.databaseKey;
const { googleAuthorize } = require('./Utils');

const addRow = async (range, data, googleClient) => {
  const request = {
    spreadsheetId: spreadSheetId,
    range: range,
    resource: {
      majorDimension: 'ROWS',
      values: [data],
    },
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    auth: googleClient,
  };
  try {
    const response = await sheets.spreadsheets.values.append(request);
    console.log({ response });
    return response;
  } catch (err) {
    console.error(err);
  }
};

const postOrderGoogleSheet = async (range, data) => {
  const googleClient = await googleAuthorize();
  await addRow(range, data, googleClient);
  return true;
};

module.exports = postOrderGoogleSheet;
