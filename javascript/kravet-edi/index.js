require('dotenv').config()
const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default
const moment = require('moment')
const formatXML = require('xml-formatter')
const { writeFileSync, createWriteStream } = require('fs')
const { getShortDate, getUnit, BRANDS } = require('./utils')
const ORDERS = require('./ORDERS')

const writer = createWriteStream(
  `ORDER_ISSUES-${moment().format('YYYY-MM-DD')}.log`
)

// Establish WooCommerce REST API connection
const WooCommerce = new WooCommerceRestApi({
  url: 'https://ladesignconcepts.com',
  consumerKey: process.env.WOOCOMMERCE_KEY,
  consumerSecret: process.env.WOOCOMMERCE_SECRET,
  version: 'wc/v3',
})

// Define constants
const KRAVET_ACCOUNT_NUMBER = process.env.KRAVET_ACCOUNT_NUMBER
const TODAYS_DATE = getShortDate()
const CONTACT_NAME = 'DIANNE'
const CONTACT_PHONE = '15624395626'
const CONTACT_EMAIL = 'dianne@ladesignconcepts.com'
const CARD_TYPE = 'VISA'
const MASKED_CC_NUMBER = process.env.MASKED_CC_NUMBER

async function main() {
  try {
    // Fetch orders for a given time period
    const res1 = await WooCommerce.get(`orders`, {
      per_page: 100,
      include: ORDERS,
    })

    const toProcess = []

    // Loop over orders
    for (let order of res1.data) {
      let products = []

      // Loop over line items
      for (let item of order.line_items) {
        // Only process products that are formatted correctly
        if (item.name !== 'Sample') {
          const res2 = await WooCommerce.get(`products`, {
            sku: item.sku,
          })

          if (res2.data.length) {
            let pn_attr = res2.data[0].attributes.find(
              (attribute) => attribute.name === 'pattern_number'
            )
            let pn_unit = res2.data[0].attributes.find(
              (attribute) => attribute.name === 'per_unit'
            )
            let number = pn_attr ? pn_attr['options'][0].toUpperCase() : ''
            let unit = pn_unit
              ? getUnit(pn_unit['options'][0].toUpperCase())
              : ''

            products.push({
              sku: item.sku,
              quantity: item.quantity,
              number,
              unit,
            })
          } else {
            write.write(`${order.id} - Cannot find ${item.sku}\n`)
          }
        }
      }

      // Check for missing pattern numbers
      let errors = products.filter((sample) => !sample.number)
      if (errors.length > 0) {
        console.log(`Issues Detected for order ${order.id}`)
      }

      // Combine products with order number and shipping info
      if (products.length > 0) {
        const { address_1, address_2 } = order.shipping
        const re = /^\s*((#\d+)|((box|bin)[\s\-\.]?\d+)|(.*p[\s\.]?\s?(o|0)[\s\-\.]?\s*-?((box|bin)|b|(#|num)?\d+))|(p(ost)?\s*(o(ff(ice)?)?)?\s*((box|bin)|b)?\s*\d+)|(p\s*-?\/?(o)?\s*-?box)|post office box|((box|bin)|b)\s*(number|num|#)?\s*\d+|(num|number|#)\s*\d+)/gim
        if (re.test(address_1) || re.test(address_2)) {
          write.write(`${order.id} - Address us P.O. BOX\n`)
        } else {
          let obj = {
            PO: order.id,
            shipping: order.shipping,
            products,
          }
          toProcess.push(obj)
        }
      }
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
                    <HDR_SHIP_ADDRESS1>L.A. DESIGN CONCEPTS C/O ${ADDRESS_1}</HDR_SHIP_ADDRESS1>
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
                    <CARD_TYPE>${CARD_TYPE}</CARD_TYPE>
                    <MASKED_CC_NUMBER>${MASKED_CC_NUMBER}</MASKED_CC_NUMBER>
                    <LIST_G_LINES>
                      ${tp.products
                        .map((product, i) => {
                          return `<G_LINES>
                                    <LINE_CUSTOMER_PO>${
                                      tp.PO
                                    }</LINE_CUSTOMER_PO>
                                    <PO_LINE_NUMBER>${i + 1}</PO_LINE_NUMBER>
                                    <ORDERED_ITEM>${
                                      product.number
                                    }.0</ORDERED_ITEM>
                                    <ORDER_QUANTITY_UOM>${
                                      product.unit
                                    }</ORDER_QUANTITY_UOM>
                                    <ORDERED_QUANTITY>${
                                      product.quantity
                                    }</ORDERED_QUANTITY>
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
      `LADC_TEST-${moment().format('YYYY-MM-DD')}.xml`,
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
