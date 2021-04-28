require('dotenv').config()
const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default
const formatXML = require('xml-formatter')
const { writeFileSync, createWriteStream } = require('fs')
const { getShortDate, BRANDS } = require('./utils')
const { getData } = require('./getData')

// Establish WooCommerce REST API connection
const WooCommerce = new WooCommerceRestApi({
  url: 'https://ladesignconcepts.com',
  consumerKey: process.env.WOOCOMMERCE_KEY,
  consumerSecret: process.env.WOOCOMMERCE_SECRET,
  version: 'wc/v3',
})

// Define constants
const BEFORE = process.env.BEFORE
const AFTER = process.env.AFTER
const KRAVET_ACCOUNT_NUMBER = process.env.KRAVET_ACCOUNT_NUMBER
const TODAYS_DATE = getShortDate()
const CONTACT_NAME = 'CHRIS'
const CONTACT_PHONE = '15624395626'

async function main() {
  try {
    // Fetch Kravet data from FTP
    const PRODUCTS = await getData()

    // Fetch orders for a given time period
    const res1 = await WooCommerce.get(`orders`, {
      per_page: 100,
      before: BEFORE,
      after: AFTER,
    })

    const toProcess = []
    const notAvailable = []

    // Loop over orders
    for (let order of res1.data) {
      let samples = []

      // Don't process failed of cancelled orders
      if (!['failed', 'cancelled'].includes(order.status)) {
        // Loop over line items
        for (let item of order.line_items) {
          // Only process samples that are formatted correctly
          if (
            item.name === 'Sample' &&
            item.meta_data[0].hasOwnProperty('key') &&
            item.meta_data[0]['key'] === 'Name'
          ) {
            let name = item.meta_data.find((el) => el.key === 'Name')['value']
            let sku = item.meta_data.find((el) => el.key === 'SKU')['value']

            // Match sample to one of Kravet's brands
            for (let brand of BRANDS) {
              if (name.startsWith(brand)) {
                const res2 = await WooCommerce.get(`products`, {
                  sku,
                })

                if (res2.data.length) {
                  let pn_attr = res2.data[0].attributes.find(
                    (attribute) => attribute.name === 'pattern_number'
                  )
                  let number1 = pn_attr
                    ? pn_attr['options'][0].toUpperCase()
                    : ''
                  let number2 = number1 ? number1 + '.0' : ''

                  if (number2) {
                    let product = PRODUCTS.find((el) => el['Item'] === number2)

                    if (product) {
                      let memoAvailable = product['Memo Sample Available']
                      if (memoAvailable.trim().toUpperCase() === 'YES') {
                        samples.push({ name, sku, number: number1 })
                        break
                      } else {
                        notAvailable.push({
                          order: order.id,
                          name,
                          sku,
                          reason: 'Sample Not Available',
                        })
                        break
                      }
                    } else {
                      notAvailable.push({
                        order: order.id,
                        name,
                        sku,
                        reason: 'Discontinued',
                      })
                      break
                    }
                  } else {
                    notAvailable.push({
                      order: order.id,
                      name,
                      sku,
                      reason: 'No Pattern Number',
                    })
                    break
                  }
                } else {
                  notAvailable.push({
                    order: order.id,
                    name,
                    sku,
                    reason: 'SKU Not Found',
                  })
                }
              }
            }
          }
        }
      }

      // Combine samples with order number and shipping info
      if (samples.length > 0) {
        const { address_1, address_2 } = order.shipping
        const re = /^\s*((#\d+)|((box|bin)[\s\-\.]?\d+)|(.*p[\s\.]?\s?(o|0)[\s\-\.]?\s*-?((box|bin)|b|(#|num)?\d+))|(p(ost)?\s*(o(ff(ice)?)?)?\s*((box|bin)|b)?\s*\d+)|(p\s*-?\/?(o)?\s*-?box)|post office box|((box|bin)|b)\s*(number|num|#)?\s*\d+|(num|number|#)\s*\d+)/gim
        if (re.test(address_1) || re.test(address_2)) {
          notAvailable.push({
            order: order.id,
            name: '',
            sku: '',
            reason: 'P.O. Box Not Allowed',
          })
        } else {
          let obj = {
            PO: order.id,
            shipping: order.shipping,
            samples,
          }
          toProcess.push(obj)
        }
      }
    }

    const writer = createWriteStream(
      `./orders/sample/LADC_SAMPLES_ISSUES-${AFTER.slice(0, 10)}.csv`
    )
    writer.write(`ORDER,SKU,PATTERN,REASON\n`)

    for (let item of notAvailable) {
      writer.write(
        `"${item.order}","${item.sku}","${item.name}","${item.reason}"\n`
      )
    }

    let xml = `
    <KFI_ORDER_LINE_XML>
      <LIST_G_HDR>
        ${toProcess
          .map((tp) => {
            const {
              company,
              first_name,
              last_name,
              address_1,
              address_2,
              city,
              state,
              postcode,
            } = tp.shipping
            const ADDRESS_1 = (first_name
              ? first_name + ' ' + last_name
              : company
            ).toUpperCase()
            const ADDRESS_2 = (address_2
              ? address_1 + ' ' + address_2
              : address_1
            ).toUpperCase()
            const CITY = city.toUpperCase()
            const STATE = state.toUpperCase()
            const ZIP = postcode
            return `<G_HDR>
                    <HDR_CUSTOMER_PO>${tp.PO}</HDR_CUSTOMER_PO>
                    <CREATION_DATE>${TODAYS_DATE}</CREATION_DATE>
                    <ACCOUNT_NUMBER>${KRAVET_ACCOUNT_NUMBER}</ACCOUNT_NUMBER>
                    <CONTACT_NAME>${CONTACT_NAME}</CONTACT_NAME>
                    <CONT_PHONE_NUMBER>${CONTACT_PHONE}</CONT_PHONE_NUMBER>
                    <HDR_SHIP_ADDRESS1>${ADDRESS_1}</HDR_SHIP_ADDRESS1>
                    <HDR_SHIP_ADDRESS2>${ADDRESS_2}</HDR_SHIP_ADDRESS2>
                    <HDR_SHIP_CITY>${CITY}</HDR_SHIP_CITY>
                    <HDR_SHIP_STATE>${STATE}</HDR_SHIP_STATE>
                    <HDR_SHIP_COUNTY/>
                    <HDR_SHIP_ZIP>${ZIP}</HDR_SHIP_ZIP>
                    <HDR_SHIP_COUNTRY>US</HDR_SHIP_COUNTRY>
                    <HDR_SHIP_METHOD/>
                    <HDR_SHIP_INSTRUCTIONS/>
                    <HDR_PACK_INSTRUCTIONS/>
                    <ACK_EMAIL_ADDRESS/>
                    <CARD_TYPE/>
                    <MASKED_CC_NUMBER/>
                    <LIST_G_LINES>
                      ${tp.samples
                        .map((sample, i) => {
                          return `<G_LINES>
                                    <LINE_CUSTOMER_PO>${
                                      tp.PO
                                    }</LINE_CUSTOMER_PO>
                                    <PO_LINE_NUMBER>${i + 1}</PO_LINE_NUMBER>
                                    <ORDERED_ITEM>${
                                      sample.number
                                    }.M</ORDERED_ITEM>
                                    <ORDER_QUANTITY_UOM>EA</ORDER_QUANTITY_UOM>
                                    <ORDERED_QUANTITY>1</ORDERED_QUANTITY>
                                    <LINE_SHIP_ADDRESS1/>
                                    <LINE_SHIP_ADDRESS2/>
                                    <LINE_SHIP_CITY/>
                                    <LINE_SHIP_STATE/>
                                    <LINE_SHIP_COUNTY/>
                                    <LINE_SHIP_ZIP/>
                                    <LINE_SHIP_COUNTRY/>
                                    <LINE_SHIP_METHOD/>
                                    <LINE_SHIP_INSTRUCTIONS/>
                                    <LINE_PACK_INSTRUCTIONS/>                          
                                </G_LINES>`
                        })
                        .join('')}
                    </LIST_G_LINES>
                  </G_HDR>`
          })
          .join('')}
      </LIST_G_HDR>
    </KFI_ORDER_LINE_XML>
    `

    writeFileSync(
      `./orders/sample/LADC_SAMPLES_TEST-${AFTER.slice(0, 10)}.xml`,
      formatXML(xml, {
        indentation: '\t',
        lineSeparator: '\n',
        collapseContent: true,
        whiteSpaceAtEndOfSelfclosingTag: false,
        stripComments: true,
      })
    )
  } catch (error) {
    console.log(error)
  }
}

main()
