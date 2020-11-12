#!/usr/bin/env node

const program = require("commander")
const axios = require('axios').default

const baseUrl = 'https://api.fabricut.com/v1E/37c8273d772b480e9e1351d39d467743/bulk-products/3037992/'

program
  .option(
    "-e, --email [address]",
    "Email address for spreadsheet recipient",
    "ben@ladesignconcepts.com"
  )
  .parse(process.argv)

  const main = async () => {
    const { email } = program

    try {
      const res = await axios({
        method: 'POST',
        url: `${baseUrl}${email}`  
      })
    
      if(res.status === 200) {
        console.log('Data sheet request received by Fabricut. Check your email.')
      }
    } catch(error) {
      console.log(error)
    }
}

main()