const path = require('path')
const { requireDir } = require('../index')
const { scanDir } = require('../index')

describe('scan dir', () => {
  test('non recurse', () => {
    const services = scanDir('services', 'service.js')
    expect(services).toEqual([
      'a.service.js',
      'b.service.js',
    ].map(file => path.join(__dirname, 'services', file)))
  })
  test('recurse', () => {
    const services = scanDir('services', 'service.js', { recurse: true })
    expect(services).toEqual([
      'a.service.js',
      'b.service.js',
      'c/d.service.js',
      'c/e/f.service.js',
    ].map(file => path.join(__dirname, 'services', file)))
  })
})

describe('require dir', () => {
  test('non recurse', () => {
    const services = requireDir('services', 'service.js')
    expect(services).toEqual([
      'a.service.js',
      'b.service.js',
    ].reduce((obj, file) => {
      obj[file] = file
      return obj
    }, {}))
  })
  test('recurse', () => {
    const services = requireDir('services', 'service.js', { recurse: true })
    expect(services).toEqual([
      'a.service.js',
      'b.service.js',
      'c/d.service.js',
      'c/e/f.service.js',
    ].reduce((obj, file) => {
      const base = path.parse(file).base
      obj[base] = base
      return obj
    }, {}))
  })
  test('removeSuffixFromKey', () => {
    const services = requireDir('services', 'service.js', { recurse: false, removeSuffixFromKey: true })
    expect(services).toEqual({
      a: 'a.service.js',
      b: 'b.service.js'
    })
  })
  test('removeSuffixFromKey recurse', () => {
    const services = requireDir('services', 'service.js', { recurse: true, removeSuffixFromKey: true })
    expect(services).toEqual({
      a: 'a.service.js',
      b: 'b.service.js',
      d: 'd.service.js',
      f: 'f.service.js'
    })
  })
  test('keyCamelCase', () => {
    const services = requireDir('services', 'service.js', { recurse: false, keyCamelCase: true })
    expect(services).toEqual({
      aServiceJs: 'a.service.js',
      bServiceJs: 'b.service.js'
    })
  })
  test('keyCamelCase recurse', () => {
    const services = requireDir('services', 'service.js', { recurse: true, keyCamelCase: true })
    expect(services).toEqual({
      aServiceJs: 'a.service.js',
      bServiceJs: 'b.service.js',
      dServiceJs: 'd.service.js',
      fServiceJs: 'f.service.js'
    })
  })
  test('keyCamelCase removeSuffixFromKey', () => {
    const services = requireDir('services', 'js', { recurse: false, keyCamelCase: true, removeSuffixFromKey: true })
    expect(services).toEqual({
      aService: 'a.service.js',
      bService: 'b.service.js'
    })
  })
  test('keyCamelCase removeSuffixFromKey recurse', () => {
    const services = requireDir('services', 'js', { recurse: true, keyCamelCase: true, removeSuffixFromKey: true })
    expect(services).toEqual({
      aService: 'a.service.js',
      bService: 'b.service.js',
      dService: 'd.service.js',
      fService: 'f.service.js'
    })
  })
})
