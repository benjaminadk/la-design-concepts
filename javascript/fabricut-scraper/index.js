const axios = require("axios")
const data = require("./data")
const fs = require("fs")

const baseUrl = "https://api.fabricut.com/v1E/37c8273d772b480e9e1351d39d467743/product"

const writer = fs.createWriteStream("data2.csv")
writer.write("id,price\n")

async function main() {
  for (let d of data) {
    try {
      let res = await axios(`${baseUrl}/${d}`)
      let price = res?.data?.base_pricing?.usd?.per_unit?.single || ""
      // let roll_size = res?.data?.wallcovering_data?.average_bolt || ''
      writer.write(`${d},${price}\n`)
    } catch (error) {
      console.log("Error")
    }
  }
}

main()
