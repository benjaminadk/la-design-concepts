#!/usr/bin/env node

const program = require("commander")
const path = require("path")

const { readdir, unlink } = require("./lib/utils")

program.parse(process.argv)

const main = async () => {
  try {
    const files = await readdir(process.cwd())

    for (let file of files) {
      if(/-[0-9].jpg/.test(file)) {
        
      } else {
        console.log(file)
        await unlink(path.join(process.cwd(), file))
      }
    }
  } catch(error) {
    console.log(error)
  }
}

main()