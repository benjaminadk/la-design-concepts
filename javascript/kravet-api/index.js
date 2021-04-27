require('dotenv').config()
const Axios = require('axios')
const qs = require('qs')
const parseString = require('xml2js').parseString
const { promisify } = require('util')

const parseXML = promisify(parseString)
const URL = 'http://www.e-designtrade.com/api/stock_check.asp'

async function main(pattern = '', color = '', identifier = '0', quantity = 1) {
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

    const {
      DATA: { TRANSATION_STATUS, INVENTORY_STATUS, ITEM_STATUS, IN_PRODUCTION },
    } = await parseXML(res.data)

    const payload = {
      status:
        INVENTORY_STATUS[0] === 'Y'
          ? 'In Stock'
          : INVENTORY_STATUS[0] === 'N'
          ? 'Out of Stock'
          : 'Multiple Pieces',
      display: ITEM_STATUS[0],
      productionQuantity: IN_PRODUCTION[0].PRODUCTION_QUANTITY[0],
      deliveryDate: IN_PRODUCTION[0].DELIVERY_DATE[0],
    }

    console.log(payload)
  } catch (error) {
    console.log(error)
  }
}

main()
