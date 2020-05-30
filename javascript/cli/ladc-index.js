#!/usr/bin/env node

const program = require('commander')
const { google } = require('googleapis')
const request = require('request')

const path = require('path')
const { readFileSync } = require('./lib/utils')
const credentials = require('./credentials-ladc.json')

program
  .option(
    '-f, --filename [name]',
    'Name of the TXT file with list of URLs to crawler and index',
    'urls.txt'
  )
  .parse(process.argv)

const main = async () => {
  const { filename } = program

  const client = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ['https://www.googleapis.com/auth/indexing'],
    null
  )

  const urlsPath = path.join(process.cwd(), filename)

  const batch = readFileSync(urlsPath).toString().split('\n')

  client.authorize(function (err, tokens) {
    if (err) {
      console.log(err)
      return
    }

    const multipart = batch.map((line) => {
      return {
        'Content-Type': 'application/http',
        'Content-ID': '',
        body:
          'POST /v3/urlNotifications:publish HTTP/1.1\n' +
          'Content-Type: application/json\n\n' +
          JSON.stringify({
            url: line,
            type: 'URL_UPDATED',
          }),
      }
    })

    const options = {
      url: 'https://indexing.googleapis.com/batch',
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/mixed',
      },
      auth: { bearer: tokens.access_token },
      multipart,
    }

    request(options, function (error, response, body) {
      console.log('body', body)
      console.log('error', error)
    })
  })
}

main()
