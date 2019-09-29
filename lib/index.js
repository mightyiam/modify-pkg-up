const read = require('read-pkg-up')
const write = require('write-pkg')

const modifyPkgUp = (modifier) => {
  if (typeof modifier !== 'function') {
    throw new TypeError('expected a function')
  }
  return read({ normalize: false }).then(({ path, packageJson }) => {
    return Promise.resolve(modifier(packageJson))
      .then(modified => write(path, modified))
  })
}

module.exports = modifyPkgUp
