const jimp = require('jimp')
const path = require('path')
const fs = require('fs')
const { promisify } = require('util')

const readdir = promisify(fs.readdir)

function abspath(rel) {
  return path.join(__dirname, rel)
}

async function resize(file) {
  const image = await jimp.read(abspath(`images-input/${file}`))
  await image.resize(800, 800, jimp.RESIZE_BICUBIC)
  image.quality(50)
  await image.writeAsync(abspath(`images-output/${file}`))
}

async function main() {
  const files = await readdir(abspath('images-input'))

  for (let file of files) {
    resize(file)
  }
}

main()
