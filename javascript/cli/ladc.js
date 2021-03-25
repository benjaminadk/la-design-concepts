#!/usr/bin/env node

const path = require("path")

require("dotenv-safe").config({
  path: path.join(__dirname, ".env"),
  example: path.join(__dirname, ".env.example"),
})

const program = require("commander")

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
    "Screenshot all LADC Shop Brand Pages on desktop, mobile or tablet and save images to directory. This currently includes all Shop By Collections pages as well."
  )
  .command(
    "sscoll",
    "Screenshot all LADC Collection Pages on desktop, mobile or tablet and save images to directory."
  )
  .command(
    "ssstyle",
    "Screenshot all LADC Styles Pages on desktop, mobile or tablet and save images to directory."
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
  .command(
    "index",
    "Bulk request Google to crawl and index a TXT file of URLs - API Limit: 100 per batch & 200 per day"
  )
  .command(
    "redirect",
    "Bulk map source url to new 301 redirect url in Nginx format"
  )
  .command("rename", "Bulk rename a directory of image files")
  .command("sitemap", "Submit sitemaps to Search Console")
  .command('fi','Filter schumacher images by filename')
  .command('fabricut', 'Request data spreadsheet from Fabricut API')
  .command('ls', 'Create TXT file listing directory contents')
  .command('samples', 'Process sample order and send emails to manufacturers')
  .parse(process.argv)
