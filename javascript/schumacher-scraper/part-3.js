const fs = require('fs')
const { promisify } = require('util')

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

const cleanup = async () => {
  const raw = await readFile('data-2.json')
  const data = JSON.parse(raw)

  const clean = []

  for (let d of data) {
    var arr1 = d.secret.split(/(.*[a-z])(?=[A-Z])/)
    arr1.shift()
    var cutSoldBy = arr1[1]
    var arr2 = arr1[0].split(/(.*[a-z])(?=[A-Z])/)
    arr2.shift()
    var cost = arr2[0]
    var pricedBy = arr2[1]
    clean.push({ ...d, cost, cutSoldBy, pricedBy })
  }

  await writeFile('data-3.json', JSON.stringify(clean))
}

cleanup()
