#!/usr/bin/env node

require('dotenv-safe').config()
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
  // .help(customHelp)
  .parse(process.argv)
