const rimraf = require('rimraf')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const getCurrentDirectoryBase = () => {
  return path.basename(process.cwd())
}

const directoryExists = filepath => {
  return fs.existsSync(filepath)
}

const readFile = promisify(fs.readFile)
const readdir = promisify(fs.readdir)
const mkdir = promisify(fs.mkdir)
const copyFile = promisify(fs.copyFile)
const rm = promisify(rimraf)

module.exports = {
  getCurrentDirectoryBase,
  directoryExists,
  readFile,
  readdir,
  mkdir,
  copyFile,
  rm
}
