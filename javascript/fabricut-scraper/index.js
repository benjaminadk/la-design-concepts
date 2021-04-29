const axios = require('axios')
const data = require('./data')
const fs = require('fs')

const baseUrl = `https://api.fabricut.com/v1E/${process.env.AUTH_TOKEN}/product`

const writer = fs.createWriteStream('data.csv')
writer.write('id,price,roll_size\n')

async function main() {
  for (let d of data) {
    try {
      let res = await axios(`${baseUrl}/${d}`)
      let price = res?.data?.base_pricing?.usd?.per_unit?.single || ''
      let roll_size = res?.data?.wallcovering_data?.average_bolt || ''
      writer.write(`${d},${price},${roll_size}\n`)
    } catch (error) {
      console.log('Error')
    }
  }
}

main()
