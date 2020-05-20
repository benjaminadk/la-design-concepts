const names = [
  "Aerin Fabric",
  "Alexa Hampton Fabric",
  "Barbara Barry Fabric",
  "Barclay Butera Fabric",
  "Barry Dixon Fabric",
  "Bunny Williams Fabric",
  "Candice Oslon Fabric",
  "Celerie Kemble Fabric",
  "Charlotte Moss Fabric",
  "Dana Gibson Fabric",
  "David Easton Fabric",
  "David Hicks Fabric",
  "Dianne Von Furstenberg Fabric",
  "Echo Design Fabric",
  "Hunt Slonem Fabric",
  "James Huniford Fabric",
  "Jan Showers Fabric",
  "Jeffrey Alan Marks Fabric",
  "Johnson Hartig Fabric",
  "Jonathan Adler Fabric",
  "Kate Spade Fabric",
  "Kelly Wearstler Fabric",
  "Kendall Wilkinson Fabric",
  "Lilly Pulitzer Fabric",
  "Linherr Hollingsworth Fabric",
  "Martyn Lawrence Bullard Fabric",
  "Mary Mcdonald Fabric",
  "Michael Berman Fabric",
  "Miles Redd Fabric",
  "Nate Berkus Fabric",
  "Oscar De Le Renta Fabric",
  "Sarah Richardson Fabric",
  "Thom Filicia Fabric",
  "Timothy Corrigan Fabric",
  "Trina Turk Fabric",
  "Vern Yip Fabric",
  "Windsor Smith Fabric",
  "Aerin Wallpaper",
  "Candice Olson Wallpaper",
  "Celerie Kemble Wallpaper",
  "Dana Gibson Wallpaper",
  "David Hicks Wallpaper",
  "Echo Design Wallpaper",
  "Fornasetti Wallpaper",
  "Hunt Slonem Wallpaper",
  "Jan Showers Wallpaper",
  "Johnson Hartig Wallpaper",
  "Kate Spade Wallpaper",
  "Kelly Wearstler Wallpaper",
  "Lilly Pulitzer Wallpaper",
  "Linherr Hollingsworth Wallpaper",
  "Martyn Lawrence Bullard Wallpaper",
  "Mary Mcdonald Wallpaper",
  "Miles Redd Wallpaper",
  "Sarah Richardson Wallpaper",
]

const queries = names.map((name) =>
  name
    .toLowerCase()
    .replace("&", "and")
    .replace("@", "")
    .replace(".", "")
    .split(" ")
    .join("+")
)

module.exports = names.map((name, i) => ({ name, q: queries[i] }))
