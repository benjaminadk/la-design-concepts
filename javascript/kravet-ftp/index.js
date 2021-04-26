var Client = require('ftp')
const fs = require('fs')
const path = require('path')
const data = require('./images')

var c = new Client()

c.on('error', (err) => console.log(err))

c.on('ready', function () {
  for (let img of data) {
    c.get(img, function (err, stream) {
      try {
        if (err) throw err
        stream.pipe(fs.createWriteStream(`kravet-images/${path.basename(img)}`))
      } catch (error) {
        console.log(img)
      }
    })
  }
})

c.connect({
  host: 'ftp.kravet.com',
  user: 'ladesign',
  password: 'G0ld$Tar',
  debug: console.log.bind(console),
})
