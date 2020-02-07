#!/usr/bin/env node

const path = require('path')

require('dotenv-safe').config({
  path: path.join(__dirname, '.env'),
  example: path.join(__dirname, '.env.example')
})

const program = require('commander')

const { customHelp } = require('./lib/help')

program
  .version('1.0.0')
  .name('ladc')
  .usage('<subcommand> [options]')
  .description('A collection of filesystem and image manipulation tools')
  .command(
    'find',
    'Find image files in a directory and create copies in new directory'
  )
  .command('image', 'Resize and optimize a directory of images')
  .command('test', 'Test Brand Page mobile appearance with Puppeteer')
  .command('seo', 'Test SEO Google Search position for brand keywords')
  .command('unpack', 'Unpack nested folder contents into one folder.')
  .command('ff', 'Format image filenames to remove whitespace and replace unwanted characters.')
  // .help(customHelp)
  .parse(process.argv)
