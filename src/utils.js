const fs = require('fs')
const path = require('path')

function targetScan(target, suffixes, recurse) {
  return fs
    .readdirSync(target)
    .reduce((files, file) => {
      const filePath = path.resolve(target, file)
      if (fs.statSync(filePath).isDirectory()) {
        if (recurse) {
          files.push(...targetScan(filePath, suffixes, recurse))
        }
      } else {
        const suffix = suffixes.find(suffix => file.endsWith(suffix))
        if (suffix != null) {
          files.push([file, filePath, suffix])
        }
      }
      return files
    }, [])
}

function parseFileName(fileName, options, suffix) {
  if (options.removeSuffixFromKey) {
    fileName = fileName.substr(0, fileName.length - suffix.length)
    fileName = fileName.replace(/\.+$/g, '')
  }
  if (options.keyCamelCase) {
    fileName = fileName.replace(/[^a-z0-9]+([a-z0-9])/gi, (m0, m1) => m1.toUpperCase())
  }
  return fileName
}

function pick(obj, keys) {
  if (obj == null || typeof obj !== 'object') {
    return {}
  }
  if (!Array.isArray(keys)) {
    keys = [keys]
  }
  return keys.reduce((o, k) => {
    if (Object.prototype.hasOwnProperty.call(obj, k)) {
      o[k] = obj[k]
    }
    return o
  }, {})
}

module.exports = {
  targetScan,
  parseFileName,
  pick,
}
