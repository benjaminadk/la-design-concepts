const { google } = require('googleapis')
const { promisify } = require('util')

const spreadsheetId = process.env.GOOGLE_SHEET_ID

require('dotenv').config()
const fs = require('fs')
const { promisify } = require('util')
const readline = require('readline')
const { google } = require('googleapis')
const updateSheet = require('./updateSheet')

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
const CREDENTIALS_PATH = 'auth.json'
const TOKEN_PATH = 'token.json'

const readFile = promisify(fs.readFile)

async function main() {
  try {
    const content = await readFile(CREDENTIALS_PATH)
    authorize(JSON.parse(content), sort)
  } catch (error) {
    console.log(error)
  }
}

async function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  )
  try {
    const token = await readFile(TOKEN_PATH)
    oAuth2Client.setCredentials(JSON.parse(token))
    callback(oAuth2Client)
  } catch (error) {
    return getNewToken(oAuth2Client, callback)
  }
}

async function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  })
  console.log('Authorize this app by visiting this url:', authUrl)
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close()
    oAuth2Client.getToken(code, (err, token) => {
      if (err)
        return console.error('Error while trying to retrieve access token', err)
      oAuth2Client.setCredentials(token)
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err)
        console.log('Token stored to', TOKEN_PATH)
      })
      callback(oAuth2Client)
    })
  })
}

async function sort(auth) {
  const sheets = google.sheets({ version: 'v4', auth })
  const batchUpdateSheet = promisify(sheets.spreadsheets.batchUpdate).bind(
    sheets
  )

  const totalColumns = 12
  await batchUpdateSheet({
    spreadsheetId,
    resource: {
      requests: [
        {
          sortRange: {
            range: {
              sheetId: 0,
              startRowIndex: 1,
              endRowIndex: 1000,
              startColumnIndex: 0,
              endColumnIndex: totalColumns,
            },
            sortSpecs: [
              {
                sortOrder: 'DESCENDING',
                dimensionIndex: 3,
              },
            ],
          },
        },
      ],
    },
  })
}

main()
