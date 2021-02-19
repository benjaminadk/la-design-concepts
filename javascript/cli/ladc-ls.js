#!/usr/bin/env node

const program = require("commander")
const { exec } = require("child_process")

program.parse(process.argv)

const main = async () => {
  try {
    exec("ls -1 >> alist.txt")
  } catch (error) {
    console.log(error)
  }
}

main()
