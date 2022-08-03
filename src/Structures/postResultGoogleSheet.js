const Config = require('../Config');
const { google } = require('googleapis');
const sheets = google.sheets({ version: 'v4' });
const spreadSheetId = Config.google.databaseKey;
const { googleAuthorize } = require('./Utils');

const clearData = async (sheetName, googleClient) => {
  const options = {
    spreadsheetId: spreadSheetId,
    range: `${sheetName}!A2:F1000`,
    auth: googleClient,
  };

  try {
    const response = await sheets.spreadsheets.values.clear(options);
    console.log({ response });
    return response;
  } catch (error) {
    console.error({ error });
    return error;
  }
};

const insertData = async (data, googleClient) => {
  const options = {
    spreadsheetId: spreadSheetId,
    resource: {
      data: data,
    },
    valueInputOption: 'USER_ENTERED',
    auth: googleClient,
  };

  try {
    const response = await sheets.spreadsheets.values.batchUpdate(options);
    console.log({ response });
    return response;
  } catch (error) {
    console.error({ error });
    return error;
  }
};

const changeCell = async (sheetId, requests, googleClient) => {
  const requestOptions = {
    spreadsheetId: spreadSheetId,
    resource: {
      requests: [
        {
          unmergeCells: {
            range: {
              sheetId: sheetId,
            },
          },
        },
        {
          repeatCell: {
            range: {
              sheetId: sheetId,
              startRowIndex: 1,
              endRowIndex: 1000,
              startColumnIndex: 0,
              endColumnIndex: 6,
            },
            cell: {
              userEnteredFormat: {
                backgroundColor: {
                  red: 1,
                  green: 1,
                  blue: 1,
                },
                textFormat: {
                  bold: false,
                },
              },
            },
            fields: 'userEnteredFormat(backgroundColor, textFormat)',
          },
        },
      ],
    },
    auth: googleClient,
  };
  requestOptions.resource.requests.push(...requests);
  try {
    const response = await sheets.spreadsheets.batchUpdate(requestOptions);
    console.log({ response });
    return response;
  } catch (error) {
    console.error(error);
  }
};

const postResultGoogleSheet = async (sheetId, sheetName, requests, data) => {
  const googleClient = await googleAuthorize();
  await clearData(sheetName, googleClient);
  await changeCell(sheetId, requests, googleClient);
  await insertData(data, googleClient);
  return true;
};

module.exports = postResultGoogleSheet;
