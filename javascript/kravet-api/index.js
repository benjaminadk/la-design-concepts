require('dotenv').config()
const Axios = require('axios')
const qs = require('qs')
const parseString = require('xml2js').parseString
const { promisify } = require('util')

const parseXML = promisify(parseString)
const URL = 'http://www.e-designtrade.com/api/stock_check.asp'

async function main(pattern, color, identifier = '0', quantity = 1) {
  try {
    const query = qs.stringify({
      user: process.env.USER,
      password: process.env.PASS,
      pattern,
      color,
      identifier,
      quantity,
    })

    const res = await Axios({
      method: 'GET',
      url: `${URL}?${query}`,
    })

    const raw = await parseXML(res.data)

    console.log(raw)
  } catch (error) {
    console.log(error)
  }
}

main('2011102', '53')
