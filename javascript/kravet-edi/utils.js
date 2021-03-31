function getShortDate() {
  let monthNames = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ]

  let today = new Date(Date.now())
  let day = today.getDate()

  let monthIndex = today.getMonth()
  let monthName = monthNames[monthIndex]

  let year = today.getFullYear()

  return `${day}-${monthName}-${year}`
}

const BRANDS = [
  "Andrew Martin",
  "Baker Lifestyle",
  "Brunschwig",
  "Clarke",
  "Cole",
  "Gaston",
  "GP",
  "Groundworks",
  "Kravet",
  "Laura Ashley",
  "Lee Jofa",
  "Mulberry",
  "Parkertex",
  "Threads",
  "Winfield",
]

module.exports = { getShortDate, BRANDS }
