#!/usr/bin/env node

const program = require("commander")

const path = require("path")
const { readdir, rename } = require("./lib/utils")

program
  .option(
    "-b, --brand [name]",
    "Type of filename formatting based on brand",
    "kravet"
  )
  .parse(process.argv)

const main = async () => {
  const { brand } = program

  try {
    const files = await readdir(process.cwd())

    for (let file of files) {
      const oldPath = path.join(process.cwd(), file)

      let newFile
      if(brand === 'jf') {
        newFile = file.replace("-400x400", "").replace("-01", "")
      } else if(brand === 'kravet') {
        newFile = file
        .slice(0, file.length - 4)
        .replace(/\s/g, "")
        .replace(/\./g, "!") + ".jpg"
      } else if(brand === 'rl') {
        let pieces = file.split(' ')
        newFile = pieces[pieces.length-1].replace('jpeg','jpg')
      } else if(brand === 'curated') {
        newFile = file.toLowerCase().replace('_1_1','_1')
      } else if(brand === 'scalamandre') {
        newFile = file.replace('_',"")
      } else if(brand === 'osborne-little') {
        newFile = file.slice(0,8) + '.jpg'
      } else if(brand === 'roomshot') {
        newFile = file.replace('.jpg', '_room.jpg')
      } else if(brand === 'roomshot-fix') {
        newFile = file.replace('_detail',"")
      } else if(brand === 'fabricut-furniture') {
        newFile = file.toLowerCase().replace(' &', "").replace(/\s/g,"-")
      } else if(brand === 'min') {
        newFile = file.replace('-min.jpg', '.jpg')
      }

      const newPath = path.join(process.cwd(), newFile)

      await rename(oldPath, newPath)
    }
  } catch (error) {
    console.log(error)
  }
}

main()
