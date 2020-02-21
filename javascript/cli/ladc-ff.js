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

      const newFile =
        brand === "jf"
          ? file.replace("-400x400", "").replace("-01", "")
          : file
              .slice(0, file.length - 4)
              .replace(/\s/g, "")
              .replace(/\./g, "!") + ".jpg"

      const newPath = path.join(process.cwd(), newFile)

      await rename(oldPath, newPath)
    }
  } catch (error) {
    console.log(error)
  }
}

main()
