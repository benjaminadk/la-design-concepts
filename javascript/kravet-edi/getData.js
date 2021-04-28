var Client = require('ftp')
const unzipper = require('unzipper')
const csv = require('csv-parser')
const fs = require('fs')
const moment = require('moment')

async function refreshData() {
  return new Promise((resolve, reject) => {
    var c = new Client()
    const results = []

    c.on('error', (err) => reject(err))

    c.on('ready', function () {
      c.get('ladesign.zip', function (err, stream) {
        try {
          if (err) throw err
          stream.once('close', function () {
            c.end()
          })
          stream.pipe(unzipper.Extract({ path: process.env.OUTPUT_DIR }))
        } catch (error) {
          reject(error)
        }
      })
    })

    c.on('end', function () {
      fs.createReadStream(process.env.OUTPUT_PATH)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
          resolve(results)
        })
    })

    c.connect({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASS,
      debug: console.log.bind(console),
    })
  })
}

async function fetchData() {
  return new Promise((resolve, reject) => {
    try {
      const results = []
      fs.createReadStream(process.env.OUTPUT_PATH)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
          resolve(results)
        })
    } catch (error) {
      reject(error)
    }
  })
}

async function getData() {
  if (
    (moment().hour() === 1 && moment().minute() < 6) ||
    !fs.existsSync(process.env.OUTPUT_PATH)
  ) {
    console.log('fetching data...')
    return await refreshData()
  } else {
    console.log('fetching data...')
    return await fetchData()
  }
}

module.exports = { getData }
