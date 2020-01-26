#!/usr/bin/env node

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
  .help(customHelp)
  .parse(process.argv)
