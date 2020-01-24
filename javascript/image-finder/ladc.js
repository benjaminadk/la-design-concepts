#!/usr/bin/env node

const program = require('commander')

program
  .version('1.0.0')
  .description('LA Design Concepts Command Line Tool')
  .command('find', 'Find image files in a directory and create copies in new directory')
  .command('image', 'Resize and optimize a directory of images')
  .parse(process.argv)
