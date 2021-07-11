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
  test('multiple suffixes - non recurse', () => {
    const services = scanDir('services', ['service.js', 'next.js'])
    expect(services).toEqual([
      'a.next.js',
      'a.service.js',
      'b.service.js',
    ].map(file => path.join(__dirname, 'services', file)))
  })
  test('multiple suffixes - recurse', () => {
    const services = scanDir('services', ['service.js', 'next.js'], { recurse: true })
    expect(services).toEqual([
      'a.next.js',
      'a.service.js',
      'b.service.js',
      'c/d.service.js',
      'c/e/f.next.js',
      'c/e/f.service.js',
    ].map(file => path.join(__dirname, 'services', file)))
  })
  test('toObject - non recurse', () => {
    const services = scanDir('services', 'service.js', { toObject: true })
    expect(services).toEqual({
      a: path.join(__dirname, 'services', 'a.service.js'),
      b: path.join(__dirname, 'services', 'b.service.js'),
    })
  })
  test('recurse', () => {
    const services = scanDir('services', 'service.js', { recurse: true, toObject: true })
    expect(services).toEqual({
      a: path.join(__dirname, 'services', 'a.service.js'),
      b: path.join(__dirname, 'services', 'b.service.js'),
      d: path.join(__dirname, 'services', 'c/d.service.js'),
      f: path.join(__dirname, 'services', 'c/e/f.service.js'),
    })
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
      aNext: 'a.next.js',
      aService: 'a.service.js',
      bService: 'b.service.js'
    })
  })
  test('keyCamelCase removeSuffixFromKey recurse', () => {
    const services = requireDir('services', 'js', { recurse: true, keyCamelCase: true, removeSuffixFromKey: true })
    expect(services).toEqual({
      aNext: 'a.next.js',
      aService: 'a.service.js',
      bService: 'b.service.js',
      dService: 'd.service.js',
      fNext: 'f.next.js',
      fService: 'f.service.js'
    })
  })
})
