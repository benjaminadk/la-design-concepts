const rimraf = require("rimraf")
const fs = require("fs")
const path = require("path")
const { promisify } = require("util")

const getCurrentDirectoryBase = () => {
  return path.basename(process.cwd())
}

const directoryExists = filepath => {
  return fs.existsSync(filepath)
}

const readFile = promisify(fs.readFile)
const readdir = promisify(fs.readdir)
const writeFile = promisify(fs.writeFile)
const mkdir = promisify(fs.mkdir)
const copyFile = promisify(fs.copyFile)
const rm = promisify(rimraf)
const lstat = promisify(fs.lstat)
const rename = promisify(fs.rename)
const createWriteStream = fs.createWriteStream

module.exports = {
  getCurrentDirectoryBase,
  directoryExists,
  readFile,
  readdir,
  writeFile,
  mkdir,
  copyFile,
  rm,
  lstat,
  rename,
  createWriteStream
}
