#!/usr/bin/env node

const program = require('commander')
const axios = require('axios')

const path = require('path')
const {
  directoryExists,
  readFile,
  mkdir,
  rm,
  createWriteStream,
} = require('./lib/utils')

program
  .option(
    '-t, --txt [filename]',
    'Text file listing desired image urls',
    'images.txt'
  )
  .option(
    '-d, --destination [folder]',
    'Directory to save image copies in',
    'images'
  )
  .parse(process.argv)

const main = async () => {
  try {
    const cwd = process.cwd()
    const { txt, destination } = program
    const txtPath = path.join(cwd, txt)
    const destPath = path.join(cwd, destination)

    if (directoryExists(destPath)) {
      await rm(destPath, { unlink: require('fs').unlink })
    }

    await mkdir(destPath)

    const textContent = await readFile(txtPath)
    const urls = textContent.toString().split('\r\n')

    for (let url of urls) {
      const imagePath = path.resolve(destPath, path.basename(url))
      const writer = createWriteStream(imagePath)

      const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
      })

      response.data.pipe(writer)
    }
  } catch (error) {}
}

main()
