const data = require('./data')

const temp = {}

async function main() {
  for (let [i, x] of data.slice(1, 20).entries()) {
    const { id, name } = x
    if (temp[name]) {
      temp[name].push(id)
    } else {
      temp[name] = [id]
    }
  }

  const upsells = data.slice(1, 20).map((x) => {
    const upsell_ids = temp[x.name]
      ? temp[x.name].filter((y) => y !== x.id)
      : []
    return { id: x.id, upsell_ids }
  })

  // send upsells to woo
}

main()
