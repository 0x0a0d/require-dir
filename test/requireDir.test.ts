import path from 'path'
import { requireDir, scanDir } from '../index'

describe('scan dir', () => {
  test('non recurse', () => {
    expect(scanDir('services', 'service.js')).toEqual([
      'a.service.js',
      'b.service.js',
    ].map(file => path.join(__dirname, 'services', file)))
  })
  test('recurse', () => {
    expect(scanDir('services', 'service.js', { recurse: true })).toEqual([
      'a.service.js',
      'b.service.js',
      'c/d.service.js',
      'c/e/f.service.js',
    ].map(file => path.join(__dirname, 'services', file)))
  })
  test('multiple suffixes - non recurse', () => {
    expect(scanDir('services', ['service.js', 'next.js'])).toEqual([
      'a.next.js',
      'a.service.js',
      'b.service.js',
    ].map(file => path.join(__dirname, 'services', file)))
  })
  test('multiple suffixes - recurse', () => {
    expect(scanDir('services', ['service.js', 'next.js'], { recurse: true })).toEqual([
      'a.next.js',
      'a.service.js',
      'b.service.js',
      'c/d.service.js',
      'c/e/f.next.js',
      'c/e/f.service.js',
    ].map(file => path.join(__dirname, 'services', file)))
  })
  test('toObject - non recurse', () => {
    expect(scanDir('services', 'service.js', { toObject: true })).toEqual({
      a: path.join(__dirname, 'services', 'a.service.js'),
      b: path.join(__dirname, 'services', 'b.service.js'),
    })
  })
  test('recurse', () => {
    expect(scanDir('services', 'service.js', { recurse: true, toObject: true })).toEqual({
      a: path.join(__dirname, 'services', 'a.service.js'),
      b: path.join(__dirname, 'services', 'b.service.js'),
      d: path.join(__dirname, 'services', 'c/d.service.js'),
      f: path.join(__dirname, 'services', 'c/e/f.service.js'),
    })
  })
})

describe('require dir', () => {
  it('', () => {
    expect(requireDir('services', 'service.js')).toEqual({
      a: 'a.service.js',
      b: 'b.service.js',
    })
    expect(requireDir('services', 'service.js', {
      recurse: false,
      removeSuffixFromKey: false,
    })).toEqual({
      aServiceJs: 'a.service.js',
      bServiceJs: 'b.service.js',
    })
    expect(requireDir('services', 'service.js', {
      recurse: true,
    })).toEqual({
      a: 'a.service.js',
      b: 'b.service.js',
      d: 'd.service.js',
      f: 'f.service.js',
    })
    expect(requireDir('services', 'service.js', {
      recurse: false,
      removeSuffixFromKey: true,
    })).toEqual({
      a: 'a.service.js',
      b: 'b.service.js',
    })
    expect(requireDir('services', 'service.js', {
      recurse: true,
      removeSuffixFromKey: true,
    })).toEqual({
      a: 'a.service.js',
      b: 'b.service.js',
      d: 'd.service.js',
      f: 'f.service.js',
    })
    expect(requireDir('services', 'service.js', { recurse: false, keyCamelCase: true })).toEqual({
      a: 'a.service.js',
      b: 'b.service.js',
    })
    expect(requireDir('services', 'service.js', { recurse: true, keyCamelCase: true })).toEqual({
      a: 'a.service.js',
      b: 'b.service.js',
      d: 'd.service.js',
      f: 'f.service.js',
    })
    expect(requireDir('services', 'js', { recurse: false, keyCamelCase: true, removeSuffixFromKey: true })).toEqual({
      aNext: 'a.next.js',
      aService: 'a.service.js',
      bService: 'b.service.js',
    })
    expect(requireDir('services', 'js', { recurse: true, keyCamelCase: true, removeSuffixFromKey: true })).toEqual({
      aNext: 'a.next.js',
      aService: 'a.service.js',
      bService: 'b.service.js',
      dService: 'd.service.js',
      fNext: 'f.next.js',
      fService: 'f.service.js',
    })
    expect(requireDir('services', 'js', { recurse: false, keyCamelCase: false, removeSuffixFromKey: true })).toEqual({
      'a.next': 'a.next.js',
      'a.service': 'a.service.js',
      'b.service': 'b.service.js',
    })
    expect(requireDir('services', 'js', { recurse: true, keyCamelCase: false, removeSuffixFromKey: true })).toEqual({
      'a.next': 'a.next.js',
      'a.service': 'a.service.js',
      'b.service': 'b.service.js',
      'd.service': 'd.service.js',
      'f.next': 'f.next.js',
      'f.service': 'f.service.js',
    })
  })
})
