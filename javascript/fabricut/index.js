const axios = require('axios')
const data = require('./data')
const fs = require('fs')

const baseUrl = 'https://api.fabricut.com/v1E/37c8273d772b480e9e1351d39d467743/product'

const writer = fs.createWriteStream("data.csv")
writer.write("id,roll_size\n")

async function main() {
  for(let d of data) {
    try {
      let res = await axios(`${baseUrl}/${d}`)
      let roll_size = res?.data?.wallcovering_data?.average_bolt || ''
      writer.write(`${d},${roll_size}\n`)
    } catch (error) {
      console.log('Error')
    }
   
  }
}

main()