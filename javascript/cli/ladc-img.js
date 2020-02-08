#!/usr/bin/env node

const program = require('commander')
const jimp = require('jimp')

const path = require('path')
const { directoryExists, readdir, mkdir, rm } = require('./lib/utils')

// Create subcommand with options
program
  .option('-t, --type [string]', 'Type of image resizing', 'compress')
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

// Creates standard 800x800 jpeg image
const compress = async (src, dest) => {
  const image = await jimp.read(src)
  await image.resize(800, 800, jimp.RESIZE_BICUBIC)
  image.quality(40)
  await image.writeAsync(dest)
}

// Creates thumbnail 250X190 jpeg image
const thumbnail = async (src, dest) => {
  const image = await jimp.read(src)
  await image.resize(225, 190, jimp.RESIZE_BICUBIC)
  image.quality(40)
  await image.writeAsync(dest)
}

// Main logic
const main = async () => {
  try {
    // Use current working dir vs __dirname where this code lives
    const cwd = process.cwd()

    // Use user input or default options
    const { type, source, destination } = program
    const srcPath = path.join(cwd, source)
    const destPath = path.join(cwd, destination)

    // Exit is type is not supported
    if (['compress', 'thumbnail'].indexOf(type) === -1) {
      return
    }

    // Remove destination directory is it exists
    if (directoryExists(destPath)) {
      await rm(destPath)
    }

    // Create destination directory
    await mkdir(destPath)

    // Read source directory
    const imagesAll = await readdir(srcPath)

    // Create new images
    if (type === 'compress') {
      for (let image of imagesAll) {
        const src = path.join(srcPath, image)
        const dest = path.join(destPath, image)
        compress(src, dest)
      }
    } else if (type === 'thumbnail') {
      for (let image of imagesAll) {
        const src = path.join(srcPath, image)
        const dest = path.join(destPath, image)
        thumbnail(src, dest)
      }
    }
  } catch (error) {
    console.log('Error')
  }
}

main()
