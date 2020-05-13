#!/usr/bin/env node

const path = require("path")

require("dotenv-safe").config({
  path: path.join(__dirname, ".env"),
  example: path.join(__dirname, ".env.example")
})

const program = require("commander")

const { customHelp } = require("./lib/help")

program
  .version("1.0.0")
  .name("ladc")
  .usage("<subcommand> [options]")
  .description("A collection of filesystem and image manipulation tools")
  .command(
    "fbj",
    "Find By JSON - copies files from a source directory into a destination directory based on a JSON list."
  )
  .command(
    "img",
    "Batch manipulate a source directory of images into a destination directory. Compressed 800x800 JPEG or 250x190 thumbnail."
  )
  .command(
    "ss",
    "Screenshot all LADC Brand Pages on desktop, mobile or tablet and save images to directory."
  )
  .command(
    "sscoll",
    "Screenshot all LADC Collection Pages on desktop, mobile or tablet and save images to directory."
  )
  .command("seo", "Test SEO Google Search position for LADC brand keywords")
  .command(
    "unpk",
    "Unpack nested folder structure contents into one directory."
  )
  .command(
    "ff",
    "Format image filenames to remove whitespace and replace unwanted characters."
  )
  .command(
    "dli",
    "Download images and save to destination directory based on text file of urls"
  )
  .command("smap", "Create sitemaps based on a JavaScript array of urls")
  // .help(customHelp)
  .parse(process.argv)
