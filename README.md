[![Build Status](https://travis-ci.org/mightyiam/modify-pkg-up.svg?branch=master)](https://travis-ci.org/mightyiam/modify-pkg-up)
[![JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

# modify-pkg-up

Helps you modify the nearest `package.json`

## Why?

- [Reads closest `package.json`](https://www.npmjs.com/package/read-pkg-up)
  and [writes](https://www.npmjs.com/package/write-pkg) to it.

## How?

### Example

```js
const modifyPkgUp = require('modify-pkg-up')
modifyPkgUp((pkg) => {
  return Object.assign(pkg, {
    //
  })
}).then(() => console.log('done'))
```

### API

#### `modifyPkgUp(modifierFn)`

- `modifierFn`:
  A function that receives the current contents of `package.json`.
  It may return the new contents, or a promise for them.

Returns an empty promise.
