#!/usr/bin/env node

const program = require('commander')

const path = require('path')
const { readdir, copyFile } = require('./lib/utils')
const renameMap = require('./rename')

program.option(
  '-d,--directory [name]',
  'Destination file where formatted redirects will be saved',
  'rename-this'
).parse(process.argv)

const main = async () => {
  const { directory } = program

  const dirPath = path.join(process.cwd(), 'rename', directory)
  const newPath = path.join(process.cwd(), 'rename', 'renamed')

  const files = await readdir(dirPath)

  for(let file of files) {
    let newName = renameMap[file]

    if(newName) {
      let srcPath = path.join(dirPath,file)
      let dstPath = path.join(newPath, newName)
  
      await copyFile(srcPath, dstPath)
    } else {
      console.log(`Could not match ${file}`)
    }
    
  }

  console.log('Files Renamed!')
}

main()