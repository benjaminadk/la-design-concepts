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

    try {
        if (directoryExists(destPath)) {
            await rm(destPath)
          }
        
        await mkdir(destPath)
    
        const objects = await readdir(srcPath)
        
        for(let object of objects) {
            const stat = await lstat(object)
            if(stat.isDirectory()) {
                const files = await readdir(object)
                for(let file of files) {
                    await copyFile(path.join(srcPath,object,file),path.join(destPath,file))
                }
            } else {
                await copyFile(path.join(srcPath,object,file),path.join(destPath,file))
            }

        }
    } catch(error) {
        console.log(error)
    }

}

main()