#!/usr/bin/env node

const program = require('commander')

const path = require('path')
const { directoryExists, readFile, readdir, mkdir, copyFile, rm, lstat } = require('./lib/utils')

program
  .option('-s, --source [folder]', 'Parent folder to unpack', '.')
  .option('-d, --destination [folder]', 'Directory to unpack folder into', 'unpacked')
  .parse(process.argv)

const main = async () => {
    const cwd = process.cwd()
    const { source, destination } = program
    const srcPath = path.join(cwd, source)
    const destPath = path.join(cwd, destination)

    if (directoryExists(destPath)) {
        await rm(destPath)
      }
    
    await mkdir(destPath)

    const objects = await readdir(srcPath)
    
    for(let object of objects) {
        if((await lstat(object)).isDirectory()) {
            const files = await readdir(object)
            for(let file of files) {
                copyFile(path.join(destPath,file))
            }
        }
        else {
            copyFile(path.join(destPath,file))
        }
    }
}

main()