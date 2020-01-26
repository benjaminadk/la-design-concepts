#!/usr/bin/env node

const program = require('commander')
const jimp = require('jimp')

const path = require('path')
const { directoryExists, readdir, mkdir, rm } = require('./lib/utils')

// Define `ladc image` subcommand
program
  .option('-t, --type', 'Type of image resizing', 'compress')
  .option(
    '-s, --source [folder]',
    'Directory containing original images',
    'images'
  )
  .option(
    '-d, --destination [folder]',
    'Directory to save new images in',
    'new-images'
  )
  .parse(process.argv)

// Resize image and save as JPG
// 800x800 with Bicubic Interpolation
// JPG quality of 40
const compress = async (src, dest) => {
  const image = await jimp.read(src)
  await image.resize(800, 800, jimp.RESIZE_BICUBIC)
  image.quality(40)
  await image.writeAsync(dest)
}

// Main process - response to command
const main = async () => {
  const cwd = process.cwd()
  const { source, destination } = program
  const srcPath = path.join(cwd, source)
  const destPath = path.join(cwd, destination)

  if (directoryExists(destPath)) {
    await rm(destPath)
  }

  await mkdir(destPath)

  const imagesAll = await readdir(srcPath)

  if (program.type === 'compress') {
    for (let image of imagesAll) {
      const src = path.join(srcPath, image)
      const dest = path.join(destPath, image)
      compress(src, dest)
    }
  }
}

main()
