delete require.cache[__filename]

const path = require('path')
const { pick } = require('./src/utils')
const { targetScan } = require('./src/utils')
const { parseFileName } = require('./src/utils')

// or simply module.parent.path
function getParentPath(dir) {
  if (!path.isAbsolute(dir)) {
    const myObj = {}
    Error.captureStackTrace(myObj)
    const stacks = myObj.stack.split(/\s*\n\s*/)
    const re = /^at \S+ \((.*?):\d+:\d+\)$/
    const stack = stacks.slice(3).find(stack => re.test(stack)) || stacks[2] || ''
    const m = stack.match(re)
    if (m != null) {
      const [, reqFilename] = m
      const parentPath = path.dirname(reqFilename)
      dir = path.resolve(parentPath, dir)
    }
  }
  return dir
}

/**
 * @param {string} dir
 * @param {string|string[]} suffixes
 * @param {import('./index').RequireDirOptions} [options={}]
 */
function requireDir(dir, suffixes = '.js', options = {}) {
  dir = getParentPath(dir)
  const files = scanDir(dir, suffixes, {
    recurse: options.recurse,
    toObject: pick(options, [
      'removeSuffixFromKey',
      'keyCamelCase',
    ])
  })
  return Object.entries(files).reduce((obj, [key, filePath]) => {
    try {
      obj[key] = require(filePath)
    } catch (e) {
      console.error(e)
      throw new Error(`Could not require '${filePath}'`)
    }
    return obj
  }, {})
}
exports.requireDir = requireDir

/**
 * @param {string} dir
 * @param {string|string[]} suffixes
 * @param {import('./index').ScanDirOptions | import('./index').ScanDirToObjectOptions} [options={}]
 */
function scanDir(dir, suffixes = '.js', options = {}) {
  if (!Array.isArray(suffixes)) {
    suffixes = [suffixes]
  }
  dir = getParentPath(dir)
  const files = targetScan(dir, suffixes, options.recurse)

  if (options.toObject) {
    const toObject = options.toObject === true ? { keyCamelCase: true, removeSuffixFromKey: true } : options.toObject == null ? {} : options.toObject
    return files
      .reduce((obj, [fileName, filePath, suffix]) => {
        fileName = parseFileName(fileName, toObject, suffix)
        obj[fileName] = filePath
        return obj
      }, {})
  } else {
    return files.map(([, filePath]) => filePath)
  }
}
exports.scanDir = scanDir
