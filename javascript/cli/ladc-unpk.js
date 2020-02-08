#!/usr/bin/env node

const program = require('commander')

const path = require('path')
const {
  directoryExists,
  readFile,
  readdir,
  mkdir,
  copyFile,
  rm,
  lstat
} = require('./lib/utils')

// Optional source and destination folder names - relative path
program
  .option('-s, --source [folder]', 'Parent folder to unpack', '.')
  .option(
    '-d, --destination [folder]',
    'Directory to unpack folder into',
    'unpacked'
  )
  .parse(process.argv)

// Main function
const main = async () => {
  // Create source and destination paths based on current working directory and options
  const cwd = process.cwd()
  const { source, destination } = program
  const srcPath = path.join(cwd, source)
  const destPath = path.join(cwd, destination)

  try {
    // If destination exists overwrite it
    if (directoryExists(destPath)) {
      await rm(destPath)
    }

    // And make a new empty directory
    await mkdir(destPath)

    // Run recursive function and flatten up to 10 sub folders deep
    // TODO find depth using unpacker
    const files = (await unpacker(srcPath)).flat(10)

    for (let file of files) {
      await copyFile(file, path.join(destPath, path.basename(file)))
    }
  } catch (error) {
    console.log(error)
  }
}

main()

const unpacker = async src => {
  const files = []
  const stat1 = await lstat(src)
  if (stat1.isDirectory()) {
    const objects = await readdir(src)
    for (let object of objects) {
      const stat2 = await lstat(path.join(src, object))
      if (stat2.isDirectory()) {
        files.push(await unpacker(path.join(src, object)))
      } else {
        files.push(path.join(src, object))
      }
    }
    return files
  }
}
