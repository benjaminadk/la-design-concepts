#!/usr/bin/env node

const program = require('commander')

const path = require('path')
const { directoryExists, readdir, rename } = require('./lib/utils')

program.parse(process.argv)

const main = async () => {
    try {
        const files = await readdir(process.cwd())

        for (let file of files) {
            const oldPath = path.join(process.cwd(), file)

            const newFile = file.slice(0, file.length - 4).replace(/\s/g, "").replace(/\./g, "!") + ".jpg"

            const newPath = path.join(process.cwd(), newFile)

            await rename(oldPath, newPath)
        }

    } catch (error) {
        console.log(error)
    }
}

main()