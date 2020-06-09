const names = [
  "Abstract Fabric",
  "Abstract Wallpaper",
  "Animal Fabric",
  "Animal Wallpaper",
  "Asian Fabric",
  "Asian Wallpaper",
  "Botanical Fabric",
  "Botanical Wallpaper",
  "Chenille Fabric",
  "Damask Fabric",
  "Damask Wallpaper",
  "Denim Fabric"
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
