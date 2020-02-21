#!/usr/bin/env node

const program = require("commander")

const path = require("path")
const {
  directoryExists,
  readFile,
  readdir,
  mkdir,
  copyFile,
  rm
} = require("./lib/utils")

program
  .option(
    "-j, --json [filename]",
    "JSON file listing desired image filenames",
    "images.json"
  )
  .option(
    "-s, --source [folder]",
    "Directory containing original images",
    "images"
  )
  .option(
    "-d, --destination [folder]",
    "Directory to save image copies in",
    "new-images"
  )
  .parse(process.argv)

const main = async () => {
  const cwd = process.cwd()
  const { json, source, destination } = program
  const jsonPath = path.join(cwd, json)
  const srcPath = path.join(cwd, source)
  const destPath = path.join(cwd, destination)

  if (directoryExists(destPath)) {
    await rm(destPath)
  }

  await mkdir(destPath)

  const imagesAll = await readdir(srcPath)
  const imagesNeeded = JSON.parse(await readFile(jsonPath)).map(x => x.image)

  for (let image of imagesNeeded) {
    if (imagesAll.indexOf(image) >= 0) {
      const src = path.join(srcPath, image)
      const dest = path.join(destPath, image)
      console.log(`Copying image to: ${dest}`)
      await copyFile(src, dest)
    }
  }
}

main()
