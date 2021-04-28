const { google } = require('googleapis')
const moment = require('moment')
const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default
const { createWriteStream } = require('fs')
const { promisify } = require('util')
const { getData } = require('./getData')

// WooCommerce REST API config
const API = new WooCommerceRestApi({
  url: 'https://ladesignconcepts.com',
  consumerKey: process.env.WOOCOMMERCE_KEY,
  consumerSecret: process.env.WOOCOMMERCE_SECRET,
  version: 'wc/v3',
})

const logger = createWriteStream(process.env.LOG_PATH)

function log(msg) {
  logger.write(`[${moment().format('M/D/YYYY hh:mm A')}] ${msg}`)
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

module.exports = async (auth) => {
  try {
    const sheets = google.sheets({ version: 'v4', auth })
    const getSheet = promisify(sheets.spreadsheets.values.get).bind(sheets)
    const updateSheet = promisify(sheets.spreadsheets.values.update).bind(
      sheets
    )
    const batchUpdateSheet = promisify(sheets.spreadsheets.batchUpdate).bind(
      sheets
    )
    const spreadsheetId = process.env.GOOGLE_SHEET_ID
    const month = moment().format('MMMM')
    const totalColumns = process.env.TOTAL_COLUMNS

    // Fetch Kravet data from FTP
    const PRODUCTS = await getData()

    // Fetch current sheet order id column
    const res1 = await getSheet({
      spreadsheetId,
      range: `${month}!C2:C1000`,
    })

    const rows = res1.data.values

    // If sheet is blank use env var as fallback
    const lastOrder = rows ? rows[30] : process.env.LAST_ORDER

    // First blank row
    const rowIndex = rows ? rows.length + 2 : 2

    // Fetch last order currently in sheet
    // Use sheets created date as after param for next fetch
    const res2 = await API.get(`orders/${lastOrder}`)
    const after = res2.data.date_created

    // Fetch latest orders
    // Use descending order and omit failed and cancelled orders
    const res3 = await API.get(`orders`, {
      per_page: 100,
      order: 'desc',
      status: ['completed', 'pending', 'processing', 'on-hold', 'tbq'],
      after,
    })

    // Array of new orders to send to sheet
    const toProcess = []

    // Loop over latest orders
    for (let order of res3.data) {
      if (order.total !== '0.00') {
        let line_items = order.line_items
        let item_data = []
        let keep = false
        let custom = ''

        // Loop over line items
        for (let item of line_items) {
          // Only keep non sample line items
          if (item.name !== 'Sample') {
            keep = true

            // Fetch line item to get brand name
            const res4 = await API.get(`products/${item.product_id}`)

            var brand = ''
            var cfa = ''
            var quantityOnHand = ''

            // If no brand attribute is set item is custom
            try {
              brand = res4.data.attributes
                .find((el) => el.name === 'brand')
                ['options'][0].replace('&amp;', 'and')

              let pn_attr = res4.data.attributes.find(
                (el) => el.name === 'pattern_number'
              )
              let number = pn_attr
                ? pn_attr['options'][0].toUpperCase() + '.0'
                : ''

              if (number) {
                let product = PRODUCTS.find((el) => el['Item'] === number)

                if (product) {
                  quantityOnHand = product['Qty On Hand']
                }
              }

              // CFA is line item meta data
              let cfaObj = item.meta_data.find(
                (el) => el.key === 'Cutting for Approval (CFA)'
              )
              cfa = cfaObj && cfaObj.value === 'Yes' ? 'Yes' : ''
            } catch (error) {
              // Store if needed at some point
              custom = 'Yes'

              // Attempt to get brand from first meta data entry
              // Relies on salesperson's manual input in WP Dashboard
              try {
                brand = item.meta_data[0]['display_key'].replace('&amp;', 'and')
              } catch (error) {
                // If anything goes wrong skip
                // Salesperson might not have completed writing order
                keep = false
                log('custom product meta data error')
              }
            }

            // Allow multiple brands when custom orders multiple products
            if (brand.includes('Delivery')) {
            } else {
              item_data.push({
                cfa,
                custom,
                brand,
                quantity: item.quantity,
                quantityOnHand,
                total: item.total,
              })
            }
          }
        }

        // Add keepers to the processing array
        // Use order id to create hyperlink to WP Dashboard
        // Format date and time with moment
        if (keep) {
          for (let item of item_data) {
            toProcess.push([
              moment(order.date_created).format('M/D/YYYY'),
              moment(order.date_created).format('hh:mm A'),
              `=hyperlink("https://ladesignconcepts.com/wp-admin/post.php?post=${order.id}&action=edit","${order.id}")`,
              toTitleCase(
                order?.shipping?.last_name ||
                  order?.billing?.last_name ||
                  order?.shipping?.company
              ),
              item.brand,
              item.total,
              item.quantity,
              item.quantityOnHand,
              item.cfa,
            ])
          }
        }
      }
    }

    if (toProcess.length) {
      // Add new rows to bottom of sheet
      const res5 = await updateSheet({
        spreadsheetId,
        range: `${month}!A${rowIndex}:I1000`,
        valueInputOption: 'USER_ENTERED',
        resource: { values: toProcess },
      })

      // Sort sheet by order number and delete any duplicate order ids
      const res6 = await batchUpdateSheet({
        spreadsheetId,
        resource: {
          requests: [
            {
              sortRange: {
                range: {
                  sheetId: 0,
                  startRowIndex: 1,
                  endRowIndex: 1000,
                  startColumnIndex: 0,
                  endColumnIndex: totalColumns,
                },
                sortSpecs: [
                  {
                    sortOrder: 'DESCENDING',
                    dimensionIndex: 2,
                  },
                ],
              },
            },
            {
              deleteDuplicates: {
                range: {
                  sheetId: 0,
                  startRowIndex: 1,
                  endRowIndex:
                    (rows ? rows.length : 0) + res5.data.updatedRows + 1,
                  startColumnIndex: 0,
                  endColumnIndex: totalColumns,
                },
                comparisonColumns: [
                  {
                    sheetId: 0,
                    dimension: 'COLUMNS',
                    startIndex: 0,
                    // endIndex: totalColumns,
                    endIndex: 10,
                  },
                ],
              },
            },
          ],
        },
      })

      log(`added ${res5.data.updatedRows} rows`)
    }
  } catch (error) {
    console.log(error)
  }
}
