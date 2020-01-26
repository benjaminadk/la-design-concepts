#!/usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const figlet = require('figlet')

program
  .version('1.0.0')
  .name('ladc')
  .usage('<subcommand> [options]')
  .description('LA Design Concepts Command Line Tool')
  .command(
    'find',
    'Find image files in a directory and create copies in new directory'
  )
  .command('image', 'Resize and optimize a directory of images')
  .help(str => {
    const banner = chalk.keyword('orange')(
      figlet.textSync('LA Design Concepts', {
        font: 'Doom',
        horizontalLayout: 'default',
        verticalLayout: 'default'
      })
    )
    return `${banner}\n\n${str}`
  })

program.on('--help', function() {
  console.log('')
  console.log('Examples: ')
  console.log('  $ ladc find')
  console.log('  $ ladc image')
})

program.parse(process.argv)
