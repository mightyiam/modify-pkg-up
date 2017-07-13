const { test } = require('ava')
const { spy } = require('simple-spy')
const mock = require('mock-require')

const readPkgUp = {}
readPkgUp.resolved = { path: Symbol('path'), pkg: { existing: Symbol('existing') } }
readPkgUp.returnVal = Promise.resolve(readPkgUp.resolved)

const writePkg = {}
writePkg.resolved = Symbol('writePkg.resolved')
writePkg.returnVal = Promise.resolve(writePkg.resolved)

test.beforeEach((t) => {
  t.context.readPkgUpSpy = spy(options => readPkgUp.returnVal)
  mock('read-pkg-up', t.context.readPkgUpSpy)
  t.context.writePkgSpy = spy((path, data) => writePkg.returnVal)
  mock('write-pkg', t.context.writePkgSpy)

  const subjectPath = '.'
  t.context.subject = mock.reRequire(subjectPath)
})

const added = Symbol('pkg.added')

const syncModifierFn = pkg => {
  pkg.added = added
  return pkg
}
const asyncModifierFn = pkg => {
  pkg.added = added
  return Promise.resolve(pkg)
}

test('exports a function of arity 1', t => {
  const subject = t.context.subject
  t.is(typeof subject, 'function')
  t.is(subject.length, 1)
})

test('calls `readPkgUp` once with one arg', async t => {
  const subject = t.context.subject
  const readPkgUpSpy = t.context.readPkgUpSpy
  await subject(syncModifierFn)
  t.is(readPkgUpSpy.args.length, 1)
  t.is(readPkgUpSpy.args[0].length, 1)
})

test('`readPkgUp` call arg is `{ normalize: false }`', async t => {
  const subject = t.context.subject
  const readPkgUpSpy = t.context.readPkgUpSpy
  await subject(syncModifierFn)
  t.deepEqual(readPkgUpSpy.args[0][0], { normalize: false })
})

test('calls `writePkg` once', async t => {
  const subject = t.context.subject
  const writePkgSpy = t.context.writePkgSpy
  await subject(syncModifierFn)
  t.is(writePkgSpy.args.length, 1)
})

test('`writePkg` call 1st arg is `path` of `readPkgUp`’s return value resolved', async t => {
  const subject = t.context.subject
  const writePkgSpy = t.context.writePkgSpy
  await subject(syncModifierFn)
  t.is(writePkgSpy.args[0][0], readPkgUp.resolved.path)
})

test('`writePkg` call 2nd arg is `pkg` of `readPkgUp`’s return value resolved', async t => {
  const subject = t.context.subject
  const writePkgSpy = t.context.writePkgSpy
  await subject(syncModifierFn)
  t.is(writePkgSpy.args[0][1], readPkgUp.resolved.pkg)
})

test('`writePkg` call 2nd arg includes modification', async t => {
  const subject = t.context.subject
  const writePkgSpy = t.context.writePkgSpy
  await subject(syncModifierFn)
  t.is(writePkgSpy.args[0][1].added, added)
})

test('throws when 1st argument is not a function', t => {
  const subject = t.context.subject
  t.throws(() => subject('foo'))
})

test('modifier function can return promise', async t => {
  const subject = t.context.subject
  const writePkgSpy = t.context.writePkgSpy
  await subject(asyncModifierFn)
  t.is(writePkgSpy.args[0][1].added, added)
})
