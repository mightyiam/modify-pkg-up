const read = require('read-pkg-up')
const write = require('write-pkg')

const modifyPkgUp = (modifier) => {
  if (typeof modifier !== 'function') {
    throw new TypeError('expected a function')
  }
  return read({ normalize: false }).then(({ path, pkg }) => {
    return Promise.resolve(modifier(pkg))
      .then(modified => write(path, modified))
  })
}

module.exports = modifyPkgUp
