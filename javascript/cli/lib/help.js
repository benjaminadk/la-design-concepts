const chalk = require('chalk')
const figlet = require('figlet')

const banner = chalk.keyword('orange')(
  figlet.textSync('LA Design Concepts', {
    font: 'Doom',
    horizontalLayout: 'default',
    verticalLayout: 'default'
  })
)

const findOptions = `
  -j, --json [filename]       JSON file listing desired image filenames (default: "images.json")
  -s, --source [folder]       Directory containing original images (default: "images")
  -d, --destination [folder]  Directory to save image copies in (default: "new-images")
`

const imageOptions = `
  -t, --type                  Type of image resizing (default: "compress")
  -s, --source [folder]       Directory containing original images (default: "images")
  -d, --destination [folder]  Directory to save new images in (default: "new-images")
`

const customHelp = str => {
  const lines = str.split('\n')

  lines.splice(10, 0, findOptions)
  lines.splice(12, 0, imageOptions)

  return `${banner}\n\n${lines.join('\n')}`
}

module.exports = {
  customHelp
}
