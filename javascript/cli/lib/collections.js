const names = ['Aerin Fabric', 'Aerin Wallpaper']

const queries = names.map((name) =>
  name
    .toLowerCase()
    .replace('&', 'and')
    .replace('@', '')
    .replace('.', '')
    .split(' ')
    .join('+')
)

module.exports = names.map((name, i) => ({ name, q: queries[i] }))
