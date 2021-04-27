const Axios = require('axios')
const qs = require('qs')
const parseString = require('xml2js').parseString
const { promisify } = require('util')

const parseXML = promisify(parseString)
const URL = 'http://www.e-designtrade.com/api/stock_check.asp'

async function getProductStatus(
  pattern = '',
  color = '',
  identifier = '0',
  quantity = 1
) {
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
      DATA: { INVENTORY_STATUS, ITEM_STATUS, IN_PRODUCTION },
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

function getShortDate() {
  let monthNames = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ]

  let today = new Date(Date.now())
  let day = today.getDate()

  let monthIndex = today.getMonth()
  let monthName = monthNames[monthIndex]

  let year = today.getFullYear()

  return `${day}-${monthName}-${year}`
}

function getUnit(raw) {
  if (raw.includes('ROLL')) {
    return 'RL'
  } else if (raw.includes('YARD')) {
    return 'YD'
  } else {
    return 'EA'
  }
}

const BRANDS = [
  'Andrew Martin',
  'Baker Lifestyle',
  'Brunschwig',
  'Clarke',
  'Cole',
  'Gaston',
  'GP',
  'Groundworks',
  'Kravet',
  'Laura Ashley',
  'Lee Jofa',
  'Mulberry',
  'Parkertex',
  'Threads',
  'Winfield',
]

module.exports = { getProductStatus, getShortDate, getUnit, BRANDS }
